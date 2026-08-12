<?php
/**
 * Plugin Name: My Next Wine for WooCommerce
 * Description: Adds the My Next Wine recommendation widget to a WooCommerce wine shop.
 * Version: 1.0.6
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

define('MYNEXTWINE_WOO_VERSION', '1.0.6');
define('MYNEXTWINE_WOO_FILE', __FILE__);
define('MYNEXTWINE_WOO_DIR', plugin_dir_path(__FILE__));
define('MYNEXTWINE_WOO_URL', plugin_dir_url(__FILE__));
define('MYNEXTWINE_WOO_OPTION', 'mynextwine_woo_settings');
define('MYNEXTWINE_WOO_TERMS_VERSION', '2026-08-09-1');
define('MYNEXTWINE_WOO_TERMS_URL', 'https://mynextwine.ie/woocommerce/terms');
define('MYNEXTWINE_WOO_PRIVACY_URL', 'https://mynextwine.ie/woocommerce/privacy');
define('MYNEXTWINE_WOO_USER_TERMS_URL', 'https://mynextwine.ie/woocommerce/user-terms');

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

require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-api-client.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-installer.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-catalogue-sync.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-settings.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-rest-controller.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-catalogue-controller.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-order-attribution.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-widget.php';
require_once MYNEXTWINE_WOO_DIR . 'includes/class-mnw-privacy.php';

add_action('plugins_loaded', static function () {
    if (!class_exists('WooCommerce')) {
        add_action('admin_notices', static function () {
            echo '<div class="notice notice-error"><p>'
                . esc_html__('My Next Wine requires WooCommerce to be installed and active.', 'my-next-wine-for-woocommerce')
                . '</p></div>';
        });
        return;
    }

    $client = new MyNextWine_Woo_API_Client();
    $catalogue_sync = new MyNextWine_Woo_Catalogue_Sync($client);
    $installer = new MyNextWine_Woo_Installer($client);
    $installer->set_catalogue_sync($catalogue_sync);
    new MyNextWine_Woo_Settings($client, $catalogue_sync);
    new MyNextWine_Woo_REST_Controller($client);
    new MyNextWine_Woo_Catalogue_Controller($client);
    new MyNextWine_Woo_Order_Attribution($client);
    new MyNextWine_Woo_Widget();
    new MyNextWine_Woo_Privacy();
});

register_activation_hook(__FILE__, array('MyNextWine_Woo_Installer', 'activate'));
register_activation_hook(__FILE__, array('MyNextWine_Woo_Catalogue_Sync', 'activate'));
register_deactivation_hook(__FILE__, array('MyNextWine_Woo_Installer', 'deactivate'));
register_deactivation_hook(__FILE__, array('MyNextWine_Woo_Catalogue_Sync', 'deactivate'));
