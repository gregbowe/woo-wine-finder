<?php
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

if (!defined('MYNEXTWINE_WOO_OPTION')) {
    define('MYNEXTWINE_WOO_OPTION', 'mynextwine_woo_settings');
}
if (!defined('MYNEXTWINE_WOO_API_BASE_URL')) {
    // The API client defaults to the public service when no developer override exists.
}

$mynextwine_woo_client_file = __DIR__ . '/includes/class-mnw-api-client.php';
if (file_exists($mynextwine_woo_client_file)) {
    require_once $mynextwine_woo_client_file;
    if (class_exists('MyNextWine_Woo_API_Client')) {
        $mynextwine_woo_client = new MyNextWine_Woo_API_Client();
        if ($mynextwine_woo_client->is_configured()) {
            // The signed backend request revokes access and immediately cancels
            // any Stripe subscription. A failed network call must never prevent
            // WordPress from completing local uninstall cleanup.
            $mynextwine_woo_client->revoke();
        }
    }
}

wp_clear_scheduled_hook('mynextwine_woo_bootstrap_installation');
wp_clear_scheduled_hook('mynextwine_woo_start_catalogue_sync');
wp_clear_scheduled_hook('mynextwine_woo_sync_catalogue_page');
wp_clear_scheduled_hook('mynextwine_woo_catalogue_reconcile');
wp_clear_scheduled_hook('mynextwine_woo_retry_order_attribution');
delete_option('mynextwine_woo_settings');
delete_option('mynextwine_woo_catalogue_sync_state');
delete_option('mynextwine_woo_bootstrap_lock');
delete_option('mynextwine_woo_catalogue_sync_lock');
delete_option('mynextwine_woo_catalogue_sync_requested_at');
