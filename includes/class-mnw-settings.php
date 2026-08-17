<?php
/** Merchant setup/status, direct Stripe billing and appearance screen. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_Settings {
    private const WINE_CATEGORY_KEYS = array(
        'red', 'white', 'rose', 'sparkling', 'orange', 'petNat',
        'sherry', 'otherFortified', 'dessert',
    );
    private MyNextWine_Woo_API_Client $client;
    private MyNextWine_Woo_Catalogue_Sync $catalogue_sync;

    public function __construct(MyNextWine_Woo_API_Client $client, MyNextWine_Woo_Catalogue_Sync $catalogue_sync) {
        $this->client = $client;
        $this->catalogue_sync = $catalogue_sync;
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_post_mynextwine_woo_save', array($this, 'save'));
        add_action('admin_post_mynextwine_woo_test', array($this, 'refresh_status'));
        add_action('admin_post_mynextwine_woo_start_billing', array($this, 'start_billing'));
        add_action('admin_post_mynextwine_woo_manage_billing', array($this, 'manage_billing'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        add_filter('plugin_action_links_' . plugin_basename(MYNEXTWINE_WOO_FILE), array($this, 'action_links'));
    }

    public function enqueue_admin_assets(string $hook_suffix): void {
        if ('woocommerce_page_mynextwine-woo-settings' !== $hook_suffix) {
            return;
        }
        wp_enqueue_media();
        wp_enqueue_script(
            'mynextwine-wine-finder-admin',
            MYNEXTWINE_WOO_URL . 'assets/js/admin-settings.js',
            array('jquery'),
            MYNEXTWINE_WOO_VERSION,
            true
        );
        wp_localize_script(
            'mynextwine-wine-finder-admin',
            'MyNextWineWooAdmin',
            array(
                'chooseLauncherImage' => __('Choose launcher image', 'my-next-wine-for-woocommerce'),
                'useThisImage' => __('Use this image', 'my-next-wine-for-woocommerce'),
                'minimumCategories' => __('Choose at least two bottle selection categories.', 'my-next-wine-for-woocommerce'),
            )
        );
    }

    public function admin_menu(): void {
        add_submenu_page(
            'woocommerce',
            __('My Next Wine', 'my-next-wine-for-woocommerce'),
            __('My Next Wine', 'my-next-wine-for-woocommerce'),
            'manage_woocommerce',
            'mynextwine-woo-settings',
            array($this, 'render')
        );
    }

    /** @param array<int,string> $links */
    public function action_links(array $links): array {
        array_unshift($links, '<a href="' . esc_url(admin_url('admin.php?page=mynextwine-woo-settings')) . '">' . esc_html__('Setup', 'my-next-wine-for-woocommerce') . '</a>');
        return $links;
    }

    public function save(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to manage My Next Wine.', 'my-next-wine-for-woocommerce'));
        }
        check_admin_referer('mynextwine_woo_save');

        $current = $this->client->settings();
        $position = isset($_POST['launcher_position']) ? sanitize_key(wp_unslash($_POST['launcher_position'])) : 'left';
        if (!in_array($position, array('left', 'right'), true)) {
            $position = 'left';
        }
        $requested_enabled = isset($_POST['enabled']);
        $status = $this->client->is_configured() ? $this->client->status() : null;
        $operational = is_array($status) && !empty($status['operational']);

        $current['enabled'] = $requested_enabled && $operational ? 'yes' : 'no';
        $current['auto_display'] = isset($_POST['auto_display']) ? 'yes' : 'no';
        $current['analytics_enabled'] = isset($_POST['analytics_enabled']) ? 'yes' : 'no';
        $current['launcher_position'] = $position;
        $current['launcher_image_id'] = absint(wp_unslash($_POST['launcher_image_id'] ?? '0'));
        $current['inherit_theme_styles'] = isset($_POST['inherit_theme_styles']) ? 'yes' : 'no';
        $current['accent_color'] = sanitize_hex_color((string) wp_unslash($_POST['accent_color'] ?? '')) ?: '#722f37';
        $current['accent_text_color'] = sanitize_hex_color((string) wp_unslash($_POST['accent_text_color'] ?? '')) ?: '#ffffff';
        $current['heading'] = sanitize_text_field((string) wp_unslash($_POST['heading'] ?? ''));
        $current['intro'] = sanitize_textarea_field((string) wp_unslash($_POST['intro'] ?? ''));
        $current['launcher_label'] = sanitize_text_field((string) wp_unslash($_POST['launcher_label'] ?? ''));
        $current['button_label'] = sanitize_text_field((string) wp_unslash($_POST['button_label'] ?? ''));
        $current['show_mnw_notes'] = isset($_POST['show_mnw_notes']) ? 'yes' : 'no';
        $current['show_mnw_rating'] = isset($_POST['show_mnw_rating']) ? 'yes' : 'no';
        $submitted_categories = $this->submitted_wine_categories();
        $category_error = count($submitted_categories) < 2;
        if (!$category_error) {
            $current['wine_categories'] = $submitted_categories;
        }
        $this->client->save_settings($current);

        $display_error = $category_error
            ? new WP_Error('mynextwine_woo_categories', __('Choose at least two bottle selection categories.', 'my-next-wine-for-woocommerce'))
            : null;
        if ($this->client->is_configured()) {
            $display_result = $this->client->update_display_settings(
                'yes' === $current['show_mnw_notes'],
                'yes' === $current['show_mnw_rating'],
                $this->client->normalise_wine_categories($current['wine_categories'] ?? null)
            );
            if (is_wp_error($display_result)) {
                $display_error = $display_result;
            } else {
                delete_transient('mynextwine_woo_last_status_' . get_current_user_id());
            }
        }

        $args = array('page' => 'mynextwine-woo-settings', 'mynextwine_woo_saved' => '1');
        if ($display_error instanceof WP_Error) {
            $args['mynextwine_woo_error'] = rawurlencode($this->error_message($display_error));
        } elseif ($requested_enabled && !$operational) {
            $args['mynextwine_woo_error'] = rawurlencode(__('The Wine Finder cannot be enabled until the catalogue is ready and My Next Wine confirms an active trial or paid plan.', 'my-next-wine-for-woocommerce'));
        }
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
        exit;
    }

    public function refresh_status(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to manage My Next Wine.', 'my-next-wine-for-woocommerce'));
        }
        check_admin_referer('mynextwine_woo_test');
        $result = $this->client->status();
        $args = array('page' => 'mynextwine-woo-settings');
        if (is_wp_error($result)) {
            $args['mynextwine_woo_error'] = rawurlencode($this->error_message($result));
        } else {
            set_transient('mynextwine_woo_last_status_' . get_current_user_id(), $result, 60);
            $args['mynextwine_woo_tested'] = '1';
        }
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
        exit;
    }

    public function start_billing(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to start My Next Wine billing.', 'my-next-wine-for-woocommerce'));
        }
        check_admin_referer('mynextwine_woo_start_billing');
        $plan_code = isset($_POST['plan_code'])
            ? strtoupper(sanitize_key(wp_unslash($_POST['plan_code'])))
            : 'LAUNCH';
        $result = $this->client->start_billing($plan_code);
        if (is_wp_error($result)) {
            $this->redirect_with_error($result);
        }

        $checkout_url = esc_url_raw((string) ($result['checkoutUrl'] ?? $result['confirmationUrl'] ?? ''));
        if (!$this->is_allowed_stripe_url($checkout_url)) {
            $this->redirect_with_message(__('My Next Wine did not return a valid Stripe checkout URL.', 'my-next-wine-for-woocommerce'));
        }
        delete_transient('mynextwine_woo_last_status_' . get_current_user_id());
        wp_redirect($checkout_url); // phpcs:ignore WordPress.Security.SafeRedirect.wp_redirect_wp_redirect -- validated Stripe HTTPS URL.
        exit;
    }

    public function manage_billing(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to manage My Next Wine billing.', 'my-next-wine-for-woocommerce'));
        }
        check_admin_referer('mynextwine_woo_manage_billing');
        $result = $this->client->manage_billing();
        if (is_wp_error($result)) {
            $this->redirect_with_error($result);
        }

        $portal_url = esc_url_raw((string) ($result['portalUrl'] ?? ''));
        if (!$this->is_allowed_stripe_url($portal_url)) {
            $this->redirect_with_message(__('My Next Wine did not return a valid Stripe billing portal URL.', 'my-next-wine-for-woocommerce'));
        }
        wp_redirect($portal_url); // phpcs:ignore WordPress.Security.SafeRedirect.wp_redirect_wp_redirect -- validated Stripe HTTPS URL.
        exit;
    }

    public function render(): void {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }
        $settings = $this->client->settings();
        $status = get_transient('mynextwine_woo_last_status_' . get_current_user_id());
        $status_error = '';
        if ($this->client->is_configured() && !is_array($status)) {
            $fresh = $this->client->status();
            if (is_wp_error($fresh)) {
                $status_error = $this->error_message($fresh);
            } else {
                $status = $fresh;
                set_transient('mynextwine_woo_last_status_' . get_current_user_id(), $status, 60);
            }
        }
        $connected = $this->client->is_configured();
        $operational = is_array($status) && !empty($status['operational']);
        $catalogue = is_array($status) && isset($status['catalogue']) && is_array($status['catalogue']) ? $status['catalogue'] : array();
        $connection_state = (string) ($settings['connection_state'] ?? 'PENDING');
        $base_location = function_exists('wc_get_base_location') ? wc_get_base_location() : array();
        $local_country_code = sanitize_text_field((string) ($base_location['country'] ?? ''));
        $country_names = function_exists('WC') && WC() && isset(WC()->countries)
            ? WC()->countries->get_countries()
            : array();
        $store_name = is_array($status)
            ? (string) ($status['storeName'] ?? get_bloginfo('name'))
            : (string) get_bloginfo('name');
        $store_country_code = is_array($status)
            ? (string) ($status['storeCountryCode'] ?? $local_country_code)
            : $local_country_code;
        $store_country = is_array($status)
            ? (string) ($status['storeCountry'] ?? ($country_names[$store_country_code] ?? $store_country_code))
            : (string) ($country_names[$store_country_code] ?? $store_country_code);
        $store_currency = is_array($status)
            ? (string) ($status['storeCurrency'] ?? (function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : ''))
            : (function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : '');
        $store_locale = is_array($status)
            ? (string) ($status['storeLocale'] ?? determine_locale())
            : determine_locale();
        $market_locale = is_array($status) ? (string) ($status['marketLocale'] ?? '') : '';
        $installed_at = is_array($status) ? (string) ($status['installedAt'] ?? '') : '';
        $last_service_contact_at = (string) ($settings['last_service_contact_at'] ?? '');
        $last_catalogue_sync_at = is_array($status)
            ? (string) ($status['lastCatalogueSyncAt'] ?? ($settings['last_catalogue_sync_at'] ?? ''))
            : (string) ($settings['last_catalogue_sync_at'] ?? '');
        $local_terms_current = 'yes' === ($settings['connection_consent'] ?? 'no')
            && MYNEXTWINE_WOO_TERMS_VERSION === ($settings['terms_version'] ?? '');
        $server_terms_current = is_array($status) && !empty($status['termsAccepted']);
        $billing_status = is_array($status) ? (string) ($status['billingStatus'] ?? 'NOT_STARTED') : 'NOT_STARTED';
        $billing_currency = is_array($status) ? (string) ($status['billingCurrency'] ?? 'EUR') : 'EUR';
        $billing_price = is_array($status) ? (string) ($status['billingPrice'] ?? '29.99') : '29.99';
        $billing_trial_days = is_array($status) ? max(0, (int) ($status['billingTrialDays'] ?? 14)) : 14;
        $plans = is_array($status) && !empty($status['plans']) && is_array($status['plans'])
            ? $status['plans']
            : array(
                array('code' => 'LAUNCH', 'name' => 'Launch', 'monthlyPrice' => '29.99', 'completedSessionsPerMonth' => 500),
                array('code' => 'GROWTH', 'name' => 'Growth', 'monthlyPrice' => '79.99', 'completedSessionsPerMonth' => 2000),
                array('code' => 'SCALE', 'name' => 'Scale', 'monthlyPrice' => '199.99', 'completedSessionsPerMonth' => 5000),
            );
        $plan_code = is_array($status) ? strtoupper((string) ($status['planCode'] ?? 'LAUNCH')) : 'LAUNCH';
        $plan_name = is_array($status) ? (string) ($status['planName'] ?? 'Launch') : 'Launch';
        $completed_sessions = is_array($status) ? max(0, (int) ($status['completedSessionsThisMonth'] ?? 0)) : 0;
        $completed_session_limit = is_array($status) ? max(0, (int) ($status['completedSessionsLimit'] ?? 500)) : 500;
        $show_mnw_notes = is_array($status)
            ? !empty($status['showMyNextWineNotes'])
            : 'yes' === ($settings['show_mnw_notes'] ?? 'no');
        $show_mnw_rating = is_array($status)
            ? !empty($status['showMyNextWineRating'])
            : 'yes' === ($settings['show_mnw_rating'] ?? 'no');
        $wine_categories = $this->client->normalise_wine_categories(
            is_array($status) && array_key_exists('wineCategories', $status)
                ? $status['wineCategories']
                : ($settings['wine_categories'] ?? null)
        );

        // These read-only flags are set by nonce-protected admin-post handlers and only control notices.
        // phpcs:disable WordPress.Security.NonceVerification.Recommended
        $notice_saved = isset($_GET['mynextwine_woo_saved']);
        $notice_tested = isset($_GET['mynextwine_woo_tested']);
        $notice_billing_returned = isset($_GET['mynextwine_woo_billing_returned']);
        $notice_billing_cancelled = isset($_GET['mynextwine_woo_billing_cancelled']);
        $notice_portal_returned = isset($_GET['mynextwine_woo_portal_returned']);
        $notice_sync_complete = isset($_GET['mynextwine_woo_sync_complete']);
        $notice_sync_progress = isset($_GET['mynextwine_woo_sync_progress']);
        $notice_error = isset($_GET['mynextwine_woo_error'])
            ? rawurldecode(sanitize_text_field(wp_unslash($_GET['mynextwine_woo_error'])))
            : '';
        // phpcs:enable WordPress.Security.NonceVerification.Recommended
        ?>
        <div class="wrap">
            <h1><?php echo esc_html__('My Next Wine', 'my-next-wine-for-woocommerce'); ?></h1>
            <?php if ($notice_saved) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Settings saved.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ($notice_tested) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('My Next Wine status refreshed.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ($notice_billing_returned) : ?>
                <div class="notice notice-info"><p><?php echo esc_html__('Stripe checkout returned successfully. Access activates only after My Next Wine receives the signed Stripe billing webhook; refresh the status if it does not update immediately.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ($notice_billing_cancelled) : ?>
                <div class="notice notice-info is-dismissible"><p><?php echo esc_html__('Stripe checkout was cancelled. No subscription was started.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ($notice_portal_returned) : ?>
                <div class="notice notice-info is-dismissible"><p><?php echo esc_html__('Billing portal closed. Refresh the status to see any subscription changes.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ($notice_sync_complete) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Catalogue synchronisation completed.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ($notice_sync_progress) : ?>
                <div class="notice notice-info is-dismissible"><p><?php echo esc_html__('Catalogue synchronisation is in progress. Refresh this page to continue.', 'my-next-wine-for-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if ('' !== $notice_error) : ?>
                <div class="notice notice-error"><p><?php echo esc_html($notice_error); ?></p></div>
            <?php endif; ?>
            <?php if ('' !== $status_error) : ?>
                <div class="notice notice-error"><p><?php echo esc_html($status_error); ?></p></div>
            <?php endif; ?>

            <div style="max-width:760px;background:#fff;border:1px solid #dcdcde;padding:18px 22px;margin:16px 0;">
                <h2 style="margin-top:0;"><?php echo esc_html__('Setup status', 'my-next-wine-for-woocommerce'); ?></h2>
                <p><strong><?php echo esc_html__('Store connection:', 'my-next-wine-for-woocommerce'); ?></strong>
                    <?php echo esc_html($connected ? __('Connected', 'my-next-wine-for-woocommerce') : $this->connection_status_label($connection_state)); ?>
                </p>
                <?php if (!$connected && !empty($settings['connection_error'])) : ?>
                    <p style="color:#b32d2e;"><?php echo esc_html((string) $settings['connection_error']); ?></p>
                <?php endif; ?>
                <p><strong><?php echo esc_html__('WooCommerce market configuration:', 'my-next-wine-for-woocommerce'); ?></strong>
                    <?php
                    /* translators: 1: country, 2: ISO country code, 3: store currency, 4: store locale. */
                    echo esc_html(sprintf(
                        __('%1$s (%2$s) — %3$s — %4$s', 'my-next-wine-for-woocommerce'),
                        '' !== $store_country ? $store_country : __('not set', 'my-next-wine-for-woocommerce'),
                        '' !== $store_country_code ? $store_country_code : __('not set', 'my-next-wine-for-woocommerce'),
                        '' !== $store_currency ? $store_currency : __('not set', 'my-next-wine-for-woocommerce'),
                        $store_locale
                    ));
                    ?>
                </p>
                <?php if (is_array($status)) : ?>
                    <p><strong><?php echo esc_html__('Store:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php echo esc_html($store_name); ?>
                    </p>
                    <p><strong><?php echo esc_html__('Store market:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php
                        /* translators: 1: country, 2: ISO country code, 3: store currency, 4: store locale, 5: service market locale. */
                        echo esc_html(sprintf(
                            __('%1$s (%2$s) — %3$s — store locale %4$s; service locale %5$s', 'my-next-wine-for-woocommerce'),
                            $store_country,
                            $store_country_code,
                            $store_currency,
                            $store_locale,
                            '' !== $market_locale ? $market_locale : __('not reported', 'my-next-wine-for-woocommerce')
                        ));
                        ?>
                    </p>
                    <?php if ('' !== $installed_at) : ?>
                        <p><strong><?php echo esc_html__('Installed:', 'my-next-wine-for-woocommerce'); ?></strong> <?php echo esc_html($this->format_status_date($installed_at)); ?></p>
                    <?php endif; ?>
                    <?php if ('' !== $last_service_contact_at) : ?>
                        <p><strong><?php echo esc_html__('Last successful service contact:', 'my-next-wine-for-woocommerce'); ?></strong> <?php echo esc_html($this->format_status_date($last_service_contact_at)); ?></p>
                    <?php endif; ?>
                    <p><strong><?php echo esc_html__('Catalogue:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php echo esc_html((string) ($catalogue['statusMessage'] ?? __('Waiting for the first catalogue sync.', 'my-next-wine-for-woocommerce'))); ?>
                    </p>
                    <p><strong><?php echo esc_html__('Catalogue counts:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php
                        /* translators: 1: imported items, 2: currently available items, 3: available mapped wines. */
                        echo esc_html(sprintf(
                            __('%1$s imported; %2$s available; %3$s available and mapped', 'my-next-wine-for-woocommerce'),
                            number_format_i18n((int) ($status['catalogueItemCount'] ?? 0)),
                            number_format_i18n((int) ($status['catalogueAvailableCount'] ?? 0)),
                            number_format_i18n((int) ($catalogue['mappedAvailableCount'] ?? 0))
                        ));
                        ?>
                    </p>
                    <p><strong><?php echo esc_html__('Mapping coverage:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php echo esc_html(number_format_i18n((int) ($catalogue['mappingCoveragePercentage'] ?? 0)) . '%'); ?>
                    </p>
                    <?php if ('' !== $last_catalogue_sync_at) : ?>
                        <p><strong><?php echo esc_html__('Last catalogue sync:', 'my-next-wine-for-woocommerce'); ?></strong> <?php echo esc_html($this->format_status_date($last_catalogue_sync_at)); ?></p>
                    <?php endif; ?>
                    <p><strong><?php echo esc_html__('Billing:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php echo esc_html($this->billing_status_label($billing_status, $billing_trial_days)); ?>
                    </p>
                    <p><strong><?php echo esc_html__('Plan:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php
                        /* translators: 1: plan name, 2: billing currency code, 3: monthly price. */
                        echo esc_html(sprintf(__('%1$s — %2$s %3$s per month', 'my-next-wine-for-woocommerce'), $plan_name, $billing_currency, $billing_price));
                        ?>
                    </p>
                    <p class="description"><?php echo esc_html__('The store currency and subscription billing currency can differ. Stripe Checkout and the Stripe invoice are authoritative for the amount and any tax shown before payment.', 'my-next-wine-for-woocommerce'); ?></p>
                    <p><strong><?php echo esc_html__('Completed sessions this month:', 'my-next-wine-for-woocommerce'); ?></strong>
                        <?php
                        /* translators: 1: completed sessions, 2: monthly session allowance. */
                        echo esc_html(sprintf(__('%1$s of %2$s', 'my-next-wine-for-woocommerce'), number_format_i18n($completed_sessions), number_format_i18n($completed_session_limit)));
                        ?>
                    </p>
                    <p class="description"><?php echo esc_html__('A session includes the initial recommendations and every refinement or bottle swap during the same shopper visit.', 'my-next-wine-for-woocommerce'); ?></p>
                    <?php if (!empty($status['trialEndsAt'])) : ?>
                        <p><strong><?php echo esc_html__('Trial ends:', 'my-next-wine-for-woocommerce'); ?></strong> <?php echo esc_html($this->format_status_date((string) $status['trialEndsAt'])); ?></p>
                    <?php endif; ?>
                    <?php if (!empty($status['nextPaymentAt'])) : ?>
                        <p><strong><?php echo esc_html__('Next renewal:', 'my-next-wine-for-woocommerce'); ?></strong> <?php echo esc_html($this->format_status_date((string) $status['nextPaymentAt'])); ?></p>
                    <?php endif; ?>
                    <?php if (!empty($status['accessEndsAt'])) : ?>
                        <p><strong><?php echo esc_html__('Access until:', 'my-next-wine-for-woocommerce'); ?></strong> <?php echo esc_html($this->format_status_date((string) $status['accessEndsAt'])); ?></p>
                    <?php endif; ?>
                    <?php if (!empty($status['latestInvoiceUrl']) && $this->is_allowed_stripe_url((string) $status['latestInvoiceUrl'])) : ?>
                        <p><a href="<?php echo esc_url((string) $status['latestInvoiceUrl']); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html__('View latest Stripe invoice', 'my-next-wine-for-woocommerce'); ?></a></p>
                    <?php endif; ?>
                    <?php if (empty($status['billingConfigured'])) : ?>
                        <p style="color:#b32d2e;"><?php echo esc_html__('Stripe subscription billing is not configured on the My Next Wine service. Checkout cannot start.', 'my-next-wine-for-woocommerce'); ?></p>
                    <?php elseif ('PAUSED' === strtoupper($billing_status)) : ?>
                        <p style="color:#b32d2e;"><?php echo esc_html__('Stripe could not collect a renewal payment. The Wine Finder is paused until Stripe confirms a successful retry.', 'my-next-wine-for-woocommerce'); ?></p>
                    <?php endif; ?>
                <?php endif; ?>

                <?php if (!$connected) : ?>
                    <p><?php echo esc_html__('No API keys, Somm IDs or installation credentials are required. The store connects only after an authorised administrator agrees below.', 'my-next-wine-for-woocommerce'); ?></p>
                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width:720px;">
                        <input type="hidden" name="action" value="mynextwine_woo_retry_connection">
                        <?php wp_nonce_field('mynextwine_woo_retry_connection'); ?>
                        <?php if (!$local_terms_current) : ?>
                            <div style="padding:14px 16px;border:1px solid #dcdcde;background:#f6f7f7;margin:14px 0;">
                                <p style="margin-top:0;"><strong><?php echo esc_html__('Before connecting', 'my-next-wine-for-woocommerce'); ?></strong></p>
                                <p><?php echo esc_html__('My Next Wine will receive the store URL, store contact and address details, WordPress/WooCommerce versions, currency and country. It will then receive the product catalogue needed to map and recommend wines.', 'my-next-wine-for-woocommerce'); ?></p>
                                <p><label><input type="checkbox" name="mynextwine_woo_accept_data_sharing" value="1" required> <?php echo esc_html__('I authorise this disclosed transfer to the external My Next Wine service.', 'my-next-wine-for-woocommerce'); ?></label></p>
                                <p><label><input type="checkbox" name="mynextwine_woo_accept_terms" value="1" required> <?php echo wp_kses_post(sprintf(
                                    /* translators: 1: Merchant Terms URL, 2: Privacy Statement URL. */
                                    __('I am authorised to bind this merchant, agree to the <a href="%1$s" target="_blank" rel="noopener">Merchant Terms</a> and acknowledge the <a href="%2$s" target="_blank" rel="noopener">Privacy Statement</a>.', 'my-next-wine-for-woocommerce'),
                                    esc_url(MYNEXTWINE_WOO_TERMS_URL),
                                    esc_url(MYNEXTWINE_WOO_PRIVACY_URL)
                                )); ?></label></p>
                            </div>
                        <?php endif; ?>
                        <?php submit_button($local_terms_current ? __('Retry connection', 'my-next-wine-for-woocommerce') : __('Agree and connect store', 'my-next-wine-for-woocommerce'), 'primary', 'submit', false); ?>
                    </form>
                <?php else : ?>
                    <?php if (!$server_terms_current) : ?>
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width:720px;padding:14px 16px;border:1px solid #dcdcde;background:#f6f7f7;margin:14px 0;">
                            <input type="hidden" name="action" value="mynextwine_woo_retry_connection">
                            <?php wp_nonce_field('mynextwine_woo_retry_connection'); ?>
                            <p style="margin-top:0;"><strong><?php echo esc_html__('Updated merchant agreement required', 'my-next-wine-for-woocommerce'); ?></strong></p>
                            <p><label><input type="checkbox" name="mynextwine_woo_accept_data_sharing" value="1" required> <?php echo esc_html__('I authorise the disclosed store and catalogue data transfer to My Next Wine.', 'my-next-wine-for-woocommerce'); ?></label></p>
                            <p><label><input type="checkbox" name="mynextwine_woo_accept_terms" value="1" required> <?php echo wp_kses_post(sprintf(
                                /* translators: 1: Merchant Terms URL, 2: Privacy Statement URL. */
                                __('I am authorised to bind this merchant, agree to the <a href="%1$s" target="_blank" rel="noopener">Merchant Terms</a> and acknowledge the <a href="%2$s" target="_blank" rel="noopener">Privacy Statement</a>.', 'my-next-wine-for-woocommerce'),
                                esc_url(MYNEXTWINE_WOO_TERMS_URL),
                                esc_url(MYNEXTWINE_WOO_PRIVACY_URL)
                            )); ?></label></p>
                            <?php submit_button(__('Accept and continue', 'my-next-wine-for-woocommerce'), 'primary', 'submit', false); ?>
                        </form>
                    <?php endif; ?>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <input type="hidden" name="action" value="mynextwine_woo_test">
                            <?php wp_nonce_field('mynextwine_woo_test'); ?>
                            <?php submit_button(__('Refresh status', 'my-next-wine-for-woocommerce'), 'secondary', 'submit', false); ?>
                        </form>
                        <?php if ('PLUGIN_PUSH' === ($settings['catalogue_mode'] ?? '')) : ?>
                            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                                <input type="hidden" name="action" value="mynextwine_woo_sync_catalogue">
                                <?php wp_nonce_field('mynextwine_woo_sync_catalogue'); ?>
                                <?php submit_button(__('Sync catalogue now', 'my-next-wine-for-woocommerce'), 'secondary', 'submit', false); ?>
                            </form>
                        <?php endif; ?>
                        <?php if (is_array($status) && !empty($status['canStartBilling'])) : ?>
                            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="width:100%;margin-top:12px;">
                                <input type="hidden" name="action" value="mynextwine_woo_start_billing">
                                <?php wp_nonce_field('mynextwine_woo_start_billing'); ?>
                                <fieldset>
                                    <legend style="font-weight:600;margin-bottom:8px;"><?php echo esc_html__('Choose a Wine Finder plan', 'my-next-wine-for-woocommerce'); ?></legend>
                                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;margin-bottom:12px;">
                                        <?php foreach ($plans as $plan) :
                                            $candidate_code = strtoupper((string) ($plan['code'] ?? ''));
                                            if (!in_array($candidate_code, array('LAUNCH', 'GROWTH', 'SCALE'), true)) {
                                                continue;
                                            }
                                            ?>
                                            <label style="display:block;border:1px solid #c3c4c7;border-radius:6px;padding:12px;background:#fff;">
                                                <input type="radio" name="plan_code" value="<?php echo esc_attr($candidate_code); ?>" <?php checked($plan_code, $candidate_code); ?> required>
                                                <strong><?php echo esc_html((string) ($plan['name'] ?? ucfirst(strtolower($candidate_code)))); ?></strong><br>
                                                <span><?php echo esc_html($billing_currency . ' ' . (string) ($plan['monthlyPrice'] ?? '')); ?>/<?php echo esc_html__('month', 'my-next-wine-for-woocommerce'); ?></span><br>
                                                <small><?php echo esc_html(number_format_i18n((int) ($plan['completedSessionsPerMonth'] ?? 0)) . ' ' . __('completed sessions', 'my-next-wine-for-woocommerce')); ?></small>
                                            </label>
                                        <?php endforeach; ?>
                                    </div>
                                </fieldset>
                                <?php submit_button(sprintf(__('Start %d-day trial with selected plan', 'my-next-wine-for-woocommerce'), $billing_trial_days), 'primary', 'submit', false); ?>
                            </form>
                        <?php endif; ?>
                        <?php if (is_array($status) && !empty($status['canManageBilling'])) : ?>
                            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                                <input type="hidden" name="action" value="mynextwine_woo_manage_billing">
                                <?php wp_nonce_field('mynextwine_woo_manage_billing'); ?>
                                <?php submit_button(__('Manage subscription', 'my-next-wine-for-woocommerce'), 'secondary', 'submit', false); ?>
                            </form>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>

            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="mynextwine_woo_save">
                <?php wp_nonce_field('mynextwine_woo_save'); ?>
                <table class="form-table" role="presentation">
                    <tr><th scope="row"><?php echo esc_html__('Enable widget', 'my-next-wine-for-woocommerce'); ?></th><td><label><input type="checkbox" name="enabled" value="1" <?php checked('yes', $settings['enabled']); ?> <?php disabled(!$operational); ?>> <?php echo esc_html__('Show the wine finder', 'my-next-wine-for-woocommerce'); ?></label><?php if (!$operational) : ?><p class="description"><?php echo esc_html__('This unlocks after the catalogue is ready and My Next Wine confirms the Stripe trial or paid plan.', 'my-next-wine-for-woocommerce'); ?></p><?php endif; ?></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Automatic display', 'my-next-wine-for-woocommerce'); ?></th><td><label><input type="checkbox" name="auto_display" value="1" <?php checked('yes', $settings['auto_display']); ?>> <?php echo esc_html__('Add the floating launcher to public shop pages', 'my-next-wine-for-woocommerce'); ?></label><p class="description"><?php echo esc_html__('The [mynextwine_wine_finder] shortcode is also available.', 'my-next-wine-for-woocommerce'); ?></p></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Optional aggregate analytics', 'my-next-wine-for-woocommerce'); ?></th><td><label><input type="checkbox" name="analytics_enabled" value="1" <?php checked('yes', $settings['analytics_enabled']); ?>> <?php echo esc_html__('Allow aggregate Wine Finder events', 'my-next-wine-for-woocommerce'); ?></label><p class="description"><?php echo esc_html__('Off by default. If the site exposes the WordPress Consent API, events are sent only when wp_has_consent("statistics") returns true. If that API is not present, enabling this setting confirms that the store\'s own privacy and consent setup permits these aggregate events. Recommendation and basket requests continue because they are needed to provide the feature.', 'my-next-wine-for-woocommerce'); ?></p></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Launcher position', 'my-next-wine-for-woocommerce'); ?></th><td><select name="launcher_position"><option value="left" <?php selected('left', $settings['launcher_position']); ?>><?php echo esc_html__('Bottom left', 'my-next-wine-for-woocommerce'); ?></option><option value="right" <?php selected('right', $settings['launcher_position']); ?>><?php echo esc_html__('Bottom right', 'my-next-wine-for-woocommerce'); ?></option></select></td></tr>
                    <?php
                    $launcher_image_id = absint($settings['launcher_image_id'] ?? 0);
                    $launcher_image_url = $launcher_image_id ? wp_get_attachment_image_url($launcher_image_id, 'thumbnail') : '';
                    ?>
                    <tr>
                        <th scope="row"><?php echo esc_html__('Launcher image', 'my-next-wine-for-woocommerce'); ?></th>
                        <td>
                            <input id="mnw-launcher-image-id" name="launcher_image_id" type="hidden" value="<?php echo esc_attr((string) $launcher_image_id); ?>">
                            <img id="mnw-launcher-image-preview" src="<?php echo esc_url($launcher_image_url ?: ''); ?>" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:12px;<?php echo $launcher_image_url ? '' : 'display:none;'; ?>">
                            <p>
                                <button class="button" id="mnw-select-launcher-image" type="button"><?php echo esc_html__('Choose image', 'my-next-wine-for-woocommerce'); ?></button>
                                <button class="button" id="mnw-remove-launcher-image" type="button" <?php disabled(!$launcher_image_url); ?>><?php echo esc_html__('Use default wine glass', 'my-next-wine-for-woocommerce'); ?></button>
                            </p>
                            <p class="description"><?php echo esc_html__('Choose a square image from the Media Library. It replaces the wine glass in the launcher and popup.', 'my-next-wine-for-woocommerce'); ?></p>
                        </td>
                    </tr>
                    <tr><th scope="row"><?php echo esc_html__('Match theme', 'my-next-wine-for-woocommerce'); ?></th><td><label><input type="checkbox" name="inherit_theme_styles" value="1" <?php checked('yes', $settings['inherit_theme_styles']); ?>> <?php echo esc_html__('Use the active theme colours where they provide sufficient contrast', 'my-next-wine-for-woocommerce'); ?></label></td></tr>
                    <tr><th scope="row"><label for="mnw-accent"><?php echo esc_html__('Fallback accent', 'my-next-wine-for-woocommerce'); ?></label></th><td><input id="mnw-accent" name="accent_color" type="color" value="<?php echo esc_attr($settings['accent_color']); ?>"> <input name="accent_text_color" type="color" value="<?php echo esc_attr($settings['accent_text_color']); ?>"></td></tr>
                    <tr><th scope="row"><label for="mnw-heading"><?php echo esc_html__('Heading', 'my-next-wine-for-woocommerce'); ?></label></th><td><input class="regular-text" id="mnw-heading" name="heading" type="text" maxlength="80" value="<?php echo esc_attr($settings['heading']); ?>"></td></tr>
                    <tr><th scope="row"><label for="mnw-intro"><?php echo esc_html__('Popup introduction', 'my-next-wine-for-woocommerce'); ?></label></th><td><textarea class="large-text" id="mnw-intro" name="intro" rows="3" maxlength="240"><?php echo esc_textarea($settings['intro']); ?></textarea></td></tr>
                    <tr><th scope="row"><label for="mnw-launcher-label"><?php echo esc_html__('Launcher label', 'my-next-wine-for-woocommerce'); ?></label></th><td><input class="regular-text" id="mnw-launcher-label" name="launcher_label" type="text" maxlength="60" value="<?php echo esc_attr($settings['launcher_label']); ?>"></td></tr>
                    <tr><th scope="row"><label for="mnw-button-label"><?php echo esc_html__('Basket button', 'my-next-wine-for-woocommerce'); ?></label></th><td><input class="regular-text" id="mnw-button-label" name="button_label" type="text" maxlength="60" value="<?php echo esc_attr($settings['button_label']); ?>"></td></tr>
                </table>

                <h2><?php echo esc_html__('Bottle selection categories', 'my-next-wine-for-woocommerce'); ?></h2>
                <p><?php echo esc_html__('Choose at least two categories to offer on the first Wine Finder question.', 'my-next-wine-for-woocommerce'); ?></p>
                <?php
                $category_labels = array(
                    'red' => __('Red', 'my-next-wine-for-woocommerce'),
                    'white' => __('White', 'my-next-wine-for-woocommerce'),
                    'rose' => __('Rosé', 'my-next-wine-for-woocommerce'),
                    'sparkling' => __('Sparkling', 'my-next-wine-for-woocommerce'),
                    'orange' => __('Orange/Skin-contact', 'my-next-wine-for-woocommerce'),
                    'petNat' => __('Pét-nat', 'my-next-wine-for-woocommerce'),
                    'sherry' => __('Sherry', 'my-next-wine-for-woocommerce'),
                    'otherFortified' => __('Other fortified', 'my-next-wine-for-woocommerce'),
                    'dessert' => __('Dessert', 'my-next-wine-for-woocommerce'),
                );
                ?>
                <fieldset style="display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px;max-width:760px;">
                    <legend class="screen-reader-text"><?php echo esc_html__('Bottle selection categories', 'my-next-wine-for-woocommerce'); ?></legend>
                    <?php foreach ($category_labels as $category_key => $category_label) : ?>
                        <label style="display:flex;align-items:center;gap:8px;min-height:40px;padding:7px 10px;border:1px solid #dcdcde;background:#fff;border-radius:4px;">
                            <input type="checkbox" name="wine_categories[]" value="<?php echo esc_attr($category_key); ?>" <?php checked(in_array($category_key, $wine_categories, true)); ?>>
                            <?php echo esc_html($category_label); ?>
                        </label>
                    <?php endforeach; ?>
                </fieldset>

                <h2><?php echo esc_html__('My Next Wine content', 'my-next-wine-for-woocommerce'); ?></h2>
                <p><?php echo esc_html__('Both options are off by default. Enable them only when they suit this store’s own product presentation.', 'my-next-wine-for-woocommerce'); ?></p>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><?php echo esc_html__('Show My Next Wine notes', 'my-next-wine-for-woocommerce'); ?></th>
                        <td>
                            <label><input type="checkbox" name="show_mnw_notes" value="1" <?php checked($show_mnw_notes); ?>> <?php echo esc_html__('Add our wine note and allow shoppers to open notes for the producer, region, country and grapes.', 'my-next-wine-for-woocommerce'); ?></label>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row"><?php echo esc_html__('Show My Next Wine rating', 'my-next-wine-for-woocommerce'); ?></th>
                        <td>
                            <label><input type="checkbox" name="show_mnw_rating" value="1" <?php checked($show_mnw_rating); ?>> <?php echo esc_html__('Display the My Next Wine rating in Quick View when a rating is available.', 'my-next-wine-for-woocommerce'); ?></label>
                        </td>
                    </tr>
                </table>
                <?php submit_button(__('Save settings', 'my-next-wine-for-woocommerce')); ?>
            </form>
        </div>
        <?php
    }

    private function redirect_with_error(WP_Error $error): void {
        $this->redirect_with_message($this->error_message($error));
    }

    /** @return array<int,string> */
    private function submitted_wine_categories(): array {
        $raw = isset($_POST['wine_categories']) && is_array($_POST['wine_categories'])
            ? wp_unslash($_POST['wine_categories'])
            : array();
        $submitted = array_values(array_unique(array_map(
            static fn($value): string => sanitize_text_field((string) $value),
            $raw
        )));
        return array_values(array_intersect(self::WINE_CATEGORY_KEYS, $submitted));
    }

    private function redirect_with_message(string $message): void {
        wp_safe_redirect(add_query_arg(array(
            'page' => 'mynextwine-woo-settings',
            'mynextwine_woo_error' => rawurlencode($message),
        ), admin_url('admin.php')));
        exit;
    }

    private function is_allowed_stripe_url(string $url): bool {
        $parts = wp_parse_url($url);
        if (!is_array($parts) || 'https' !== strtolower((string) ($parts['scheme'] ?? ''))) {
            return false;
        }
        $host = strtolower((string) ($parts['host'] ?? ''));
        return in_array($host, array(
            'checkout.stripe.com',
            'billing.stripe.com',
            'invoice.stripe.com',
        ), true);
    }

    private function billing_status_label(string $status, int $trial_days): string {
        $labels = array(
            'NOT_STARTED' => __('Not started', 'my-next-wine-for-woocommerce'),
            'PENDING_CONFIRMATION' => __('Awaiting Stripe checkout confirmation', 'my-next-wine-for-woocommerce'),
            /* translators: %d: trial length in days. */
            'TRIAL' => sprintf(__('%d-day trial active', 'my-next-wine-for-woocommerce'), $trial_days),
            'ACTIVE' => __('Active', 'my-next-wine-for-woocommerce'),
            'PAUSED' => __('Paused after failed payment', 'my-next-wine-for-woocommerce'),
            'CANCEL_PENDING' => __('Cancellation scheduled — access remains active until the date shown', 'my-next-wine-for-woocommerce'),
            'CANCELED' => __('Cancelled', 'my-next-wine-for-woocommerce'),
            'REFUNDED' => __('Refunded', 'my-next-wine-for-woocommerce'),
        );
        $key = strtoupper($status);
        return (string) ($labels[$key] ?? $status);
    }

    private function connection_status_label(string $status): string {
        $labels = array(
            'PENDING' => __('Pending administrator connection', 'my-next-wine-for-woocommerce'),
            'CONNECTING' => __('Connecting', 'my-next-wine-for-woocommerce'),
            'ERROR' => __('Connection error; automatic retry scheduled', 'my-next-wine-for-woocommerce'),
            'MARKET_UNSUPPORTED' => __('Store country is not supported', 'my-next-wine-for-woocommerce'),
            'MARKET_DISABLED' => __('UK onboarding is temporarily paused', 'my-next-wine-for-woocommerce'),
            'CURRENCY_MISMATCH' => __('Store currency does not match its country', 'my-next-wine-for-woocommerce'),
            'MARKET_CONFIGURATION_ERROR' => __('The selected market is not fully configured', 'my-next-wine-for-woocommerce'),
        );
        $key = strtoupper($status);
        return (string) ($labels[$key] ?? $status);
    }

    private function format_status_date(string $value): string {
        $timestamp = strtotime($value);
        return false === $timestamp
            ? sanitize_text_field($value)
            : wp_date(get_option('date_format') . ' ' . get_option('time_format'), $timestamp);
    }

    private function error_message(WP_Error $error): string {
        $message = $error->get_error_message();
        $data = $error->get_error_data();
        if (is_array($data) && !empty($data['detail']) && is_string($data['detail'])) {
            $message .= ' ' . $data['detail'];
        }
        return $message;
    }
}
