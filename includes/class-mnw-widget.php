<?php
/** Storefront widget renderer. */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_Widget {
    private bool $rendered = false;

    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue'));
        add_action('wp_footer', array($this, 'render_automatic'), 30);
        add_shortcode('mynextwine_wine_finder', array($this, 'shortcode'));
    }

    public function enqueue(): void {
        $settings = $this->settings();
        if (!$this->is_frontend_enabled($settings)) {
            return;
        }
        wp_enqueue_style(
            'mynextwine-wine-finder',
            MYNEXTWINE_WOO_URL . 'assets/css/wine-finder.css',
            array(),
            MYNEXTWINE_WOO_VERSION
        );
        wp_enqueue_script(
            'mynextwine-wine-finder',
            MYNEXTWINE_WOO_URL . 'assets/js/wine-finder.js',
            array(),
            MYNEXTWINE_WOO_VERSION,
            true
        );
    }

    public function render_automatic(): void {
        $settings = $this->settings();
        if ('yes' !== ($settings['auto_display'] ?? 'no') || !$this->is_frontend_enabled($settings)) {
            return;
        }
        echo $this->render(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    }

    public function shortcode(): string {
        $settings = $this->settings();
        if (!$this->is_frontend_enabled($settings)) {
            return '';
        }
        wp_enqueue_style('mynextwine-wine-finder');
        wp_enqueue_script('mynextwine-wine-finder');
        return $this->render();
    }

    private function render(): string {
        if ($this->rendered) {
            return '';
        }
        $this->rendered = true;
        $settings = $this->settings();
        $widget_id = 'woo-' . wp_generate_uuid4();
        $heading = (string) ($settings['heading'] ?? 'Not sure what to choose?');
        $launcher_label = (string) ($settings['launcher_label'] ?? 'Build my wine selection');
        $intro = (string) ($settings['intro'] ?? __('A complete selection from our available wines, built around your budget, preferences and occasion.', 'my-next-wine-for-woocommerce'));
        $button_label = (string) ($settings['button_label'] ?? 'Add selected to basket');
        $launcher_position = 'right' === ($settings['launcher_position'] ?? 'left') ? 'right' : 'left';
        $launcher_image_id = absint($settings['launcher_image_id'] ?? 0);
        $launcher_image_url = $launcher_image_id ? wp_get_attachment_image_url($launcher_image_id, 'full') : '';
        $inherit_theme_styles = 'yes' === ($settings['inherit_theme_styles'] ?? 'yes') ? 'true' : 'false';
        $analytics_enabled = 'yes' === ($settings['analytics_enabled'] ?? 'no') ? 'true' : 'false';
        $accent_color = sanitize_hex_color((string) ($settings['accent_color'] ?? '')) ?: '#722f37';
        $accent_text_color = sanitize_hex_color((string) ($settings['accent_text_color'] ?? '')) ?: '#ffffff';
        $configuration_endpoint = rest_url('my-next-wine/v1/configuration');
        $recommendations_endpoint = rest_url('my-next-wine/v1/recommendations');
        $swap_endpoint = rest_url('my-next-wine/v1/swap');
        $refine_endpoint = rest_url('my-next-wine/v1/refine');
        $events_endpoint = rest_url('my-next-wine/v1/events');
        $cart_endpoint = rest_url('my-next-wine/v1/cart');
        $wp_nonce = wp_create_nonce('wp_rest');

        ob_start();
        include MYNEXTWINE_WOO_DIR . 'templates/widget.php';
        return (string) ob_get_clean();
    }

    /** @return array<string,mixed> */
    private function settings(): array {
        $client = new MyNextWine_Woo_API_Client();
        return $client->settings();
    }

    /** @param array<string,mixed> $settings */
    private function is_frontend_enabled(array $settings): bool {
        return !is_admin()
            && 'yes' === ($settings['enabled'] ?? 'no')
            && !empty($settings['api_base_url'])
            && !empty($settings['installation_id'])
            && !empty($settings['installation_secret']);
    }
}
