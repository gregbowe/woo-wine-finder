=== My Next Wine for WooCommerce ===
Contributors: mynextwine
Tags: woocommerce, wine, wine recommendations, product recommendations, wine finder
Requires at least: 6.5
Tested up to: 7.0
Requires PHP: 7.4
Requires Plugins: woocommerce
Stable tag: 1.0.27
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Adds a guided Wine Finder that builds complete selections from your live catalogue using structured wine knowledge, budget, tastes and food.

== Description ==

Most wine websites work well when the shopper already knows what they want. My Next Wine helps everyone else.

The plugin adds a guided, theme-aware Wine Finder to your WooCommerce store. In four quick questions, shoppers choose a bottle mix and total budget, then describe any tastes, dislikes, food, gift or occasion they want considered.

My Next Wine builds a complete 1-to-12-bottle selection from the mapped wines currently available in your own catalogue.

= What makes it different =

Each eligible product is mapped to structured data about its wine, producer, country, region, subregion, grapes, style and concise notes. Recommendations therefore use more context than product titles and descriptions alone.

* Handles grapes, regions, styles, dislikes, meals, gifts and occasions in natural language.
* Keeps the requested red, white, sparkling and dessert mix within the total order budget.
* Recommends only mapped wines currently available from your store.
* Explains each bottle and clearly identifies compromises or alternatives.
* Lets shoppers swap or remove individual bottles without restarting.
* Adds selected products and quantities directly to the WooCommerce basket.
* Requires no shopper account or email address to show recommendations.
* Uses your existing basket and checkout, so you keep the customer relationship, payment and fulfilment.

Artificial intelligence interprets the shopper's request. Structured catalogue data and deterministic checks enforce the bottle count, wine mix, budget and eligible product pool. At basket time, WooCommerce revalidates each product or variation, quantity, current price, stock and purchase eligibility.

Non-wine products can be excluded. The initial eligible catalogue is mapped or reviewed before the trial begins. The launcher, introduction and presentation can be configured for your storefront, and optional aggregate analytics can measure Wine Finder activity and attributed orders.

= Pricing =

The hosted My Next Wine service includes a 14-day free trial followed by one of these monthly plans. The current direct-subscription billing currency is EUR:

* Launch: EUR 29.99 per month for up to 500 completed Wine Finder sessions.
* Growth: EUR 79.99 per month for up to 2,000 completed Wine Finder sessions.
* Scale: EUR 199.99 per month for up to 5,000 completed Wine Finder sessions.

A completed session includes the shopper's initial recommendations and every follow-up refinement or bottle swap made during that visit. Refinements and swaps are not counted as separate sessions. There is no commission or per-order fee.

Subscription checkout and account management are hosted by Stripe. The trial begins only when the catalogue is ready and the merchant chooses to start it. Activating the plugin alone does not start the trial, create a charge or transmit store or catalogue data.

Stripe Checkout and the Stripe invoice show the authoritative charge and any tax before payment. My Next Wine does not claim that Stripe Automatic Tax is enabled. The Wine Finder pilot accepts stores in Ireland using EUR and stores in the United Kingdom using GBP; store prices and shopper budgets continue to use the store's own currency.

My Next Wine provides technology only. The merchant remains the seller of every wine and is responsible for alcohol licensing, age verification, product information and condition, payment, fulfilment, delivery, customer service, refunds and legal compliance.

== Installation ==

1. Install and activate the plugin.
2. Open WooCommerce > My Next Wine.
3. Review the external-service data disclosure and the linked Merchant Terms and Privacy Statement.
4. An authorised administrator ticks both consent boxes and chooses "Agree and connect store".
5. The plugin proves ownership of the site and securely sends the disclosed store information to My Next Wine.
6. The catalogue is synchronised and eligible products are mapped or excluded.
7. When the catalogue is ready, complete the Stripe-hosted subscription checkout to start the 14-day trial.
8. Configure and enable the Wine Finder from WooCommerce > My Next Wine.

No WooCommerce REST key, Somm ID, installation ID or installation secret needs to be entered by the merchant.

== External services ==

This plugin connects to the externally hosted My Next Wine service at https://mynextwine.com. It cannot provide catalogue mapping, recommendations, reporting or order attribution without that service.

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
* Optional widget events such as impressions, opens, requests, results, swaps and basket attempts/outcomes. These are off by default. When the WordPress Consent API is available, they are sent only with positive statistics consent. When it is unavailable, enabling analytics confirms that the merchant has a valid data-protection lawful basis and has obtained any consent or other permission required by applicable ePrivacy or PECR rules. A successful basket addition is the only recommendation-usefulness signal; the widget does not ask shoppers to rate recommendations.
* For orders attributed to the Wine Finder: order identifier, currency, total, selected product/variation references and quantities.
* Technical request, replay-prevention and security metadata.

The plugin is not designed to send shopper names, customer email addresses, billing/delivery addresses or payment-card details to My Next Wine.

Stripe is used for merchant subscription billing. Stripe is contacted only after the merchant chooses to start the trial or manage the subscription. My Next Wine may provide Stripe with the merchant contact email and subscription metadata; the merchant submits billing and payment details directly on Stripe-hosted pages. Stripe returns the merchant name, billing address/country and any supplied tax identifier to My Next Wine as billing evidence. Payment-card details are not sent through the WordPress plugin or stored by My Next Wine.

My Next Wine may use contracted hosting, database, monitoring, support, billing and artificial-intelligence providers, including Stripe for merchant subscription billing, to operate the service. Full information is available here:

