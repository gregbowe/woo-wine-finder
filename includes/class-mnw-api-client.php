<?php
/**
 * Signed server-to-server API client for the My Next Wine backend.
 */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_API_Client {
    private const SIGNATURE_SKEW_SECONDS = 300;
    private const DEFAULT_WINE_CATEGORIES = array('red', 'white', 'rose', 'sparkling');
    private const WINE_CATEGORY_KEYS = array(
        'red', 'white', 'rose', 'sparkling', 'orange', 'petNat',
        'sherry', 'otherFortified', 'dessert',
    );

    /** @return array<string,mixed> */
    public function settings(): array {
        $defaults = array(
            'enabled' => 'no',
            'api_base_url' => $this->default_api_base_url(),
            'installation_id' => '',
            'installation_secret' => '',
            'connection_state' => 'PENDING',
            'connection_error' => '',
            'connection_consent' => 'no',
            'terms_version' => '',
            'terms_accepted_at' => '',
            'somm_id' => 0,
            'catalogue_mode' => '',
            'last_catalogue_sync_at' => '',
            'last_catalogue_sync_error' => '',
            'last_service_contact_at' => '',
            'auto_display' => 'yes',
            'analytics_enabled' => 'no',
            'launcher_position' => 'left',
            'launcher_image_id' => 0,
            'inherit_theme_styles' => 'yes',
            'accent_color' => '#722f37',
            'accent_text_color' => '#ffffff',
            'heading' => __('Not sure what to choose?', 'my-next-wine-for-woocommerce'),
            'intro' => __('A complete selection from our available wines, built around your budget, preferences and occasion.', 'my-next-wine-for-woocommerce'),
            'launcher_label' => __('Build my wine selection', 'my-next-wine-for-woocommerce'),
            'button_label' => __('Add selected to basket', 'my-next-wine-for-woocommerce'),
            'show_mnw_notes' => 'no',
            'show_mnw_rating' => 'no',
            'wine_categories' => self::DEFAULT_WINE_CATEGORIES,
        );
        $saved = get_option(MYNEXTWINE_WOO_OPTION, array());
        $settings = wp_parse_args(is_array($saved) ? $saved : array(), $defaults);
        if (in_array(
            ($settings['intro'] ?? ''),
            array(
                "Answer a few questions and get a selection from this shop's current range.",
                'Four quick questions. We will choose from our cellar.',
                'Four quick questions and we will pick the perfect wines from our cellar',
            ),
            true
        )) {
            $settings['intro'] = __('A complete selection from our available wines, built around your budget, preferences and occasion.', 'my-next-wine-for-woocommerce');
        }
        if ('Need help choosing wine?' === ($settings['heading'] ?? '')) {
            $settings['heading'] = __('Not sure what to choose?', 'my-next-wine-for-woocommerce');
        }
        if (in_array(
            ($settings['launcher_label'] ?? ''),
            array('Find my wines', 'Use our wine matcher'),
            true
        )) {
            $settings['launcher_label'] = __('Build my wine selection', 'my-next-wine-for-woocommerce');
        }
        $settings['api_base_url'] = $this->default_api_base_url();
        $settings['wine_categories'] = $this->normalise_wine_categories($settings['wine_categories'] ?? null);
        $settings['installation_secret'] = $this->unprotect_secret((string) ($settings['installation_secret'] ?? ''));
        return $settings;
    }

    /** @param array<string,mixed> $settings */
    public function save_settings(array $settings): void {
        $current = $this->settings();
        $merged = array_merge($current, $settings);
        $merged['api_base_url'] = $this->default_api_base_url();
        $merged['installation_secret'] = $this->protect_secret((string) ($merged['installation_secret'] ?? ''));
        update_option(MYNEXTWINE_WOO_OPTION, $merged, false);
    }

    public function default_api_base_url(): string {
        $configured = defined('MYNEXTWINE_WOO_API_BASE_URL') ? (string) MYNEXTWINE_WOO_API_BASE_URL : 'https://mynextwine.com';
        return esc_url_raw(untrailingslashit($configured));
    }

    public function is_configured(): bool {
        $settings = $this->settings();
        return !empty($settings['api_base_url'])
            && !empty($settings['installation_id'])
            && !empty($settings['installation_secret'])
            && 'CONNECTED' === ($settings['connection_state'] ?? '');
    }

    public function is_enabled(): bool {
        $settings = $this->settings();
        return $this->is_configured() && 'yes' === ($settings['enabled'] ?? 'no');
    }

    /**
     * Unauthenticated first-contact request. The backend verifies ownership by
     * calling the plugin's short-lived bootstrap proof endpoint.
     *
     * @param array<string,mixed> $payload
     * @return array<string,mixed>|WP_Error
     */
    public function bootstrap(array $payload) {
        return $this->raw_request('POST', '/api/woocommerce/widget/install', $payload, array());
    }

    /**
     * @param array<string,mixed>|null $payload
     * @return array<string,mixed>|WP_Error
     */
    public function request(
        string $method,
        string $path,
        ?array $payload = null,
        string $client_key = '',
        int $timeout_seconds = 40
    ) {
        if (!$this->is_configured()) {
            return new WP_Error('mynextwine_woo_not_configured', __('My Next Wine is still connecting this store.', 'my-next-wine-for-woocommerce'));
        }

        $settings = $this->settings();
        $method = strtoupper($method);
        $path = '/' . ltrim($path, '/');
        $raw_body = null === $payload ? '' : wp_json_encode($payload, JSON_UNESCAPED_SLASHES);
        if (false === $raw_body) {
            return new WP_Error('mynextwine_woo_json_error', __('The request could not be encoded.', 'my-next-wine-for-woocommerce'));
        }

        $timestamp = (string) time();
        $request_id = wp_generate_uuid4();
        $canonical = $this->canonical($method, $path, (string) $settings['installation_id'], $timestamp, $request_id, $raw_body);
        $signature = hash_hmac('sha256', $canonical, (string) $settings['installation_secret']);

        $headers = array(
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
            'X-MNW-Installation-Id' => (string) $settings['installation_id'],
            'X-MNW-Timestamp' => $timestamp,
            'X-MNW-Request-Id' => $request_id,
            'X-MNW-Signature' => $signature,
        );
        if ('' !== $client_key) {
            $headers['X-MNW-Client-Key'] = substr($client_key, 0, 128);
        }

        return $this->raw_request($method, $path, $payload, $headers, $raw_body, $timeout_seconds);
    }

    /** @return array<string,mixed>|WP_Error */
    public function status() {
        $result = $this->request('GET', '/api/woocommerce/widget/merchant/status');
        if (!is_wp_error($result)) {
            $settings = $this->settings();
            $settings['last_service_contact_at'] = gmdate('c');
            $this->save_settings($settings);
        }
        return $result;
    }

    /** @return array<string,mixed>|WP_Error */
    public function start_billing(string $plan_code = 'LAUNCH') {
        $plan_code = strtoupper(sanitize_key($plan_code));
        if (!in_array($plan_code, array('LAUNCH', 'GROWTH', 'SCALE'), true)) {
            return new WP_Error('mynextwine_woo_plan_invalid', __('Choose a valid Wine Finder plan.', 'my-next-wine-for-woocommerce'));
        }
        return $this->request('POST', '/api/woocommerce/widget/merchant/billing/start', array(
            'planCode' => $plan_code,
        ));
    }

    /** Compatibility alias for older plugin builds. @return array<string,mixed>|WP_Error */
    public function start_trial() {
        return $this->start_billing();
    }

    /** @return array<string,mixed>|WP_Error */
    public function manage_billing() {
        return $this->request('POST', '/api/woocommerce/widget/merchant/billing/manage', array());
    }

    /** @return array<string,mixed>|WP_Error */
    public function update_display_settings(bool $show_notes, bool $show_rating, ?array $wine_categories = null) {
        $payload = array(
            'showMyNextWineNotes' => $show_notes,
            'showMyNextWineRating' => $show_rating,
        );
        // Omitting this field preserves custom settings when an older caller
        // invokes the two-argument method during a staged deployment.
        if (null !== $wine_categories) {
            $payload['wineCategories'] = $this->normalise_wine_categories($wine_categories);
        }
        return $this->request('POST', '/api/woocommerce/widget/merchant/display-settings', $payload);
    }

    /** @param mixed $value @return array<int,string> */
    public function normalise_wine_categories($value): array {
        if (!is_array($value)) {
            return self::DEFAULT_WINE_CATEGORIES;
        }
        $selected = array_values(array_unique(array_map('strval', $value)));
        $selected = array_values(array_intersect(self::WINE_CATEGORY_KEYS, $selected));
        return count($selected) >= 2 ? $selected : self::DEFAULT_WINE_CATEGORIES;
    }

    /** @return array<string,mixed>|WP_Error */
    public function revoke() {
        return $this->request('POST', '/api/woocommerce/widget/merchant/uninstall', array());
    }

    /**
     * Validate a recommendation token locally before any WooCommerce product
     * is accepted into the basket.
     *
     * @return array<string,mixed>|WP_Error
     */
    public function verify_recommendation_token(string $token) {
        $settings = $this->settings();
        if (!$this->is_configured() || strlen($token) > 20000 || false === strpos($token, '.')) {
            return new WP_Error('mynextwine_woo_invalid_token', __('The recommendation has expired. Please choose your wines again.', 'my-next-wine-for-woocommerce'));
        }

        list($encoded, $signature) = explode('.', $token, 2);
        if ('' === $encoded || !preg_match('/^[a-f0-9]{64}$/', $signature)) {
            return new WP_Error('mynextwine_woo_invalid_token', __('The recommendation token is invalid.', 'my-next-wine-for-woocommerce'));
        }
        $expected = hash_hmac('sha256', $encoded, (string) $settings['installation_secret']);
        if (!hash_equals($expected, strtolower($signature))) {
            return new WP_Error('mynextwine_woo_invalid_token', __('The recommendation token is invalid.', 'my-next-wine-for-woocommerce'));
        }

        $padding = strlen($encoded) % 4;
        if ($padding > 0) {
            $encoded .= str_repeat('=', 4 - $padding);
        }
        $json = base64_decode(strtr($encoded, '-_', '+/'), true);
        $claims = false === $json ? null : json_decode($json, true);
        if (!is_array($claims)
            || !isset($claims['installationId'], $claims['expiresAt'], $claims['wines'])
            || !hash_equals((string) $settings['installation_id'], (string) $claims['installationId'])
            || (int) $claims['expiresAt'] < time()
            || (int) $claims['expiresAt'] > time() + 3700
            || !is_array($claims['wines'])) {
            return new WP_Error('mynextwine_woo_expired_token', __('The recommendation has expired. Please choose your wines again.', 'my-next-wine-for-woocommerce'));
        }
        return $claims;
    }

    /**
     * Verify a signed support/Bacchus request to the local catalogue endpoint.
     *
     * @return true|WP_Error
     */
    public function verify_incoming_request(WP_REST_Request $request, string $signed_path) {
        if (!$this->is_configured()) {
            return new WP_Error('mynextwine_woo_not_configured', __('My Next Wine is not connected.', 'my-next-wine-for-woocommerce'), array('status' => 503));
        }
        $settings = $this->settings();
        $installation_id = trim((string) $request->get_header('x-mnw-installation-id'));
        $timestamp = trim((string) $request->get_header('x-mnw-timestamp'));
        $request_id = trim((string) $request->get_header('x-mnw-request-id'));
        $signature = strtolower(trim((string) $request->get_header('x-mnw-signature')));

        if (!hash_equals((string) $settings['installation_id'], $installation_id)
            || !ctype_digit($timestamp)
            || abs(time() - (int) $timestamp) > self::SIGNATURE_SKEW_SECONDS
            || !preg_match('/^[a-zA-Z0-9-]{16,80}$/', $request_id)
            || !preg_match('/^[a-f0-9]{64}$/', $signature)) {
            return new WP_Error('mynextwine_woo_invalid_signature', __('Invalid My Next Wine signature.', 'my-next-wine-for-woocommerce'), array('status' => 401));
        }

        $replay_key = 'mynextwine_woo_req_' . substr(hash('sha256', $installation_id . '|' . $request_id), 0, 32);
        if (false !== get_transient($replay_key)) {
            return new WP_Error('mynextwine_woo_replayed_request', __('This request has already been used.', 'my-next-wine-for-woocommerce'), array('status' => 409));
        }

        $raw_body = (string) $request->get_body();
        $canonical = $this->canonical($request->get_method(), $signed_path, $installation_id, $timestamp, $request_id, $raw_body);
        $expected = hash_hmac('sha256', $canonical, (string) $settings['installation_secret']);
        if (!hash_equals($expected, $signature)) {
            return new WP_Error('mynextwine_woo_invalid_signature', __('Invalid My Next Wine signature.', 'my-next-wine-for-woocommerce'), array('status' => 401));
        }
        set_transient($replay_key, '1', self::SIGNATURE_SKEW_SECONDS + 60);
        return true;
    }

    /** Encrypt the installation secret using WordPress salts before storage. */
    public function protect_secret(string $secret): string {
        if ('' === $secret || 0 === strpos($secret, 'enc:v1:')) {
            return $secret;
        }
        if (!function_exists('openssl_encrypt')) {
            return $secret;
        }
        try {
            $iv = random_bytes(12);
            $tag = '';
            $ciphertext = openssl_encrypt(
                $secret,
                'aes-256-gcm',
                $this->secret_storage_key(),
                OPENSSL_RAW_DATA,
                $iv,
                $tag,
                '',
                16
            );
            if (false === $ciphertext || 16 !== strlen($tag)) {
                return $secret;
            }
            return 'enc:v1:' . base64_encode($iv . $tag . $ciphertext);
        } catch (Throwable $ignored) {
            return $secret;
        }
    }

    private function unprotect_secret(string $stored): string {
        if (0 !== strpos($stored, 'enc:v1:')) {
            return $stored;
        }
        if (!function_exists('openssl_decrypt')) {
            return '';
        }
        $payload = base64_decode(substr($stored, 7), true);
        if (false === $payload || strlen($payload) <= 28) {
            return '';
        }
        $iv = substr($payload, 0, 12);
        $tag = substr($payload, 12, 16);
        $ciphertext = substr($payload, 28);
        $plaintext = openssl_decrypt(
            $ciphertext,
            'aes-256-gcm',
            $this->secret_storage_key(),
            OPENSSL_RAW_DATA,
            $iv,
            $tag
        );
        return false === $plaintext ? '' : $plaintext;
    }

    private function secret_storage_key(): string {
        $auth = defined('AUTH_KEY') ? (string) AUTH_KEY : '';
        $secure = defined('SECURE_AUTH_KEY') ? (string) SECURE_AUTH_KEY : '';
        return hash('sha256', $auth . '|' . $secure . '|my-next-wine-woocommerce', true);
    }

    public function client_key(): string {
        $settings = $this->settings();
        $address = isset($_SERVER['REMOTE_ADDR']) ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR'])) : 'unknown';
        return substr(hash_hmac('sha256', $address, (string) ($settings['installation_secret'] ?? '')), 0, 32);
    }

    /**
     * @param array<string,mixed>|null $payload
     * @param array<string,string> $headers
     * @return array<string,mixed>|WP_Error
     */
    private function raw_request(
        string $method,
        string $path,
        ?array $payload,
        array $headers,
        ?string $preencoded_body = null,
        int $timeout_seconds = 40
    ) {
        $raw_body = null !== $preencoded_body
            ? $preencoded_body
            : (null === $payload ? '' : wp_json_encode($payload, JSON_UNESCAPED_SLASHES));
        if (false === $raw_body) {
            return new WP_Error('mynextwine_woo_json_error', __('The request could not be encoded.', 'my-next-wine-for-woocommerce'));
        }
        $url = untrailingslashit($this->default_api_base_url()) . '/' . ltrim($path, '/');
        $response = wp_remote_request($url, array(
            'method' => strtoupper($method),
            // Recommendation/refinement requests currently have a 125-second
            // proxy allowance; retain a finite ceiling for every other call.
            'timeout' => max(1, min(130, $timeout_seconds)),
            'redirection' => 0,
            'sslverify' => true,
            'headers' => array_merge(array(
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ), $headers),
            'body' => $raw_body,
            'data_format' => 'body',
        ));
        if (is_wp_error($response)) {
            return new WP_Error(
                'mynextwine_woo_backend_unreachable',
                __('My Next Wine could not be reached.', 'my-next-wine-for-woocommerce'),
                array('detail' => $response->get_error_message())
            );
        }

        $status = (int) wp_remote_retrieve_response_code($response);
        $body = (string) wp_remote_retrieve_body($response);
        $decoded = array();
        if ('' !== trim($body)) {
            $decoded = json_decode($body, true);
            if (!is_array($decoded)) {
                return new WP_Error(
                    'mynextwine_woo_invalid_backend_response',
                    __('My Next Wine returned an unexpected response.', 'my-next-wine-for-woocommerce'),
                    array('status' => $status)
                );
            }
        }

        if ($status < 200 || $status >= 300) {
            $message = isset($decoded['error']) && is_string($decoded['error'])
                ? $decoded['error']
                : __('My Next Wine could not complete the request.', 'my-next-wine-for-woocommerce');
            return new WP_Error('mynextwine_woo_backend_error', $message, array(
                'status' => $status,
                'body' => $decoded,
                'retry_after' => wp_remote_retrieve_header($response, 'retry-after'),
            ));
        }

        return $decoded;
    }

    private function canonical(string $method, string $path, string $installation_id, string $timestamp, string $request_id, string $raw_body): string {
        return strtoupper($method) . "\n"
            . $path . "\n"
            . $installation_id . "\n"
            . $timestamp . "\n"
            . $request_id . "\n"
            . hash('sha256', $raw_body);
    }
}
