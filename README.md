# My Next Wine for WooCommerce

A GPL-licensed WooCommerce connector for the externally hosted My Next Wine B2B wine-recommendation service.

## Merchant experience

1. Install and activate the plugin. Activation does **not** contact My Next Wine or upload store/catalogue data.
2. Open **WooCommerce → My Next Wine**.
3. Review the external-service data disclosure, accept the current Merchant Terms and acknowledge the Privacy Statement.
4. Choose **Agree and connect store**. The plugin proves ownership of the WooCommerce site and connects it to My Next Wine.
5. A new B2B-only merchant account is created automatically, or an existing WooCommerce merchant is safely reused.
6. For a new B2B-only merchant, the plugin pushes a complete signed catalogue snapshot and keeps it reconciled.
7. My Next Wine maps or ignores the products.
8. Once the catalogue is ready, the merchant completes Stripe-hosted checkout to start the 30-day trial and then enables the widget.

The merchant never handles a Somm ID, installation ID, installation secret, connection code or WooCommerce REST API key.

## Legal and commercial boundary

My Next Wine provides recommendation, catalogue-mapping, widget, analytics and attribution technology. It does not sell, possess, inspect, store, ship or take payment for wine. The WooCommerce merchant remains seller of record and is responsible for product accuracy and condition, defects, licensing, age verification, payment, taxes, fulfilment, delivery, returns, recalls and customer claims.

Published documents:

- Merchant Terms: `https://mynextwine.ie/woocommerce/terms`
- Privacy Statement: `https://mynextwine.ie/woocommerce/privacy`
- Subprocessors: `https://mynextwine.ie/subprocessors`

## External-service disclosure

No store or catalogue information is sent solely because the plugin is installed or activated. After an authorised administrator expressly connects the store, the plugin sends the My Next Wine service:

- store URL/name, administrator email, store address/phone, country, currency and locale;
- WordPress, WooCommerce and plugin versions;
- a generated installation identity, ownership challenge and accepted terms version;
- product/variation identifiers, descriptions, images, attributes, prices and availability;
- the current shopper recommendation criteria when a recommendation is requested;
- optional aggregate widget events, off by default and consent-gated; and
- for attributed orders, order/product references, quantities, currency and total, without customer identity, address or payment-card details.

The service may use contracted infrastructure, monitoring, support and AI providers as described in the Privacy Statement and subprocessor list.

## What the plugin does

- Displays the four-step My Next Wine Wine Finder.
- Gives merchants Shopify-equivalent controls for launcher placement, theme inheritance, colours, labels, introduction text, optional My Next Wine notes and optional ratings.
- Sends shopper answers to My Next Wine through signed server-to-server requests.
- Registers the WooCommerce installation using a short-lived ownership challenge after consent.
- Pushes full, signed catalogue snapshots for B2B-only installations.
- Schedules hourly full reconciliation plus product, stock, price and deletion updates.
- Reuses the existing B2C catalogue connection for an existing My Next Wine WooCommerce merchant.
- Revalidates every recommended product, variation, price and stock state before adding it to the basket.
- Copies private attribution metadata to order items and reports only attributed order/product references.
- Supports simple and variable products.
- Declares compatibility with WooCommerce HPOS and Cart/Checkout Blocks.
- Adds suggested text to the WordPress Privacy Policy Guide.

## Security boundaries

- The plugin generates a random installation identity locally.
- The backend calls a short-lived proof route on the claimed WordPress site before accepting a new installation.
- The installation secret is encrypted using the site's WordPress salts before storage.
- The secret is never rendered into storefront JavaScript.
- Plugin/backend requests use timestamped HMAC-SHA256 signatures and replay IDs.
- The public bootstrap endpoint is rate limited and rejects non-HTTPS or private-network store URLs by default.
- Basket writes require a WordPress REST nonce and a short-lived signed recommendation token.
- Product IDs supplied by the browser must exist in the signed token and are checked against live stock and pricing again.
- The catalogue importer refuses to overwrite a catalogue owned by Shopify or the established WooCommerce B2C connection.

## Existing WooCommerce B2C merchants

When the store URL uniquely matches an existing My Next Wine WooCommerce merchant with valid Woo API credentials:

- The existing organisation and Somm are reused.
- The existing mapped catalogue is reused.
- The established `WooCommerceInventoryImporter` remains authoritative.
- The plugin does not upload a duplicate catalogue.
- Only the B2B entitlement and Woo widget installation are added.

Ambiguous or conflicting matches are rejected for manual support review rather than linked automatically.

## Direct Stripe billing

- The backend creates a Stripe Checkout Session and redirects the merchant to Stripe-hosted subscription checkout.
- The Wine Finder is activated only from a verified Stripe webhook, never from the browser return alone.
- Stripe handles card collection, payment authentication, renewals and hosted invoices; payment-card details never pass through the WordPress plugin or My Next Wine backend.
- The merchant opens Stripe Customer Portal from **WooCommerce → My Next Wine** to update billing details, view invoices or cancel.
- Cancellation normally keeps access until the end of the paid period reported by Stripe.
- Uninstalling revokes the plugin connection but does not silently cancel the Stripe subscription.

## Public-release prerequisites

- Set the sole-trader legal name, genuine geographic business address, CRO business-name registration number and monitored support/privacy email in the backend AWS Secrets Manager record. Leave VAT blank while not VAT registered.
- Publish the Merchant Terms, Privacy Statement and subprocessor list at the URLs above.
- Create the Stripe recurring Price, configure Stripe Customer Portal, register the dedicated Stripe webhook endpoint and add separate staging/production Stripe secrets in AWS Secrets Manager.
- Test against the exact WordPress/WooCommerce/PHP versions claimed in `readme.txt` and update `Tested up to` before submission.
- Run Plugin Check and WordPress Coding Standards, prepare repository assets/screenshots, and provide clear WordPress.org reviewer instructions for the external SaaS and Stripe billing flow.

## Initial limitations

- One store currency must match the merchant country's configured My Next Wine currency.
- Backordered products are intentionally treated as unavailable.
- Bundle, composite and subscription products are not imported as individual wine offers.
- The default direct subscription is EUR 29.99/month after a 30-day trial; the configured Stripe Price currency and amount must exactly match the backend settings and published terms.

## Local development

Production bootstrap accepts only public HTTPS store URLs. For a known local test store and local backend, set these backend environment variables:

```text
WOOCOMMERCE_WIDGET_BOOTSTRAP_ALLOW_HTTP=true
WOOCOMMERCE_WIDGET_BOOTSTRAP_ALLOW_PRIVATE_HOSTS=true
```

Add these to the local WordPress site's `wp-config.php` before the `That's all, stop editing` line:

```php
define('MNW_WOO_API_BASE_URL', 'https://192.168.68.106:8443');
define('MNW_WOO_ALLOW_INSECURE_LOCAL_SSL', true);
```

Never enable those local-development exceptions in production.


Wine Finder legal pages
-----------------------
* Merchant installation terms: https://mynextwine.ie/woocommerce/terms (B2B click-wrap before connection).
* WooCommerce Wine Finder privacy statement: https://mynextwine.ie/woocommerce/privacy.
* Shopper Wine Finder user terms: https://mynextwine.ie/woocommerce/user-terms (linked beside the recommendation button).
* The storefront disclosure states that recommendations are AI-assisted and that wine is sold and fulfilled by the merchant.
* These pages are separate from the Irish My Next Wine B2C terms and privacy policy.
