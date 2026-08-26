<?php
/** Store Palate merchant controls on a separate, focused WooCommerce screen. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_Store_Palate_Settings {
    private const MAX_STAFF_FAVOURITES = 12;
    private const MAX_SIGNATURE_PAIRINGS = 12;
    private const MAX_SIGNATURE_WINES = 3;

    private MyNextWine_Woo_API_Client $client;

    public function __construct(MyNextWine_Woo_API_Client $client) {
        $this->client = $client;
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('admin_post_mynextwine_woo_save_store_palate', array($this, 'save'));
        add_action('wp_ajax_mynextwine_woo_store_palate_search', array($this, 'search_wines'));
    }

    public function admin_menu(): void {
        add_submenu_page(
            'woocommerce',
            __('Store Palate', 'my-next-wine-for-woocommerce'),
            __('Store Palate', 'my-next-wine-for-woocommerce'),
            'manage_woocommerce',
            'mynextwine-woo-palate',
            array($this, 'render')
        );
    }

    public function enqueue_assets(string $hook_suffix): void {
        if ('woocommerce_page_mynextwine-woo-palate' !== $hook_suffix) {
            return;
        }
        wp_enqueue_style(
            'mynextwine-wine-finder-palate-admin',
            MYNEXTWINE_WOO_URL . 'assets/css/admin-store-palate.css',
            array(),
            MYNEXTWINE_WOO_VERSION
        );
        wp_enqueue_script(
            'mynextwine-wine-finder-palate-admin',
            MYNEXTWINE_WOO_URL . 'assets/js/admin-store-palate.js',
            array('jquery'),
            MYNEXTWINE_WOO_VERSION,
            true
        );
        wp_localize_script(
            'mynextwine-wine-finder-palate-admin',
            'MyNextWineWooPalate',
            array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('mynextwine_woo_store_palate_search'),
                'currency' => function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'EUR',
                'searchFailed' => __('Wine search failed. Please try again.', 'my-next-wine-for-woocommerce'),
                'noResults' => __('No matching available wines.', 'my-next-wine-for-woocommerce'),
            )
        );
    }

    public function save(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to manage Store Palate.', 'my-next-wine-for-woocommerce'));
        }
        check_admin_referer('mynextwine_woo_save_store_palate');

        $raw = isset($_POST['store_palate_json'])
            ? (string) wp_unslash($_POST['store_palate_json'])
            : '';
        $decoded = json_decode($raw, true);
        if (!is_array($decoded)) {
            $this->redirect_with_error(__('Store Palate settings were incomplete.', 'my-next-wine-for-woocommerce'));
        }

        try {
            $payload = $this->normalise_payload($decoded);
        } catch (InvalidArgumentException $exception) {
            $this->redirect_with_error($exception->getMessage());
        }

        $result = $this->client->update_store_palate($payload);
        if (is_wp_error($result)) {
            $this->redirect_with_error($this->error_message($result));
        }
        delete_transient('mynextwine_woo_last_status_' . get_current_user_id());
        wp_safe_redirect(add_query_arg(array(
            'page' => 'mynextwine-woo-palate',
            'mynextwine_woo_palate_saved' => '1',
        ), admin_url('admin.php')));
        exit;
    }

    public function search_wines(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_send_json_error(array('message' => __('Permission denied.', 'my-next-wine-for-woocommerce')), 403);
        }
        check_ajax_referer('mynextwine_woo_store_palate_search', 'nonce');
        $query = isset($_POST['query'])
            ? sanitize_text_field((string) wp_unslash($_POST['query']))
            : '';
        if ($this->text_length($query) > 100) {
            wp_send_json_error(array('message' => __('Wine search is too long.', 'my-next-wine-for-woocommerce')), 400);
        }
        $result = $this->client->search_store_palate_wines($query);
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $this->error_message($result)), 400);
        }
        wp_send_json_success(array(
            'wines' => isset($result['wines']) && is_array($result['wines']) ? $result['wines'] : array(),
        ));
    }

    public function render(): void {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }
        $status = $this->client->is_configured() ? $this->client->status() : null;
        $palate = is_array($status) && isset($status['storePalate']) && is_array($status['storePalate'])
            ? $status['storePalate']
            : array(
                'discoveryStyle' => 'BALANCED',
                'pairingStyle' => 'BALANCED',
                'staffFavourites' => array(),
                'signaturePairings' => array(),
            );
        $initial_json = wp_json_encode($palate, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        // Read-only notice flags set by the nonce-protected save handler.
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        $saved = isset($_GET['mynextwine_woo_palate_saved']);
        $notice_error = isset($_GET['mynextwine_woo_error'])
            ? rawurldecode(sanitize_text_field(wp_unslash($_GET['mynextwine_woo_error'])))
            : '';
        // phpcs:enable WordPress.Security.NonceVerification.Recommended
        ?>
        <div class="wrap mnw-palate-admin" data-mnw-palate-root data-configured="<?php echo $this->client->is_configured() ? 'true' : 'false'; ?>" data-initial-palate="<?php echo esc_attr($initial_json ?: '{}'); ?>">
            <h1><?php echo esc_html__('My Next Wine', 'my-next-wine-for-woocommerce'); ?></h1>
            <?php $this->render_tabs(); ?>

            <?php if ($saved) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Store Palate saved.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ('' !== $notice_error) : ?>
                <div class="notice notice-error"><p><?php echo esc_html($notice_error); ?></p></div>
            <?php endif; ?>
            <?php if (is_wp_error($status)) : ?>
                <div class="notice notice-error"><p><?php echo esc_html($this->error_message($status)); ?></p></div>
            <?php elseif (!$this->client->is_configured()) : ?>
                <div class="notice notice-warning"><p><?php echo esc_html__('Connect the store from Setup before saving Store Palate.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>

            <header class="mnw-palate-admin__hero">
                <p class="mnw-palate-admin__eyebrow"><?php echo esc_html__('Store Palate', 'my-next-wine-for-woocommerce'); ?></p>
                <h2><?php echo esc_html__('Shape how your shop recommends', 'my-next-wine-for-woocommerce'); ?></h2>
                <p><?php echo esc_html__("Add your team's point of view as a gentle influence on suitable recommendations.", 'my-next-wine-for-woocommerce'); ?></p>
            </header>

            <div class="mnw-palate-admin__principle">
                <strong><?php echo esc_html__('What this means', 'my-next-wine-for-woocommerce'); ?></strong>
                <p><?php echo esc_html__("Your Store Palate influences recommendations when relevant. It does not guarantee that a particular wine will be chosen. My Next Wine still considers the shopper's request, wine suitability, budget and availability.", 'my-next-wine-for-woocommerce'); ?></p>
            </div>

            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" data-mnw-palate-form>
                <input type="hidden" name="action" value="mynextwine_woo_save_store_palate">
                <input type="hidden" name="store_palate_json" value="" data-mnw-palate-json>
                <?php wp_nonce_field('mynextwine_woo_save_store_palate'); ?>

                <div class="mnw-palate-admin__grid">
                    <section class="mnw-palate-admin__card">
                        <p class="mnw-palate-admin__eyebrow"><?php echo esc_html__('Discovery style', 'my-next-wine-for-woocommerce'); ?></p>
                        <h2><?php echo esc_html__('How familiar should recommendations feel?', 'my-next-wine-for-woocommerce'); ?></h2>
                        <?php $this->render_style_choice('discovery', 'FAMILIAR', __('Familiar', 'my-next-wine-for-woocommerce'), __('Recognisable grapes, regions and classic styles.', 'my-next-wine-for-woocommerce'), __('How AI uses this: favours familiar choices when equally suitable.', 'my-next-wine-for-woocommerce')); ?>
                        <?php $this->render_style_choice('discovery', 'BALANCED', __('Balanced', 'my-next-wine-for-woocommerce'), __('A mix of trusted choices and worthwhile discoveries.', 'my-next-wine-for-woocommerce'), __('How AI uses this: adds no directional preference.', 'my-next-wine-for-woocommerce')); ?>
                        <?php $this->render_style_choice('discovery', 'DISCOVERY_LED', __('Discovery-led', 'my-next-wine-for-woocommerce'), __('Lesser-known grapes, regions and producers when equally suitable.', 'my-next-wine-for-woocommerce'), __('How AI uses this: favours a worthwhile discovery over a familiar tie.', 'my-next-wine-for-woocommerce')); ?>
                    </section>

                    <section class="mnw-palate-admin__card">
                        <p class="mnw-palate-admin__eyebrow"><?php echo esc_html__('Pairing style', 'my-next-wine-for-woocommerce'); ?></p>
                        <h2><?php echo esc_html__('How adventurous should pairings be?', 'my-next-wine-for-woocommerce'); ?></h2>
                        <?php $this->render_style_choice('pairing', 'CLASSIC', __('Classic', 'my-next-wine-for-woocommerce'), __('Established, familiar matches.', 'my-next-wine-for-woocommerce'), __('How AI uses this: prefers the classic fit when several pairings work.', 'my-next-wine-for-woocommerce')); ?>
                        <?php $this->render_style_choice('pairing', 'BALANCED', __('Balanced', 'my-next-wine-for-woocommerce'), __('The strongest match, including less obvious choices when justified.', 'my-next-wine-for-woocommerce'), __('How AI uses this: relies on its normal pairing judgement.', 'my-next-wine-for-woocommerce')); ?>
                        <?php $this->render_style_choice('pairing', 'ADVENTUROUS', __('Adventurous', 'my-next-wine-for-woocommerce'), __('Surprising but genuinely defensible matches.', 'my-next-wine-for-woocommerce'), __('How AI uses this: allows a less obvious tie-break when the structure works.', 'my-next-wine-for-woocommerce')); ?>
                        <p class="mnw-palate-admin__note"><?php echo esc_html__('This changes the style of good pairings—not what counts as a good pairing.', 'my-next-wine-for-woocommerce'); ?></p>
                    </section>
                </div>

                <section class="mnw-palate-admin__card mnw-palate-admin__card--wide">
                    <p class="mnw-palate-admin__eyebrow"><?php echo esc_html__('Staff favourites', 'my-next-wine-for-woocommerce'); ?></p>
                    <h2><?php echo esc_html__('Wines your team particularly recommends', 'my-next-wine-for-woocommerce'); ?></h2>
                    <p><?php echo esc_html__('These receive a gentle preference only when they genuinely fit the request. Choose up to 12.', 'my-next-wine-for-woocommerce'); ?></p>
                    <div class="mnw-palate-admin__search">
                        <label for="mnw-palate-favourite-search"><?php echo esc_html__('Find a mapped wine', 'my-next-wine-for-woocommerce'); ?></label>
                        <input id="mnw-palate-favourite-search" type="search" class="regular-text" autocomplete="off" placeholder="<?php echo esc_attr__('Search by wine, producer, region or grape', 'my-next-wine-for-woocommerce'); ?>" data-mnw-favourite-search>
                        <div class="mnw-palate-admin__results" data-mnw-favourite-results hidden></div>
                    </div>
                    <div class="mnw-palate-admin__wine-list" data-mnw-favourite-list></div>
                    <p class="description" data-mnw-favourite-empty><?php echo esc_html__('No staff favourites added. The AI will use its normal judgement.', 'my-next-wine-for-woocommerce'); ?></p>
                </section>

                <section class="mnw-palate-admin__card mnw-palate-admin__card--wide">
                    <div class="mnw-palate-admin__heading-row">
                        <div>
                            <p class="mnw-palate-admin__eyebrow"><?php echo esc_html__('Signature pairings', 'my-next-wine-for-woocommerce'); ?></p>
                            <h2><?php echo esc_html__('Specific pairings your team stands behind', 'my-next-wine-for-woocommerce'); ?></h2>
                            <p><?php echo esc_html__('Add a specific dish, including its sauce or preparation, and up to three preferred wines. Similar shopper requests receive a gentle preference when those wines still fit.', 'my-next-wine-for-woocommerce'); ?></p>
                        </div>
                        <button class="button" type="button" data-mnw-add-pairing><?php echo esc_html__('Add pairing', 'my-next-wine-for-woocommerce'); ?></button>
                    </div>
                    <div class="mnw-palate-admin__pairing-list" data-mnw-pairing-list></div>
                    <p class="description" data-mnw-pairing-empty><?php echo esc_html__("No signature pairings added. Unmatched requests use My Next Wine's normal pairing knowledge.", 'my-next-wine-for-woocommerce'); ?></p>
                </section>

                <div class="mnw-palate-admin__save-bar">
                    <span data-mnw-palate-status><?php echo esc_html__('No unsaved changes.', 'my-next-wine-for-woocommerce'); ?></span>
                    <?php submit_button(__('Save Store Palate', 'my-next-wine-for-woocommerce'), 'primary', 'submit', false, array('data-mnw-save-palate' => '')); ?>
                </div>
            </form>

            <dialog class="mnw-palate-admin__dialog" data-mnw-pairing-dialog>
                <div class="mnw-palate-admin__dialog-shell">
                    <div class="mnw-palate-admin__heading-row">
                        <h2 data-mnw-pairing-title><?php echo esc_html__('Add a pairing', 'my-next-wine-for-woocommerce'); ?></h2>
                        <button class="button" type="button" data-mnw-close-pairing><?php echo esc_html__('Close', 'my-next-wine-for-woocommerce'); ?></button>
                    </div>
                    <label for="mnw-palate-dish"><strong><?php echo esc_html__('Specific dish or pairing', 'my-next-wine-for-woocommerce'); ?></strong></label>
                    <input id="mnw-palate-dish" type="text" maxlength="180" class="large-text" placeholder="<?php echo esc_attr__('e.g. Roast chicken with cream and mushrooms', 'my-next-wine-for-woocommerce'); ?>" data-mnw-pairing-dish>
                    <p class="description"><?php echo esc_html__('Be specific—sauce and preparation matter.', 'my-next-wine-for-woocommerce'); ?></p>

                    <div class="mnw-palate-admin__search">
                        <label for="mnw-palate-pairing-search"><strong><?php echo esc_html__('Preferred wines (choose up to 3)', 'my-next-wine-for-woocommerce'); ?></strong></label>
                        <input id="mnw-palate-pairing-search" type="search" class="large-text" autocomplete="off" placeholder="<?php echo esc_attr__('Search your mapped wines', 'my-next-wine-for-woocommerce'); ?>" data-mnw-pairing-search>
                        <div class="mnw-palate-admin__results" data-mnw-pairing-results hidden></div>
                    </div>
                    <div class="mnw-palate-admin__wine-list mnw-palate-admin__wine-list--compact" data-mnw-pairing-wines></div>

                    <label for="mnw-palate-rationale"><strong><?php echo esc_html__('Why your team recommends these wines (optional)', 'my-next-wine-for-woocommerce'); ?></strong></label>
                    <textarea id="mnw-palate-rationale" rows="3" maxlength="400" class="large-text" placeholder="<?php echo esc_attr__('Fresh acidity for the sauce, with enough texture for the dish.', 'my-next-wine-for-woocommerce'); ?>" data-mnw-pairing-rationale></textarea>
                    <p class="mnw-palate-admin__error" data-mnw-pairing-error></p>
                    <div class="mnw-palate-admin__dialog-actions">
                        <button class="button" type="button" data-mnw-close-pairing><?php echo esc_html__('Cancel', 'my-next-wine-for-woocommerce'); ?></button>
                        <button class="button button-primary" type="button" data-mnw-confirm-pairing><?php echo esc_html__('Add pairing', 'my-next-wine-for-woocommerce'); ?></button>
                    </div>
                </div>
            </dialog>
        </div>
        <?php
    }

    private function render_tabs(): void {
        ?>
        <nav class="nav-tab-wrapper" aria-label="<?php echo esc_attr__('My Next Wine sections', 'my-next-wine-for-woocommerce'); ?>">
            <a class="nav-tab" href="<?php echo esc_url(admin_url('admin.php?page=mynextwine-woo-settings')); ?>"><?php echo esc_html__('Setup', 'my-next-wine-for-woocommerce'); ?></a>
            <a class="nav-tab nav-tab-active" href="<?php echo esc_url(admin_url('admin.php?page=mynextwine-woo-palate')); ?>"><?php echo esc_html__('Store Palate', 'my-next-wine-for-woocommerce'); ?></a>
        </nav>
        <?php
    }

    private function render_style_choice(string $group, string $value, string $label, string $description, string $meaning): void {
        ?>
        <label class="mnw-palate-admin__choice">
            <input type="radio" name="mnw_<?php echo esc_attr($group); ?>_style" value="<?php echo esc_attr($value); ?>" data-mnw-<?php echo esc_attr($group); ?>-style>
            <span><strong><?php echo esc_html($label); ?></strong><small><?php echo esc_html($description); ?></small><em><?php echo esc_html($meaning); ?></em></span>
        </label>
        <?php
    }

    /** @param array<string,mixed> $input @return array<string,mixed> */
    private function normalise_payload(array $input): array {
        $discovery = strtoupper(sanitize_key((string) ($input['discoveryStyle'] ?? 'BALANCED')));
        $pairing = strtoupper(sanitize_key((string) ($input['pairingStyle'] ?? 'BALANCED')));
        if (!in_array($discovery, array('FAMILIAR', 'BALANCED', 'DISCOVERY_LED'), true)) {
            throw new InvalidArgumentException(__('Choose a valid discovery style.', 'my-next-wine-for-woocommerce'));
        }
        if (!in_array($pairing, array('CLASSIC', 'BALANCED', 'ADVENTUROUS'), true)) {
            throw new InvalidArgumentException(__('Choose a valid pairing style.', 'my-next-wine-for-woocommerce'));
        }

        $favourites = $this->normalise_ids($input['staffFavouriteWineIds'] ?? array());
        if (count($favourites) > self::MAX_STAFF_FAVOURITES) {
            throw new InvalidArgumentException(__('Choose no more than 12 staff favourites.', 'my-next-wine-for-woocommerce'));
        }

        $submitted_pairings = isset($input['signaturePairings']) && is_array($input['signaturePairings'])
            ? $input['signaturePairings']
            : array();
        if (count($submitted_pairings) > self::MAX_SIGNATURE_PAIRINGS) {
            throw new InvalidArgumentException(__('Add no more than 12 signature pairings.', 'my-next-wine-for-woocommerce'));
        }
        $pairings = array();
        foreach ($submitted_pairings as $submitted) {
            if (!is_array($submitted)) {
                continue;
            }
            $dish = sanitize_text_field((string) ($submitted['dish'] ?? ''));
            $rationale = sanitize_textarea_field((string) ($submitted['rationale'] ?? ''));
            $ids = $this->normalise_ids($submitted['preferredWineIds'] ?? array());
            if ('' === $dish || empty($ids)) {
                throw new InvalidArgumentException(__('Every signature pairing needs a specific dish and at least one wine.', 'my-next-wine-for-woocommerce'));
            }
            if ($this->text_length($dish) > 180 || $this->text_length($rationale) > 400 || count($ids) > self::MAX_SIGNATURE_WINES) {
                throw new InvalidArgumentException(__('One of the signature pairings is too long or has too many wines.', 'my-next-wine-for-woocommerce'));
            }
            $pairings[] = array(
                'dish' => $dish,
                'rationale' => $rationale,
                'preferredWineIds' => $ids,
            );
        }

        return array(
            'discoveryStyle' => $discovery,
            'pairingStyle' => $pairing,
            'staffFavouriteWineIds' => $favourites,
            'signaturePairings' => $pairings,
        );
    }

    /** @param mixed $value @return array<int,int> */
    private function normalise_ids($value): array {
        if (!is_array($value)) {
            return array();
        }
        return array_values(array_unique(array_filter(array_map('absint', $value))));
    }

    private function text_length(string $value): int {
        return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    }

    private function error_message(WP_Error $error): string {
        $data = $error->get_error_data();
        if (is_array($data) && !empty($data['body']['error'])) {
            return sanitize_text_field((string) $data['body']['error']);
        }
        return sanitize_text_field($error->get_error_message());
    }

    private function redirect_with_error(string $message): void {
        wp_safe_redirect(add_query_arg(array(
            'page' => 'mynextwine-woo-palate',
            'mynextwine_woo_error' => rawurlencode($message),
        ), admin_url('admin.php')));
        exit;
    }
}
