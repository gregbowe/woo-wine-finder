=== My Next Wine for WooCommerce ===
Contributors: mynextwine
Tags: woocommerce, wine, recommendations, product recommendations
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Requires Plugins: woocommerce
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds the My Next Wine wine recommendation widget and a consent-based, secure catalogue connector to WooCommerce.

== Description ==

My Next Wine is a hosted recommendation service for online wine merchants. This plugin displays a theme-aware Wine Finder, securely synchronises eligible catalogue information and validates selected products against live WooCommerce price and stock before adding them to the basket.

My Next Wine provides technology only. The merchant remains the seller of every wine and is responsible for alcohol licensing, age verification, product information and condition, payment, fulfilment, delivery, customer service, refunds and legal compliance.

The hosted service offers a 30-day free trial followed by EUR 29.99 per month plus applicable tax. Subscription checkout and account management are hosted by Stripe. My Next Wine activates, renews, pauses or ends access only from verified Stripe billing events. Activating the plugin alone does not start the trial, create a charge or transmit store/catalogue data.

== Installation ==

1. Install and activate the plugin.
2. Open WooCommerce > My Next Wine.
3. Review the external-service data disclosure and the linked Merchant Terms and Privacy Statement.
4. An authorised administrator ticks both consent boxes and chooses "Agree and connect store".
5. The plugin proves ownership of the site and securely sends the disclosed store information to My Next Wine.
6. The catalogue is synchronised and My Next Wine maps or ignores eligible products.
7. When the catalogue is ready, complete the Stripe-hosted subscription checkout to start the 30-day trial, then enable the Wine Finder.

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
* Optional aggregate widget events such as impressions, opens, requests, results, swaps and basket clicks. These are off by default. When the WordPress Consent API is available, they are sent only with positive statistics consent. When it is unavailable, enabling analytics confirms that the merchant has another lawful consent or privacy basis for these aggregate events.
* For orders attributed to the Wine Finder: order identifier, currency, total, selected product/variation references and quantities.
* Technical request, replay-prevention and security metadata.

The plugin is not designed to send shopper names, customer email addresses, billing/delivery addresses or payment-card details to My Next Wine.

Stripe is used for merchant subscription billing. Stripe is contacted only after the merchant chooses to start the trial or manage the subscription. My Next Wine may provide Stripe with the merchant contact email and subscription metadata; the merchant submits billing and payment details directly on Stripe-hosted pages. Payment-card details are not sent through the WordPress plugin or stored by My Next Wine.

My Next Wine may use contracted hosting, database, monitoring, support, billing and artificial-intelligence providers, including Stripe for merchant subscription billing, to operate the service. Full information is available here:

* Merchant Terms: https://mynextwine.ie/woocommerce/terms
* Privacy Statement: https://mynextwine.ie/woocommerce/privacy
* Subprocessors: https://mynextwine.ie/subprocessors
* Stripe Services Agreement: https://stripe.com/legal/ssa
* Stripe Privacy Policy: https://stripe.com/privacy

== Privacy ==

The plugin adds suggested wording to WordPress's Privacy Policy Guide under Settings > Privacy. Merchants should review and include suitable wording in their own customer privacy notice, cookie notice and terms of sale.

Shopper preference answers are used to create the requested recommendation. For attributed orders, My Next Wine receives order and product references but not customer identity, address or payment-card data. Normal security logs may contain network or device metadata.

Uninstall removes local plugin settings and sends a best-effort service revocation request to My Next Wine. Uninstalling does not itself cancel the Stripe subscription; use Manage subscription in WooCommerce > My Next Wine before uninstalling. A merchant can also contact support@mynextwine.ie to request revocation, access, export or deletion, subject to legal retention requirements.

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

Yes. Disable the storefront widget in WooCommerce > My Next Wine, use Manage subscription to cancel the connected Stripe plan, or uninstall the plugin.

== Changelog ==

= 1.0.0 =
* Initial public WordPress.org release.
* Added consent-based store connection, secure catalogue synchronisation and the storefront Wine Finder.
* Added direct Stripe-hosted trial and subscription management.
* Added live WooCommerce price, stock and basket validation, optional aggregate analytics and attributed-order reporting.
