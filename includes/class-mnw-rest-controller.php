<?php
/** Public storefront REST facade and protected basket endpoint. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_REST_Controller {
    private const NAMESPACE = 'my-next-wine/v1';
    private const MAX_BODY_BYTES = 65536;
    /** Keep the Woo proxy above the backend's temporary 120-second deadline. */
    private const RECOMMENDATION_PROXY_TIMEOUT_SECONDS = 125;

    private MyNextWine_Woo_API_Client $client;

    public function __construct(MyNextWine_Woo_API_Client $client) {
        $this->client = $client;
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes(): void {
        register_rest_route(self::NAMESPACE, '/configuration', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'configuration'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route(self::NAMESPACE, '/recommendations', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'recommendations'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route(self::NAMESPACE, '/swap', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'swap'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route(self::NAMESPACE, '/refine', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'refine'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route(self::NAMESPACE, '/events', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'events'),
            'permission_callback' => '__return_true',
        ));
        register_rest_route(self::NAMESPACE, '/cart', array(
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => array($this, 'cart'),
            'permission_callback' => '__return_true',
        ));
    }

    public function configuration(WP_REST_Request $request): WP_REST_Response {
        return $this->proxy('GET', '/api/woocommerce/widget/configuration', null);
    }

    public function recommendations(WP_REST_Request $request): WP_REST_Response {
        return $this->proxy_json($request, '/api/woocommerce/widget/recommendations');
    }

    public function swap(WP_REST_Request $request): WP_REST_Response {
        return $this->proxy_json($request, '/api/woocommerce/widget/swap');
    }

    public function refine(WP_REST_Request $request): WP_REST_Response {
        return $this->proxy_json($request, '/api/woocommerce/widget/refine');
    }

    public function events(WP_REST_Request $request): WP_REST_Response {
        return $this->proxy_json($request, '/api/woocommerce/widget/events');
    }

    public function cart(WP_REST_Request $request): WP_REST_Response {
        if (!$this->client->is_enabled()) {
            return $this->error(__('The wine finder is not enabled.', 'my-next-wine-for-woocommerce'), 503);
        }
        $nonce = (string) $request->get_header('x-wp-nonce');
        if ('' === $nonce || !wp_verify_nonce($nonce, 'wp_rest')) {
            return $this->error(__('The basket session has expired. Refresh the page and try again.', 'my-next-wine-for-woocommerce'), 403);
        }

        $payload = $this->json_payload($request);
        if (is_wp_error($payload)) {
            return $this->from_error($payload, 400);
        }
        $session_id = sanitize_text_field((string) ($payload['sessionId'] ?? ''));
        $recommendation_token = (string) ($payload['recommendationToken'] ?? '');
        $requested_wines = $payload['wines'] ?? null;
        if ('' === $session_id || !is_array($requested_wines) || count($requested_wines) < 1 || count($requested_wines) > 12) {
            return $this->error(__('The basket request is incomplete.', 'my-next-wine-for-woocommerce'), 400);
        }

        $claims = $this->client->verify_recommendation_token($recommendation_token);
        if (is_wp_error($claims)) {
            return $this->from_error($claims, 409);
        }
        if (!isset($claims['sessionId']) || !hash_equals((string) $claims['sessionId'], $session_id)) {
            return $this->error(__('The wine selection no longer matches this session.', 'my-next-wine-for-woocommerce'), 409);
        }

        $allowed = array();
        foreach ($claims['wines'] as $token_wine) {
            if (!is_array($token_wine) || !isset($token_wine['sommWineId'], $token_wine['productId'], $token_wine['price'])) {
                continue;
            }
            $key = (string) $token_wine['sommWineId'] . '|' . (string) $token_wine['productId'];
            $allowed[$key] = $token_wine;
        }

        if (function_exists('wc_load_cart') && (null === WC()->session || null === WC()->cart)) {
            wc_load_cart();
        }
        if (null === WC()->cart) {
            return $this->error(__('WooCommerce could not start the basket.', 'my-next-wine-for-woocommerce'), 503);
        }

        $added_keys = array();
        $seen = array();
        foreach ($requested_wines as $requested) {
            if (!is_array($requested)) {
                $this->rollback($added_keys);
                return $this->error(__('A selected wine was invalid.', 'my-next-wine-for-woocommerce'), 400);
            }
            $somm_wine_id = absint($requested['sommWineId'] ?? 0);
            $external_id = absint($requested['variantId'] ?? 0);
            $key = $somm_wine_id . '|' . $external_id;
            if ($somm_wine_id < 1 || $external_id < 1 || isset($seen[$key]) || !isset($allowed[$key])) {
                $this->rollback($added_keys);
                return $this->error(__('The selected wines have changed. Please request a fresh selection.', 'my-next-wine-for-woocommerce'), 409);
            }
            $seen[$key] = true;

            $product = wc_get_product($external_id);
            if (!$product instanceof WC_Product
                || 'publish' !== get_post_status($product->get_id())
                || !$product->is_purchasable()
                || !$product->is_in_stock()
                || !$product->has_enough_stock(1)
                || $product->backorders_allowed()) {
                $this->rollback($added_keys);
                return $this->error(__('One recommended wine is no longer available. Please choose your wines again.', 'my-next-wine-for-woocommerce'), 409);
            }

            $current_price = (float) wc_get_price_to_display($product);
            $recommended_price = (float) $allowed[$key]['price'];
            if ($current_price <= 0 || abs($current_price - $recommended_price) > 0.01) {
                $this->rollback($added_keys);
                return $this->error(__('A wine price has changed. Please request a fresh selection.', 'my-next-wine-for-woocommerce'), 409);
            }

            $product_id = $product->is_type('variation') ? $product->get_parent_id() : $product->get_id();
            $variation_id = $product->is_type('variation') ? $product->get_id() : 0;
            $variation = $variation_id > 0 ? wc_get_product_variation_attributes($variation_id) : array();
            $cart_item_data = array(
                '_mynextwine_woo_session_id' => $session_id,
                '_mynextwine_woo_somm_wine_id' => (string) $somm_wine_id,
                '_mynextwine_woo_source' => 'wine_finder',
                '_mynextwine_woo_recommendation_id' => $session_id,
            );
            $cart_key = WC()->cart->add_to_cart($product_id, 1, $variation_id, $variation, $cart_item_data);
            if (false === $cart_key) {
                $this->rollback($added_keys);
                return $this->error(__('A recommended wine could not be added to the basket.', 'my-next-wine-for-woocommerce'), 409);
            }
            $added_keys[] = $cart_key;
        }

        WC()->cart->calculate_totals();
        if (WC()->session) {
            WC()->session->set_customer_session_cookie(true);
        }
        return new WP_REST_Response(array(
            'added' => count($added_keys),
            'cartUrl' => wc_get_cart_url(),
        ), 200, $this->no_store_headers());
    }

    private function proxy_json(WP_REST_Request $request, string $backend_path): WP_REST_Response {
        $payload = $this->json_payload($request);
        if (is_wp_error($payload)) {
            return $this->from_error($payload, 400);
        }
        return $this->proxy('POST', $backend_path, $payload);
    }

    /** @param array<string,mixed>|null $payload */
    private function proxy(string $method, string $backend_path, ?array $payload): WP_REST_Response {
        if (!$this->client->is_enabled()) {
            return $this->error(__('The wine finder is not enabled.', 'my-next-wine-for-woocommerce'), 503);
        }
        $timeout_seconds = in_array($backend_path, array(
            '/api/woocommerce/widget/recommendations',
            '/api/woocommerce/widget/refine',
        ), true)
            ? self::RECOMMENDATION_PROXY_TIMEOUT_SECONDS
            : 40;
        $result = $this->client->request(
            $method,
            $backend_path,
            $payload,
            $this->client->client_key(),
            $timeout_seconds
        );
        if (is_wp_error($result)) {
            $data = $result->get_error_data();
            $status = is_array($data) && isset($data['status']) ? (int) $data['status'] : 502;
            return $this->from_error($result, $status);
        }
        if (is_array($result) && in_array($backend_path, array(
            '/api/woocommerce/widget/recommendations',
            '/api/woocommerce/widget/refine',
            '/api/woocommerce/widget/swap',
        ), true)) {
            $result = $this->with_local_wine_images($result);
        }
        return new WP_REST_Response($result, 200, $this->no_store_headers());
    }

    /** @param array<string,mixed> $payload
     *  @return array<string,mixed>
     */
    private function with_local_wine_images(array $payload): array {
        if (isset($payload['wines']) && is_array($payload['wines'])) {
            $payload['wines'] = $this->with_local_wine_image_list($payload['wines']);
        }
        foreach (array('exactSelection', 'budgetAlternative') as $selection_key) {
            if (isset($payload[$selection_key])
                && is_array($payload[$selection_key])
                && isset($payload[$selection_key]['wines'])
                && is_array($payload[$selection_key]['wines'])) {
                $payload[$selection_key]['wines'] = $this->with_local_wine_image_list(
                    $payload[$selection_key]['wines']
                );
            }
        }
        if (isset($payload['wine']) && is_array($payload['wine'])) {
            $payload['wine'] = $this->with_local_wine_image($payload['wine']);
        }
        return $payload;
    }

    /** @param array<int,mixed> $wines
     *  @return array<int,mixed>
     */
    private function with_local_wine_image_list(array $wines): array {
        foreach ($wines as $index => $wine) {
            if (is_array($wine)) {
                $wines[$index] = $this->with_local_wine_image($wine);
            }
        }
        return $wines;
    }

    /** @param array<string,mixed> $wine
     *  @return array<string,mixed>
     */
    private function with_local_wine_image(array $wine): array {
        $external_id = absint($wine['variantId'] ?? 0);
        if ($external_id < 1) {
            return $wine;
        }
        $product = wc_get_product($external_id);
        if (!$product instanceof WC_Product) {
            return $wine;
        }

        $image_id = $product->get_image_id();
        if (!$image_id && $product instanceof WC_Product_Variation) {
            $parent = wc_get_product($product->get_parent_id());
            if ($parent instanceof WC_Product) {
                $image_id = $parent->get_image_id();
            }
        }
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';
        if (is_string($image_url) && '' !== $image_url) {
            $wine['imageUrl'] = esc_url_raw($image_url);
        }
        return $wine;
    }

    /** @return array<string,mixed>|WP_Error */
    private function json_payload(WP_REST_Request $request) {
        $raw = (string) $request->get_body();
        if (strlen($raw) > self::MAX_BODY_BYTES) {
            return new WP_Error('mynextwine_woo_too_large', __('The request is too large.', 'my-next-wine-for-woocommerce'));
        }
        $payload = $request->get_json_params();
        if (!is_array($payload)) {
            return new WP_Error('mynextwine_woo_invalid_json', __('A valid JSON request is required.', 'my-next-wine-for-woocommerce'));
        }
        return $payload;
    }

    /** @param array<int,string> $keys */
    private function rollback(array $keys): void {
        if (null === WC()->cart) {
            return;
        }
        foreach ($keys as $key) {
            WC()->cart->remove_cart_item($key);
        }
        WC()->cart->calculate_totals();
    }

    private function from_error(WP_Error $error, int $fallback_status): WP_REST_Response {
        $data = $error->get_error_data();
        $status = is_array($data) && isset($data['status']) ? (int) $data['status'] : $fallback_status;
        $body = array('error' => $error->get_error_message());
        if (is_array($data) && isset($data['body']) && is_array($data['body'])) {
            $body = array_merge($data['body'], $body);
        }
        $headers = $this->no_store_headers();
        if (is_array($data) && !empty($data['retry_after'])) {
            $headers['Retry-After'] = (string) $data['retry_after'];
        }
        return new WP_REST_Response($body, max(400, $status), $headers);
    }

    private function error(string $message, int $status): WP_REST_Response {
        return new WP_REST_Response(array('error' => $message), $status, $this->no_store_headers());
    }

    /** @return array<string,string> */
    private function no_store_headers(): array {
        return array('Cache-Control' => 'no-store, no-cache, must-revalidate, max-age=0');
    }
}
