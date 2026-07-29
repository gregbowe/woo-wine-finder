<?php
/** Merchant setup/status and appearance screen. */

if (!defined('ABSPATH')) {
    exit;
}

final class MNW_Woo_Settings {
    private MNW_Woo_API_Client $client;
    private MNW_Woo_Catalogue_Sync $catalogue_sync;

    public function __construct(MNW_Woo_API_Client $client, MNW_Woo_Catalogue_Sync $catalogue_sync) {
        $this->client = $client;
        $this->catalogue_sync = $catalogue_sync;
        add_action('admin_menu', array($this, 'admin_menu'));
        add_action('admin_post_mnw_woo_save', array($this, 'save'));
        add_action('admin_post_mnw_woo_test', array($this, 'refresh_status'));
        add_action('admin_post_mnw_woo_start_trial', array($this, 'start_trial'));
        add_filter('plugin_action_links_' . plugin_basename(MNW_WOO_FILE), array($this, 'action_links'));
    }

    public function admin_menu(): void {
        add_submenu_page(
            'woocommerce',
            __('My Next Wine', 'my-next-wine-woocommerce'),
            __('My Next Wine', 'my-next-wine-woocommerce'),
            'manage_woocommerce',
            'my-next-wine',
            array($this, 'render')
        );
    }

    /** @param array<int,string> $links */
    public function action_links(array $links): array {
        array_unshift($links, '<a href="' . esc_url(admin_url('admin.php?page=my-next-wine')) . '">' . esc_html__('Setup', 'my-next-wine-woocommerce') . '</a>');
        return $links;
    }

    public function save(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to manage My Next Wine.', 'my-next-wine-woocommerce'));
        }
        check_admin_referer('mnw_woo_save');

        $current = $this->client->settings();
        $position = isset($_POST['launcher_position']) ? sanitize_key(wp_unslash($_POST['launcher_position'])) : 'right';
        if (!in_array($position, array('left', 'right'), true)) {
            $position = 'right';
        }
        $requested_enabled = isset($_POST['enabled']);
        $status = $this->client->is_configured() ? $this->client->status() : null;
        $operational = is_array($status) && !empty($status['operational']);

        $current['enabled'] = $requested_enabled && $operational ? 'yes' : 'no';
        $current['auto_display'] = isset($_POST['auto_display']) ? 'yes' : 'no';
        $current['launcher_position'] = $position;
        $current['inherit_theme_styles'] = isset($_POST['inherit_theme_styles']) ? 'yes' : 'no';
        $current['accent_color'] = sanitize_hex_color((string) wp_unslash($_POST['accent_color'] ?? '')) ?: '#722f37';
        $current['accent_text_color'] = sanitize_hex_color((string) wp_unslash($_POST['accent_text_color'] ?? '')) ?: '#ffffff';
        $current['heading'] = sanitize_text_field((string) wp_unslash($_POST['heading'] ?? ''));
        $current['launcher_label'] = sanitize_text_field((string) wp_unslash($_POST['launcher_label'] ?? ''));
        $current['button_label'] = sanitize_text_field((string) wp_unslash($_POST['button_label'] ?? ''));
        $this->client->save_settings($current);

