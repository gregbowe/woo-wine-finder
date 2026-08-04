<?php
/**
 * Plugin Name: My Next Wine for WooCommerce
 * Plugin URI: https://mynextwine.ie/
 * Description: Adds the My Next Wine recommendation widget to a WooCommerce wine shop.
 * Version: 1.0.0
 * Author: My Next Wine
 * Author URI: https://mynextwine.ie/
 * Requires at least: 6.5
 * Requires PHP: 7.4
 * WC requires at least: 8.0
 * WC tested up to: 10.9
 * Requires Plugins: woocommerce
 * Text Domain: my-next-wine-for-woocommerce
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MNW_WOO_VERSION', '1.0.0');
define('MNW_WOO_FILE', __FILE__);
define('MNW_WOO_DIR', plugin_dir_path(__FILE__));
define('MNW_WOO_URL', plugin_dir_url(__FILE__));
define('MNW_WOO_OPTION', 'mnw_woo_settings');
define('MNW_WOO_TERMS_VERSION', '2026-08-04-6');
define('MNW_WOO_TERMS_URL', 'https://mynextwine.ie/woocommerce/terms');
define('MNW_WOO_PRIVACY_URL', 'https://mynextwine.ie/woocommerce/privacy');
define('MNW_WOO_USER_TERMS_URL', 'https://mynextwine.ie/woocommerce/user-terms');

add_action('before_woocommerce_init', static function () {
    if (class_exists('Automattic\\WooCommerce\\Utilities\\FeaturesUtil')) {
        Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
            'custom_order_tables',
            __FILE__,
            true
        );
        Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility(
            'cart_checkout_blocks',
            __FILE__,
            true
        );
    }
});

require_once MNW_WOO_DIR . 'includes/class-mnw-api-client.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-installer.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-catalogue-sync.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-settings.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-rest-controller.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-catalogue-controller.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-order-attribution.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-widget.php';
require_once MNW_WOO_DIR . 'includes/class-mnw-privacy.php';

add_action('plugins_loaded', static function () {
    if (!class_exists('WooCommerce')) {
        add_action('admin_notices', static function () {
            echo '<div class="notice notice-error"><p>'
                . esc_html__('My Next Wine requires WooCommerce to be installed and active.', 'my-next-wine-for-woocommerce')
                . '</p></div>';
        });
        return;
    }

    $client = new MNW_Woo_API_Client();
    $catalogue_sync = new MNW_Woo_Catalogue_Sync($client);
    $installer = new MNW_Woo_Installer($client);
    $installer->set_catalogue_sync($catalogue_sync);
    new MNW_Woo_Settings($client, $catalogue_sync);
    new MNW_Woo_REST_Controller($client);
    new MNW_Woo_Catalogue_Controller($client);
    new MNW_Woo_Order_Attribution($client);
    new MNW_Woo_Widget();
    new MNW_Woo_Privacy();
});

register_activation_hook(__FILE__, array('MNW_Woo_Installer', 'activate'));
register_activation_hook(__FILE__, array('MNW_Woo_Catalogue_Sync', 'activate'));
register_deactivation_hook(__FILE__, array('MNW_Woo_Installer', 'deactivate'));
register_deactivation_hook(__FILE__, array('MNW_Woo_Catalogue_Sync', 'deactivate'));
