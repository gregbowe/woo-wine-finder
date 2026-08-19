<?php
if (!defined('ABSPATH')) { exit; }
?>
<div
  id="mnw-wine-finder-<?php echo esc_attr($widget_id); ?>"
  class="mnw-wine-finder mnw-wine-finder--<?php echo esc_attr($launcher_position); ?>"
  data-mnw-widget
  data-mnw-phase="form"
  data-config-endpoint="<?php echo esc_url($configuration_endpoint); ?>"
  data-endpoint="<?php echo esc_url($recommendations_endpoint); ?>"
  data-swap-endpoint="<?php echo esc_url($swap_endpoint); ?>"
  data-refine-endpoint="<?php echo esc_url($refine_endpoint); ?>"
  data-events-endpoint="<?php echo esc_url($events_endpoint); ?>"
  data-cart-endpoint="<?php echo esc_url($cart_endpoint); ?>"
  data-mnw-analytics-enabled="<?php echo esc_attr($analytics_enabled); ?>"
  data-mnw-wp-nonce="<?php echo esc_attr($wp_nonce); ?>"
  data-inherit-theme-styles="<?php echo esc_attr($inherit_theme_styles); ?>"
  data-fallback-accent="<?php echo esc_attr($accent_color); ?>"
  data-fallback-accent-contrast="<?php echo esc_attr($accent_text_color); ?>"
  hidden
