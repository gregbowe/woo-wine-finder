<?php
/** Outbound, signed catalogue synchronisation for public plugin installs. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_Catalogue_Sync {
    private const START_HOOK = 'mynextwine_woo_start_catalogue_sync';
    private const PAGE_HOOK = 'mynextwine_woo_sync_catalogue_page';
    private const RECONCILE_HOOK = 'mynextwine_woo_catalogue_reconcile';
    private const PAGE_SIZE = 50;
    private const SYNC_LOCK_OPTION = 'mynextwine_woo_catalogue_sync_lock';
    private const SYNC_REQUESTED_OPTION = 'mynextwine_woo_catalogue_sync_requested_at';
    private const SYNC_LOCK_SECONDS = 120;

    private MyNextWine_Woo_API_Client $client;

    public function __construct(MyNextWine_Woo_API_Client $client) {
        $this->client = $client;
        add_action(self::START_HOOK, array($this, 'start_sync'));
        add_action(self::PAGE_HOOK, array($this, 'sync_page'), 10, 2);
        add_action(self::RECONCILE_HOOK, array($this, 'schedule_full_sync'));
        add_action('admin_post_mynextwine_woo_sync_catalogue', array($this, 'manual_sync'));
        add_action('admin_init', array($this, 'maybe_process_queued_sync'), 20);

        add_action('woocommerce_update_product', array($this, 'product_changed'));
        add_action('woocommerce_new_product', array($this, 'product_changed'));
        add_action('before_delete_post', array($this, 'post_deleted'));
        add_action('woocommerce_product_set_stock', array($this, 'stock_changed'));
        add_action('woocommerce_variation_set_stock', array($this, 'stock_changed'));
    }

    public static function activate(): void {
        if (!wp_next_scheduled(self::RECONCILE_HOOK)) {
            wp_schedule_event(time() + HOUR_IN_SECONDS, 'hourly', self::RECONCILE_HOOK);
        }
    }

    public static function deactivate(): void {
        wp_clear_scheduled_hook(self::START_HOOK);
        wp_clear_scheduled_hook(self::PAGE_HOOK);
        wp_clear_scheduled_hook(self::RECONCILE_HOOK);
        delete_option(self::SYNC_LOCK_OPTION);
        delete_option(self::SYNC_REQUESTED_OPTION);
    }

    public function schedule_full_sync(int $delay = 60): void {
        $settings = $this->client->settings();
        if (!$this->client->is_configured() || 'PLUGIN_PUSH' !== ($settings['catalogue_mode'] ?? '')) {
            return;
        }
        update_option(self::SYNC_REQUESTED_OPTION, time(), false);
        if (!wp_next_scheduled(self::START_HOOK)) {
            wp_schedule_single_event(time() + max(1, $delay), self::START_HOOK);
        }
    }

    /**
     * WordPress cron is traffic-dependent and is often disabled on managed hosts.
     * Whenever the merchant opens the My Next Wine screen, advance a queued sync
     * inline as a reliable fallback. Two pages covers the common 100-product case.
     */
    public function maybe_process_queued_sync(): void {
        global $pagenow;

        // This is a read-only admin routing check; state-changing actions use nonce-protected handlers.
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        $current_page = isset($_GET['page'])
            ? sanitize_key(wp_unslash($_GET['page']))
            : '';
        // phpcs:enable WordPress.Security.NonceVerification.Recommended

        if (!current_user_can('manage_woocommerce')
            || 'mynextwine-woo-settings' !== $current_page
            || 'admin-post.php' === $pagenow) {
            return;
        }
        if (false === get_option(self::SYNC_REQUESTED_OPTION, false) && empty($this->state())) {
            return;
        }
        $this->run_inline_sync(2, 20);
    }

    public function manual_sync(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to synchronise My Next Wine.', 'my-next-wine-for-woocommerce'));
        }
        check_admin_referer('mynextwine_woo_sync_catalogue');
        $result = $this->run_inline_sync(20, 25, true);
        $args = array('page' => 'mynextwine-woo-settings');
        if (is_wp_error($result)) {
            $args['mynextwine_woo_error'] = rawurlencode($result->get_error_message());
        } elseif (!empty($result['complete'])) {
            $args['mynextwine_woo_sync_complete'] = '1';
        } else {
            $args['mynextwine_woo_sync_progress'] = '1';
        }
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
        exit;
    }

    public function start_sync(): void {
        $this->run_inline_sync(2, 20, true);
    }

    public function sync_page(string $sync_id, int $page): void {
        $state = $this->state();
        if (!$this->client->is_configured()
            || 'PLUGIN_PUSH' !== ($this->client->settings()['catalogue_mode'] ?? '')
            || !hash_equals((string) ($state['sync_id'] ?? ''), $sync_id)) {
            return;
        }
        $result = $this->process_page($sync_id, max(1, $page));
        if (is_wp_error($result)) {
            $attempts = (int) ($this->state()['attempts'] ?? 1);
            if ($attempts <= 5) {
                wp_schedule_single_event(time() + min(900, 60 * $attempts), self::PAGE_HOOK, array($sync_id, $page));
            }
            return;
        }
        if (empty($result['complete'])) {
            wp_schedule_single_event(time() + 1, self::PAGE_HOOK, array($sync_id, $page + 1));
        }
    }

    /** @return array{complete:bool,page:int,total_pages:int}|WP_Error */
    public function run_inline_sync(int $max_pages = 2, int $time_budget_seconds = 20, bool $force_new = false) {
        $settings = $this->client->settings();
        if (!$this->client->is_configured() || 'PLUGIN_PUSH' !== ($settings['catalogue_mode'] ?? '')) {
            return new WP_Error('mynextwine_woo_sync_not_configured', __('My Next Wine is not ready to synchronise this catalogue.', 'my-next-wine-for-woocommerce'));
        }
        if (!$this->acquire_sync_lock()) {
            return array('complete' => false, 'page' => 0, 'total_pages' => 0);
        }

        try {
            wp_clear_scheduled_hook(self::START_HOOK);
            if ($force_new) {
                wp_clear_scheduled_hook(self::PAGE_HOOK);
                delete_option('mynextwine_woo_catalogue_sync_state');
            }

            $state = $this->state();
            if (empty($state) || empty($state['sync_id'])) {
                $state = array(
                    'sync_id' => wp_generate_uuid4(),
                    'page' => 0,
                    'attempts' => 0,
                    'started_at' => time(),
                    'error' => '',
                );
                $this->save_state($state);
            }
            delete_option(self::SYNC_REQUESTED_OPTION);

            $started = microtime(true);
            $last = array('complete' => false, 'page' => (int) ($state['page'] ?? 0), 'total_pages' => 0);
            for ($processed = 0; $processed < max(1, $max_pages); $processed++) {
                if ($processed > 0 && (microtime(true) - $started) >= max(5, $time_budget_seconds)) {
                    break;
                }
                $state = $this->state();
                if (empty($state) || empty($state['sync_id'])) {
                    return array('complete' => true, 'page' => (int) ($last['page'] ?? 0), 'total_pages' => (int) ($last['total_pages'] ?? 0));
                }
                $next_page = max(1, (int) ($state['page'] ?? 0) + 1);
                $last = $this->process_page((string) $state['sync_id'], $next_page);
                if (is_wp_error($last)) {
                    return $last;
                }
                if (!empty($last['complete'])) {
                    return $last;
                }
            }

            $state = $this->state();
            if (!empty($state['sync_id'])) {
                $next_page = max(1, (int) ($state['page'] ?? 0) + 1);
                wp_schedule_single_event(time() + 5, self::PAGE_HOOK, array((string) $state['sync_id'], $next_page));
                update_option(self::SYNC_REQUESTED_OPTION, time(), false);
            }
            return $last;
        } finally {
            $this->release_sync_lock();
        }
    }

    /** @return array{complete:bool,page:int,total_pages:int}|WP_Error */
    private function process_page(string $sync_id, int $page) {
        $state = $this->state();
        if (empty($state['sync_id']) || !hash_equals((string) $state['sync_id'], $sync_id)) {
            return new WP_Error('mynextwine_woo_sync_superseded', __('A newer catalogue synchronisation has started.', 'my-next-wine-for-woocommerce'));
        }

        $page_data = $this->product_page(max(1, $page));
        $products = $page_data['products'];
        $total_pages = $page_data['total_pages'];
        $items = array();
        foreach ($products as $product) {
            if (!$product instanceof WC_Product) {
                continue;
            }
            if ($product->is_type('variable')) {
                foreach ($this->variation_ids($product->get_id()) as $variation_id) {
                    $variation = wc_get_product($variation_id);
                    if ($variation instanceof WC_Product_Variation && 'trash' !== get_post_status($variation_id)) {
                        $items[] = $this->variation_item($product, $variation);
                    }
                }
            } else {
                $items[] = $this->simple_item($product);
            }
        }

        $complete = $page >= $total_pages;
        $response = $this->client->request('POST', '/api/woocommerce/widget/catalogue/snapshot', array(
            'syncId' => $sync_id,
            'page' => $page,
            'totalPages' => $total_pages,
            'complete' => $complete,
            'items' => $items,
        ));
        if (is_wp_error($response)) {
            $state['attempts'] = (int) ($state['attempts'] ?? 0) + 1;
            $state['error'] = $response->get_error_message();
            $this->save_state($state);
            $settings = $this->client->settings();
            $settings['last_catalogue_sync_error'] = sanitize_text_field($response->get_error_message());
            $this->client->save_settings($settings);
            return $response;
        }

        $state['page'] = $page;
        $state['attempts'] = 0;
        $state['error'] = '';
        $this->save_state($state);

        if ($complete) {
            delete_option('mynextwine_woo_catalogue_sync_state');
            delete_option(self::SYNC_REQUESTED_OPTION);
            wp_clear_scheduled_hook(self::PAGE_HOOK);
            $settings = $this->client->settings();
            $settings['last_catalogue_sync_at'] = gmdate('c');
            $settings['last_catalogue_sync_error'] = '';
            $settings['onboarding_status'] = sanitize_text_field((string) ($response['onboardingStatus'] ?? 'PENDING_MAPPING'));
            $this->client->save_settings($settings);
        }

        return array('complete' => $complete, 'page' => $page, 'total_pages' => $total_pages);
    }

    private function acquire_sync_lock(): bool {
        $now = time();
        if (add_option(self::SYNC_LOCK_OPTION, $now, '', false)) {
            return true;
        }
        $locked_at = (int) get_option(self::SYNC_LOCK_OPTION, 0);
        if ($locked_at > 0 && $locked_at >= ($now - self::SYNC_LOCK_SECONDS)) {
            return false;
        }
        delete_option(self::SYNC_LOCK_OPTION);
        return add_option(self::SYNC_LOCK_OPTION, $now, '', false);
    }

    private function release_sync_lock(): void {
        delete_option(self::SYNC_LOCK_OPTION);
    }

    public function product_changed($product_id = 0): void {
        if (doing_action(self::PAGE_HOOK)) {
            return;
        }
        $this->schedule_full_sync(60);
    }

    public function stock_changed($product): void {
        $this->schedule_full_sync(60);
    }

    public function post_deleted(int $post_id): void {
        $type = get_post_type($post_id);
        if ('product' === $type || 'product_variation' === $type) {
            $this->schedule_full_sync(30);
        }
    }


    /** @return array{products:array<int,WC_Product>,total_pages:int} */
    private function product_page(int $page): array {
        $results = wc_get_products(array(
            'limit' => self::PAGE_SIZE,
            'page' => max(1, $page),
            'paginate' => true,
            'return' => 'objects',
            'orderby' => 'ID',
            'order' => 'ASC',
            'status' => array_values(get_post_stati(array('internal' => false), 'names')),
        ));

        $products = array();
        if (is_object($results) && isset($results->products) && is_array($results->products)) {
            foreach ($results->products as $product) {
                if ($product instanceof WC_Product) {
                    $products[] = $product;
                }
            }
        }

        return array(
            'products' => $products,
            'total_pages' => is_object($results) && isset($results->max_num_pages)
                ? max(1, (int) $results->max_num_pages)
                : 1,
        );
    }

    /** @return array<int,int> */
    private function variation_ids(int $parent_id): array {
        $parent = wc_get_product($parent_id);
        if (!$parent instanceof WC_Product_Variable) {
            return array();
        }
        return array_values(array_filter(array_map('intval', $parent->get_children())));
    }

    /** @return array<string,mixed> */
    private function simple_item(WC_Product $product): array {
        return array(
            'productId' => (string) $product->get_id(),
            'variantId' => (string) $product->get_id(),
            'title' => $this->truncate($product->get_name(), 245),
            'description' => $this->description($product),
            'imageUrl' => $this->image_url($product),
            'sku' => $this->truncate($product->get_sku(), 245),
            'price' => $this->price($product),
            'tags' => $this->tags($product),
            'available' => $this->available($product),
            'status' => (string) $product->get_status(),
        );
    }

    /** @return array<string,mixed> */
    private function variation_item(WC_Product $parent, WC_Product_Variation $variation): array {
        $attributes = array_values(array_filter(array_map('wc_clean', $variation->get_variation_attributes())));
        $title = $parent->get_name();
        if (!empty($attributes)) {
            $title .= ' - ' . implode(', ', $attributes);
        }
        $description = trim(wp_strip_all_tags((string) $variation->get_description()));
        if ('' === $description) {
            $description = $this->description($parent);
        }
        return array(
            'productId' => (string) $parent->get_id(),
            'variantId' => (string) $variation->get_id(),
            'title' => $this->truncate($title, 245),
            'description' => $this->truncate($description, 10445),
            'imageUrl' => $this->image_url($variation, $parent),
            'sku' => $this->truncate($variation->get_sku(), 245),
            'price' => $this->price($variation),
            'tags' => $this->tags($parent, $variation),
            'available' => $this->available($variation, $parent),
            'status' => (string) $variation->get_status(),
        );
    }

    private function description(WC_Product $product): string {
        $description = (string) $product->get_description();
        if ('' === trim($description)) {
            $description = (string) $product->get_short_description();
        }
        return $this->truncate(trim(wp_strip_all_tags($description)), 10445);
    }

    private function image_url(WC_Product $product, ?WC_Product $fallback = null): string {
        $image_id = $product->get_image_id();
        if (!$image_id && $fallback) {
            $image_id = $fallback->get_image_id();
        }
        $url = $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';
        return $this->truncate(is_string($url) ? esc_url_raw($url) : '', 245);
    }

    private function price(WC_Product $product): string {
        $price = wc_get_price_to_display($product);
        return is_numeric($price) ? wc_format_decimal($price, wc_get_price_decimals()) : '0';
    }

    private function available(WC_Product $product, ?WC_Product $parent = null): bool {
        $published = 'publish' === get_post_status($product->get_id());
        if ($parent) {
            $published = $published && 'publish' === get_post_status($parent->get_id());
        }
        return $published
            && $product->is_purchasable()
            && $product->is_in_stock()
            && $product->has_enough_stock(1)
            && !$product->backorders_allowed()
            && (float) wc_get_price_to_display($product) > 0;
    }

    private function tags(WC_Product $product, ?WC_Product_Variation $variation = null): string {
        $values = array();
        $terms = wp_get_post_terms($product->get_id(), array('product_cat', 'product_tag'), array('fields' => 'names'));
        if (!is_wp_error($terms)) {
            foreach ($terms as $term) {
                $values[] = wc_clean((string) $term);
            }
        }
        foreach ($product->get_attributes() as $attribute) {
            if ($attribute instanceof WC_Product_Attribute) {
                foreach ($attribute->get_options() as $option) {
                    if ($attribute->is_taxonomy()) {
                        $term = get_term($option, $attribute->get_name());
                        if ($term instanceof WP_Term) {
                            $values[] = wc_clean($term->name);
                        }
                    } else {
                        $values[] = wc_clean((string) $option);
                    }
                }
            }
        }
        if ($variation) {
            foreach ($variation->get_variation_attributes() as $value) {
                $values[] = wc_clean((string) $value);
            }
        }
        return $this->truncate(implode(', ', array_values(array_unique(array_filter($values)))), 2000);
    }

    /** @return array<string,mixed> */
    private function state(): array {
        $state = get_option('mynextwine_woo_catalogue_sync_state', array());
        return is_array($state) ? $state : array();
    }

    /** @param array<string,mixed> $state */
    private function save_state(array $state): void {
        update_option('mynextwine_woo_catalogue_sync_state', $state, false);
    }

    private function truncate(string $value, int $length): string {
        $value = trim($value);
        return function_exists('mb_substr') ? mb_substr($value, 0, $length) : substr($value, 0, $length);
    }
}
