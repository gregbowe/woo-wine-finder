<?php
/**
 * Bundled merchant translations. Shopper widget messages still come from the backend.
 */

if (!defined('ABSPATH')) {
    exit;
}

final class MyNextWine_Woo_I18n {
    private const DOMAIN = 'my-next-wine-for-woocommerce';

    public static function register(): void {
        // Register before WordPress attempts just-in-time loading. Do not translate here.
        add_filter('load_textdomain_mofile', array(self::class, 'bundled_mofile'), 10, 2);
        add_action('init', array(self::class, 'load'), 0);
    }

    public static function load(): void {
        load_plugin_textdomain(
            self::DOMAIN,
            false,
            dirname(plugin_basename(MYNEXTWINE_WOO_FILE)) . '/languages'
        );
    }

    public static function bundled_mofile(string $mofile, string $domain): string {
        if (self::DOMAIN !== $domain) {
            return $mofile;
        }

        // Use the locale WordPress actually requested, not the site's locale.
        // This preserves user-language selection and switch_to_locale() behaviour.
        $filename = basename($mofile);
        if (!preg_match('/^my-next-wine-for-woocommerce-[A-Za-z0-9_@-]+\\.mo$/D', $filename)) {
            return $mofile;
        }
        $bundled = MYNEXTWINE_WOO_DIR . 'languages/' . $filename;
        // A shipped catalogue takes precedence over a stale/incomplete language pack.
        // Unbundled locales retain WordPress's normal loading and English fallback.
        return is_readable($bundled) ? $bundled : $mofile;
    }
}
