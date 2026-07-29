<?php
/** Signed catalogue feed consumed only by Bacchus. */

if (!defined('ABSPATH')) {
    exit;
}

final class MNW_Woo_Catalogue_Controller {
    private const NAMESPACE = 'my-next-wine/v1';
    private const SIGNED_PATH = '/wp-json/my-next-wine/v1/catalogue';

    private MNW_Woo_API_Client $client;

    public function __construct(MNW_Woo_API_Client $client) {
        $this->client = $client;
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes(): void {
        register_rest_route(self::NAMESPACE, '/catalogue', array(
            'methods' => WP_REST_Server::READABLE,
            'callback' => array($this, 'catalogue'),
            'permission_callback' => array($this, 'permission'),
            'args' => array(
                'page' => array('default' => 1, 'sanitize_callback' => 'absint'),
                'per_page' => array('default' => 100, 'sanitize_callback' => 'absint'),
            ),
        ));
    }

    /** @return true|WP_Error */
    public function permission(WP_REST_Request $request) {
        return $this->client->verify_incoming_request($request, self::SIGNED_PATH);
    }

    public function catalogue(WP_REST_Request $request): WP_REST_Response {
        $page = max(1, absint($request->get_param('page')));
        $per_page = min(100, max(1, absint($request->get_param('per_page'))));
        $query = new WC_Product_Query(array(
            'status' => array('publish', 'private', 'draft', 'pending', 'future'),
            'limit' => $per_page,
            'page' => $page,
            'paginate' => true,
            'orderby' => 'ID',
            'order' => 'ASC',
            'return' => 'objects',
        ));
        $results = $query->get_products();
        $products = is_object($results) && isset($results->products) ? $results->products : array();
        $max_pages = is_object($results) && isset($results->max_num_pages) ? (int) $results->max_num_pages : 1;
        $total = is_object($results) && isset($results->total) ? (int) $results->total : count($products);

        $items = array();
        foreach ($products as $product) {
            if (!$product instanceof WC_Product) {
                continue;
            }
            if ($product->is_type('variable')) {
                foreach ($product->get_children() as $variation_id) {
                    $variation = wc_get_product($variation_id);
                    if (!$variation instanceof WC_Product_Variation || 'trash' === get_post_status($variation_id)) {
                        continue;
                    }
                    $items[] = $this->variation_item($product, $variation);
                }
            } else {
                $items[] = $this->simple_item($product);
            }
        }

        return new WP_REST_Response(array(
            'items' => $items,
            'page' => $page,
            'totalPages' => max(1, $max_pages),
            'totalProducts' => $total,
        ), 200, array('Cache-Control' => 'no-store'));
    }

    /** @return array<string,mixed> */
    private function simple_item(WC_Product $product): array {
        return array(
            'productId' => (string) $product->get_id(),
            'variantId' => (string) $product->get_id(),
            'title' => $this->truncate($product->get_name(), 128),
            'description' => $this->description($product),
            'imageUrl' => $this->image_url($product),
            'sku' => $this->truncate($product->get_sku(), 128),
            'price' => $this->price($product),
            'tags' => $this->tags($product),
            'available' => $this->available($product),
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
            'title' => $this->truncate($title, 128),
            'description' => $description,
            'imageUrl' => $this->image_url($variation, $parent),
            'sku' => $this->truncate($variation->get_sku(), 128),
            'price' => $this->price($variation),
            'tags' => $this->tags($parent, $variation),
            'available' => $this->available($variation),
        );
    }

    private function description(WC_Product $product): string {
        $description = (string) $product->get_description();
        if ('' === trim($description)) {
            $description = (string) $product->get_short_description();
        }
        return trim(wp_strip_all_tags($description));
    }

    private function image_url(WC_Product $product, ?WC_Product $fallback = null): string {
        $image_id = $product->get_image_id();
        if (!$image_id && $fallback) {
            $image_id = $fallback->get_image_id();
        }
        $url = $image_id ? wp_get_attachment_image_url($image_id, 'full') : '';
        return is_string($url) ? esc_url_raw($url) : '';
    }

    private function price(WC_Product $product): string {
        $price = wc_get_price_to_display($product);
        return is_numeric($price) ? wc_format_decimal($price, wc_get_price_decimals()) : '0';
    }

    private function available(WC_Product $product): bool {
        return 'publish' === get_post_status($product->get_id())
            && $product->is_purchasable()
            && $product->is_in_stock()
            && $product->has_enough_stock(1)
            && !$product->backorders_allowed()
            && (float) wc_get_price_to_display($product) > 0;
    }

    private function tags(WC_Product $product, ?WC_Product_Variation $variation = null): string {
        $values = array();
        foreach (wp_get_post_terms($product->get_id(), array('product_cat', 'product_tag'), array('fields' => 'names')) as $term) {
            $values[] = wc_clean($term);
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
        $values = array_values(array_unique(array_filter($values)));
        return $this->truncate(implode(', ', $values), 2000);
    }

    private function truncate(string $value, int $length): string {
        $value = trim($value);
        return function_exists('mb_substr') ? mb_substr($value, 0, $length) : substr($value, 0, $length);
    }
}
