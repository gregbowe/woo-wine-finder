<?php
/** Copy private cart metadata to the order and report attributed orders. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_Order_Attribution {
    private const RETRY_HOOK = 'mynextwine_woo_retry_order_attribution';

    private MyNextWine_Woo_API_Client $client;

    public function __construct(MyNextWine_Woo_API_Client $client) {
        $this->client = $client;
        add_action('woocommerce_checkout_create_order_line_item', array($this, 'copy_line_metadata'), 10, 4);
        add_action('woocommerce_checkout_order_processed', array($this, 'classic_order_processed'), 20, 3);
        add_action('woocommerce_store_api_checkout_order_processed', array($this, 'blocks_order_processed'), 20, 1);
        add_action(self::RETRY_HOOK, array($this, 'retry'), 10, 1);
    }

    /**
     * @param WC_Order_Item_Product $item
     * @param string $cart_item_key
     * @param array<string,mixed> $values
     * @param WC_Order $order
     */
    public function copy_line_metadata($item, $cart_item_key, $values, $order): void {
        if (!isset($values['_mynextwine_woo_source']) || 'wine_finder' !== $values['_mynextwine_woo_source']) {
            return;
        }
        foreach (array('_mynextwine_woo_session_id', '_mynextwine_woo_somm_wine_id', '_mynextwine_woo_source', '_mynextwine_woo_recommendation_id') as $key) {
            if (isset($values[$key]) && '' !== (string) $values[$key]) {
                $item->add_meta_data($key, wc_clean((string) $values[$key]), true);
            }
        }
    }

    /** @param array<string,mixed> $posted_data */
    public function classic_order_processed($order_id, $posted_data, $order): void {
        $this->report($order instanceof WC_Order ? $order : wc_get_order($order_id));
    }

    public function blocks_order_processed($order): void {
        if ($order instanceof WC_Order) {
            $this->report($order);
        }
    }

    public function retry($order_id): void {
        $order = wc_get_order(absint($order_id));
        if ($order instanceof WC_Order) {
            $this->report($order);
        }
    }

    private function report($order): void {
        if (!$order instanceof WC_Order || !$this->client->is_configured()) {
            return;
        }
        if ('yes' === $order->get_meta('_mynextwine_woo_attribution_sent', true)) {
            return;
        }

        $lines = array();
        $recommendation_ids = array();
        foreach ($order->get_items('line_item') as $item) {
            if (!$item instanceof WC_Order_Item_Product || 'wine_finder' !== $item->get_meta('_mynextwine_woo_source', true)) {
                continue;
            }
            $external_id = $item->get_variation_id() > 0 ? $item->get_variation_id() : $item->get_product_id();
            $somm_wine_id = absint($item->get_meta('_mynextwine_woo_somm_wine_id', true));
            if ($external_id < 1 || $somm_wine_id < 1) {
                continue;
            }
            $recommendation_id = sanitize_text_field((string) $item->get_meta('_mynextwine_woo_recommendation_id', true));
            if ('' !== $recommendation_id) {
                $recommendation_ids[] = $recommendation_id;
            }
            $lines[] = array(
                'productId' => (string) $external_id,
                'quantity' => max(1, (int) $item->get_quantity()),
                'sommWineId' => $somm_wine_id,
                'lineTotal' => wc_format_decimal($item->get_total(), wc_get_price_decimals()),
            );
        }
        if (empty($lines)) {
            return;
        }

        $result = $this->client->request('POST', '/api/woocommerce/widget/orders', array(
            'orderId' => (string) $order->get_id(),
            'currency' => $order->get_currency(),
            'total' => wc_format_decimal($order->get_total(), wc_get_price_decimals()),
            'recommendationIds' => array_values(array_unique($recommendation_ids)),
            'lines' => $lines,
        ));

        if (is_wp_error($result)) {
            $retry_count = (int) $order->get_meta('_mynextwine_woo_attribution_retry_count', true);
            if ($retry_count < 12) {
                $order->update_meta_data('_mynextwine_woo_attribution_retry_count', (string) ($retry_count + 1));
                if (0 === $retry_count) {
                    $order->add_order_note(__('My Next Wine attribution will be retried automatically.', 'my-next-wine-for-woocommerce'));
                }
                $order->save();
                $this->schedule_retry($order->get_id());
            }
            return;
        }
        $order->update_meta_data('_mynextwine_woo_attribution_sent', 'yes');
        $order->update_meta_data('_mynextwine_woo_attribution_sent_at', gmdate('c'));
        $order->delete_meta_data('_mynextwine_woo_attribution_retry_count');
        $order->save();
    }

    private function schedule_retry(int $order_id): void {
        $args = array($order_id);
        if (!wp_next_scheduled(self::RETRY_HOOK, $args)) {
            wp_schedule_single_event(time() + 300, self::RETRY_HOOK, $args);
        }
    }
}