        $args = array('page' => 'my-next-wine', 'mnw_saved' => '1');
        if ($requested_enabled && !$operational) {
            $args['mnw_error'] = rawurlencode(__('The Wine Finder cannot be enabled until the catalogue is ready and the trial or plan is active.', 'my-next-wine-woocommerce'));
        }
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
        exit;
    }

    public function refresh_status(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to manage My Next Wine.', 'my-next-wine-woocommerce'));
        }
        check_admin_referer('mnw_woo_test');
        $result = $this->client->status();
        $args = array('page' => 'my-next-wine');
        if (is_wp_error($result)) {
            $args['mnw_error'] = rawurlencode($this->error_message($result));
        } else {
            set_transient('mnw_woo_last_status_' . get_current_user_id(), $result, 60);
            $args['mnw_tested'] = '1';
        }
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
        exit;
    }

    public function start_trial(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to start the My Next Wine trial.', 'my-next-wine-woocommerce'));
        }
        check_admin_referer('mnw_woo_start_trial');
        $result = $this->client->start_trial();
        $args = array('page' => 'my-next-wine');
        if (is_wp_error($result)) {
            $args['mnw_error'] = rawurlencode($this->error_message($result));
        } else {
            $args['mnw_trial_started'] = '1';
            delete_transient('mnw_woo_last_status_' . get_current_user_id());
        }
        wp_safe_redirect(add_query_arg($args, admin_url('admin.php')));
        exit;
    }

    public function render(): void {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }
        $settings = $this->client->settings();
        $status = get_transient('mnw_woo_last_status_' . get_current_user_id());
        $status_error = '';
        if ($this->client->is_configured() && !is_array($status)) {
            $fresh = $this->client->status();
            if (is_wp_error($fresh)) {
                $status_error = $this->error_message($fresh);
            } else {
                $status = $fresh;
                set_transient('mnw_woo_last_status_' . get_current_user_id(), $status, 60);
            }
        }
        $connected = $this->client->is_configured();
        $operational = is_array($status) && !empty($status['operational']);
        $catalogue = is_array($status) && isset($status['catalogue']) && is_array($status['catalogue']) ? $status['catalogue'] : array();
        $connection_state = (string) ($settings['connection_state'] ?? 'PENDING');
        $local_terms_current = 'yes' === ($settings['connection_consent'] ?? 'no')
            && MNW_WOO_TERMS_VERSION === ($settings['terms_version'] ?? '');
        $server_terms_current = is_array($status) && !empty($status['termsAccepted']);
        ?>
        <div class="wrap">
            <h1><?php echo esc_html__('My Next Wine', 'my-next-wine-woocommerce'); ?></h1>
            <?php if (isset($_GET['mnw_saved'])) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Settings saved.', 'my-next-wine-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if (isset($_GET['mnw_tested'])) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('My Next Wine status refreshed.', 'my-next-wine-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if (isset($_GET['mnw_trial_started'])) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Your 30-day My Next Wine trial has started.', 'my-next-wine-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if (isset($_GET['mnw_sync_complete'])) : ?>
                <div class="notice notice-success is-dismissible"><p><?php echo esc_html__('Catalogue synchronisation completed.', 'my-next-wine-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if (isset($_GET['mnw_sync_progress'])) : ?>
                <div class="notice notice-info is-dismissible"><p><?php echo esc_html__('Catalogue synchronisation is in progress. Refresh this page to continue.', 'my-next-wine-woocommerce'); ?></p></div>
            <?php endif; ?>
            <?php if (isset($_GET['mnw_error'])) : ?>
                <div class="notice notice-error"><p><?php echo esc_html(rawurldecode(sanitize_text_field(wp_unslash($_GET['mnw_error'])))); ?></p></div>
            <?php endif; ?>
            <?php if ('' !== $status_error) : ?>
                <div class="notice notice-error"><p><?php echo esc_html($status_error); ?></p></div>
            <?php endif; ?>

            <div style="max-width:760px;background:#fff;border:1px solid #dcdcde;padding:18px 22px;margin:16px 0;">
                <h2 style="margin-top:0;"><?php echo esc_html__('Setup status', 'my-next-wine-woocommerce'); ?></h2>
                <p><strong><?php echo esc_html__('Store connection:', 'my-next-wine-woocommerce'); ?></strong>
                    <?php echo esc_html($connected ? __('Connected', 'my-next-wine-woocommerce') : ucfirst(strtolower($connection_state))); ?>
                </p>
                <?php if (!$connected && !empty($settings['connection_error'])) : ?>
                    <p style="color:#b32d2e;"><?php echo esc_html((string) $settings['connection_error']); ?></p>
                <?php endif; ?>
                <?php if (is_array($status)) : ?>
                    <p><strong><?php echo esc_html__('Catalogue:', 'my-next-wine-woocommerce'); ?></strong>
                        <?php echo esc_html((string) ($catalogue['statusMessage'] ?? __('Waiting for the first catalogue sync.', 'my-next-wine-woocommerce'))); ?>
                    </p>
                    <p><strong><?php echo esc_html__('Available mapped wines:', 'my-next-wine-woocommerce'); ?></strong>
                        <?php echo esc_html((string) ((int) ($catalogue['mappedAvailableCount'] ?? 0))); ?>
                    </p>
                    <p><strong><?php echo esc_html__('Billing:', 'my-next-wine-woocommerce'); ?></strong>
                        <?php echo esc_html((string) ($status['billingStatus'] ?? 'NOT_STARTED')); ?>
                    </p>
                <?php endif; ?>

                <?php if (!$connected) : ?>
                    <p><?php echo esc_html__('No API keys, Somm IDs or installation credentials are required. The store connects only after an authorised administrator agrees below.', 'my-next-wine-woocommerce'); ?></p>
                    <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width:720px;">
                        <input type="hidden" name="action" value="mnw_woo_retry_connection">
                        <?php wp_nonce_field('mnw_woo_retry_connection'); ?>
                        <?php if (!$local_terms_current) : ?>
                            <div style="padding:14px 16px;border:1px solid #dcdcde;background:#f6f7f7;margin:14px 0;">
                                <p style="margin-top:0;"><strong><?php echo esc_html__('Before connecting', 'my-next-wine-woocommerce'); ?></strong></p>
                                <p><?php echo esc_html__('My Next Wine will receive the store URL, store contact and address details, WordPress/WooCommerce versions, currency and country. It will then receive the product catalogue needed to map and recommend wines.', 'my-next-wine-woocommerce'); ?></p>
                                <p><label><input type="checkbox" name="mnw_accept_data_sharing" value="1" required> <?php echo esc_html__('I authorise this disclosed transfer to the external My Next Wine service.', 'my-next-wine-woocommerce'); ?></label></p>
                                <p><label><input type="checkbox" name="mnw_accept_terms" value="1" required> <?php echo wp_kses_post(sprintf(
                                    __('I am authorised to bind this merchant, agree to the <a href="%1$s" target="_blank" rel="noopener">Merchant Terms</a> and acknowledge the <a href="%2$s" target="_blank" rel="noopener">Privacy Statement</a>.', 'my-next-wine-woocommerce'),
                                    esc_url(MNW_WOO_TERMS_URL),
                                    esc_url(MNW_WOO_PRIVACY_URL)
                                )); ?></label></p>
                            </div>
                        <?php endif; ?>
                        <?php submit_button($local_terms_current ? __('Retry connection', 'my-next-wine-woocommerce') : __('Agree and connect store', 'my-next-wine-woocommerce'), 'primary', 'submit', false); ?>
                    </form>
                <?php else : ?>
                    <?php if (!$server_terms_current) : ?>
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width:720px;padding:14px 16px;border:1px solid #dcdcde;background:#f6f7f7;margin:14px 0;">
                            <input type="hidden" name="action" value="mnw_woo_retry_connection">
                            <?php wp_nonce_field('mnw_woo_retry_connection'); ?>
                            <p style="margin-top:0;"><strong><?php echo esc_html__('Updated merchant agreement required', 'my-next-wine-woocommerce'); ?></strong></p>
                            <p><label><input type="checkbox" name="mnw_accept_data_sharing" value="1" required> <?php echo esc_html__('I authorise the disclosed store and catalogue data transfer to My Next Wine.', 'my-next-wine-woocommerce'); ?></label></p>
                            <p><label><input type="checkbox" name="mnw_accept_terms" value="1" required> <?php echo wp_kses_post(sprintf(
                                __('I am authorised to bind this merchant, agree to the <a href="%1$s" target="_blank" rel="noopener">Merchant Terms</a> and acknowledge the <a href="%2$s" target="_blank" rel="noopener">Privacy Statement</a>.', 'my-next-wine-woocommerce'),
                                esc_url(MNW_WOO_TERMS_URL),
                                esc_url(MNW_WOO_PRIVACY_URL)
                            )); ?></label></p>
                            <?php submit_button(__('Accept and continue', 'my-next-wine-woocommerce'), 'primary', 'submit', false); ?>
                        </form>
                    <?php endif; ?>
                    <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
                        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                            <input type="hidden" name="action" value="mnw_woo_test">
                            <?php wp_nonce_field('mnw_woo_test'); ?>
                            <?php submit_button(__('Refresh status', 'my-next-wine-woocommerce'), 'secondary', 'submit', false); ?>
                        </form>
                        <?php if ('PLUGIN_PUSH' === ($settings['catalogue_mode'] ?? '')) : ?>
                            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                                <input type="hidden" name="action" value="mnw_woo_sync_catalogue">
                                <?php wp_nonce_field('mnw_woo_sync_catalogue'); ?>
                                <?php submit_button(__('Sync catalogue now', 'my-next-wine-woocommerce'), 'secondary', 'submit', false); ?>
                            </form>
                        <?php endif; ?>
                        <?php if (is_array($status) && !empty($status['canStartTrial'])) : ?>
                            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                                <input type="hidden" name="action" value="mnw_woo_start_trial">
                                <?php wp_nonce_field('mnw_woo_start_trial'); ?>
                                <?php submit_button(__('Start 30-day trial', 'my-next-wine-woocommerce'), 'primary', 'submit', false); ?>
                            </form>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>
            </div>

            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="mnw_woo_save">
                <?php wp_nonce_field('mnw_woo_save'); ?>
                <table class="form-table" role="presentation">
                    <tr><th scope="row"><?php echo esc_html__('Enable widget', 'my-next-wine-woocommerce'); ?></th><td><label><input type="checkbox" name="enabled" value="1" <?php checked('yes', $settings['enabled']); ?> <?php disabled(!$operational); ?>> <?php echo esc_html__('Show the wine finder', 'my-next-wine-woocommerce'); ?></label><?php if (!$operational) : ?><p class="description"><?php echo esc_html__('This unlocks after the catalogue is ready and the trial or plan is active.', 'my-next-wine-woocommerce'); ?></p><?php endif; ?></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Automatic display', 'my-next-wine-woocommerce'); ?></th><td><label><input type="checkbox" name="auto_display" value="1" <?php checked('yes', $settings['auto_display']); ?>> <?php echo esc_html__('Add the floating launcher to public shop pages', 'my-next-wine-woocommerce'); ?></label><p class="description"><?php echo esc_html__('The [my_next_wine] shortcode is also available.', 'my-next-wine-woocommerce'); ?></p></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Launcher position', 'my-next-wine-woocommerce'); ?></th><td><select name="launcher_position"><option value="right" <?php selected('right', $settings['launcher_position']); ?>><?php echo esc_html__('Bottom right', 'my-next-wine-woocommerce'); ?></option><option value="left" <?php selected('left', $settings['launcher_position']); ?>><?php echo esc_html__('Bottom left', 'my-next-wine-woocommerce'); ?></option></select></td></tr>
                    <tr><th scope="row"><?php echo esc_html__('Match theme', 'my-next-wine-woocommerce'); ?></th><td><label><input type="checkbox" name="inherit_theme_styles" value="1" <?php checked('yes', $settings['inherit_theme_styles']); ?>> <?php echo esc_html__('Use the active theme colours where they provide sufficient contrast', 'my-next-wine-woocommerce'); ?></label></td></tr>
                    <tr><th scope="row"><label for="mnw-accent"><?php echo esc_html__('Fallback accent', 'my-next-wine-woocommerce'); ?></label></th><td><input id="mnw-accent" name="accent_color" type="color" value="<?php echo esc_attr($settings['accent_color']); ?>"> <input name="accent_text_color" type="color" value="<?php echo esc_attr($settings['accent_text_color']); ?>"></td></tr>
                    <tr><th scope="row"><label for="mnw-heading"><?php echo esc_html__('Heading', 'my-next-wine-woocommerce'); ?></label></th><td><input class="regular-text" id="mnw-heading" name="heading" type="text" maxlength="80" value="<?php echo esc_attr($settings['heading']); ?>"></td></tr>
                    <tr><th scope="row"><label for="mnw-launcher-label"><?php echo esc_html__('Launcher label', 'my-next-wine-woocommerce'); ?></label></th><td><input class="regular-text" id="mnw-launcher-label" name="launcher_label" type="text" maxlength="60" value="<?php echo esc_attr($settings['launcher_label']); ?>"></td></tr>
                    <tr><th scope="row"><label for="mnw-button-label"><?php echo esc_html__('Basket button', 'my-next-wine-woocommerce'); ?></label></th><td><input class="regular-text" id="mnw-button-label" name="button_label" type="text" maxlength="60" value="<?php echo esc_attr($settings['button_label']); ?>"></td></tr>
                </table>
                <?php submit_button(__('Save settings', 'my-next-wine-woocommerce')); ?>
            </form>
        </div>
        <?php
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