>
  <button
    class="mnw-wine-finder__launcher"
    type="button"
    data-mnw-open
    aria-haspopup="dialog"
    aria-expanded="false"
    aria-busy="true"
    disabled
  >
    <span class="mnw-wine-finder__launcher-icon" aria-hidden="true">
      <?php if ($launcher_image_url) : ?>
        <img class="mnw-wine-finder__brand-image" src="<?php echo esc_url($launcher_image_url); ?>" alt="">
      <?php else : ?>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9 4h14l-1.2 8.2A5.9 5.9 0 0 1 16 17.3a5.9 5.9 0 0 1-5.8-5.1L9 4Z"/>
          <path d="M10.3 11h11.4M16 17.3V26M11.5 27h9"/>
        </svg>
      <?php endif; ?>
    </span>

    <span class="mnw-wine-finder__launcher-copy">
      <span class="mnw-wine-finder__launcher-heading">
        <?php echo esc_html($heading); ?>
      </span>
      <span class="mnw-wine-finder__launcher-action">
        <?php echo esc_html($launcher_label); ?>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4 10h11M11 6l4 4-4 4"/>
        </svg>
      </span>
    </span>
  </button>

  <dialog
    class="mnw-wine-finder__dialog"
    data-mnw-dialog
    aria-labelledby="mnw-dialog-title-<?php echo esc_attr($widget_id); ?>"
  >
    <div class="mnw-wine-finder__dialog-shell">
      <aside class="mnw-wine-finder__dialog-aside">
        <div>
          <div class="mnw-wine-finder__brand-lockup">
            <span class="mnw-wine-finder__brand-mark" aria-hidden="true">
              <?php if ($launcher_image_url) : ?>
                <img class="mnw-wine-finder__brand-image" src="<?php echo esc_url($launcher_image_url); ?>" alt="">
              <?php else : ?>
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M9 4h14l-1.2 8.2A5.9 5.9 0 0 1 16 17.3a5.9 5.9 0 0 1-5.8-5.1L9 4Z"/>
                  <path d="M10.3 11h11.4M16 17.3V26M11.5 27h9"/>
                </svg>
              <?php endif; ?>
            </span>
            <span><?php echo esc_html__('Wine finder', 'my-next-wine-for-woocommerce'); ?></span>
          </div>

          <h2 class="mnw-wine-finder__aside-title">
            <?php echo esc_html__('Wine, picked for you.', 'my-next-wine-for-woocommerce'); ?>
          </h2>
          <p class="mnw-wine-finder__aside-copy">
            <?php echo esc_html($intro); ?>
          </p>
        </div>

      </aside>

      <section class="mnw-wine-finder__dialog-main">
        <button
          class="mnw-wine-finder__close-button"
          type="button"
          data-mnw-close
          aria-label="<?php echo esc_attr__('Close wine finder', 'my-next-wine-for-woocommerce'); ?>"
        >
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="m5 5 10 10M15 5 5 15"/>
          </svg>
        </button>

        <div class="mnw-wine-finder__dialog-scroll" data-mnw-dialog-scroll>
          <h2
            id="mnw-dialog-title-<?php echo esc_attr($widget_id); ?>"
            class="mnw-visually-hidden"
          >
            <?php echo esc_html__('Wine finder', 'my-next-wine-for-woocommerce'); ?>
          </h2>

          <div class="mnw-wine-finder__wizard-progress" data-mnw-wizard-progress>
            <div class="mnw-wine-finder__wizard-progress-copy">
              <span data-mnw-wizard-count><?php echo esc_html__('Question 1 of 4', 'my-next-wine-for-woocommerce'); ?></span>
            </div>
            <div
              class="mnw-wine-finder__wizard-track"
              role="progressbar"
              aria-valuemin="1"
              aria-valuemax="4"
              aria-valuenow="1"
              data-mnw-wizard-track
            >
              <span data-mnw-wizard-bar></span>
            </div>
          </div>

          <form class="mnw-wine-finder__form" data-mnw-form>
            <input
              type="hidden"
              name="bottleCount"
              value="6"
              data-mnw-bottle-count
            >

            <fieldset
              class="mnw-wine-finder__fieldset mnw-wine-finder__wizard-step"
              data-mnw-wizard-step
              data-mnw-wizard-title="<?php echo esc_attr__('Bottle mix', 'my-next-wine-for-woocommerce'); ?>"
              data-mnw-wizard-mix
            >
              <legend class="mnw-wine-finder__question-title">
                <?php echo esc_html__('What mix would you like?', 'my-next-wine-for-woocommerce'); ?>
              </legend>

              <p class="mnw-wine-finder__question-help">
                <?php echo esc_html__('Choose 1 to 12 bottles across the categories available in this shop.', 'my-next-wine-for-woocommerce'); ?>
              </p>

              <div class="mnw-wine-finder__breakdown-grid">
                <div class="mnw-field" data-mnw-category-field="red">
                  <label
                    class="mnw-field__label"
                    for="mnw-red-<?php echo esc_attr($widget_id); ?>"
                  >
                    <?php echo esc_html__('Red', 'my-next-wine-for-woocommerce'); ?>
                  </label>

                  <input
                    id="mnw-red-<?php echo esc_attr($widget_id); ?>"
                    class="mnw-field__control"
                    type="number"
                    name="numberRed"
                    value="3"
                    min="0"
                    max="12"
                    step="1"
                    inputmode="numeric"
                    required
                    data-mnw-breakdown
                    data-mnw-category="red"
                  >
                </div>

                <div class="mnw-field" data-mnw-category-field="white">
                  <label
                    class="mnw-field__label"
                    for="mnw-white-<?php echo esc_attr($widget_id); ?>"
                  >
                    <?php echo esc_html__('White', 'my-next-wine-for-woocommerce'); ?>
                  </label>

                  <input
                    id="mnw-white-<?php echo esc_attr($widget_id); ?>"
                    class="mnw-field__control"
                    type="number"
                    name="numberWhite"
                    value="3"
                    min="0"
                    max="12"
                    step="1"
                    inputmode="numeric"
                    required
                    data-mnw-breakdown
                    data-mnw-category="white"
                  >
                </div>

                <div class="mnw-field" data-mnw-category-field="rose">
                  <label class="mnw-field__label" for="mnw-rose-<?php echo esc_attr($widget_id); ?>"><?php echo esc_html__('Rosé', 'my-next-wine-for-woocommerce'); ?></label>
                  <input id="mnw-rose-<?php echo esc_attr($widget_id); ?>" class="mnw-field__control" type="number" name="numberRose" value="0" min="0" max="12" step="1" inputmode="numeric" required data-mnw-breakdown data-mnw-category="rose">
                </div>

                <div class="mnw-field" data-mnw-category-field="sparkling">
                  <label
                    class="mnw-field__label"
                    for="mnw-sparkling-<?php echo esc_attr($widget_id); ?>"
                  >
                    <?php echo esc_html__('Sparkling', 'my-next-wine-for-woocommerce'); ?>
                  </label>

                  <input
                    id="mnw-sparkling-<?php echo esc_attr($widget_id); ?>"
                    class="mnw-field__control"
                    type="number"
                    name="numberSparkling"
                    value="0"
                    min="0"
                    max="12"
                    step="1"
                    inputmode="numeric"
                    required
                    data-mnw-breakdown
                    data-mnw-category="sparkling"
                  >
                </div>

                <div class="mnw-field" data-mnw-category-field="orange">
                  <label class="mnw-field__label" for="mnw-orange-<?php echo esc_attr($widget_id); ?>"><?php echo esc_html__('Orange/Skin-contact', 'my-next-wine-for-woocommerce'); ?></label>
                  <input id="mnw-orange-<?php echo esc_attr($widget_id); ?>" class="mnw-field__control" type="number" name="numberOrange" value="0" min="0" max="12" step="1" inputmode="numeric" required data-mnw-breakdown data-mnw-category="orange">
                </div>

                <div class="mnw-field" data-mnw-category-field="petNat">
                  <label class="mnw-field__label" for="mnw-pet-nat-<?php echo esc_attr($widget_id); ?>"><?php echo esc_html__('Pét-nat', 'my-next-wine-for-woocommerce'); ?></label>
                  <input id="mnw-pet-nat-<?php echo esc_attr($widget_id); ?>" class="mnw-field__control" type="number" name="numberPetNat" value="0" min="0" max="12" step="1" inputmode="numeric" required data-mnw-breakdown data-mnw-category="petNat">
                </div>

                <div class="mnw-field" data-mnw-category-field="sherry">
                  <label class="mnw-field__label" for="mnw-sherry-<?php echo esc_attr($widget_id); ?>"><?php echo esc_html__('Sherry', 'my-next-wine-for-woocommerce'); ?></label>
                  <input id="mnw-sherry-<?php echo esc_attr($widget_id); ?>" class="mnw-field__control" type="number" name="numberSherry" value="0" min="0" max="12" step="1" inputmode="numeric" required data-mnw-breakdown data-mnw-category="sherry">
                </div>

                <div class="mnw-field" data-mnw-category-field="otherFortified">
                  <label class="mnw-field__label" for="mnw-fortified-<?php echo esc_attr($widget_id); ?>"><?php echo esc_html__('Other fortified', 'my-next-wine-for-woocommerce'); ?></label>
                  <input id="mnw-fortified-<?php echo esc_attr($widget_id); ?>" class="mnw-field__control" type="number" name="numberOtherFortified" value="0" min="0" max="12" step="1" inputmode="numeric" required data-mnw-breakdown data-mnw-category="otherFortified">
                </div>

                <div class="mnw-field" data-mnw-category-field="dessert">
                  <label
                    class="mnw-field__label"
                    for="mnw-dessert-<?php echo esc_attr($widget_id); ?>"
                  >
                    <?php echo esc_html__('Dessert', 'my-next-wine-for-woocommerce'); ?>
                  </label>

                  <input
                    id="mnw-dessert-<?php echo esc_attr($widget_id); ?>"
                    class="mnw-field__control"
                    type="number"
                    name="numberDessert"
                    value="0"
                    min="0"
                    max="12"
                    step="1"
                    inputmode="numeric"
                    required
                    data-mnw-breakdown
                    data-mnw-category="dessert"
                  >
                </div>
              </div>

              <div class="mnw-wine-finder__mix-footer">
                <p
                  class="mnw-wine-finder__allocation-status"
                  data-mnw-allocation-status
                  aria-live="polite"
                >
                  <?php echo esc_html__('6 bottles selected', 'my-next-wine-for-woocommerce'); ?>
                </p>

                <div class="mnw-wine-finder__wizard-actions mnw-wine-finder__wizard-actions--end">
                  <button
                    class="mnw-wine-finder__primary-button"
                    type="button"
                    data-mnw-wizard-next
                  >
                    <?php echo esc_html__('Next', 'my-next-wine-for-woocommerce'); ?>
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M4 10h11M11 6l4 4-4 4"/>
                    </svg>
                  </button>
                </div>
              </div>
            </fieldset>

            <fieldset
              class="mnw-wine-finder__fieldset mnw-wine-finder__wizard-step"
              data-mnw-wizard-step
              data-mnw-wizard-title="<?php echo esc_attr__('Budget', 'my-next-wine-for-woocommerce'); ?>"
              data-mnw-wizard-budget
              hidden
            >
              <legend class="mnw-wine-finder__question-title">
                <?php echo esc_html__('What is your total budget?', 'my-next-wine-for-woocommerce'); ?>
              </legend>

              <p class="mnw-wine-finder__question-help" data-mnw-budget-help>
                <?php echo esc_html__("Loading this shop's currency and spend limits.", 'my-next-wine-for-woocommerce'); ?>
              </p>

              <div class="mnw-wine-finder__budget-panel">
                <p class="mnw-wine-finder__budget-label">
                  <?php echo esc_html__('Total budget', 'my-next-wine-for-woocommerce'); ?>
                </p>

                <div class="mnw-wine-finder__budget-editor">
                  <button
                    class="mnw-wine-finder__budget-step mnw-wine-finder__budget-step--decrease"
                    type="button"
                    data-mnw-budget-decrease
                  >
                    <span aria-hidden="true">−</span>
                    <span data-mnw-budget-decrease-amount>—</span>
                  </button>

                  <div class="mnw-budget-control">
                    <span
                      class="mnw-budget-control__currency"
                      aria-hidden="true"
                      data-mnw-budget-currency
                    >
                      —
                    </span>

                    <input
                      id="mnw-budget-<?php echo esc_attr($widget_id); ?>"
                      class="mnw-field__control mnw-budget-control__input"
                      type="number"
                      name="budget"
                      value="0"
                      min="0"
                      max="1000000000"
                      step="1"
                      inputmode="decimal"
                      aria-label="<?php echo esc_attr__('Total budget', 'my-next-wine-for-woocommerce'); ?>"
                      required
                      data-mnw-budget
                    >
                  </div>

                  <button
                    class="mnw-wine-finder__budget-step mnw-wine-finder__budget-step--increase"
                    type="button"
                    data-mnw-budget-increase
                  >
                    <span aria-hidden="true">+</span>
                    <span data-mnw-budget-increase-amount>—</span>
                  </button>
                </div>

                <p
                  class="mnw-wine-finder__budget-per-bottle"
                  data-mnw-budget-per-bottle
                  aria-live="polite"
                ></p>

                <div class="mnw-wine-finder__quick-choice-heading" aria-hidden="true">
                  <span><?php echo esc_html__('Quick choices', 'my-next-wine-for-woocommerce'); ?></span>
                </div>

                <div
                  class="mnw-wine-finder__budget-quick-choices"
                  data-mnw-budget-quick-choices
                ></div>
              </div>

              <div class="mnw-wine-finder__wizard-actions">
                <button
                  class="mnw-wine-finder__secondary-button"
                  type="button"
                  data-mnw-wizard-back
                >
                  <?php echo esc_html__('Back', 'my-next-wine-for-woocommerce'); ?>
                </button>

                <button
                  class="mnw-wine-finder__primary-button"
                  type="button"
                  data-mnw-wizard-next
                >
                  <?php echo esc_html__('Next', 'my-next-wine-for-woocommerce'); ?>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10h11M11 6l4 4-4 4"/>
                  </svg>
                </button>
              </div>
            </fieldset>

            <fieldset
              class="mnw-wine-finder__fieldset mnw-wine-finder__wizard-step"
              data-mnw-wizard-step
              data-mnw-wizard-title="<?php echo esc_attr__('Your taste', 'my-next-wine-for-woocommerce'); ?>"
              data-mnw-wizard-preferences
              hidden
            >
              <legend class="mnw-wine-finder__question-title">
                <?php echo esc_html__('Tell us a little more', 'my-next-wine-for-woocommerce'); ?>
              </legend>

              <p class="mnw-wine-finder__question-help">
                <?php echo esc_html__('Share what you enjoy, anything you would rather avoid, and whether the wines are for a gift or special occasion.', 'my-next-wine-for-woocommerce'); ?>
              </p>

              <div class="mnw-wine-finder__preferences-panel">
                <div class="mnw-wine-finder__preferences-heading">
                  <label
                    class="mnw-wine-finder__preferences-label"
                    for="mnw-usual-wines-<?php echo esc_attr($widget_id); ?>"
                  >
                    <?php echo esc_html__('Your preferences', 'my-next-wine-for-woocommerce'); ?>
                  </label>
                  <span class="mnw-wine-finder__optional-label">
                    <?php echo esc_html__('Optional', 'my-next-wine-for-woocommerce'); ?>
                  </span>
                </div>

                <textarea
                  id="mnw-usual-wines-<?php echo esc_attr($widget_id); ?>"
                  class="mnw-field__control mnw-field__textarea mnw-wine-finder__preferences-input"
                  name="usualWines"
                  rows="5"
                  maxlength="500"
                  placeholder="<?php echo esc_attr__('For example: I like light Pinot Noir and crisp whites, dislike heavily oaked wines, and need one special bottle as a gift.', 'my-next-wine-for-woocommerce'); ?>"
                  aria-describedby="mnw-preferences-help-<?php echo esc_attr($widget_id); ?>"
                ></textarea>

                <p
                  id="mnw-preferences-help-<?php echo esc_attr($widget_id); ?>"
                  class="mnw-wine-finder__preferences-help"
                >
                  <?php echo esc_html__('A sentence is plenty. Leave this blank if you would like us to surprise you.', 'my-next-wine-for-woocommerce'); ?>
                </p>
              </div>

              <div class="mnw-wine-finder__wizard-actions">
                <button
                  class="mnw-wine-finder__secondary-button"
                  type="button"
                  data-mnw-wizard-back
                >
                  <?php echo esc_html__('Back', 'my-next-wine-for-woocommerce'); ?>
                </button>

                <button
                  class="mnw-wine-finder__primary-button"
                  type="button"
                  data-mnw-wizard-next
                >
                  <?php echo esc_html__('Next', 'my-next-wine-for-woocommerce'); ?>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10h11M11 6l4 4-4 4"/>
                  </svg>
                </button>
              </div>
            </fieldset>

            <fieldset
              class="mnw-wine-finder__fieldset mnw-wine-finder__wizard-step"
              data-mnw-wizard-step
              data-mnw-wizard-title="<?php echo esc_attr__('Food', 'my-next-wine-for-woocommerce'); ?>"
              data-mnw-wizard-food
              hidden
            >
              <legend class="mnw-wine-finder__question-title">
                <?php echo esc_html__('What are you pairing with?', 'my-next-wine-for-woocommerce'); ?>
              </legend>

              <p class="mnw-wine-finder__question-help">
                <?php echo esc_html__('Share any meals, dishes or snacks you would like us to match with a bottle.', 'my-next-wine-for-woocommerce'); ?>
              </p>

              <div class="mnw-wine-finder__pairing-panel">
                <div class="mnw-wine-finder__pairing-heading">
                  <label
                    class="mnw-wine-finder__pairing-label"
                    for="mnw-food-pairings-<?php echo esc_attr($widget_id); ?>"
                  >
                    <?php echo esc_html__('Food pairings', 'my-next-wine-for-woocommerce'); ?>
                  </label>
                  <span class="mnw-wine-finder__optional-label">
                    <?php echo esc_html__('Optional', 'my-next-wine-for-woocommerce'); ?>
                  </span>
                </div>

                <textarea
                  id="mnw-food-pairings-<?php echo esc_attr($widget_id); ?>"
                  class="mnw-field__control mnw-field__textarea mnw-wine-finder__pairing-input"
                  name="foodPairings"
                  rows="5"
                  maxlength="500"
                  placeholder="<?php echo esc_attr__('For example: roast lamb on Saturday, seafood, spicy food, or a cheese board.', 'my-next-wine-for-woocommerce'); ?>"
                  aria-describedby="mnw-pairing-help-<?php echo esc_attr($widget_id); ?>"
                ></textarea>

                <p
                  id="mnw-pairing-help-<?php echo esc_attr($widget_id); ?>"
                  class="mnw-wine-finder__pairing-help"
                >
                  <?php echo esc_html__('Add more than one dish if you need different bottles for different meals.', 'my-next-wine-for-woocommerce'); ?>
                </p>
              </div>

              <div class="mnw-wine-finder__wizard-actions">
                <button
                  class="mnw-wine-finder__secondary-button"
                  type="button"
                  data-mnw-wizard-back
                >
                  <?php echo esc_html__('Back', 'my-next-wine-for-woocommerce'); ?>
                </button>

                <button
                  class="mnw-wine-finder__primary-button"
                  type="submit"
                  data-mnw-submit
                >
                  <span data-mnw-submit-label><?php echo esc_html__('Find my wines', 'my-next-wine-for-woocommerce'); ?></span>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M4 10h11M11 6l4 4-4 4"/>
                  </svg>
                </button>
              </div>

              <p class="mnw-wine-finder__legal-copy">
                <?php echo esc_html__('Automated, AI-assisted guidance for people of legal drinking age. Do not enter names, contact details, health information or other sensitive personal data.', 'my-next-wine-for-woocommerce'); ?><br>
                <?php echo esc_html__('By selecting “Find my wines”, you agree to the', 'my-next-wine-for-woocommerce'); ?>
                <a href="<?php echo esc_url(MYNEXTWINE_WOO_USER_TERMS_URL); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html__('Wine Finder User Terms', 'my-next-wine-for-woocommerce'); ?></a>
                <?php echo esc_html__('and acknowledge the', 'my-next-wine-for-woocommerce'); ?>
                <a href="<?php echo esc_url(MYNEXTWINE_WOO_PRIVACY_URL); ?>" target="_blank" rel="noopener noreferrer"><?php echo esc_html__('Privacy Statement', 'my-next-wine-for-woocommerce'); ?></a>.
              </p>
            </fieldset>
          </form>

          <p
            class="mnw-wine-finder__status"
            data-mnw-status
            hidden
            tabindex="-1"
            role="status"
            aria-live="polite"
          ></p>

          <p
            class="mnw-wine-finder__error"
            data-mnw-error
            hidden
            tabindex="-1"
            role="alert"
          ></p>

          <section
            class="mnw-wine-finder__budget-guidance"
            data-mnw-budget-guidance
            hidden
            tabindex="-1"
            aria-live="polite"
          >
            <div class="mnw-wine-finder__budget-guidance-icon" aria-hidden="true">↗</div>
            <div class="mnw-wine-finder__budget-guidance-content">
              <strong><?php echo esc_html__('A little more budget is needed', 'my-next-wine-for-woocommerce'); ?></strong>
              <p data-mnw-budget-guidance-copy></p>
              <div class="mnw-wine-finder__budget-guidance-actions">
                <button
                  class="mnw-wine-finder__primary-button"
                  type="button"
                  data-mnw-try-suggested-budget
                ></button>
                <button
                  class="mnw-wine-finder__secondary-button"
                  type="button"
                  data-mnw-edit-preferences
                >
                  <?php echo esc_html__('Edit my request', 'my-next-wine-for-woocommerce'); ?>
                </button>
              </div>
            </div>
          </section>

          <div
            class="mnw-wine-finder__selection"
            data-mnw-selection
            hidden
            tabindex="-1"
          >
            <div class="mnw-wine-finder__selection-header">
              <div>
                <h3 class="mnw-wine-finder__selection-title">
                  <?php echo esc_html__('Your wine selection', 'my-next-wine-for-woocommerce'); ?>
                </h3>

                <p
                  class="mnw-wine-finder__selection-summary"
                  data-mnw-summary
                ></p>
              </div>

              <p
                class="mnw-wine-finder__selection-total"
                data-mnw-total
                aria-live="polite"
              ></p>
            </div>

            <section
              class="mnw-wine-finder__request-match"
              data-mnw-request-match
              hidden
              aria-live="polite"
            >
              <span class="mnw-wine-finder__request-match-icon" aria-hidden="true">✓</span>
              <div class="mnw-wine-finder__request-match-content">
                <strong data-mnw-request-match-title></strong>
                <div
                  class="mnw-wine-finder__request-match-items"
                  data-mnw-request-match-items
                ></div>
                <p
                  class="mnw-wine-finder__request-match-unmet"
                  data-mnw-request-match-unmet
                  hidden
                >
                  <span><?php echo esc_html__('Not fully matched:', 'my-next-wine-for-woocommerce'); ?></span>
                  <span data-mnw-request-match-unmet-copy></span>
                </p>
              </div>
            </section>

            <div
              class="mnw-wine-finder__budget-notice"
              data-mnw-budget-notice
              aria-live="polite"
              hidden
            >
              <strong data-mnw-budget-notice-title></strong>
              <p data-mnw-budget-notice-copy></p>
              <div class="mnw-wine-finder__budget-notice-actions">
                <button
                  class="mnw-wine-finder__secondary-button mnw-wine-finder__budget-toggle"
                  type="button"
                  data-mnw-show-budget-alternative
                  hidden
                >
                  <?php echo esc_html__('Show budget-friendly alternatives', 'my-next-wine-for-woocommerce'); ?>
                </button>

                <button
                  class="mnw-wine-finder__secondary-button mnw-wine-finder__budget-toggle"
                  type="button"
                  data-mnw-show-exact-selection
                  hidden
                >
                  <?php echo esc_html__('Show exact matches', 'my-next-wine-for-woocommerce'); ?>
                </button>

              </div>
            </div>

            <section class="mnw-wine-finder__refinement" data-mnw-refinement>
              <div class="mnw-wine-finder__refinement-heading">
                <h4><?php echo esc_html__('Want to adjust your selection?', 'my-next-wine-for-woocommerce'); ?></h4>
                <button
                  class="mnw-wine-finder__refinement-undo"
                  type="button"
                  data-mnw-refine-undo
                  hidden
                ><?php echo esc_html__('Undo last refinement', 'my-next-wine-for-woocommerce'); ?></button>
              </div>
              <form class="mnw-wine-finder__refinement-form" data-mnw-refine-form>
                <label class="mnw-visually-hidden" for="mnw-refine-<?php echo esc_attr($widget_id); ?>">
                  <?php echo esc_html__('How should we refine this selection?', 'my-next-wine-for-woocommerce'); ?>
                </label>
                <input
                  id="mnw-refine-<?php echo esc_attr($widget_id); ?>"
                  class="mnw-field__control mnw-wine-finder__refinement-input"
                  type="text"
                  maxlength="240"
                  autocomplete="off"
                  placeholder="<?php echo esc_attr__('Ask for cheaper bottles, more reds, or a different style…', 'my-next-wine-for-woocommerce'); ?>"
                  data-mnw-refine-input
                >
                <button
                  class="mnw-wine-finder__primary-button mnw-wine-finder__refinement-button"
                  type="submit"
                  data-mnw-refine-submit
                ><span data-mnw-refine-label><?php echo esc_html__('Refine', 'my-next-wine-for-woocommerce'); ?></span></button>
              </form>
              <div
                class="mnw-wine-finder__quick-budgets"
                data-mnw-retry-budget-controls
                hidden
              >
                <span class="mnw-wine-finder__quick-budgets-label">
                  <?php echo esc_html__('Or try a different budget', 'my-next-wine-for-woocommerce'); ?>
                </span>
                <div class="mnw-wine-finder__quick-budget-actions">
                  <button
                    class="mnw-wine-finder__secondary-button mnw-wine-finder__budget-retry"
                    type="button"
                    data-mnw-retry-lower-budget
                    hidden
                  ></button>
                  <button
                    class="mnw-wine-finder__secondary-button mnw-wine-finder__budget-retry"
                    type="button"
                    data-mnw-retry-higher-budget
                    hidden
                  ></button>
                </div>
              </div>
              <p
                class="mnw-wine-finder__refinement-status"
                data-mnw-refine-status
                role="status"
                aria-live="polite"
                hidden
              ></p>
              <div
                class="mnw-wine-finder__refinement-budget-confirmation"
                data-mnw-refinement-budget-confirmation
                role="region"
                aria-labelledby="mnw-refinement-budget-title-<?php echo esc_attr($widget_id); ?>"
                aria-live="polite"
                hidden
              >
                <strong
                  id="mnw-refinement-budget-title-<?php echo esc_attr($widget_id); ?>"
                  data-mnw-refinement-budget-title
                >
                  <?php echo esc_html__('This refinement is a little over budget', 'my-next-wine-for-woocommerce'); ?>
                </strong>
                <p data-mnw-refinement-budget-copy></p>
                <div class="mnw-wine-finder__refinement-budget-actions">
                  <button
                    class="mnw-wine-finder__primary-button"
                    type="button"
                    data-mnw-accept-refinement-budget
                  ><span data-mnw-accept-refinement-budget-label><?php echo esc_html__('Yes, use the higher budget', 'my-next-wine-for-woocommerce'); ?></span></button>
                  <button
                    class="mnw-wine-finder__secondary-button"
                    type="button"
                    data-mnw-decline-refinement-budget
                  ><?php echo esc_html__('No, keep current selection', 'my-next-wine-for-woocommerce'); ?></button>
                </div>
              </div>
            </section>

            <div
              class="mnw-wine-finder__results"
              data-mnw-results
            ></div>

            <div class="mnw-wine-finder__selection-toolbar">
              <div class="mnw-wine-finder__selected-summary">
                <span data-mnw-selected-count></span>
                <strong data-mnw-selected-total></strong>
                <span
                  class="mnw-wine-finder__selected-budget-status"
                  data-mnw-selected-budget-status
                  aria-live="polite"
                ></span>
              </div>

              <div class="mnw-wine-finder__actions">
                <button
                  class="mnw-wine-finder__secondary-button"
                  type="button"
                  data-mnw-start-again
                >
                  <?php echo esc_html__('Edit answers', 'my-next-wine-for-woocommerce'); ?>
                </button>

                <button
                  class="mnw-wine-finder__primary-button mnw-wine-finder__add-selected"
                  type="button"
                  data-mnw-add-selected
                >
                  <span data-mnw-add-selected-label><?php echo esc_html($button_label); ?></span>
                </button>
              </div>
            </div>

          </div>

          <p class="mnw-wine-finder__powered-by">
            <?php echo esc_html__('AI-assisted recommendations by', 'my-next-wine-for-woocommerce'); ?>
            <span><?php echo esc_html__('My Next Wine', 'my-next-wine-for-woocommerce'); ?></span>.
            <?php echo esc_html__('Wine is sold and fulfilled by this shop.', 'my-next-wine-for-woocommerce'); ?>
          </p>

        </div>

        <div
          class="mnw-wine-quick-view"
          data-mnw-quick-view
          aria-hidden="true"
          hidden
        >
          <button
            class="mnw-wine-quick-view__backdrop"
            type="button"
            data-mnw-quick-view-close
            aria-label="<?php echo esc_attr__('Close wine details', 'my-next-wine-for-woocommerce'); ?>"
          ></button>

          <section
            class="mnw-wine-quick-view__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mnw-quick-view-title-<?php echo esc_attr($widget_id); ?>"
          >
            <button
              class="mnw-wine-quick-view__close"
              type="button"
              data-mnw-quick-view-close
              aria-label="<?php echo esc_attr__('Close wine details', 'my-next-wine-for-woocommerce'); ?>"
            >
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="m5 5 10 10M15 5 5 15"/>
              </svg>
            </button>

            <div class="mnw-wine-quick-view__image-wrap">
              <img
                class="mnw-wine-quick-view__image"
                data-mnw-quick-view-image
                width="640"
                height="640"
                alt=""
                hidden
              >
              <span data-mnw-quick-view-image-fallback><?php echo esc_html__('Wine', 'my-next-wine-for-woocommerce'); ?></span>
            </div>

            <div class="mnw-wine-quick-view__content">
              <h3
                id="mnw-quick-view-title-<?php echo esc_attr($widget_id); ?>"
                class="mnw-wine-quick-view__title"
                data-mnw-quick-view-title
              ></h3>
              <p
                class="mnw-wine-quick-view__price"
                data-mnw-quick-view-price
              ></p>
              <section
                class="mnw-wine-quick-view__reason"
                data-mnw-quick-view-reason-row
                hidden
              >
                <div
                  class="mnw-wine-quick-view__reason-tags"
                  data-mnw-quick-view-reason-tags
                  hidden
                ></div>
                <span data-mnw-quick-view-reason-label><?php echo esc_html__('Why it fits', 'my-next-wine-for-woocommerce'); ?></span>
                <p data-mnw-quick-view-reason></p>
              </section>
              <p class="mnw-wine-quick-view__rating" data-mnw-quick-view-rating-row hidden>
                <span><?php echo esc_html__('My Next Wine rating', 'my-next-wine-for-woocommerce'); ?></span>
                <strong data-mnw-quick-view-rating></strong>
              </p>
              <dl
                class="mnw-wine-quick-view__details"
                data-mnw-quick-view-details
                hidden
              >
                <div class="mnw-wine-quick-view__detail" data-mnw-quick-view-producer-row hidden>
                  <dt><?php echo esc_html__('Producer', 'my-next-wine-for-woocommerce'); ?></dt>
                  <dd data-mnw-quick-view-producer></dd>
                </div>
                <div class="mnw-wine-quick-view__detail" data-mnw-quick-view-region-row hidden>
                  <dt><?php echo esc_html__('Region', 'my-next-wine-for-woocommerce'); ?></dt>
                  <dd data-mnw-quick-view-region></dd>
                </div>
                <div class="mnw-wine-quick-view__detail" data-mnw-quick-view-country-row hidden>
                  <dt><?php echo esc_html__('Country', 'my-next-wine-for-woocommerce'); ?></dt>
                  <dd data-mnw-quick-view-country></dd>
                </div>
                <div class="mnw-wine-quick-view__detail" data-mnw-quick-view-grapes-row hidden>
                  <dt><?php echo esc_html__('Grapes', 'my-next-wine-for-woocommerce'); ?></dt>
                  <dd data-mnw-quick-view-grapes></dd>
                </div>
              </dl>
              <p
                class="mnw-wine-quick-view__description"
                data-mnw-quick-view-description
              ></p>
              <section class="mnw-wine-quick-view__mnw-note" data-mnw-quick-view-wine-note-row hidden>
                <p><?php echo esc_html__('My Next Wine note', 'my-next-wine-for-woocommerce'); ?></p>
                <div data-mnw-quick-view-wine-note></div>
              </section>
            </div>

            <div class="mnw-wine-note-popup" data-mnw-note-popup aria-hidden="true" hidden>
              <button
                class="mnw-wine-note-popup__backdrop"
                type="button"
                data-mnw-note-popup-close
                aria-label="<?php echo esc_attr__('Close note', 'my-next-wine-for-woocommerce'); ?>"
              ></button>
              <section
                class="mnw-wine-note-popup__panel"
                role="dialog"
                aria-modal="false"
                aria-labelledby="mnw-note-popup-title-<?php echo esc_attr($widget_id); ?>"
              >
                <button
                  class="mnw-wine-note-popup__close"
                  type="button"
                  data-mnw-note-popup-close
                  aria-label="<?php echo esc_attr__('Close note', 'my-next-wine-for-woocommerce'); ?>"
                >
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="m5 5 10 10M15 5 5 15"/>
                  </svg>
                </button>
                <p class="mnw-wine-note-popup__eyebrow"><?php echo esc_html__('My Next Wine note', 'my-next-wine-for-woocommerce'); ?></p>
                <h4 id="mnw-note-popup-title-<?php echo esc_attr($widget_id); ?>" data-mnw-note-popup-title></h4>
                <p data-mnw-note-popup-copy></p>
              </section>
            </div>
          </section>
        </div>
      </section>
    </div>
  </dialog>
</div>
