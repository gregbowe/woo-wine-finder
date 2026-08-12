<?php
/** Suggested privacy-policy text for stores using the external My Next Wine service. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_Privacy {
    public function __construct() {
        add_action('admin_init', array($this, 'add_policy_content'));
    }

    public function add_policy_content(): void {
        if (!function_exists('wp_add_privacy_policy_content')) {
            return;
        }

        $content = wp_kses_post(
            '<p>'
            . esc_html__('When the My Next Wine Wine Finder is connected, this store sends product and variation identifiers, names, descriptions, images, categories, attributes, prices and availability to the externally hosted My Next Wine service so wines can be mapped and recommended.', 'my-next-wine-for-woocommerce')
            . '</p><p>'
            . esc_html__('Shopper wine-preference answers are sent when a recommendation is requested. Optional widget analytics are off by default and may include impressions, recommendation results and basket attempts or outcomes linked to the recommended wine identifiers. A successful basket addition is the only recommendation-usefulness signal; the widget does not ask the shopper to rate the recommendations. When this site exposes the WordPress Consent API, those events are additionally suppressed until statistics consent is reported. For attributed orders, the service receives the WooCommerce order identifier, currency, total, product references and quantities, but not the customer name, email, delivery address or payment-card details. Technical security logs may include network and request metadata.', 'my-next-wine-for-woocommerce')
            . '</p><p>'
            . sprintf(
                /* translators: 1: privacy URL, 2: shopper terms URL, 3: merchant terms URL */
                esc_html__('See the My Next Wine %1$s, %2$s and %3$s.', 'my-next-wine-for-woocommerce'),
                '<a href="' . esc_url(MYNEXTWINE_WOO_PRIVACY_URL) . '">' . esc_html__('Privacy Statement', 'my-next-wine-for-woocommerce') . '</a>',
                '<a href="' . esc_url(MYNEXTWINE_WOO_USER_TERMS_URL) . '">' . esc_html__('Wine Finder User Terms', 'my-next-wine-for-woocommerce') . '</a>',
                '<a href="' . esc_url(MYNEXTWINE_WOO_TERMS_URL) . '">' . esc_html__('Merchant Terms', 'my-next-wine-for-woocommerce') . '</a>'
            )
            . '</p>'
        );

        wp_add_privacy_policy_content(
            __('My Next Wine Wine Finder', 'my-next-wine-for-woocommerce'),
            wpautop($content, false)
        );
    }
}
