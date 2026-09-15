<?php
/** Run: php tests/bundled-i18n-smoke.php (isolated WordPress API stubs, no database). */
define('ABSPATH', __DIR__ . '/');
define('MYNEXTWINE_WOO_DIR', dirname(__DIR__) . '/');
define('MYNEXTWINE_WOO_FILE', MYNEXTWINE_WOO_DIR . 'my-next-wine-woocommerce.php');
define('MYNEXTWINE_WOO_OPTION', 'mnw_test');
$hooks = array();
function add_filter($hook, $callback, $priority, $arguments) { global $hooks; $hooks[$hook] = array($callback, $priority, $arguments); }
function add_action($hook, $callback, $priority) { global $hooks; $hooks[$hook] = array($callback, $priority); }
function load_plugin_textdomain($domain, $deprecated, $path) { return true; }
function plugin_basename($path) { return 'my-next-wine-for-woocommerce/' . basename($path); }
function get_option($name, $default) { return $GLOBALS['saved'] ?? $default; }
function wp_parse_args($args, $defaults) { return array_merge($defaults, $args); }
function esc_url_raw($url) { return $url; }
function untrailingslashit($url) { return rtrim($url, '/'); }
function sanitize_key($key) { return strtolower(preg_replace('/[^a-zA-Z0-9_\-]/', '', $key)); }
function __($message, $domain) { return ($GLOBALS['catalogue'] ?? array())[$message] ?? $message; }
function check($condition, $label) { if (!$condition) { throw new RuntimeException($label); } }

require MYNEXTWINE_WOO_DIR . 'includes/class-mnw-i18n.php';
require MYNEXTWINE_WOO_DIR . 'includes/class-mnw-api-client.php';
MyNextWine_Woo_I18n::register();
check(isset($hooks['init']) && 0 === $hooks['init'][1], 'Register translations on init');
check(isset($hooks['load_textdomain_mofile']), 'Bundled path filter');
$domain = 'my-next-wine-for-woocommerce';
foreach (array('pt_PT', 'fr_FR', 'de_DE', 'de_AT', 'de_CH', 'de_DE_formal') as $locale) {
    $filename = $domain . '-' . $locale . '.mo';
    $global = '/wp-content/languages/plugins/' . $filename;
    check(MyNextWine_Woo_I18n::bundled_mofile($global, $domain) === MYNEXTWINE_WOO_DIR . 'languages/' . $filename, $locale . ' uses shipped catalogue');
}
$external = '/wp-content/languages/plugins/another-plugin-pt_PT.mo';
check(MyNextWine_Woo_I18n::bundled_mofile($external, 'another-plugin') === $external, 'Other plugin unchanged');
$unbundled = '/wp-content/languages/plugins/' . $domain . '-ja.mo';
check(MyNextWine_Woo_I18n::bundled_mofile($unbundled, $domain) === $unbundled, 'Unbundled locale fallback');

// Simulate the WordPress user's chosen gettext catalogue independently of site language.
$catalogue = array(
    'Not sure what to choose?' => 'Não sabe o que escolher?',
    'Build my wine selection' => 'Criar a minha seleção de vinhos',
    'Add selected to basket' => 'Adicionar selecionados ao carrinho',
    'A complete selection from our available wines, built around your budget, preferences and occasion.' =>
        'Uma seleção completa dos nossos vinhos disponíveis, pensada para o seu orçamento, as suas preferências e a ocasião.',
);
$saved = array('heading' => 'Not sure what to choose?', 'launcher_label' => 'Build my wine selection', 'button_label' => 'Add selected to basket');
$client = new MyNextWine_Woo_API_Client();
$settings = $client->settings();
check($settings['heading'] === $catalogue['Not sure what to choose?'], 'Stored English default translated');
check($settings['launcher_label'] === $catalogue['Build my wine selection'], 'Launcher default translated');
check($settings['button_label'] === $catalogue['Add selected to basket'], 'Basket default translated');
$saved['heading'] = 'A escolha pessoal da nossa garrafeira';
check($client->settings()['heading'] === $saved['heading'], 'Merchant custom text unchanged');
$saved['heading'] = 'Não sabe o que escolher?';
$catalogue = array();
check($client->settings()['heading'] === 'Not sure what to choose?', 'Stored Portuguese default follows a later locale change');
echo "PASS: bundled PT/DE/FR loading, foreign-domain isolation, unbundled fallback and default/custom-text preservation.\n";
