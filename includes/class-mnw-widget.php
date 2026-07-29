<?php
/** Storefront widget renderer. */

if (!defined('ABSPATH')) {
    exit;
}

final class MNW_Woo_Widget {
    private bool $rendered = false;

    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue'));
        add_action('wp_footer', array($this, 'render_automatic'), 30);
        add_shortcode('my_next_wine', array($this, 'shortcode'));
    }

    public function enqueue(): void {
        $settings = $this->settings();
        if (!$this->is_frontend_enabled($settings)) {
            return;
        }
        wp_enqueue_style(
            'mnw-wine-finder',
            MNW_WOO_URL . 'assets/css/wine-finder.css',
            array(),
            MNW_WOO_VERSION
        );
        wp_enqueue_script(
            'mnw-wine-finder',
            MNW_WOO_URL . 'assets/js/wine-finder.js',
            array(),
            MNW_WOO_VERSION,
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
        wp_enqueue_style('mnw-wine-finder');
        wp_enqueue_script('mnw-wine-finder');
        return $this->render();
    }

    private function render(): string {
        if ($this->rendered) {
            return '';
        }
        $this->rendered = true;
        $settings = $this->settings();
        $widget_id = 'woo-' . wp_generate_uuid4();
        $heading = (string) ($settings['heading'] ?? 'Need help choosing wine?');
        $launcher_label = (string) ($settings['launcher_label'] ?? 'Find my wines');
        $button_label = (string) ($settings['button_label'] ?? 'Add selected to basket');
        $launcher_position = 'left' === ($settings['launcher_position'] ?? 'right') ? 'left' : 'right';
        $inherit_theme_styles = 'yes' === ($settings['inherit_theme_styles'] ?? 'yes') ? 'true' : 'false';
        $accent_color = sanitize_hex_color((string) ($settings['accent_color'] ?? '')) ?: '#722f37';
        $accent_text_color = sanitize_hex_color((string) ($settings['accent_text_color'] ?? '')) ?: '#ffffff';
        $configuration_endpoint = rest_url('my-next-wine/v1/configuration');
        $recommendations_endpoint = rest_url('my-next-wine/v1/recommendations');
        $swap_endpoint = rest_url('my-next-wine/v1/swap');
        $events_endpoint = rest_url('my-next-wine/v1/events');
        $cart_endpoint = rest_url('my-next-wine/v1/cart');
        $wp_nonce = wp_create_nonce('wp_rest');

        ob_start();
        include MNW_WOO_DIR . 'templates/widget.php';
        return (string) ob_get_clean();
    }

    /** @return array<string,mixed> */
    private function settings(): array {
        $client = new MNW_Woo_API_Client();
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
