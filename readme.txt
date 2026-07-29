=== My Next Wine for WooCommerce ===
Contributors: mynextwine
Tags: woocommerce, wine, recommendations, product recommendations
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Requires Plugins: woocommerce
Stable tag: 0.3.1
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds the My Next Wine wine recommendation widget and a consent-based, secure catalogue connector to WooCommerce.

== Description ==

My Next Wine is a hosted recommendation service for online wine merchants. This plugin displays a theme-aware Wine Finder, securely synchronises eligible catalogue information and validates selected products against live WooCommerce price and stock before adding them to the basket.

My Next Wine provides technology only. The merchant remains the seller of every wine and is responsible for alcohol licensing, age verification, product information and condition, payment, fulfilment, delivery, customer service, refunds and legal compliance.

The hosted service offers a 30-day free trial followed by the price disclosed in the connection and billing flow. Activating the plugin alone does not start the trial, create a charge or transmit store/catalogue data.

== Installation ==

1. Install and activate the plugin.
2. Open WooCommerce > My Next Wine.
3. Review the external-service data disclosure and the linked Merchant Terms and Privacy Statement.
4. An authorised administrator ticks both consent boxes and chooses "Agree and connect store".
5. The plugin proves ownership of the site and securely sends the disclosed store information to My Next Wine.
6. The catalogue is synchronised and My Next Wine maps or ignores eligible products.
7. When the catalogue is ready, start the 30-day trial and enable the Wine Finder.

No WooCommerce REST key, Somm ID, installation ID or installation secret needs to be entered by the merchant.

== External services ==

This plugin connects to the externally hosted My Next Wine service at https://mynextwine.ie. It cannot provide catalogue mapping, recommendations, reporting or order attribution without that service.

No store or catalogue information is transmitted merely because the plugin is installed or activated. Transmission begins only after an authorised administrator accepts the disclosure and connects the store from WooCommerce > My Next Wine.

At connection, the plugin sends:

* Store URL and name.
* WordPress administrator email.
* WooCommerce store address, phone, country/state, currency and locale.
* WordPress, WooCommerce and plugin versions.
* A generated installation identifier/secret and a short-lived ownership challenge.
* The accepted Merchant Terms version and acceptance time.

After connection, the plugin may send:

* Product and variation identifiers, SKUs, names, descriptions, images, categories, attributes, prices, currency, stock and availability.
* Shopper bottle mix, budget, wine preferences and food-pairing text when a recommendation is requested.
* Aggregate widget events such as impressions, opens, requests, results, swaps and basket clicks.
* For orders attributed to the Wine Finder: order identifier, currency, total, selected product/variation references and quantities.
* Technical request, replay-prevention and security metadata.

The plugin is not designed to send shopper names, customer email addresses, billing/delivery addresses or payment-card details to My Next Wine.

My Next Wine may use contracted hosting, database, monitoring, support and artificial-intelligence providers to operate the service. Full information is available here:

* Merchant Terms: https://mynextwine.ie/woocommerce/terms
* Privacy Statement: https://mynextwine.ie/woocommerce/privacy
* Subprocessors: https://mynextwine.ie/subprocessors

== Privacy ==

The plugin adds suggested wording to WordPress's Privacy Policy Guide under Settings > Privacy. Merchants should review and include suitable wording in their own customer privacy notice, cookie notice and terms of sale.

Shopper preference answers are used to create the requested recommendation. For attributed orders, My Next Wine receives order and product references but not customer identity, address or payment-card data. Normal security logs may contain network or device metadata.

Uninstall removes local plugin settings and sends a best-effort revocation request to My Next Wine. A merchant can also contact support@mynextwine.ie to request revocation, access, export or deletion, subject to legal retention requirements.

== Frequently Asked Questions ==

= Does activation send my catalogue? =

No. An authorised administrator must first review the disclosure, accept the Merchant Terms and explicitly connect the store.

= Does My Next Wine sell or fulfil the wine? =

No. My Next Wine provides recommendation and catalogue technology. The WooCommerce merchant is the seller of record and remains responsible for product quality, defects, licensing, age checks, payment, fulfilment, delivery, returns and customer claims.

= Does the plugin need WooCommerce REST API keys? =

No. The plugin uses an ownership challenge and signed server-to-server requests. The installation secret is generated automatically and is not displayed to the merchant or storefront browser.

= What happens before recommendations go into the basket? =

WooCommerce revalidates the selected product or variation, quantity, current price and stock before basket insertion.

= Can I disable it? =

Yes. Disable the storefront widget in WooCommerce > My Next Wine, cancel the connected plan using the disclosed billing route, or uninstall the plugin.

== Changelog ==

= 0.3.1 =
* Added separate shopper-facing Wine Finder User Terms and linked them beside the recommendation button.
* Strengthened merchant/customer ownership, AI transparency, platform-review, no-conversion-guarantee and privacy disclosures.
* Updated the Merchant Terms acceptance version to 2026-07-29-2.

= 0.3.0 =
* Changed activation to a consent-based connection: no account or catalogue data is sent until an administrator explicitly agrees and connects the store.
* Added versioned Merchant Terms acceptance and Privacy Statement acknowledgement.
* Added a clear external-service and data-transfer disclosure to the setup screen and plugin readme.
* Added suggested text to the WordPress Privacy Policy Guide.
* Changed the distributed plugin code licence to GPLv2 or later; the separately hosted service remains subject to the Merchant Terms.
* Added the WooCommerce dependency header.

= 0.2.2 =
* Fixed automatic installation verification when wp-cron and an admin retry overlap.
* Added a short bootstrap lock so only one connection attempt runs at a time.

= 0.2.0 =
* Added ownership-verified store registration.
* Creates or safely reuses the correct My Next Wine merchant account.
* Added signed outbound catalogue snapshots and scheduled reconciliation.
* Added setup, mapping and trial progress to the WooCommerce admin screen.
* Locks widget activation until catalogue mapping and trial activation are complete.
* Existing My Next Wine WooCommerce merchants reuse their established catalogue connection.

= 0.1.3 =
* Kept theme-matched pill rounding on buttons without applying it to text fields and textareas.

= 0.1.2 =
* Fixed the mapped available wine count shown on the connection status screen.

= 0.1.1 =
* Added an explicit local-development switch for self-signed backend certificates.
* Connection tests now show the underlying WordPress HTTP error.

= 0.1.0 =
* Initial manually provisioned WooCommerce pilot.


== Wine Finder legal pages ==
* Merchant installation terms: https://mynextwine.ie/woocommerce/terms (B2B click-wrap before connection).
* WooCommerce Wine Finder privacy statement: https://mynextwine.ie/woocommerce/privacy.
* Shopper Wine Finder user terms: https://mynextwine.ie/woocommerce/user-terms (linked beside the recommendation button).
* The storefront disclosure states that recommendations are AI-assisted and that wine is sold and fulfilled by the merchant.
* These pages are separate from the Irish My Next Wine B2C terms and privacy policy.
