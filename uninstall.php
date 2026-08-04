<?php
if (!defined('WP_UNINSTALL_PLUGIN')) {
    exit;
}

if (!defined('MNW_WOO_OPTION')) {
    define('MNW_WOO_OPTION', 'mnw_woo_settings');
}
if (!defined('MNW_WOO_API_BASE_URL')) {
    // The API client defaults to the public service when no developer override exists.
}

$mnw_woo_client_file = __DIR__ . '/includes/class-mnw-api-client.php';
if (file_exists($mnw_woo_client_file)) {
    require_once $mnw_woo_client_file;
    if (class_exists('MNW_Woo_API_Client')) {
        $mnw_woo_client = new MNW_Woo_API_Client();
        if ($mnw_woo_client->is_configured()) {
            // Best effort. A failed network call must never prevent WordPress uninstall.
            $mnw_woo_client->revoke();
        }
    }
}

wp_clear_scheduled_hook('mnw_woo_bootstrap_installation');
wp_clear_scheduled_hook('mnw_woo_start_catalogue_sync');
wp_clear_scheduled_hook('mnw_woo_sync_catalogue_page');
wp_clear_scheduled_hook('mnw_woo_catalogue_reconcile');
wp_clear_scheduled_hook('mnw_woo_retry_order_attribution');
delete_option('mnw_woo_settings');
delete_option('mnw_woo_catalogue_sync_state');
delete_option('mnw_woo_bootstrap_lock');
delete_option('mnw_woo_catalogue_sync_lock');
delete_option('mnw_woo_catalogue_sync_requested_at');