* Merchant Terms: https://mynextwine.com/woocommerce/terms
* Privacy Statement: https://mynextwine.com/woocommerce/privacy
* Subprocessors: https://mynextwine.com/subprocessors
* Stripe Services Agreement: https://stripe.com/legal/ssa
* Stripe Privacy Policy: https://stripe.com/privacy

== Privacy ==

The plugin adds suggested wording to WordPress's Privacy Policy Guide under Settings > Privacy. Merchants should review and include suitable wording in their own customer privacy notice, cookie notice and terms of sale.

Shopper preference answers are used to create the requested automated, AI-assisted recommendation. The pre-submission notice tells shoppers not to enter names, contact details, health information or other sensitive personal data. For attributed orders, My Next Wine receives order and product references but not customer identity, address or payment-card data. Normal security logs may contain network or device metadata.

Uninstall removes local plugin settings and sends a best-effort service revocation request to My Next Wine. Uninstalling does not itself cancel the Stripe subscription; use Manage subscription in WooCommerce > My Next Wine before uninstalling. A merchant can also contact support@mynextwine.com to request revocation, access, export or deletion, subject to legal retention requirements.

== Frequently Asked Questions ==

= What makes this different from a normal product recommender? =

My Next Wine builds a complete selection around the requested bottle mix and total budget. It uses mapped wine, producer, grape, region, style and note data rather than depending on product titles alone. It also explains compromises and lets the shopper swap one bottle without restarting.

= Does it recommend wines from other shops? =

No. Recommendations are restricted to mapped wines currently available from the connected WooCommerce store.

= What happens if the exact request cannot be met? =

The results identify requirements that could not be fully satisfied and may offer relevant substitutions or a sensible budget alternative. The Wine Finder does not silently present a weaker match as an exact one.

= Does activation send my catalogue? =

No. An authorised administrator must first review the disclosure, accept the Merchant Terms and explicitly connect the store.

= When does the free trial start? =

The trial starts only after the initial catalogue has been prepared and the merchant completes the Stripe-hosted subscription checkout.

= Does My Next Wine sell or fulfil the wine? =

No. My Next Wine provides recommendation and catalogue technology. The WooCommerce merchant is the seller of record and remains responsible for product quality, defects, licensing, age checks, payment, fulfilment, delivery, returns and customer claims.

= What happens before recommendations go into the basket? =

WooCommerce revalidates the selected product or variation, quantity, current price, stock and purchase eligibility before basket insertion.

== Changelog ==

= 1.0.27 =
* Updated Merchant Terms acceptance to version 2026-08-18-UK3 for annual rate-change notice and merchant brand/licence retailer-listing permissions.

= 1.0.26 =
* Aligned WooCommerce Merchant Terms acceptance with the 2026-08-18-UK2 legal release for the United Kingdom launch while retaining Ireland and EU coverage.

= 1.0.25 =
* Switched the hosted service, API, legal-document and support addresses to the canonical mynextwine.com domain.

= 1.0.24 =
* Restored the pre-submission AI, legal-drinking-age and sensitive-data warning after the storefront redesign.
* Expanded the WordPress Privacy Policy Guide wording for controller/processor roles, AI providers, international transfers, rights and complaints.
* Clarified that optional analytics require both a valid data-protection basis and any consent or permission required under applicable ePrivacy or PECR rules.

= 1.0.23 =
* Added explicit Ireland/EUR and United Kingdom/GBP market validation feedback.
* Added merchant market, catalogue readiness and last-service-contact details to the settings screen.
* Updated merchant agreement acceptance and clarified the actual EUR Stripe billing currency and billing evidence.

= 1.0.22 =
* Added Launch, Growth and Scale plan selection for Stripe checkout.
* Reused one visit-scoped session across initial recommendations, refinements and bottle swaps.
* Added completed-session allowance and current-month usage to the merchant settings screen.

= 1.0.14 =
* Show the lower and higher budget retries whenever a result has a visible alternatives notice, not only when it is over budget.
* Rehydrate recommendation images from the live local WooCommerce products before displaying them.

= 1.0.13 =
* Kept the current wines visible while retrying a lower or higher budget and preserved them when that retry fails.

= 1.0.12 =
* Replaced the token over-budget retry with meaningful budget choices approximately 10% below and above the displayed selection total.

= 1.0.11 =
* Clarified genuine refinement budget errors while keeping the existing selection intact.
* Added storefront support for AI-interpreted natural-language refinement changes.

= 1.0.10 =
* Made all Wine Finder bottle categories mutually exclusive using structured wine data plus specialist evidence from mapped names and imported descriptions.
* Replaced category-stock dead ends with clearly explained, style-aware alternatives from mapped, currently available wines.

= 1.0.9 =
* Added merchant-configurable Wine Finder bottle categories with a minimum of two and nine supported choices.
* Passed the configured category mix through recommendations, swaps and refinements while preserving legacy request fields.

= 1.0.8 =
* Removed the decorative example selection from the opening panel.
* Clarified the refinement example for exact bottle-mix changes.

= 1.0.7 =
* Polished the launcher, opening panel, loading states, recommendation cards, quick view and responsive results layout.
* Added safe server-side selection refinement with one-step undo while preserving existing inventory, mapping, budget and basket validation.
* Fixed the add-to-basket close animation so the modal keeps its dimensions until closing completes.

= 1.0.5 =
* Added idempotent item-level basket attempt, success and failure attribution. A successful basket addition is the only recommendation-usefulness signal.
