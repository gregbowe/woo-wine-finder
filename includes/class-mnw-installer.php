<?php
/** Consent-gated, ownership-verified WooCommerce installation bootstrap. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_Installer {
    private const BOOTSTRAP_HOOK = 'mynextwine_woo_bootstrap_installation';
    private const PROOF_NAMESPACE = 'my-next-wine/v1';
    private const PROOF_ROUTE = '/bootstrap-proof';
    private const CHALLENGE_LIFETIME = 600;
    private const BOOTSTRAP_LOCK_OPTION = 'mynextwine_woo_bootstrap_lock';
    private const BOOTSTRAP_LOCK_SECONDS = 90;

    private MyNextWine_Woo_API_Client $client;
    private ?MyNextWine_Woo_Catalogue_Sync $catalogue_sync = null;

    public function __construct(MyNextWine_Woo_API_Client $client) {
        $this->client = $client;
        add_action('rest_api_init', array($this, 'register_proof_route'));
        add_action(self::BOOTSTRAP_HOOK, array($this, 'bootstrap'));
        add_action('admin_init', array($this, 'maybe_bootstrap_in_admin'));
        add_action('admin_post_mynextwine_woo_retry_connection', array($this, 'retry_connection'));
    }

    public function set_catalogue_sync(MyNextWine_Woo_Catalogue_Sync $catalogue_sync): void {
        $this->catalogue_sync = $catalogue_sync;
    }

    public static function activate(): void {
        if (!class_exists('MyNextWine_Woo_API_Client')) {
            return;
        }
        $client = new MyNextWine_Woo_API_Client();
        $settings = $client->settings();
        if (empty($settings['installation_id'])) {
            $settings['installation_id'] = wp_generate_uuid4();
        }
        if (empty($settings['installation_secret'])) {
            $settings['installation_secret'] = self::random_secret();
        }
        $settings['connection_state'] = 'PENDING';
        $settings['connection_error'] = '';
        $client->save_settings($settings);
        // Do not contact My Next Wine on activation. An authorised WooCommerce
        // administrator must first review the disclosures and connect the store.
    }

    public static function deactivate(): void {
        wp_clear_scheduled_hook(self::BOOTSTRAP_HOOK);
    }

    public function register_proof_route(): void {
        register_rest_route(self::PROOF_NAMESPACE, self::PROOF_ROUTE, array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'proof'),
            'permission_callback' => '__return_true',
            'args' => array(
                'challenge' => array('required' => true, 'sanitize_callback' => 'sanitize_text_field'),
                'installation_id' => array('required' => true, 'sanitize_callback' => 'sanitize_text_field'),
            ),
        ));
    }

    public function proof(WP_REST_Request $request): WP_REST_Response {
        $settings = $this->client->settings();
        $challenge = (string) $request->get_param('challenge');
        $installation_id = (string) $request->get_param('installation_id');
        // The challenge is supplied by My Next Wine and signed with the secret
        // that exists only in this WordPress installation. Do not require it to
        // equal one mutable stored challenge: wp-cron and an admin retry can
        // otherwise overlap and invalidate each other before the backend calls
        // this proof route.
        if (!preg_match('/^[A-Za-z0-9_-]{24,128}$/', $challenge)
            || !hash_equals((string) ($settings['installation_id'] ?? ''), $installation_id)
            || empty($settings['installation_secret'])) {
            return new WP_REST_Response(array('error' => 'Invalid or expired installation challenge.'), 404, array(
                'Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0',
            ));
        }

        $store_url = $this->store_url();
        $canonical = $installation_id . "\n" . $challenge . "\n" . $store_url;
        $proof = hash_hmac('sha256', $canonical, (string) $settings['installation_secret']);
        return new WP_REST_Response(array(
            'installationId' => $installation_id,
            'storeUrl' => $store_url,
            'proof' => $proof,
        ), 200, array('Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0'));
    }

    public function maybe_bootstrap_in_admin(): void {
        if (!current_user_can('manage_woocommerce')) {
            return;
        }
        $settings = $this->client->settings();
        if ('yes' !== ($settings['connection_consent'] ?? 'no')) {
            return;
        }
        if ('CONNECTED' === ($settings['connection_state'] ?? '') && $this->client->is_configured()) {
            return;
        }
        $next_attempt = (int) ($settings['bootstrap_next_attempt'] ?? 0);
        if ($next_attempt > time()) {
            return;
        }
        $this->bootstrap();
    }

    public function retry_connection(): void {
        if (!current_user_can('manage_woocommerce')) {
            wp_die(esc_html__('You do not have permission to connect My Next Wine.', 'my-next-wine-for-woocommerce'));
        }
        check_admin_referer('mynextwine_woo_retry_connection');
        $settings = $this->client->settings();
        $already_consented = 'yes' === ($settings['connection_consent'] ?? 'no')
            && MYNEXTWINE_WOO_TERMS_VERSION === ($settings['terms_version'] ?? '');
        if (!$already_consented) {
            $accepted_terms = isset($_POST['mynextwine_woo_accept_terms']);
            $accepted_data = isset($_POST['mynextwine_woo_accept_data_sharing']);
            if (!$accepted_terms || !$accepted_data) {
                wp_die(esc_html__('Accept the Merchant Terms and data-sharing disclosure to connect My Next Wine.', 'my-next-wine-for-woocommerce'));
            }
            $settings['connection_consent'] = 'yes';
            $settings['terms_version'] = MYNEXTWINE_WOO_TERMS_VERSION;
            $settings['terms_accepted_at'] = gmdate('c');
        }
        $settings['connection_state'] = 'PENDING';
        $settings['connection_error'] = '';
        $settings['bootstrap_next_attempt'] = 0;
        $this->client->save_settings($settings);
        $this->bootstrap();
        wp_safe_redirect(add_query_arg(array('page' => 'mynextwine-woo-settings'), admin_url('admin.php')));
        exit;
    }

    public function bootstrap(): void {
        $settings = $this->client->settings();
        if ('yes' !== ($settings['connection_consent'] ?? 'no')
            || MYNEXTWINE_WOO_TERMS_VERSION !== ($settings['terms_version'] ?? '')) {
            return;
        }
        if (!$this->acquire_bootstrap_lock()) {
            return;
        }

        try {
            $this->perform_bootstrap();
        } finally {
            $this->release_bootstrap_lock();
        }
    }

    private function perform_bootstrap(): void {
        if (!class_exists('WooCommerce')) {
            $this->record_failure(__('WooCommerce must be active before My Next Wine can connect.', 'my-next-wine-for-woocommerce'));
            return;
        }

        $settings = $this->client->settings();
        if (empty($settings['installation_id'])) {
            $settings['installation_id'] = wp_generate_uuid4();
        }
        if (empty($settings['installation_secret'])) {
            $settings['installation_secret'] = self::random_secret();
        }
        $challenge = self::random_secret();
        $settings['bootstrap_challenge'] = $challenge;
        $settings['bootstrap_challenge_expires'] = time() + self::CHALLENGE_LIFETIME;
        $settings['connection_state'] = 'CONNECTING';
        $settings['connection_error'] = '';
        $this->client->save_settings($settings);

        $base_location = function_exists('wc_get_base_location') ? wc_get_base_location() : array();
        $country = sanitize_text_field((string) ($base_location['country'] ?? ''));
        $state = sanitize_text_field((string) ($base_location['state'] ?? get_option('woocommerce_default_country', '')));
        $payload = array(
            'installationId' => (string) $settings['installation_id'],
            'installationSecret' => (string) $settings['installation_secret'],
            'challenge' => $challenge,
            'storeUrl' => $this->store_url(),
            'storeName' => sanitize_text_field((string) get_bloginfo('name')),
            'adminEmail' => sanitize_email((string) get_option('admin_email')),
            'countryCode' => $country,
            'currency' => function_exists('get_woocommerce_currency') ? get_woocommerce_currency() : 'EUR',
            'address1' => sanitize_text_field((string) get_option('woocommerce_store_address', '')),
            'address2' => sanitize_text_field((string) get_option('woocommerce_store_address_2', '')),
            'city' => sanitize_text_field((string) get_option('woocommerce_store_city', '')),
            'state' => $state,
            'postcode' => sanitize_text_field((string) get_option('woocommerce_store_postcode', '')),
            'phone' => sanitize_text_field((string) get_option('woocommerce_store_phone', '')),
            'locale' => determine_locale(),
            'pluginVersion' => MYNEXTWINE_WOO_VERSION,
            'wordpressVersion' => get_bloginfo('version'),
            'woocommerceVersion' => defined('WC_VERSION') ? WC_VERSION : '',
            'termsAccepted' => true,
            'termsVersion' => MYNEXTWINE_WOO_TERMS_VERSION,
        );

        $result = $this->client->bootstrap($payload);
        if (is_wp_error($result)) {
            $this->record_failure($result->get_error_message());
            return;
        }

        $settings = $this->client->settings();
        $settings['connection_state'] = 'CONNECTED';
        $settings['connection_error'] = '';
        $settings['bootstrap_challenge'] = '';
        $settings['bootstrap_challenge_expires'] = 0;
        $settings['bootstrap_next_attempt'] = 0;
        $settings['somm_id'] = absint($result['sommId'] ?? 0);
        $settings['catalogue_mode'] = sanitize_text_field((string) ($result['catalogueMode'] ?? ''));
        $settings['onboarding_status'] = sanitize_text_field((string) ($result['onboardingStatus'] ?? 'PENDING_CATALOGUE'));
        $this->client->save_settings($settings);

        if ('PLUGIN_PUSH' === $settings['catalogue_mode'] && $this->catalogue_sync instanceof MyNextWine_Woo_Catalogue_Sync) {
            $this->catalogue_sync->schedule_full_sync(2);
        }
    }


    private function acquire_bootstrap_lock(): bool {
        $now = time();
        if (add_option(self::BOOTSTRAP_LOCK_OPTION, $now, '', false)) {
            return true;
        }

        $locked_at = (int) get_option(self::BOOTSTRAP_LOCK_OPTION, 0);
        if ($locked_at > 0 && $locked_at >= ($now - self::BOOTSTRAP_LOCK_SECONDS)) {
            return false;
        }

        delete_option(self::BOOTSTRAP_LOCK_OPTION);
        return add_option(self::BOOTSTRAP_LOCK_OPTION, $now, '', false);
    }

    private function release_bootstrap_lock(): void {
        delete_option(self::BOOTSTRAP_LOCK_OPTION);
    }

    private function store_url(): string {
        $raw = untrailingslashit(home_url('/'));
        $parts = wp_parse_url($raw);
        if (!is_array($parts) || empty($parts['scheme']) || empty($parts['host'])) {
            return $raw;
        }
        $scheme = strtolower((string) $parts['scheme']);
        $host = strtolower((string) $parts['host']);
        $port = isset($parts['port']) ? ':' . absint($parts['port']) : '';
        $path = isset($parts['path']) ? rtrim((string) $parts['path'], '/') : '';
        return $scheme . '://' . $host . $port . $path;
    }

    private function record_failure(string $message): void {
        $settings = $this->client->settings();
        $settings['connection_state'] = 'ERROR';
        $settings['connection_error'] = sanitize_text_field($message);
        $settings['bootstrap_next_attempt'] = time() + 300;
        $this->client->save_settings($settings);
        if (!wp_next_scheduled(self::BOOTSTRAP_HOOK)) {
            wp_schedule_single_event(time() + 300, self::BOOTSTRAP_HOOK);
        }
    }

    private static function random_secret(): string {
        try {
            return rtrim(strtr(base64_encode(random_bytes(32)), '+/', '-_'), '=');
        } catch (Throwable $ignored) {
            return wp_generate_password(48, false, false);
        }
    }
}
