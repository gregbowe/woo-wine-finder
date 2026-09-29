(() => {
  "use strict";

  const STATIC_WIDGET_DEFAULTS = Object.freeze({
    "widget.static.wine_finder": "Wine finder",
    "widget.static.wine_picked_for_you": "Wine, picked for you.",
    "widget.static.question_1_of_4": "Question 1 of 4",
    "widget.static.what_mix_would_you_like": "What mix would you like?",
    "widget.static.choose_1_to_12_bottles_across_the_categories_available_in_this_shop": "Choose 1 to 12 bottles across the categories available in this shop.",
    "widget.static.red": "Red",
    "widget.static.white": "White",
    "widget.static.ros": "Rosé",
    "widget.static.sparkling": "Sparkling",
    "widget.static.orange_skin_contact": "Orange/Skin-contact",
    "widget.static.p_t_nat": "Pét-nat",
    "widget.static.sherry": "Sherry",
    "widget.static.other_fortified": "Other fortified",
    "widget.static.dessert": "Dessert",
    "widget.static.6_bottles_selected": "6 bottles selected",
    "widget.static.next": "Next",
    "widget.static.what_is_your_total_budget": "What is your total budget?",
    "widget.static.loading_this_shop_s_currency_and_spend_limits": "Loading this shop's currency and spend limits.",
    "widget.static.total_budget": "Total budget",
    "widget.static.quick_choices": "Quick choices",
    "widget.static.back": "Back",
    "widget.static.tell_us_a_little_more": "Tell us a little more",
    "widget.static.share_what_you_enjoy_anything_you_would_rather_avoid_and_whether_the": "Share what you enjoy, anything you would rather avoid, and whether the wines are for a gift or special occasion.",
    "widget.static.your_preferences": "Your preferences",
    "widget.static.optional": "Optional",
    "widget.static.a_sentence_is_plenty_leave_this_blank_if_you_would_like_us_to_surpri": "A sentence is plenty. Leave this blank if you would like us to surprise you.",
    "widget.static.what_are_you_pairing_with": "What are you pairing with?",
    "widget.static.share_any_meals_dishes_or_snacks_you_would_like_us_to_match_with_a_b": "What are you eating? Tell us about the dish, including any sauce or spice.",
    "widget.static.food_pairings": "Food pairings",
    "widget.static.add_more_than_one_dish_if_you_need_different_bottles_for_different_m": "Add more than one dish if you need different bottles for different meals.",
    "widget.static.find_my_wines": "Find my wines",
    "widget.static.automated_ai_assisted_guidance_for_people_of_legal_drinking_age_do_n": "Automated, AI-assisted guidance for people of legal drinking age. Do not enter names, contact details, health information or other sensitive personal data.",
    "widget.static.by_selecting_find_my_wines_you_agree_to_the": "By selecting “Find my wines”, you agree to the",
    "widget.static.wine_finder_user_terms": "Wine Finder User Terms",
    "widget.static.and_acknowledge_the": "and acknowledge the",
    "widget.static.privacy_statement": "Privacy Statement",
    "widget.static.a_little_more_budget_is_needed": "A little more budget is needed",
    "widget.static.edit_my_request": "Edit my request",
    "widget.static.your_wine_selection": "Your wines",
    "widget.static.not_fully_matched": "A compromise on:",
    "widget.static.show_budget_friendly_alternatives": "Show budget-friendly alternatives",
    "widget.static.show_exact_matches": "Back to the first selection",
    "widget.static.want_to_adjust_your_selection": "Want to change anything?",
    "widget.static.undo_last_refinement": "Undo last change",
    "widget.static.how_should_we_refine_this_selection": "What would you like to change?",
    "widget.static.refine": "Make changes",
    "widget.static.or_try_a_different_budget": "Or try a different budget",
    "widget.static.this_refinement_is_a_little_over_budget": "This change would cost more",
    "widget.static.yes_use_the_higher_budget": "Yes, use the higher budget",
    "widget.static.no_keep_current_selection": "No, keep current selection",
    "widget.static.edit_answers": "Edit answers",
    "widget.static.ai_assisted_recommendations_by": "AI-assisted recommendations by",
    "widget.static.my_next_wine": "My Next Wine",
    "widget.static.wine_is_sold_and_fulfilled_by_this_shop": ". Wine is sold and fulfilled by this shop.",
    "widget.static.wine": "Wine",
    "widget.static.why_it_fits": "About this wine",
    "widget.static.my_next_wine_rating": "My Next Wine rating",
    "widget.static.producer": "Producer",
    "widget.static.region": "Region",
    "widget.static.country": "Country",
    "widget.static.grapes": "Grapes",
    "widget.static.my_next_wine_note": "My Next Wine note",
    "widget.static.close_wine_finder": "Close wine finder",
    "widget.static.bottle_mix": "Bottle mix",
    "widget.static.budget": "Budget",
    "widget.static.your_taste": "Your taste",
    "widget.static.for_example_i_like_light_pinot_noir_and_crisp_whites_dislike_heavily": "For example: I like light Pinot Noir and crisp whites, dislike heavily oaked wines, and need one special bottle as a gift.",
    "widget.static.food": "Food",
    "widget.static.for_example_roast_lamb_on_saturday_seafood_spicy_food_or_a_cheese_bo": "For example: roast lamb on Saturday, seafood, spicy food, or a cheese board.",
    "widget.static.ask_for_cheaper_bottles_more_reds_or_a_different_style": "Ask for cheaper bottles, more reds, or a different style…",
    "widget.static.close_wine_details": "Close wine details",
    "widget.static.close_note": "Close note",
    "widget.static.not_sure_what_to_choose": "Not sure what to choose?",
    "widget.static.build_my_wine_selection": "Build my wine selection",
    "widget.static.a_complete_selection_from_our_available_wines_built_around_your_budg": "A complete selection from our available wines, built around your budget, preferences and occasion.",
    "widget.static.add_selected_wines_to_my_basket": "Add selected wines to my basket",
    "widget.static.add_selected_to_basket": "Add selected to basket",
  });

  const STATIC_WIDGET_KEYS_BY_TEXT = new Map(
    Object.entries(STATIC_WIDGET_DEFAULTS).map(([key, value]) => [String(value).trim(), key])
  );
  let widgetMessages = Object.freeze({});
  let widgetUiLocale = "en";

  const formatWidgetMessage = (template, values = {}) =>
    Object.entries(values).reduce(
      (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
      String(template ?? "")
    );

  const t = (key, fallback, values = {}) => formatWidgetMessage(
    Object.prototype.hasOwnProperty.call(widgetMessages, key)
      ? widgetMessages[key]
      : (fallback ?? STATIC_WIDGET_DEFAULTS[key] ?? key),
    values
  );

  const DYNAMIC_WIDGET_KEYS_BY_TEXT = new Map([
    ["Understanding your preferences…", "widget.loading.understanding"],
    ["Checking our available wines…", "widget.loading.checking"],
    ["Balancing your bottle mix and budget…", "widget.loading.balancing"],
    ["Building your selection…", "widget.loading.building"],
    ["We could not complete that request. Please try again.", "widget.error.generic_request"],
    ["ten percent lower", "widget.budget.ten_percent_lower"],
    ["ten percent higher", "widget.budget.ten_percent_higher"],
    ["Updating budget…", "widget.budget.updating"],
    ["We could not build a complete selection at that budget. Try increasing it or changing your request.", "widget.budget.incomplete_increase"],
    ["We could not build a complete selection at that budget. Please edit your wine preferences or bottle mix and try again.", "widget.budget.incomplete_edit"],
    ["Chosen for you", "widget.match.matched"],
    ["Chosen from wines currently in stock.", "widget.match.current_stock"],
    ["Other wines to consider", "widget.match.closest_alternatives"],
    ["Another selection to consider", "widget.match.closest_complete"],
    ["A note about your wines", "widget.match.substitutions"],
    ["These wines are over budget", "widget.match.exact_over_budget"],
    ["Finding wines…", "widget.recommendation.finding"],
    ["The wine finder took too long to respond. Please try again.", "widget.recommendation.timeout"],
    ["The wine finder is temporarily unavailable. Please try again shortly.", "widget.recommendation.storage_unavailable"],
    ["No suitable wines were found for those answers. Try a slightly larger budget or different mix.", "widget.recommendation.none"],
    ["The wine finder response was incomplete. Please try again.", "widget.recommendation.incomplete"],
    ["We could not build the wine selection.", "widget.recommendation.failed"],
    ["Finding another…", "widget.swap.finding"],
    ["The wine swap took too long. Please try again.", "widget.swap.timeout"],
    ["No alternative wine was returned. Please try again.", "widget.swap.none"],
    ["That wine could not be swapped. Please try again.", "widget.swap.failed"],
    ["This change would cost more", "widget.refine.over_budget"],
    ["Choosing your wines again…", "widget.refine.running"],
    ["Making changes…", "widget.refine.short"],
    ["Your wines have been updated.", "widget.refine.done"],
    ["That took too long. We have kept your current wines.", "widget.refine.timeout"],
    ["Tell us what you want to change.", "widget.refine.tell_change"],
    ["No changes made. Your current selection has been kept.", "widget.refine.no_changes"],
    ["Last change undone.", "widget.refine.undone"],
    ["Adding to basket…", "widget.cart.adding"],
    ["The wines could not be added to the basket. Please try again.", "widget.cart.failed"],
    ["This shop's Wine Finder configuration is unavailable.", "widget.config.unavailable"],
    ["This shop's currency and spend limits are not configured.", "widget.config.currency_unavailable"],
    ["The linked merchant currency range is invalid.", "widget.config.invalid_range"],
    ["The Wine Finder configuration endpoint is missing.", "widget.config.endpoint_missing"],
    ["The wine finder configuration took too long to load.", "widget.config.timeout"],
    ["The available bottle categories are invalid. Refresh and try again.", "widget.validation.categories_invalid"],
    ["Every bottle mix value must be a whole number of zero or more.", "widget.validation.mix_whole_numbers"],
    ["One of your answers is too long.", "widget.validation.answer_too_long"],
    ["Why we picked it", "widget.quick_view.why"],
    ["Quick view", "widget.quick_view.label"],
    ["Select at least one wine", "widget.selection.select_one"],
    ["Add back", "widget.selection.add_back"],
    ["On budget", "widget.selection.on_budget"],
    ["The retry budget is invalid.", "widget.retry.invalid"],
    ["We could not finish that change. We have kept your current wines.", "widget.refine.response_incomplete"],
    ["That change included a wine type this shop does not offer. We have kept your current wines.", "widget.refine.category_changed"],
    ["We could not make that change. We have kept your current wines.", "widget.refine.response_invalid"],
    ["We could not make that change.", "widget.refine.failed"],
    ["One recommended wine is temporarily unavailable. Change your answers and try again.", "widget.cart.unavailable"],
    ["The basket took too long to respond. Please try again.", "widget.cart.timeout"],
    ["The service returned an unexpected response. Please try again.", "widget.http.unexpected"],
    ["The shop's Wine Finder categories are invalid.", "widget.categories.shop_invalid"],
    ["The shop must configure at least two valid Wine Finder categories.", "widget.categories.minimum"],
    ["Red", "widget.category.red.label"],
    ["reds", "widget.category.red.plural"],
    ["White", "widget.category.white.label"],
    ["whites", "widget.category.white.plural"],
    ["Rosé", "widget.category.rose.label"],
    ["rosés", "widget.category.rose.plural"],
    ["Sparkling", "widget.category.sparkling.label"],
    ["sparkling wines", "widget.category.sparkling.plural"],
    ["Orange/Skin-contact", "widget.category.orange.label"],
    ["orange wines", "widget.category.orange.plural"],
    ["Pét-nat", "widget.category.petNat.label"],
    ["pét-nats", "widget.category.petNat.plural"],
    ["Sherry", "widget.category.sherry.label"],
    ["sherries", "widget.category.sherry.plural"],
    ["Other fortified", "widget.category.otherFortified.label"],
    ["fortified wines", "widget.category.otherFortified.plural"],
    ["Dessert", "widget.category.dessert.label"],
    ["dessert wines", "widget.category.dessert.plural"],
    ["other bottles", "widget.category.other_bottles"],
    ["The linked merchant currency is invalid.", "widget.config.invalid_currency"],
    ["No further description is available for this wine.", "widget.wine.no_description"],
    ["We could not give you everything you asked for at this price. These alternatives stay within your budget.", "widget.alternative.within_budget"],
    ["We have stayed within your budget, with the compromises noted above.", "widget.alternative.closest_within"],
    ["Minimum", "widget.budget.minimum"],
    ["Suggested", "widget.budget.suggested"],
    ["Add", "widget.action.add"],
    ["Remove", "widget.action.remove"],
    ["bottle", "widget.unit.bottle"],
    ["bottles", "widget.unit.bottles"],
    ["Included", "widget.selection.included"],
    ["Removed", "widget.selection.removed"],
    ["Swap", "widget.action.swap"],
    ["wine", "widget.unit.wine"],
    ["This swap is a little over budget", "widget.swap.over_budget"],
    ["There are a few compromises here. Please check the notes before adding these wines to your basket.", "widget.match.partial_fallback"],
  ]);

  const translateBudgetQualifier = (value) => {
    const normalised = String(value || "").trim().toLowerCase();
    if (normalised === "minimum") return t("widget.budget.minimum", "Minimum");
    if (normalised === "suggested") return t("widget.budget.suggested", "Suggested");
    return value;
  };

  const translateAction = (value) => String(value || "").trim().toLowerCase() === "remove"
    ? t("widget.action.remove", "Remove")
    : t("widget.action.add", "Add");

  const translateBottleUnit = (value) => String(value || "").trim().toLowerCase() === "bottle"
    ? t("widget.unit.bottle", "bottle")
    : t("widget.unit.bottles", "bottles");

  const DYNAMIC_WIDGET_PATTERNS = [
    [/^Decrease total budget by (.+) to (.+)$/, "widget.budget.decrease_to", "Decrease total budget by {amount} to {total}", (m) => ({ amount: m[1], total: m[2] })],
    [/^Decrease total budget by (.+)$/, "widget.budget.decrease_by", "Decrease total budget by {amount}", (m) => ({ amount: m[1] })],
    [/^Increase total budget by (.+) to (.+)$/, "widget.budget.increase_to", "Increase total budget by {amount} to {total}", (m) => ({ amount: m[1], total: m[2] })],
    [/^Increase total budget by (.+)$/, "widget.budget.increase_by", "Increase total budget by {amount}", (m) => ({ amount: m[1] })],
    [/^About (.+) per bottle$/, "widget.budget.about_per_bottle", "About {amount} per bottle", (m) => ({ amount: m[1] })],
    [/^Use (minimum|suggested) total budget of (.+)$/i, "widget.budget.use_qualified", "Use {qualifier} total budget of {amount}", (m) => ({ qualifier: translateBudgetQualifier(m[1]).toLocaleLowerCase(widgetUiLocale), amount: m[2] })],
    [/^Use total budget of (.+)$/, "widget.budget.use", "Use total budget of {amount}", (m) => ({ amount: m[1] })],
    [/^(.+) (Minimum|Suggested)$/, "widget.budget.choice_qualified", "{amount} {qualifier}", (m) => ({ amount: m[1], qualifier: translateBudgetQualifier(m[2]) })],
    [/^Question (\d+) of (\d+)$/, "widget.wizard.progress", "Question {current} of {total}", (m) => ({ current: m[1], total: m[2] })],
    [/^Try (.+) budget$/, "widget.budget.try", "Try {amount} budget", (m) => ({ amount: m[1] })],
    [/^Try (.+) \(([-+−]\d+%)\)$/, "widget.budget.try_change", "Try {amount} ({change})", (m) => ({ amount: m[1], change: m[2] })],
    [/^Try a budget of (.+), (ten percent lower|ten percent higher)\.$/, "widget.budget.try_change_accessible", "Try a budget of {amount}, {change}.", (m) => ({ amount: m[1], change: t(DYNAMIC_WIDGET_KEYS_BY_TEXT.get(m[2]) || "", m[2]) })],
    [/^Rebuilding your current selection around (.+)…$/, "widget.budget.rebuilding", "Rebuilding your current selection around {amount}…", (m) => ({ amount: m[1] })],
    [/^Your selection has been rebuilt around (.+)\.$/, "widget.budget.rebuilt", "Your selection has been rebuilt around {amount}.", (m) => ({ amount: m[1] })],
    [/^Rebuilding your selection around (.+)…$/, "widget.refine.rebuilding", "Rebuilding your selection around {amount}…", (m) => ({ amount: m[1] })],
    [/^Your selection now uses a budget of (.+)\.$/, "widget.refine.new_budget", "Your selection now uses a budget of {amount}.", (m) => ({ amount: m[1] })],
    [/^We do not have enough exact matches in stock\. A complete alternative selection starts at (.+?)(?: — (.+) above your current budget)?\.$/, "widget.budget.guidance_start", "We cannot put together everything you asked for from the wines in stock. An alternative selection starts at {amount}{difference}.", (m) => ({ amount: m[1], difference: m[2] ? t("widget.budget.guidance_difference", " — {amount} above your current budget", { amount: m[2] }) : "" })],
    [/^We replaced unavailable or expensive exact matches with similar styles\. Total (.+?)(?: — (.+) under budget)?\.$/, "widget.alternative.replaced", "We have chosen alternatives for the wines we could not include. Total {total}{difference}.", (m) => ({ total: m[1], difference: m[2] ? t("widget.alternative.under_difference", " — {amount} under budget", { amount: m[2] }) : "" })],
    [/^Show exact (.+) selection$/, "widget.alternative.show_exact", "Back to the {amount} selection", (m) => ({ amount: m[1] })],
    [/^We do not have enough exact matches in stock\. This selection is (.+) — (.+) over your (.+) budget\.$/, "widget.alternative.not_enough_exact", "We could not include everything you asked for. These wines cost {total}, which is {difference} over your {budget} budget.", (m) => ({ total: m[1], difference: m[2], budget: m[3] })],
    [/^These are the closest suitable alternatives from current stock\. The total is (.+) — (.+) over budget\.$/, "widget.alternative.closest_over", "These alternatives cost {total}, which is {difference} over budget.", (m) => ({ total: m[1], difference: m[2] })],
    [/^Exact matches total (.+) — (.+) over your (.+) budget\.$/, "widget.budget.exact_total", "These wines cost {total}, which is {difference} over your {budget} budget.", (m) => ({ total: m[1], difference: m[2], budget: m[3] })],
    [/^A similar option is (.+)\.$/, "widget.budget.similar_option", "A similar option is {amount}.", (m) => ({ amount: m[1] })],
    [/^View (.+) alternative$/, "widget.alternative.view", "View {amount} alternative", (m) => ({ amount: m[1] })],
    [/^The minimum budget for (\d+) (bottle|bottles) is (.+)\.$/, "widget.validation.minimum_budget", "The minimum budget for {count} {bottles} is {amount}.", (m) => ({ count: m[1], bottles: translateBottleUnit(m[2]), amount: m[3] })],
    [/^The maximum supported budget is (.+)\.$/, "widget.validation.maximum_budget", "The maximum supported budget is {amount}.", (m) => ({ amount: m[1] })],
    [/^The bottle mix adds up to (\d+), not (\d+)\.$/, "widget.validation.mix_total", "The bottle mix adds up to {actual}, not {expected}.", (m) => ({ actual: m[1], expected: m[2] })],
    [/^Quick view: (.+)$/, "widget.quick_view.title", "Quick view: {wine}", (m) => ({ wine: m[1] })],
    [/^Read the My Next Wine note for (.+)$/, "widget.quick_view.note_for", "Read the My Next Wine note for {name}", (m) => ({ name: m[1] })],
    [/^Producer: (.+)$/, "widget.quick_view.producer", "Producer: {value}", (m) => ({ value: m[1] })],
    [/^Region: (.+)$/, "widget.quick_view.region", "Region: {value}", (m) => ({ value: m[1] })],
    [/^Country: (.+)$/, "widget.quick_view.country", "Country: {value}", (m) => ({ value: m[1] })],
    [/^Grape: (.+)$/, "widget.quick_view.grape", "Grape: {value}", (m) => ({ value: m[1] })],
    [/^Swap (.+) with another$/, "widget.quick_view.swap", "Swap {wine} with another", (m) => ({ wine: m[1] })],
    [/^Remove (.+) from selection$/, "widget.selection.remove", "Remove {wine} from selection", (m) => ({ wine: m[1] })],
    [/^Add (.+) back to selection$/, "widget.selection.add_back_wine", "Add {wine} back to selection", (m) => ({ wine: m[1] })],
    [/^(\d+) bottle selected$/, "widget.selection.count_one", "{count} bottle selected", (m) => ({ count: m[1] })],
    [/^(\d+) bottles selected$/, "widget.selection.count_many", "{count} bottles selected", (m) => ({ count: m[1] })],
    [/^(.+) of (.+)$/, "widget.selection.total_of_budget", "{total} of {budget}", (m) => ({ total: m[1], budget: m[2] })],
    [/^Add (\d+) wine to basket$/, "widget.selection.add_one", "Add {count} wine to basket", (m) => ({ count: m[1] })],
    [/^Add (\d+) wines to basket$/, "widget.selection.add_many", "Add {count} wines to basket", (m) => ({ count: m[1] })],
    [/^(\d+) bottle$/, "widget.selection.bottle_one", "{count} bottle", (m) => ({ count: m[1] })],
    [/^(\d+) bottles$/, "widget.selection.bottle_many", "{count} bottles", (m) => ({ count: m[1] })],
    [/^(.+) under budget$/, "widget.selection.under_budget", "{amount} under budget", (m) => ({ amount: m[1] })],
    [/^(.+) over budget$/, "widget.selection.over_budget", "{amount} over budget", (m) => ({ amount: m[1] })],
    [/^That refinement would need (.+), (.+) above your current (.+) budget\. Is that okay\?$/, "widget.refine.budget_question", "That change would cost {suggested}, which is {difference} above your {current} budget. Is that okay?", (m) => ({ suggested: m[1], difference: m[2], current: m[3] })],
    [/^The nearest available replacement needs (.+), (.+) above your current (.+) budget\. Is that okay\?$/, "widget.swap.budget_question", "The nearest available replacement needs {suggested}, {difference} above your current {current} budget. Is that okay?", (m) => ({ suggested: m[1], difference: m[2], current: m[3] })],
    [/^Yes, use (.+)$/, "widget.refine.accept_budget", "Yes, use {amount}", (m) => ({ amount: m[1] })],
    [/^That exact refinement needs at least (.+)\. Your current selection has been kept\.$/, "widget.refine.exact_needs", "That change needs at least {amount}. We have kept your current wines.", (m) => ({ amount: m[1] })],
    [/^For (\d+) (bottle|bottles), the minimum budget is (.+)\.$/, "widget.budget.minimum_for", "For {count} {bottles}, the minimum budget is {amount}.", (m) => ({ count: m[1], bottles: translateBottleUnit(m[2]), amount: m[3] })],
    [/^(.+) bottles$/, "widget.category.bottles", "{label} bottles", (m) => ({ label: m[1] })],
    [/^(Add|Remove) one (.+) bottle$/, "widget.category.adjust", "{action} one {label} bottle", (m) => ({ action: translateAction(m[1]), label: m[2] })],
    [/^(\d+) bottle selected$/, "widget.allocation.selected_one", "{count} bottle selected", (m) => ({ count: m[1] })],
    [/^(\d+) bottles selected$/, "widget.allocation.selected_many", "{count} bottles selected", (m) => ({ count: m[1] })],
    [/^(.+)\. Choose at least (\d+)\.$/, "widget.allocation.choose_min", "{labels}. Choose at least {min}.", (m) => ({ labels: m[1], min: m[2] })],
    [/^(.+)\. Choose no more than (\d+)\.$/, "widget.allocation.choose_max", "{labels}. Choose no more than {max}.", (m) => ({ labels: m[1], max: m[2] })],
    [/^The linked merchant (.+) is invalid\.$/, "widget.config.invalid_value", "The linked merchant {label} is invalid.", (m) => ({ label: m[1] })],
    [/^Sub: (.+)$/, "widget.recommendation.substitute", "Instead of: {label}", (m) => ({ label: m[1] })],
    [/^Considered substitute for (.+)$/, "widget.recommendation.substitute_title", "An alternative for {label}", (m) => ({ label: m[1] })],
    [/^Keep the refinement to (\d+) characters or fewer\.$/, "widget.refine.character_limit", "Please keep your message to {max} characters or fewer.", (m) => ({ max: m[1] })]
  ];

  const translateKnownWidgetText = (value) => {
    const text = String(value ?? "").trim();
    if (!text) return text;
    const staticKey = STATIC_WIDGET_KEYS_BY_TEXT.get(text);
    if (staticKey) return t(staticKey, text);
    const dynamicKey = DYNAMIC_WIDGET_KEYS_BY_TEXT.get(text);
    if (dynamicKey) return t(dynamicKey, text);
    for (const [pattern, key, fallback, values] of DYNAMIC_WIDGET_PATTERNS) {
      const match = text.match(pattern);
      if (match) return t(key, fallback, values(match));
    }
    return text;
  };

  const localiseWidgetNode = (node) => {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;
    const original = String(node.textContent || "");
    const trimmed = original.trim();
    if (!trimmed) return;
    const translated = translateKnownWidgetText(trimmed);
    if (translated === trimmed) return;
    const start = original.indexOf(trimmed);
    node.textContent = original.slice(0, start) + translated + original.slice(start + trimmed.length);
  };

  const localiseWidgetElementAttributes = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return;
    ["aria-label", "placeholder", "title", "data-mnw-wizard-title"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const original = String(element.getAttribute(attribute) || "").trim();
      const translated = translateKnownWidgetText(original);
      if (translated !== original) element.setAttribute(attribute, translated);
    });
  };

  const observeWidgetTranslations = (root) => {
    if (!root || typeof MutationObserver !== "function" || root.mnwTranslationObserver) return;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") {
          localiseWidgetNode(mutation.target);
          return;
        }
        if (mutation.type === "attributes") {
          localiseWidgetElementAttributes(mutation.target);
          return;
        }
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            localiseWidgetNode(node);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            localiseWidgetElementAttributes(node);
            node.querySelectorAll?.("*").forEach(localiseWidgetElementAttributes);
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) localiseWidgetNode(walker.currentNode);
          }
        });
      });
    });
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["aria-label", "placeholder", "title", "data-mnw-wizard-title"]
    });
    root.mnwTranslationObserver = observer;
  };

  const requestedWidgetLocale = () => {
    const documentLocale = String(document.documentElement?.lang || "").trim();
    return documentLocale || String(navigator.language || "en").trim() || "en";
  };

  const endpointWithLocale = (endpoint) => {
    const url = new URL(endpoint, window.location.href);
    url.searchParams.set("locale", requestedWidgetLocale());
    return url.toString();
  };

  const applyStaticWidgetTranslations = (root) => {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) localiseWidgetNode(walker.currentNode);
    root.querySelectorAll("*").forEach(localiseWidgetElementAttributes);
    root.setAttribute("lang", widgetUiLocale);
  };

  const MIN_BOTTLE_COUNT = 1;
  const MAX_BOTTLE_COUNT = 12;
  const MAX_FREE_TEXT_LENGTH = 500;
  const MAX_REFINEMENT_LENGTH = 240;
  const DEFAULT_BUDGET_MULTIPLIER = 1.2;
  const DEFAULT_BUDGET_ROUNDING_UNIT = 10;
  // Temporary launch-stabilisation timeout. Leave five seconds of headroom
  // above the backend's 120-second recommendation deadline.
  const REQUEST_TIMEOUT_MS = 125000;
  const CART_TIMEOUT_MS = 15000;
  const SWAP_TIMEOUT_MS = 20000;
  const CONFIGURATION_TIMEOUT_MS = 10000;
  const MODAL_CLOSE_ANIMATION_MS = 190;
  const LOADING_MESSAGES = [
    "Understanding your preferences…",
    "Checking our available wines…",
    "Balancing your bottle mix and budget…",
    "Building your selection…"
  ];
  const CATEGORY_DEFINITIONS = Object.freeze([
    { key: "red", label: "Red", plural: "reds" },
    { key: "white", label: "White", plural: "whites" },
    { key: "rose", label: "Rosé", plural: "rosés" },
    { key: "sparkling", label: "Sparkling", plural: "sparkling wines" },
    { key: "orange", label: "Orange/Skin-contact", plural: "orange wines" },
    { key: "petNat", label: "Pét-nat", plural: "pét-nats" },
    { key: "sherry", label: "Sherry", plural: "sherries" },
    { key: "otherFortified", label: "Other fortified", plural: "fortified wines" },
    { key: "dessert", label: "Dessert", plural: "dessert wines" }
  ]);
  const LEGACY_WINE_CATEGORIES = Object.freeze(["red", "white", "sparkling", "dessert"]);
  let serviceLocale = null;

  const initialiseAllWidgets = () => {
    document.querySelectorAll("[data-mnw-widget]").forEach(initialiseWidget);
  };

  const normaliseBudgetButtonVisibility = (configuration = {}) => ({
    lower: configuration?.showBudgetDecrease !== false,
    higher: configuration?.showBudgetIncrease !== false
  });

  const visibleRetryBudgetChoices = (choices, visibility) => ({
    lower: visibility.lower ? choices.lower : null,
    higher: visibility.higher ? choices.higher : null
  });

  const WORKING_STAGES = Object.freeze({
    PREPARING: ["widget.working.preparing", "Getting started"],
    CATALOGUE: ["widget.working.catalogue", "Looking through the available wines"],
    SELECTING: ["widget.working.selecting", "Choosing bottles for you"],
    STORE_PALATE: ["widget.working.palate", "Considering the shop's recommendations"],
    VALUE: ["widget.working.value", "Considering value for money"],
    CHECKING: ["widget.working.checking", "Checking the bottles and total"],
    READY: ["widget.working.ready", "Getting your wines ready"]
  });

  // No timers invent stages or percentages. An unrecognised/missing state stays indeterminate.
  const normaliseWorkingProgress = (value) => {
    if (!value || typeof value !== "object") return null;
    const state = String(value.state || "");
    if (!["PENDING", "RUNNING", "COMPLETE", "FAILED", "UNAVAILABLE"].includes(state)) return null;
    const stage = Object.hasOwn(WORKING_STAGES, value.stage) ? value.stage : "PREPARING";
    const steps = Array.isArray(value.steps) ? [...new Set(value.steps.filter((step) =>
      Object.hasOwn(WORKING_STAGES, step) && step !== "READY"))].slice(0, 6) : [];
    return { state, stage, steps };
  };

  const createProgressId = () => {
    const crypto = globalThis.crypto;
    if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
    if (typeof crypto?.getRandomValues !== "function") return null;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  const withProgressId = (endpoint, id, base = globalThis.location?.href) => {
    if (!id) return endpoint;
    const url = new URL(endpoint, base);
    url.searchParams.set("progressId", id);
    return url.toString();
  };

  /** Poll metadata only, one request at a time. It cannot create/charge a recommendation. */
  const createProgressPoller = ({ endpoint, method = "GET", id, onUpdate,
    fetcher = (...args) => fetch(...args), scheduler = globalThis, base = globalThis.location?.href,
    interval = 1500, firstDelay = 800 }) => {
    let stopped = false, timer = null, abort = null, requestTimer = null, failures = 0, polls = 0;
    let unavailableResponses = 0;
    const stop = () => {
      stopped = true;
      if (timer !== null) scheduler.clearTimeout(timer);
      if (requestTimer !== null) scheduler.clearTimeout(requestTimer);
      timer = null; requestTimer = null;
      abort?.abort(); abort = null;
    };
    const unavailable = () => {
      if (stopped) return;
      // Losing optional metadata must not leave a frozen, misleading first stage on screen.
      stop();
      onUpdate({ state: "UNAVAILABLE", stage: "PREPARING", steps: [] });
    };
    const poll = async () => {
      if (stopped) return;
      if (++polls > 80) { unavailable(); return; }
      let nextDelay = interval;
      abort = new AbortController();
      requestTimer = scheduler.setTimeout(() => abort?.abort(), 4000);
      try {
        const url = new URL(endpoint, base);
        const options = { method, headers: { "Accept": "application/json" }, cache: "no-store", signal: abort.signal };
        if (method === "POST") {
          options.headers["Content-Type"] = "application/json";
          options.body = JSON.stringify({ progressId: id });
        } else {
          url.searchParams.set("progressId", id);
          url.searchParams.set("_", String(Date.now()));
        }
        const response = await fetcher(url.toString(), options);
        if (stopped) return;
        if (!response.ok) {
          // Old/mixed deployments and rate limits degrade to a spinner, not a failed lookup.
          if ([400, 401, 403, 404, 405, 429].includes(response.status)) { unavailable(); return; }
          throw new Error("Progress unavailable");
        }
        const snapshot = normaliseWorkingProgress(await response.json());
        if (stopped) return;
        if (!snapshot) throw new Error("Invalid progress metadata");
        failures = 0;
        onUpdate(snapshot);
        if (stopped) return; // onUpdate may finish/hide the underlying dialog.
        if (["COMPLETE", "FAILED"].includes(snapshot.state)) { stop(); return; }
        if (snapshot.state === "UNAVAILABLE") {
          // Temporary metadata failure is not completion of the recommendation.
          // Retry metadata only, bounded and sequential; never submit another lookup.
          if (++unavailableResponses >= 8) { stop(); return; }
          nextDelay = Math.min(10000, 2000 * (2 ** (unavailableResponses - 1)));
        } else {
          unavailableResponses = 0;
        }
      } catch (ignored) {
        if (!stopped && ++failures >= 3) { unavailable(); return; }
      } finally {
        if (requestTimer !== null) scheduler.clearTimeout(requestTimer);
        requestTimer = null; abort = null;
      }
      if (!stopped) timer = scheduler.setTimeout(poll, nextDelay);
    };
    if (endpoint && id) timer = scheduler.setTimeout(poll, firstDelay);
    else unavailable();
    return { stop, isStopped: () => stopped };
  };

  /** Separate top-layer dialog: visible even when the main Wine Finder is scrolled. */
  const createWorkingDialog = (root, parentDialog, options = {}) => {
    const doc = root.ownerDocument || document;
    const modal = doc.createElement("dialog");
    modal.className = "mnw-wine-finder__working";
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("data-mnw-working", "");
    const titleId = `${root.id || "mnw"}-working-title`;
    const title = doc.createElement("h2");
    title.id = titleId; title.tabIndex = -1;
    modal.setAttribute("aria-labelledby", titleId);
    const brand = doc.createElement("p");
    brand.className = "mnw-wine-finder__working-eyebrow";
    brand.textContent = t("widget.working.eyebrow", "Wine Finder");
    const close = doc.createElement("button");
    close.type = "button"; close.className = "mnw-wine-finder__working-close";
    close.setAttribute("aria-label", t("widget.working.hide", "Hide progress"));
    close.textContent = "×";
    const intro = doc.createElement("p"); intro.className = "mnw-wine-finder__working-intro";
    const live = doc.createElement("p");
    live.className = "mnw-wine-finder__working-status";
    live.setAttribute("role", "status"); live.setAttribute("aria-live", "polite"); live.setAttribute("aria-atomic", "true");
    const bar = doc.createElement("div"); bar.className = "mnw-wine-finder__working-bar";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-label", t("widget.working.progress", "Wine selection progress"));
    // Omit aria-valuenow: stage duration/percentage is not measurable.
    const steps = doc.createElement("ol"); steps.className = "mnw-wine-finder__working-steps";
    const hint = doc.createElement("p"); hint.className = "mnw-wine-finder__working-hint";
    hint.textContent = t("widget.working.hint", "You can hide this window while we finish.");
    modal.append(close, brand, title, intro, live, bar, steps, hint);
    root.append(modal);
    let poller = null, active = false, returnFocus = null, epoch = 0, lastView = "", destroyed = false;
    let parentInert = false;
    const label = (stage) => t(...WORKING_STAGES[stage]);
    const render = (snapshot) => {
      if (!active || destroyed || snapshot.state === "FAILED") return;
      const indeterminate = snapshot.state === "UNAVAILABLE" || snapshot.state === "PENDING";
      const stage = snapshot.state === "COMPLETE" ? "READY" : snapshot.stage;
      const caption = indeterminate ? t("widget.working.waiting", "We’re working on your wines") : label(stage);
      const reportedSteps = indeterminate ? [] : snapshot.steps;
      const signature = JSON.stringify([caption, reportedSteps]);
      if (signature === lastView) return;
      lastView = signature;
      live.textContent = caption;
      bar.setAttribute("aria-valuetext", caption);
      steps.replaceChildren();
      for (const step of reportedSteps) {
        const item = doc.createElement("li");
        item.textContent = label(step);
        item.className = step === stage ? "is-current" : "is-done";
        if (step === stage) item.setAttribute("aria-current", "step");
        steps.append(item);
      }
    };
    const hide = ({ restoreFocus = true } = {}) => {
      if (typeof modal.close === "function" && modal.open) modal.close();
      else modal.removeAttribute("open");
      if (parentDialog) parentDialog.inert = parentInert;
      if (restoreFocus) {
        if (returnFocus?.isConnected && !returnFocus.disabled) returnFocus.focus({ preventScroll: true });
        else if (parentDialog?.open) parentDialog.focus({ preventScroll: true });
      }
    };
    const finish = ({ restoreFocus = true } = {}) => {
      if (!active) return;
      active = false; epoch += 1; poller?.stop(); poller = null;
      hide({ restoreFocus });
    };
    close.addEventListener("click", () => { poller?.stop(); hide(); });
    modal.addEventListener("cancel", (event) => { event.preventDefault(); poller?.stop(); hide(); });
    modal.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); poller?.stop(); hide(); }
      else if (event.key === "Tab") {
        // The only interactive control is Hide progress; contain fallback-browser focus too.
        event.preventDefault(); close.focus();
      }
    });
    return {
      start(kind, requestEndpoint) {
        finish({ restoreFocus: false });
        if (destroyed) return requestEndpoint;
        active = true; const current = ++epoch; lastView = ""; returnFocus = doc.activeElement;
        parentInert = Boolean(parentDialog?.inert);
        brand.textContent = t("widget.working.eyebrow", "Wine Finder");
        close.setAttribute("aria-label", t("widget.working.hide", "Hide progress"));
        bar.setAttribute("aria-label", t("widget.working.progress", "Wine selection progress"));
        hint.textContent = t("widget.working.hint", "You can hide this window while we finish.");
        title.textContent = kind === "REFINE" ? t("widget.working.refine_title", "Updating your wines")
          : t("widget.working.title", "Choosing your wines");
        intro.textContent = kind === "REFINE"
          ? t("widget.working.refine_intro", "Your current wines will stay here until the new selection is ready.")
          : t("widget.working.intro", "We're putting your selection together.");
        render({ state: "PENDING", stage: "PREPARING", steps: [] });
        try { modal.showModal(); } catch (unsupported) { modal.setAttribute("open", ""); }
        if (parentDialog) parentDialog.inert = true;
        title.focus({ preventScroll: true });
        const id = createProgressId();
        poller = createProgressPoller({ endpoint: options.endpoint, method: options.method || "GET", id,
          onUpdate: (snapshot) => { if (active && epoch === current) render(snapshot); } });
        return withProgressId(requestEndpoint, id);
      },
      finish,
      destroy() { finish({ restoreFocus: false }); destroyed = true; modal.remove(); }
    };
  };

  const initialiseWidget = (root) => {
    if (root.dataset.mnwInitialised === "true") return;
    root.dataset.mnwInitialised = "true";

    const endpoint = root.dataset.endpoint;
    const configEndpoint = root.dataset.configEndpoint;
    const swapEndpoint = root.dataset.swapEndpoint;
    const refineEndpoint = root.dataset.refineEndpoint;
    const eventsEndpoint = root.dataset.eventsEndpoint;
    const analyticsEnabled = root.dataset.mnwAnalyticsEnabled === "true";
    const cartEndpoint = root.dataset.cartEndpoint;
    const wpNonce = root.dataset.mnwWpNonce;
    const dialog = root.querySelector("[data-mnw-dialog]");
    const openButton = root.querySelector("[data-mnw-open]");
    const closeButton = root.querySelector("[data-mnw-close]");
    const dialogScroll = root.querySelector("[data-mnw-dialog-scroll]");
    const form = root.querySelector("[data-mnw-form]");
    const submitButton = root.querySelector("[data-mnw-submit]");
    const submitLabel = root.querySelector("[data-mnw-submit-label]");
    const bottleCountInput = root.querySelector("[data-mnw-bottle-count]");
    const budgetInput = root.querySelector("[data-mnw-budget]");
    const budgetHelp = root.querySelector("[data-mnw-budget-help]");
    const budgetCurrencyElement = root.querySelector("[data-mnw-budget-currency]");
    const budgetDecreaseButton = root.querySelector("[data-mnw-budget-decrease]");
    const budgetIncreaseButton = root.querySelector("[data-mnw-budget-increase]");
    const budgetDecreaseAmount = root.querySelector("[data-mnw-budget-decrease-amount]");
    const budgetIncreaseAmount = root.querySelector("[data-mnw-budget-increase-amount]");
    const budgetPerBottle = root.querySelector("[data-mnw-budget-per-bottle]");
    const budgetQuickChoices = root.querySelector("[data-mnw-budget-quick-choices]");
    const breakdownInputs = Array.from(root.querySelectorAll("[data-mnw-breakdown]"));
    const allocationStatus = root.querySelector("[data-mnw-allocation-status]");
    const statusElement = root.querySelector("[data-mnw-status]");
    const errorElement = root.querySelector("[data-mnw-error]");
    const budgetGuidance = root.querySelector("[data-mnw-budget-guidance]");
    const budgetGuidanceCopy = root.querySelector("[data-mnw-budget-guidance-copy]");
    const trySuggestedBudgetButton = root.querySelector("[data-mnw-try-suggested-budget]");
    const editPreferencesButton = root.querySelector("[data-mnw-edit-preferences]");
    const selectionElement = root.querySelector("[data-mnw-selection]");
    const resultsElement = root.querySelector("[data-mnw-results]");
    const budgetImprovementElement = root.querySelector("[data-mnw-budget-improvement]");
    const summaryElement = root.querySelector("[data-mnw-summary]");
    const totalElement = root.querySelector("[data-mnw-total]");
    const requestMatch = root.querySelector("[data-mnw-request-match]");
    const requestMatchTitle = root.querySelector("[data-mnw-request-match-title]");
    const requestMatchItems = root.querySelector("[data-mnw-request-match-items]");
    const requestMatchUnmet = root.querySelector("[data-mnw-request-match-unmet]");
    const requestMatchUnmetCopy = root.querySelector("[data-mnw-request-match-unmet-copy]");
    const budgetNotice = root.querySelector("[data-mnw-budget-notice]");
    const budgetNoticeTitle = root.querySelector("[data-mnw-budget-notice-title]");
    const budgetNoticeCopy = root.querySelector("[data-mnw-budget-notice-copy]");
    const showBudgetAlternativeButton = root.querySelector("[data-mnw-show-budget-alternative]");
    const showExactSelectionButton = root.querySelector("[data-mnw-show-exact-selection]");
    const retryBudgetControls = root.querySelector("[data-mnw-retry-budget-controls]");
    const retryWithLowerBudgetButton = root.querySelector("[data-mnw-retry-lower-budget]");
    const retryWithHigherBudgetButton = root.querySelector("[data-mnw-retry-higher-budget]");
    const selectedCountElement = root.querySelector("[data-mnw-selected-count]");
    const selectedTotalElement = root.querySelector("[data-mnw-selected-total]");
    const selectedBudgetStatusElement = root.querySelector("[data-mnw-selected-budget-status]");
    const addSelectedButton = root.querySelector("[data-mnw-add-selected]");
    const addSelectedLabel = root.querySelector("[data-mnw-add-selected-label]");
    const refineForm = root.querySelector("[data-mnw-refine-form]");
    const refineInput = root.querySelector("[data-mnw-refine-input]");
    const refineSubmit = root.querySelector("[data-mnw-refine-submit]");
    const refineLabel = root.querySelector("[data-mnw-refine-label]");
    const refineStatus = root.querySelector("[data-mnw-refine-status]");
    const refineUndo = root.querySelector("[data-mnw-refine-undo]");
    const refinementBudgetConfirmation = root.querySelector("[data-mnw-refinement-budget-confirmation]");
    const refinementBudgetTitle = root.querySelector("[data-mnw-refinement-budget-title]");
    const refinementBudgetCopy = root.querySelector("[data-mnw-refinement-budget-copy]");
    const acceptRefinementBudgetButton = root.querySelector("[data-mnw-accept-refinement-budget]");
    const acceptRefinementBudgetLabel = root.querySelector("[data-mnw-accept-refinement-budget-label]");
    const declineRefinementBudgetButton = root.querySelector("[data-mnw-decline-refinement-budget]");
    const startAgainButton = root.querySelector("[data-mnw-start-again]");
    const progressForm = root.querySelector("[data-mnw-progress-form]");
    const progressResults = root.querySelector("[data-mnw-progress-results]");
    const progressCart = root.querySelector("[data-mnw-progress-cart]");
    const wizardSteps = Array.from(root.querySelectorAll("[data-mnw-wizard-step]"));
    const wizardCount = root.querySelector("[data-mnw-wizard-count]");
    const wizardTrack = root.querySelector("[data-mnw-wizard-track]");
    const wizardBar = root.querySelector("[data-mnw-wizard-bar]");
    const wizardProgress = root.querySelector("[data-mnw-wizard-progress]");
    const quickView = root.querySelector("[data-mnw-quick-view]");
    const quickViewCloseButtons = Array.from(root.querySelectorAll("[data-mnw-quick-view-close]"));
    const quickViewImage = root.querySelector("[data-mnw-quick-view-image]");
    const quickViewImageFallback = root.querySelector("[data-mnw-quick-view-image-fallback]");
    const quickViewTitle = root.querySelector("[data-mnw-quick-view-title]");
    const quickViewPrice = root.querySelector("[data-mnw-quick-view-price]");
    const quickViewReasonRow = root.querySelector("[data-mnw-quick-view-reason-row]");
    const quickViewReasonTags = root.querySelector("[data-mnw-quick-view-reason-tags]");
    const quickViewReasonLabel = root.querySelector("[data-mnw-quick-view-reason-label]");
    const quickViewReason = root.querySelector("[data-mnw-quick-view-reason]");
    const quickViewRatingRow = root.querySelector("[data-mnw-quick-view-rating-row]");
    const quickViewRating = root.querySelector("[data-mnw-quick-view-rating]");
    const quickViewDetails = root.querySelector("[data-mnw-quick-view-details]");
    const quickViewProducerRow = root.querySelector("[data-mnw-quick-view-producer-row]");
    const quickViewProducer = root.querySelector("[data-mnw-quick-view-producer]");
    const quickViewRegionRow = root.querySelector("[data-mnw-quick-view-region-row]");
    const quickViewRegion = root.querySelector("[data-mnw-quick-view-region]");
    const quickViewCountryRow = root.querySelector("[data-mnw-quick-view-country-row]");
    const quickViewCountry = root.querySelector("[data-mnw-quick-view-country]");
    const quickViewGrapesRow = root.querySelector("[data-mnw-quick-view-grapes-row]");
    const quickViewGrapes = root.querySelector("[data-mnw-quick-view-grapes]");
    const quickViewDescription = root.querySelector("[data-mnw-quick-view-description]");
    const quickViewWineNoteRow = root.querySelector("[data-mnw-quick-view-wine-note-row]");
    const quickViewWineNote = root.querySelector("[data-mnw-quick-view-wine-note]");
    const notePopup = root.querySelector("[data-mnw-note-popup]");
    const notePopupCloseButtons = Array.from(root.querySelectorAll("[data-mnw-note-popup-close]"));
    const notePopupTitle = root.querySelector("[data-mnw-note-popup-title]");
    const notePopupCopy = root.querySelector("[data-mnw-note-popup-copy]");

    if (!endpoint || !dialog || !form || !openButton || wizardSteps.length === 0) return;

    enhanceBreakdownControls(breakdownInputs);

    let currentRecommendation = null;
    let currentRequest = null;
    let currentSelectionMode = "exact";
    let recommendationInFlight = false;
    let swapInFlight = false;
    let refinementInFlight = false;
    let cartInFlight = false;
    let previousRefinement = null;
    let storeCurrency = null;
    let storeCurrencySymbol = null;
    let currencyPrecision = 2;
    let minimumBottlePrice = null;
    let minimumOrder = null;
    let maximumBudget = null;
    let configurationReady = false;
    let configuredCategories = Array.from(LEGACY_WINE_CATEGORIES);
    let budgetButtonVisibility = normaliseBudgetButtonVisibility();
    let budgetEdited = false;
    let suggestedBudget = null;
    let retryBudgets = { lower: null, higher: null };
    let pendingRefinementBudgetProposal = null;
    let destroyed = false;
    let visitId = getOrCreateVisitId(endpoint);
    let pageSessionId = createPageSessionId();
    const beginNewRecommendationSession = () => {
      pageSessionId = createPageSessionId();
    };
    const workingDialog = createWorkingDialog(root, dialog, {
      endpoint: root.dataset.progressEndpoint,
      method: root.dataset.progressMethod || "GET"
    });

    const applyBudgetScreenValue = (value) => {
      if (!configurationReady || !Number.isFinite(value)) return;
      budgetInput.value = String(roundMoney(value, currencyPrecision));
      budgetInput.dispatchEvent(new Event("input", { bubbles: true }));
      budgetInput.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const renderBudgetScreen = () => {
      if (!configurationReady || !storeCurrency) return;

      const formatter = createCurrencyFormatter(storeCurrency, currencyPrecision);
      const bottleCount = normaliseBottleCount(bottleCountInput.value);
      const minimumBudget = Number(budgetInput.min);
      const allowedMaximum = Number(budgetInput.max);
      const rawValue = String(budgetInput.value || "").trim();
      const parsedValue = rawValue === "" ? Number.NaN : Number(rawValue);
      const currentBudget = Number.isFinite(parsedValue)
        ? roundMoney(parsedValue, currencyPrecision)
        : null;
      const formattedIncrement = formatter.format(DEFAULT_BUDGET_ROUNDING_UNIT);
      const lowerBudget = calculateAdjustedBudgetValue(
        currentBudget,
        minimumBudget,
        allowedMaximum,
        -1,
        currencyPrecision
      );
      const higherBudget = calculateAdjustedBudgetValue(
        currentBudget,
        minimumBudget,
        allowedMaximum,
        1,
        currencyPrecision
      );

      budgetInput.style.setProperty(
        "--mnw-budget-value-width",
        `${Math.max(3, rawValue.length || 3)}ch`
      );
      if (budgetDecreaseAmount) budgetDecreaseAmount.textContent = formattedIncrement;
      if (budgetIncreaseAmount) budgetIncreaseAmount.textContent = formattedIncrement;

      if (budgetDecreaseButton) {
        budgetDecreaseButton.disabled = currentBudget === null || lowerBudget === currentBudget;
        budgetDecreaseButton.setAttribute(
          "aria-label",
          lowerBudget === null
            ? `Decrease total budget by ${formattedIncrement}`
            : `Decrease total budget by ${formattedIncrement} to ${formatter.format(lowerBudget)}`
        );
      }
      if (budgetIncreaseButton) {
        budgetIncreaseButton.disabled = currentBudget === null || higherBudget === currentBudget;
        budgetIncreaseButton.setAttribute(
          "aria-label",
          higherBudget === null
            ? `Increase total budget by ${formattedIncrement}`
            : `Increase total budget by ${formattedIncrement} to ${formatter.format(higherBudget)}`
        );
      }

      if (budgetPerBottle) {
        budgetPerBottle.textContent = currentBudget === null
          ? ""
          : `About ${formatter.format(roundMoney(currentBudget / bottleCount, currencyPrecision))} per bottle`;
      }

      if (budgetQuickChoices) {
        budgetQuickChoices.replaceChildren();
        calculateBudgetQuickChoices(minimumBudget, allowedMaximum, currencyPrecision)
          .forEach((choice) => {
            const button = document.createElement("button");
            const qualifier = choice.kind === "minimum"
              ? "Minimum"
              : (choice.kind === "suggested" ? "Suggested" : "");
            const formattedValue = formatter.format(choice.value);
            const selected = currentBudget !== null && choice.value === currentBudget;
            button.type = "button";
            button.className = "mnw-wine-finder__budget-quick-choice";
            button.dataset.mnwBudgetQuickChoice = String(choice.value);
            button.setAttribute("aria-pressed", String(selected));
            button.setAttribute(
              "aria-label",
              qualifier
                ? `Use ${qualifier.toLowerCase()} total budget of ${formattedValue}`
                : `Use total budget of ${formattedValue}`
            );
            button.textContent = qualifier ? `${formattedValue} ${qualifier}` : formattedValue;
            button.addEventListener("click", () => applyBudgetScreenValue(choice.value));
            budgetQuickChoices.append(button);
          });
      }
    };

    const refreshBudgetMinimum = (bottleCount) => {
      if (!configurationReady) return;
      updateBudgetMinimum(
        budgetInput,
        budgetHelp,
        budgetCurrencyElement,
        bottleCount,
        minimumBottlePrice,
        minimumOrder,
        maximumBudget,
        storeCurrency,
        storeCurrencySymbol,
        currencyPrecision,
        !budgetEdited
      );
      renderBudgetScreen();
    };

    // Do not leave a disabled/empty launcher on a merchant storefront while
    // the first inventory sync and mapping review are still in progress.
    root.hidden = true;
    openButton.disabled = true;
    openButton.setAttribute("aria-busy", "true");
    applyThemeStyles(root);
    let currentWizardStep = 0;
    let quickViewRestoreFocus = null;
    let notePopupRestoreFocus = null;

    const closeNotePopup = ({ restoreFocus = true } = {}) => {
      if (!notePopup || notePopup.hidden) return;
      notePopup.hidden = true;
      notePopup.setAttribute("aria-hidden", "true");
      if (restoreFocus) notePopupRestoreFocus?.focus({ preventScroll: true });
      notePopupRestoreFocus = null;
    };

    const openNotePopup = (title, note, trigger) => {
      if (!notePopup || !notePopupTitle || !notePopupCopy || !note) return;
      notePopupRestoreFocus = trigger || document.activeElement;
      notePopupTitle.textContent = title;
      notePopupCopy.textContent = note;
      notePopup.hidden = false;
      notePopup.setAttribute("aria-hidden", "false");
      window.setTimeout(() => notePopupCloseButtons.find((button) => button.classList.contains("mnw-wine-note-popup__close"))
        ?.focus({ preventScroll: true }), 0);
    };

    const closeQuickView = ({ restoreFocus = true } = {}) => {
      if (!quickView || quickView.hidden) return;
      closeNotePopup({ restoreFocus: false });
      quickView.hidden = true;
      quickView.setAttribute("aria-hidden", "true");
      if (restoreFocus) quickViewRestoreFocus?.focus({ preventScroll: true });
      quickViewRestoreFocus = null;
    };

    const openQuickView = (wine, trigger) => {
      if (!quickView || !quickViewTitle || !quickViewPrice || !quickViewDescription) return;

      quickViewRestoreFocus = trigger || document.activeElement;
      quickViewTitle.textContent = wine.title || "Wine";
      quickViewPrice.textContent = createCurrencyFormatter(wine.currency || currentRecommendation?.currency || storeCurrency)
        .format(Number(wine.price || 0));

      const recommendationLabel = String(wine.recommendationLabel || "About this wine").trim();
      const recommendationReason = directAddressRecommendationCopy(
        wine.recommendationReason || ""
      );
      const recommendationTags = recommendationTagsForWine(wine);
      if (quickViewReasonRow && quickViewReason) {
        quickViewReasonRow.hidden = !recommendationReason && recommendationTags.length === 0;
        if (quickViewReasonTags) {
          renderRecommendationTags(quickViewReasonTags, recommendationTags);
          quickViewReasonTags.hidden = recommendationTags.length === 0;
        }
        if (quickViewReasonLabel) {
          quickViewReasonLabel.hidden = !recommendationReason || recommendationTags.length > 0;
          quickViewReasonLabel.textContent = recommendationLabel || "About this wine";
        }
        quickViewReason.textContent = recommendationReason;
      }

      const rating = Number(wine.myNextWineRating);
      const hasRating = Number.isFinite(rating) && rating > 0;
      if (quickViewRatingRow && quickViewRating) {
        quickViewRatingRow.hidden = !hasRating;
        quickViewRating.textContent = hasRating
          ? `${Number.isInteger(rating) ? rating.toFixed(0) : rating.toFixed(1)}/100`
          : "";
      }

      const renderNamedDetail = (row, valueElement, name, note, noteTitle) => {
        if (!row || !valueElement) return false;
        const cleanName = String(name || "").trim();
        const cleanNote = String(note || "").trim();
        row.hidden = !cleanName;
        valueElement.replaceChildren();
        if (!cleanName) return false;

        if (cleanNote) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "mnw-wine-quick-view__note-link";
          button.textContent = cleanName;
          button.setAttribute("aria-label", `Read the My Next Wine note for ${cleanName}`);
          button.addEventListener("click", () => openNotePopup(noteTitle || cleanName, cleanNote, button));
          valueElement.appendChild(button);
        } else {
          valueElement.textContent = cleanName;
        }
        return true;
      };

      let hasDetails = false;
      hasDetails = renderNamedDetail(quickViewProducerRow, quickViewProducer, wine.producer, wine.producerNote, `Producer: ${wine.producer || ""}`) || hasDetails;
      hasDetails = renderNamedDetail(quickViewRegionRow, quickViewRegion, wine.region, wine.regionNote, `Region: ${wine.region || ""}`) || hasDetails;
      hasDetails = renderNamedDetail(quickViewCountryRow, quickViewCountry, wine.country, wine.countryNote, `Country: ${wine.country || ""}`) || hasDetails;

      const grapeDetails = Array.isArray(wine.grapeDetails) && wine.grapeDetails.length
        ? wine.grapeDetails
        : (Array.isArray(wine.grapes) ? wine.grapes.map((name) => ({ name, note: null })) : []);
      if (quickViewGrapesRow && quickViewGrapes) {
        const visibleGrapes = grapeDetails
          .map((grape) => ({ name: String(grape?.name || "").trim(), note: String(grape?.note || "").trim() }))
          .filter((grape) => grape.name);
        quickViewGrapesRow.hidden = visibleGrapes.length === 0;
        quickViewGrapes.replaceChildren();
        visibleGrapes.forEach((grape, index) => {
          if (index > 0) quickViewGrapes.appendChild(document.createTextNode(", "));
          if (grape.note) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "mnw-wine-quick-view__note-link";
            button.textContent = grape.name;
            button.setAttribute("aria-label", `Read the My Next Wine note for ${grape.name}`);
            button.addEventListener("click", () => openNotePopup(`Grape: ${grape.name}`, grape.note, button));
            quickViewGrapes.appendChild(button);
          } else {
            quickViewGrapes.appendChild(document.createTextNode(grape.name));
          }
        });
        hasDetails = visibleGrapes.length > 0 || hasDetails;
      }
      if (quickViewDetails) quickViewDetails.hidden = !hasDetails;

      const fullDescription = String(wine.description || "").trim();
      quickViewDescription.textContent = fullDescription || "No further description is available for this wine.";

      const wineNote = String(wine.wineNote || "").trim();
      if (quickViewWineNoteRow && quickViewWineNote) {
        quickViewWineNoteRow.hidden = !wineNote;
        quickViewWineNote.textContent = wineNote;
      }

      if (quickViewImage && quickViewImageFallback) {
        const showFallback = () => {
          quickViewImage.hidden = true;
          quickViewImage.onerror = null;
          quickViewImage.removeAttribute("src");
          quickViewImageFallback.hidden = false;
        };

        if (wine.imageUrl) {
          quickViewImage.alt = wine.title || "Wine";
          quickViewImage.hidden = false;
          quickViewImageFallback.hidden = true;
          quickViewImage.onerror = showFallback;
          quickViewImage.src = wine.imageUrl;
        } else {
          showFallback();
        }
      }

      quickView.hidden = false;
      quickView.setAttribute("aria-hidden", "false");
      window.setTimeout(() => quickViewCloseButtons.find((button) => button.classList.contains("mnw-wine-quick-view__close"))
        ?.focus({ preventScroll: true }), 0);
    };

    const setPhase = (phase) => {
      // Preserve the full results layout while the basket request hands off to the cart page.
      root.dataset.mnwPhase = stableVisualPhase(phase);
      [progressForm, progressResults, progressCart].forEach((step) => {
        if (step) step.classList.remove("mnw-wine-finder__journey-step--active", "mnw-wine-finder__journey-step--complete");
      });
      if (phase === "form") {
        progressForm?.classList.add("mnw-wine-finder__journey-step--active");
      } else if (phase === "results") {
        progressForm?.classList.add("mnw-wine-finder__journey-step--complete");
        progressResults?.classList.add("mnw-wine-finder__journey-step--active");
      } else if (phase === "cart") {
        progressForm?.classList.add("mnw-wine-finder__journey-step--complete");
        progressResults?.classList.add("mnw-wine-finder__journey-step--complete");
        progressCart?.classList.add("mnw-wine-finder__journey-step--active");
      }
    };

    const setBusy = (busy) => {
      dialog.setAttribute("aria-busy", String(Boolean(busy)));
      root.classList.toggle("mnw-wine-finder--busy", Boolean(busy));
      budgetImprovementElement?.querySelectorAll("button").forEach((button) => {
        button.disabled = Boolean(busy);
      });
    };

    const focusCurrentWizardStep = () => {
      const currentStep = wizardSteps[currentWizardStep];
      const preferredControl = currentStep?.hasAttribute("data-mnw-wizard-budget")
        ? budgetInput
        : currentStep?.querySelector("input, textarea, select, button");
      preferredControl?.focus({ preventScroll: true });
    };

    const showWizardStep = (index, { focus = true } = {}) => {
      currentWizardStep = Math.max(0, Math.min(wizardSteps.length - 1, index));
      wizardSteps.forEach((step, stepIndex) => {
        step.hidden = stepIndex !== currentWizardStep;
      });

      const currentStep = wizardSteps[currentWizardStep];
      const displayIndex = currentWizardStep + 1;
      root.dataset.mnwQuestion = String(displayIndex);
      const percentage = (displayIndex / wizardSteps.length) * 100;
      if (wizardCount) wizardCount.textContent = `Question ${displayIndex} of ${wizardSteps.length}`;
      if (wizardBar) wizardBar.style.width = `${percentage}%`;
      if (wizardTrack) {
        wizardTrack.setAttribute("aria-valuemax", String(wizardSteps.length));
        wizardTrack.setAttribute("aria-valuenow", String(displayIndex));
      }
      if (currentStep?.hasAttribute("data-mnw-wizard-budget")) renderBudgetScreen();

      errorElement.hidden = true;
      dialogScroll.scrollTo({ top: 0, behavior: "smooth" });
      if (focus) window.setTimeout(focusCurrentWizardStep, 180);
    };

    const validateWizardStep = (index) => {
      const step = wizardSteps[index];
      if (!step) return false;

      const fields = Array.from(step.querySelectorAll("input, textarea, select"));
      const invalidField = fields.find((field) => !field.checkValidity());
      if (invalidField) {
        invalidField.reportValidity();
        invalidField.focus({ preventScroll: true });
        return false;
      }

      if (step.hasAttribute("data-mnw-wizard-mix")) {
        const bottleCount = readBreakdownTotal(form);
        bottleCountInput.value = String(bottleCount);
        if (!Number.isInteger(bottleCount) || bottleCount < MIN_BOTTLE_COUNT || bottleCount > MAX_BOTTLE_COUNT) {
          allocationStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
          breakdownInputs.find((input) => !input.disabled)?.focus({ preventScroll: true });
          return false;
        }
      }

      return true;
    };

    const openDialog = () => {
      if (!configurationReady) return;
      sendAnalytics(analyticsEnabled, eventsEndpoint, pageSessionId, "OPEN");
      if (typeof dialog.showModal === "function") {
        if (!dialog.open) dialog.showModal();
      } else {
        dialog.setAttribute("open", "");
      }
      openButton.setAttribute("aria-expanded", "true");
      document.documentElement.classList.add("mnw-wine-finder-open");
      document.body.classList.add("mnw-wine-finder-open");
      window.setTimeout(() => {
        const target = currentRecommendation && !selectionElement.hidden
          ? selectionElement
          : wizardSteps[currentWizardStep]?.querySelector("input, textarea, select, button");
        target?.focus({ preventScroll: true });
      }, 80);
    };

    const closeDialog = () => {
      workingDialog.finish({ restoreFocus: false });
      closeQuickView({ restoreFocus: false });
      if (typeof dialog.close === "function" && dialog.open) dialog.close();
      else dialog.removeAttribute("open");
      openButton.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("mnw-wine-finder-open");
      document.body.classList.remove("mnw-wine-finder-open");
      openButton.focus({ preventScroll: true });
    };

    const requestInFlight = () => recommendationInFlight
      || refinementInFlight
      || swapInFlight
      || cartInFlight;

    const showError = (message) => {
      statusElement.hidden = true;
      if (budgetGuidance) budgetGuidance.hidden = true;
      errorElement.textContent = message || "We could not complete that request. Please try again.";
      errorElement.hidden = false;
      errorElement.focus({ preventScroll: true });
      errorElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const setSuggestedBudget = (value, button) => {
      const amount = Number(value);
      if (!Number.isFinite(amount) || amount <= 0 || !button) {
        if (button) button.hidden = true;
        return;
      }
      const retryAmount = Math.ceil(amount);
      suggestedBudget = retryAmount;
      button.textContent = `Try ${createCurrencyFormatter(storeCurrency, currencyPrecision).format(retryAmount)} budget`;
      button.hidden = false;
    };

    const applySuggestedBudget = () => {
      if (!Number.isFinite(suggestedBudget) || suggestedBudget <= 0) return;
      budgetEdited = true;
      budgetInput.value = String(suggestedBudget);
      if (budgetGuidance) budgetGuidance.hidden = true;
      form.requestSubmit();
    };

    const hideRetryBudgetChoices = () => {
      retryBudgets = { lower: null, higher: null };
      if (retryWithLowerBudgetButton) retryWithLowerBudgetButton.hidden = true;
      if (retryWithHigherBudgetButton) retryWithHigherBudgetButton.hidden = true;
      if (retryBudgetControls) retryBudgetControls.hidden = true;
    };

    const setRefinementControlsBusy = (busy) => {
      [
        refineSubmit,
        retryWithLowerBudgetButton,
        retryWithHigherBudgetButton,
        acceptRefinementBudgetButton,
        declineRefinementBudgetButton
      ]
        .forEach((button) => {
          if (!button) return;
          button.disabled = Boolean(busy);
          if (busy) button.setAttribute("aria-busy", "true");
          else button.removeAttribute("aria-busy");
        });
    };

    const setRetryBudgetChoices = (activeBudget) => {
      retryBudgets = visibleRetryBudgetChoices(calculateRetryBudgetChoices(
        activeBudget,
        budgetInput.min,
        budgetInput.max
      ), budgetButtonVisibility);
      const formatter = createCurrencyFormatter(storeCurrency, currencyPrecision);
      const choices = [
        [retryWithLowerBudgetButton, retryBudgets.lower, "−10%", "ten percent lower"],
        [retryWithHigherBudgetButton, retryBudgets.higher, "+10%", "ten percent higher"]
      ];
      let visibleChoices = 0;
      choices.forEach(([button, amount, change, accessibleChange]) => {
        if (!button) return;
        if (!Number.isFinite(amount) || amount <= 0) {
          button.hidden = true;
          button.removeAttribute("aria-label");
          return;
        }
        const formattedAmount = formatter.format(amount);
        button.textContent = `Try ${formattedAmount} (${change})`;
        button.setAttribute("aria-label", `Try a budget of ${formattedAmount}, ${accessibleChange}.`);
        button.disabled = refinementInFlight;
        button.hidden = false;
        visibleChoices += 1;
      });
      if (retryBudgetControls) retryBudgetControls.hidden = visibleChoices === 0;
    };

    const applyRetryBudget = async (direction) => {
      if (!Object.hasOwn(budgetButtonVisibility, direction) || !budgetButtonVisibility[direction]) return;
      const amount = Number(retryBudgets[direction]);
      if (!Number.isFinite(amount) || amount <= 0 || !currentRequest
          || refinementInFlight || recommendationInFlight || cartInFlight) return;
      const retry = createBudgetRetryRefinement(
        currentRequest,
        amount,
        storeCurrency,
        currencyPrecision
      );
      const formattedBudget = createCurrencyFormatter(
        storeCurrency,
        currencyPrecision
      ).format(amount);
      dismissRefinementBudgetConfirmation();
      await submitRefinementRequest({
        instruction: retry.instruction,
        request: retry.request,
        refinementMode: "BUDGET_ONLY",
        progressMessage: `Rebuilding your current selection around ${formattedBudget}…`,
        pendingLabel: "Updating budget…",
        successMessage: `Your selection has been rebuilt around ${formattedBudget}.`,
        synchroniseBudgetInput: true
      });
    };

    const showBudgetGuidance = (details) => {
      const requested = Number(details?.requestedBudget || currentRequest?.budget || 0);
      const suggested = Number(details?.suggestedBudget || 0);
      if (!budgetGuidance || !budgetGuidanceCopy || !Number.isFinite(suggested) || suggested <= 0) {
        showError("We could not build a complete selection at that budget. Try increasing it or changing your request.");
        return;
      }
      if (!budgetSuggestionAdvances(requested, suggested, currencyPrecision)) {
        showError("We could not build a complete selection at that budget. Please edit your wine preferences or bottle mix and try again.");
        return;
      }
      const formatter = createCurrencyFormatter(storeCurrency, currencyPrecision);
      const difference = Math.max(0, suggested - requested);
      statusElement.hidden = true;
      errorElement.hidden = true;
      budgetGuidanceCopy.textContent = t("widget.budget.guidance_start", "We cannot put together everything you asked for from the wines in stock. An alternative selection starts at {amount}{difference}.", {
        amount: formatter.format(suggested),
        difference: difference > 0 ? t("widget.budget.guidance_difference", " — {amount} above your current budget", { amount: formatter.format(difference) }) : ""
      });
      setSuggestedBudget(suggested, trySuggestedBudgetButton);
      budgetGuidance.hidden = false;
      budgetGuidance.focus({ preventScroll: true });
      budgetGuidance.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const renderRequestMatch = (selection) => {
      if (!requestMatch || !requestMatchTitle || !requestMatchItems
          || !requestMatchUnmet || !requestMatchUnmetCopy) return;

      const wines = Array.isArray(selection?.wines) ? selection.wines : [];
      const perWineTags = wines.flatMap((wine) => recommendationTagsForWine(wine));
      const directTags = normaliseRecommendationTags(
        perWineTags.filter((tag) => tag.type === "MATCH")
      );
      const substituteTags = normaliseRecommendationTags(
        perWineTags.filter((tag) => tag.type === "SUBSTITUTE")
      );

      const fallbackMatched = normaliseDisplayList(selection?.matchedPreferences)
        .map((label) => ({ type: "MATCH", label }));
      const summaryTags = normaliseRecommendationTags([
        ...(directTags.length > 0 ? directTags : fallbackMatched),
        ...substituteTags
      ]).slice(0, 8);

      const unmet = normaliseDisplayList(selection?.unmetPreferences)
        .slice(0, 4);

      renderRecommendationTags(requestMatchItems, summaryTags);

      requestMatch.hidden = summaryTags.length === 0 && unmet.length === 0;
      const partial = substituteTags.length > 0 || unmet.length > 0;
      requestMatch.classList.toggle("mnw-wine-finder__request-match--partial", partial);
      requestMatchTitle.textContent = "Chosen for you";
      requestMatchUnmet.hidden = unmet.length === 0;
      requestMatchUnmetCopy.textContent = unmet.join("; ");
    };

    const renderBudgetImprovement = () => {
      if (!budgetImprovementElement) return;
      budgetImprovementElement.replaceChildren();
      budgetImprovementElement.hidden = true;
      const improvement = currentSelectionMode === "exact"
        ? validateBudgetImprovement(currentRecommendation, currentRequest, currencyPrecision) : null;
      if (!improvement) return;
      const selected = getSelectedWineIds(resultsElement);
      if (selected.size !== improvement.selectedWineIds.length
          || !improvement.selectedWineIds.every((id) => selected.has(String(id)))) return;
      const money = createCurrencyFormatter(currentRecommendation.currency || storeCurrency, currencyPrecision);
      const heading = document.createElement("h3");
      const aboveBudget = Number(improvement.aboveBudgetAmount) > 0;
      heading.textContent = aboveBudget
        ? t("widget.tolerance.title", "Why we'd go {above} over budget", { above: money.format(improvement.aboveBudgetAmount) })
        : t("widget.tolerance.within_title", "Why we chose these bottles");
      budgetImprovementElement.append(heading);
      for (const change of improvement.changes) {
        const oldWine = improvement.wines.find((wine) => String(wine.sommWineId) === String(change.replacedWineId));
        const newWine = currentRecommendation.wines.find((wine) => String(wine.sommWineId) === String(change.replacementWineId));
        const comparison = document.createElement("p");
        comparison.textContent = t("widget.tolerance.comparison",
          "For {extra} more, we'd go with {chosen} ({chosenPrice}) rather than {current} ({currentPrice}).", {
            current: oldWine.title, currentPrice: money.format(oldWine.price),
            chosen: newWine.title, chosenPrice: money.format(newWine.price), extra: money.format(change.addedCost)
          });
        const reason = document.createElement("p");
        reason.textContent = change.explanation;
        budgetImprovementElement.append(comparison, reason);
      }
      const totals = document.createElement("p");
      totals.className = "mnw-wine-finder__improvement-total";
      totals.textContent = t("widget.tolerance.total",
        "These wines come to {total}, which is {above} over your {budget} budget. The original selection costs {baseline}.", {
          total: money.format(improvement.total), above: money.format(improvement.aboveBudgetAmount),
          budget: money.format(currentRequest.budget), baseline: money.format(improvement.originalTotal)
        });
      if (!aboveBudget) {
        const under = Number(currentRequest.budget) - Number(improvement.total);
        totals.textContent = under > 0
          ? t("widget.tolerance.within_total", "These wines come to {total}, still {under} below your {budget} budget.", {
              total: money.format(improvement.total), under: money.format(under), budget: money.format(currentRequest.budget)
            })
          : t("widget.tolerance.on_total", "These wines come to {total}, exactly your budget.", { total: money.format(improvement.total) });
        budgetImprovementElement.append(totals);
        budgetImprovementElement.hidden = false;
        return; // No misleading 'keep to budget' action when this case already does.
      }
      const actions = document.createElement("div");
      actions.className = "mnw-wine-finder__improvement-actions";
      const withinBudget = document.createElement("button");
      withinBudget.type = "button";
      withinBudget.className = "mnw-wine-finder__secondary-button";
      withinBudget.textContent = t("widget.tolerance.keep_budget", "Keep to my {budget} budget", {
        budget: money.format(currentRequest.budget)
      });
      withinBudget.disabled = requestInFlight();
      withinBudget.addEventListener("click", () => {
        if (requestInFlight() || currentSelectionMode !== "exact") return;
        const selectedNow = getSelectedWineIds(resultsElement);
        if (selectedNow.size !== improvement.selectedWineIds.length
            || !improvement.selectedWineIds.every((id) => selectedNow.has(String(id)))) return;
        const baseline = chooseWithinBudgetSelection(currentRecommendation, currentRequest, currencyPrecision);
        if (!baseline) { renderBudgetImprovement(); return; }
        previousRefinement = createRefinementSnapshot(currentRecommendation, currentRequest,
          currentSelectionMode, selectedNow);
        currentRecommendation = baseline.recommendation;
        currentRequest = baseline.request; // Original target unchanged; future refinements are strict.
        dismissRefinementBudgetConfirmation();
        showRecommendationSelection("exact");
        if (refineUndo) { refineUndo.hidden = false; refineUndo.focus({ preventScroll: true }); }
        announceRefinement(t("widget.tolerance.kept_budget", "We have kept it within your {budget} budget.", {
          budget: money.format(currentRequest.budget)
        }));
      });
      actions.append(withinBudget);
      budgetImprovementElement.append(totals, actions);
      budgetImprovementElement.hidden = false;
    };

    const showRecommendationSelection = (mode) => {
      if (!currentRecommendation) return;

      const alternative = currentRecommendation.budgetAlternative;
      const useAlternative = mode === "alternative"
        && alternative
        && Array.isArray(alternative.wines)
        && alternative.wines.length > 0;
      const selection = useAlternative
        ? alternative
        : currentRecommendation.exactSelection;
      if (!selection || !Array.isArray(selection.wines) || selection.wines.length === 0) return;

      currentSelectionMode = useAlternative ? "alternative" : "exact";
      currentRecommendation.wines = selection.wines;
      currentRecommendation.total = selection.total;
      currentRecommendation.summary = selection.summary;

      const currency = currentRecommendation.currency || storeCurrency;
      const formatter = createCurrencyFormatter(currency, currencyPrecision);
      const requestedBudget = Number(currentRequest?.budget || currentRecommendation.requestedBudget || 0);
      const exactTotal = Number(currentRecommendation.exactSelection?.total || 0);
      const derivedOverBudget = Number.isFinite(requestedBudget)
        && Number.isFinite(exactTotal)
        && exactTotal > requestedBudget + 0.0001;
      const selectionStatus = String(currentRecommendation.selectionStatus || "").trim().toUpperCase();
      const consideredSubstitutions = selectionStatus === "CONSIDERED_SUBSTITUTIONS"
        || selectionStatus === "CONSIDERED_SUBSTITUTIONS_OVER_BUDGET";
      const alternativeOnly = selectionStatus === "ALTERNATIVE_ONLY"
        || selectionStatus === "ALTERNATIVE_ONLY_OVER_BUDGET";
      const exactOverBudget = selectionStatus === "EXACT_OVER_BUDGET"
        || selectionStatus === "CONSIDERED_SUBSTITUTIONS_OVER_BUDGET"
        || selectionStatus === "ALTERNATIVE_ONLY_OVER_BUDGET"
        || derivedOverBudget;
      currentRecommendation.overBudget = exactOverBudget;
      const appliedImprovement = currentSelectionMode === "exact"
        ? validateBudgetImprovement(currentRecommendation, currentRequest, currencyPrecision) : null;
      if (appliedImprovement) {
        currentRecommendation.budgetToleranceAllowance = {
          requestedBudget, selectedTotal: appliedImprovement.total,
          maximumTotal: appliedImprovement.maximumTotal, tolerancePercent: appliedImprovement.tolerancePercent
        };
      }
      const withinTolerance = currentSelectionMode === "exact"
        && toleranceSwapAllowed(currentRecommendation, currentRequest, currencyPrecision);
      const allowSwap = currentSelectionMode === "exact"
        && selectionStatus !== "ALTERNATIVE_ONLY"
        && (!exactOverBudget || withinTolerance);

      renderWines(
        resultsElement,
        selection.wines,
        currency,
        openQuickView,
        allowSwap ? swapWine : null,
        currentRequest,
        selectionStatus
      );
      summaryElement.textContent = formatSelectionHeadingSummary(
        currentRequest,
        selection.summary || "Chosen from wines currently in stock."
      );
      attachSelectionListeners({
        resultsElement,
        wines: selection.wines,
        currency,
        currencyPrecision,
        requestedBudget,
        resultSummaryElement: totalElement,
        selectedCountElement,
        selectedTotalElement,
        selectedBudgetStatusElement,
        addSelectedButton,
        addSelectedLabel
      });
      renderRequestMatch(selection);
      renderBudgetImprovement();
      setRetryBudgetChoices(requestedBudget);

      if (!budgetNotice || !budgetNoticeTitle || !budgetNoticeCopy) return;

      if (currentSelectionMode === "alternative") {
        const alternativeTotal = Number(alternative.total || 0);
        const underBudget = Math.max(0, requestedBudget - alternativeTotal);
        budgetNotice.hidden = false;
        budgetNotice.dataset.mnwBudgetState = "alternative";
        budgetNoticeTitle.textContent = "Other wines to consider";
        budgetNoticeCopy.textContent = recommendationNoticeCopy(
          selection,
          t("widget.alternative.replaced", "We have chosen alternatives for the wines we could not include. Total {total}{difference}.", {
            total: formatter.format(alternativeTotal),
            difference: underBudget > 0.0001 ? t("widget.alternative.under_difference", " — {amount} under budget", { amount: formatter.format(underBudget) }) : ""
          })
        );
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) {
          showExactSelectionButton.hidden = false;
          showExactSelectionButton.textContent = t("widget.alternative.show_exact", "Back to the {amount} selection", { amount: formatter.format(exactTotal) });
        }
        return;
      }

      if (withinTolerance) {
        budgetNotice.hidden = false;
        budgetNotice.dataset.mnwBudgetState = "tolerance";
        budgetNoticeTitle.textContent = t("widget.tolerance.notice_title", "Why we'd spend more");
        budgetNoticeCopy.textContent = t("widget.tolerance.notice",
          "These wines come to {total}, which is {above} over your {budget} budget.", {
            total: formatter.format(Number(selection.total)),
            above: formatter.format(Math.max(0, Number(selection.total) - requestedBudget)),
            budget: formatter.format(requestedBudget)
          });
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) showExactSelectionButton.hidden = true;
        return;
      }

      if (alternativeOnly) {
        budgetNotice.hidden = false;
        budgetNotice.dataset.mnwBudgetState = exactOverBudget ? "over" : "alternative";
        budgetNoticeTitle.textContent = exactOverBudget
          ? "Another selection to consider"
          : "A note about your wines";
        budgetNoticeCopy.textContent = recommendationNoticeCopy(
          selection,
          exactOverBudget
            ? t("widget.alternative.not_enough_exact", "We could not include everything you asked for. These wines cost {total}, which is {difference} over your {budget} budget.", {
                total: formatter.format(Number(selection.total || 0)), difference: formatter.format(Math.max(0, Number(selection.total || 0) - requestedBudget)), budget: formatter.format(requestedBudget)
              })
            : "We could not give you everything you asked for at this price. These alternatives stay within your budget."
        );
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) showExactSelectionButton.hidden = true;
        return;
      }

      if (consideredSubstitutions) {
        // The requirement pills already identify any unmet wish. Show an extra panel
        // only for an actual explanation or a monetary disclosure, not a blanket warning.
        const note = substitutionNoticeCopy(selection, exactOverBudget,
          exactOverBudget
            ? t("widget.alternative.closest_over", "These alternatives cost {total}, which is {difference} over budget.", {
                total: formatter.format(Number(selection.total || 0)), difference: formatter.format(Math.max(0, Number(selection.total || 0) - requestedBudget))
              })
            : "");
        budgetNotice.hidden = !note;
        budgetNotice.dataset.mnwBudgetState = exactOverBudget ? "over" : "alternative";
        budgetNoticeTitle.textContent = "A note about your wines";
        budgetNoticeCopy.textContent = note;
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) showExactSelectionButton.hidden = true;
        return;
      }

      if (!exactOverBudget) {
        budgetNotice.hidden = true;
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) showExactSelectionButton.hidden = true;
        return;
      }

      const difference = Number(currentRecommendation.budgetDifference || Math.max(0, exactTotal - requestedBudget));
      budgetNotice.hidden = false;
      budgetNotice.dataset.mnwBudgetState = "over";
      budgetNoticeTitle.textContent = "These wines are over budget";

      let notice = t("widget.budget.exact_total", "These wines cost {total}, which is {difference} over your {budget} budget.", {
        total: formatter.format(exactTotal), difference: formatter.format(difference), budget: formatter.format(requestedBudget)
      });
      if (alternative) {
        const alternativeTotal = Number(alternative.total || 0);
        notice += ` A similar option is ${formatter.format(alternativeTotal)}.`;
      }
      budgetNoticeCopy.textContent = notice;

      if (showBudgetAlternativeButton) {
        showBudgetAlternativeButton.hidden = !alternative;
        if (alternative) {
          showBudgetAlternativeButton.textContent = `View ${formatter.format(Number(alternative.total || 0))} alternative`;
        }
      }
      if (showExactSelectionButton) showExactSelectionButton.hidden = true;
    };

    openButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);
    quickViewCloseButtons.forEach((button) => button.addEventListener("click", () => closeQuickView()));
    notePopupCloseButtons.forEach((button) => button.addEventListener("click", () => closeNotePopup()));
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        if (notePopup && !notePopup.hidden) {
          event.preventDefault();
          event.stopPropagation();
          closeNotePopup();
          return;
        }
        if (quickView && !quickView.hidden) {
          event.preventDefault();
          event.stopPropagation();
          closeQuickView();
          return;
        }
      }
      if (event.key !== "Tab") return;
      if (notePopup && !notePopup.hidden) {
        trapModalFocus(event, notePopup);
      } else if (quickView && !quickView.hidden) {
        trapModalFocus(event, quickView);
      } else {
        trapModalFocus(event, dialog);
      }
    });
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      if (notePopup && !notePopup.hidden) {
        closeNotePopup();
        return;
      }
      if (quickView && !quickView.hidden) {
        closeQuickView();
        return;
      }
      if (!requestInFlight()) closeDialog();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog && !requestInFlight()) closeDialog();
    });
    dialog.addEventListener("close", () => {
      workingDialog.finish({ restoreFocus: false });
      openButton.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("mnw-wine-finder-open");
      document.body.classList.remove("mnw-wine-finder-open");
    });

    let removalObserver = null;
    const cleanupWidget = () => {
      if (destroyed) return;
      destroyed = true;
      workingDialog.destroy();
      removalObserver?.disconnect();
      removalObserver = null;
    };
    root.addEventListener("mnw:destroy", cleanupWidget, { once: true });
    window.addEventListener("pagehide", cleanupWidget, { once: true });
    if (typeof MutationObserver === "function") {
      removalObserver = new MutationObserver(() => {
        if (!root.isConnected) cleanupWidget();
      });
      removalObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    root.querySelectorAll("[data-mnw-wizard-next]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!validateWizardStep(currentWizardStep)) return;
        showWizardStep(currentWizardStep + 1);
      });
    });

    root.querySelectorAll("[data-mnw-wizard-back]").forEach((button) => {
      button.addEventListener("click", () => {
        showWizardStep(currentWizardStep - 1);
      });
    });

    breakdownInputs.forEach((input) => input.addEventListener("input", () => {
      const bottleCount = readBreakdownTotal(form);
      bottleCountInput.value = String(bottleCount);
      if (configurationReady && bottleCount >= MIN_BOTTLE_COUNT && bottleCount <= MAX_BOTTLE_COUNT) {
        refreshBudgetMinimum(bottleCount);
      }
      updateAllocationStatus(form, allocationStatus, submitButton);
      updateBreakdownControlStates(breakdownInputs);
    }));

    budgetDecreaseButton?.addEventListener("click", () => {
      const adjustedBudget = calculateAdjustedBudgetValue(
        budgetInput.value,
        budgetInput.min,
        budgetInput.max,
        -1,
        currencyPrecision
      );
      if (adjustedBudget !== null) applyBudgetScreenValue(adjustedBudget);
    });

    budgetIncreaseButton?.addEventListener("click", () => {
      const adjustedBudget = calculateAdjustedBudgetValue(
        budgetInput.value,
        budgetInput.min,
        budgetInput.max,
        1,
        currencyPrecision
      );
      if (adjustedBudget !== null) applyBudgetScreenValue(adjustedBudget);
    });

    budgetInput.addEventListener("input", () => {
      budgetEdited = true;
      renderBudgetScreen();
    });

    budgetInput.addEventListener("change", () => {
      budgetEdited = true;
      const bottleCount = normaliseBottleCount(bottleCountInput.value);
      const minimumBudget = Math.max(bottleCount * minimumBottlePrice, minimumOrder);
      const enteredBudget = Number(budgetInput.value);
      if (!Number.isFinite(enteredBudget) || enteredBudget < minimumBudget) {
        budgetInput.value = String(roundMoney(minimumBudget, currencyPrecision));
      } else if (enteredBudget > maximumBudget) {
        budgetInput.value = String(roundMoney(maximumBudget, currencyPrecision));
      }
      renderBudgetScreen();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (currentWizardStep < wizardSteps.length - 1) {
        if (validateWizardStep(currentWizardStep)) showWizardStep(currentWizardStep + 1);
        return;
      }

      if (recommendationInFlight || !validateWizardStep(currentWizardStep) || !form.reportValidity()) return;

      recommendationInFlight = true;
      setBusy(true);
      const originalLabel = submitLabel.textContent;
      errorElement.hidden = true;
      if (budgetGuidance) budgetGuidance.hidden = true;
      selectionElement.hidden = true;
      statusElement.hidden = true;
      const trackedEndpoint = workingDialog.start("INITIAL", endpoint);
      submitButton.disabled = true;
      submitLabel.textContent = "Finding wines…";

      try {
        const payload = readRecommendationForm(form, configuredCategories);
        payload.sessionId = pageSessionId;
        visitId = getOrCreateVisitId(endpoint);
        payload.visitId = visitId;
        payload.locale = widgetUiLocale;
        validateRecommendationPayload(
          payload,
          minimumBottlePrice,
          minimumOrder,
          maximumBudget,
          storeCurrency,
          currencyPrecision
        );
        currentRequest = payload;
        sendAnalytics(analyticsEnabled, eventsEndpoint, pageSessionId, "RECOMMENDATION_REQUEST", {
          budget: payload.budget,
          bottleCount: payload.bottleCount
        });
        const result = await fetchJson(trackedEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store"
        }, REQUEST_TIMEOUT_MS, "The wine finder took too long to respond. Please try again.");

        if (!Array.isArray(result.wines) || result.wines.length === 0) {
          throw new Error("No suitable wines were found for those answers. Try a slightly larger budget or different mix.");
        }
        if (!result.sessionId) throw new Error("The wine finder response was incomplete. Please try again.");
        // A replay returns the original billable session. All follow-up actions/cart attribution use it.
        pageSessionId = result.sessionId;
        payload.sessionId = result.sessionId;

        storeCurrency = normaliseCurrencyCode(result.currency || storeCurrency);
        result.currency = storeCurrency;
        result.exactSelection = {
          summary: result.summary,
          total: result.total,
          explanation: String(result.customerMessage || "").trim(),
          matchedPreferences: result.matchedPreferences,
          unmetPreferences: result.unmetPreferences,
          wines: result.wines
        };
        currentRecommendation = result;
        showRecommendationSelection("exact");
        sendAnalytics(analyticsEnabled, eventsEndpoint, pageSessionId, "RECOMMENDATION_RESULT", {
          selectionTotal: Number(result.total || 0)
        });

        workingDialog.finish({ restoreFocus: false });
        statusElement.hidden = true;
        form.hidden = true;
        if (wizardProgress) wizardProgress.hidden = true;
        selectionElement.hidden = false;
        setPhase("results");
        selectionElement.focus({ preventScroll: true });
        selectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        workingDialog.finish({ restoreFocus: false });
        currentRecommendation = null;
        if (error?.details?.code === "BUDGET_INCREASE_REQUIRED") {
          showBudgetGuidance(error.details);
        } else {
          if (error?.details?.code === "SESSION_INITIAL_ALREADY_COMPLETED") {
            beginNewRecommendationSession();
          }
          currentRequest = null;
          showError(error.message || "We could not build the wine selection.");
        }
      } finally {
        workingDialog.finish({ restoreFocus: false });
        recommendationInFlight = false;
        setBusy(false);
        submitButton.disabled = false;
        submitLabel.textContent = originalLabel;
        updateAllocationStatus(form, allocationStatus, submitButton);
      }
    });

    const refreshCurrentSelectedState = () => {
      if (!currentRecommendation) return;
      updateSelectedState({
        resultsElement,
        wines: currentRecommendation.wines,
        currency: currentRecommendation.currency || storeCurrency,
        currencyPrecision,
        requestedBudget: Number(currentRequest?.budget || currentRecommendation.requestedBudget || 0),
        resultSummaryElement: totalElement,
        selectedCountElement,
        selectedTotalElement,
        selectedBudgetStatusElement,
        addSelectedButton,
        addSelectedLabel
      });
    };

    const swapWine = async (
      wineToReplace,
      trigger,
      {
        request = currentRequest,
        synchroniseBudget = false,
        allowBudgetProposal = true
      } = {}
    ) => {
      if (!swapEndpoint || !currentRecommendation || !currentRequest || requestInFlight()) return;

      const selectedIds = getSelectedWineIds(resultsElement);
      const originalLabel = trigger?.textContent || "Swap";
      if (allowBudgetProposal) dismissRefinementBudgetConfirmation();
      swapInFlight = true;
      setBusy(true);
      errorElement.hidden = true;
      if (trigger) {
        trigger.disabled = true;
        trigger.textContent = "Finding another…";
      }

      try {
        const response = await fetchJson(swapEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            request,
            wineToReplaceId: wineToReplace.sommWineId,
            currentWineIds: currentRecommendation.wines.map((wine) => wine.sommWineId),
            sessionId: currentRecommendation.sessionId
          }),
          cache: "no-store"
        }, SWAP_TIMEOUT_MS, "The wine swap took too long. Please try again.");

        if (!response.wine?.sommWineId) throw new Error("No alternative wine was returned. Please try again.");
        currentRecommendation.wines = currentRecommendation.wines.map((wine) =>
          String(wine.sommWineId) === String(wineToReplace.sommWineId) ? response.wine : wine
        );
        // A previously calculated offer is no longer valid after a manual swap.
        currentRecommendation.budgetImprovement = null;
        currentRecommendation.total = response.total;
        currentRecommendation.sessionId = response.sessionId || currentRecommendation.sessionId;
        currentRecommendation.recommendationToken = response.recommendationToken || currentRecommendation.recommendationToken;
        if (synchroniseBudget) {
          currentRequest = {
            ...request,
            ...(request?.categoryCounts && typeof request.categoryCounts === "object"
              ? { categoryCounts: { ...request.categoryCounts } }
              : {})
          };
          currentRecommendation.requestedBudget = currentRequest.budget;
          budgetEdited = true;
          budgetInput.value = String(currentRequest.budget);
        }
        if (response.currency) {
          storeCurrency = normaliseCurrencyCode(response.currency);
          currentRecommendation.currency = storeCurrency;
        }

        currentRecommendation.exactSelection = {
          summary: currentRecommendation.summary,
          total: response.total,
          matchedPreferences: response.matchedPreferences
            || currentRecommendation.exactSelection?.matchedPreferences,
          unmetPreferences: response.unmetPreferences
            || currentRecommendation.exactSelection?.unmetPreferences,
          wines: currentRecommendation.wines
        };
        showRecommendationSelection("exact");
        restoreSelectedWineIds(resultsElement, selectedIds, response.wine.sommWineId, wineToReplace.sommWineId);
        refreshCurrentSelectedState();
        dismissRefinementBudgetConfirmation();
        if (synchroniseBudget) {
          announceRefinement(`The swap was made using a budget of ${
            createCurrencyFormatter(storeCurrency, currencyPrecision).format(Number(currentRequest.budget))
          }.`);
        }
        sendAnalytics(analyticsEnabled, eventsEndpoint, pageSessionId, "SWAP");
      } catch (error) {
        const confirmationOffered = allowBudgetProposal && offerSwapBudgetConfirmation({
          error,
          request,
          wineToReplace,
          trigger
        });
        if (!confirmationOffered) {
          showError(error.message || "That wine could not be swapped. Please try again.");
        }
      } finally {
        swapInFlight = false;
        setBusy(false);
        if (trigger?.isConnected) {
          trigger.disabled = false;
          trigger.textContent = originalLabel;
        }
      }
    };

    const dismissRefinementBudgetConfirmation = () => {
      pendingRefinementBudgetProposal = null;
      if (refinementBudgetConfirmation) refinementBudgetConfirmation.hidden = true;
      if (refinementBudgetTitle) refinementBudgetTitle.textContent = "This change would cost more";
      if (refinementBudgetCopy) refinementBudgetCopy.textContent = "";
    };

    const offerRefinementBudgetConfirmation = ({
      error,
      request,
      instruction,
      clearInput
    }) => {
      const proposal = createRefinementBudgetProposal(
        error,
        request,
        instruction,
        storeCurrency,
        currencyPrecision,
        null,
        maximumBudget
      );
      if (!proposal || !refinementBudgetConfirmation || !refinementBudgetCopy
          || !acceptRefinementBudgetButton || !acceptRefinementBudgetLabel
          || !declineRefinementBudgetButton) return false;

      pendingRefinementBudgetProposal = {
        ...proposal,
        action: "refinement",
        clearInput: Boolean(clearInput)
      };
      if (refineStatus) refineStatus.hidden = true;
      if (refinementBudgetTitle) refinementBudgetTitle.textContent = "This change would cost more";
      refinementBudgetCopy.textContent = proposal.prompt;
      acceptRefinementBudgetLabel.textContent = proposal.acceptLabel;
      refinementBudgetConfirmation.hidden = false;
      window.setTimeout(() => acceptRefinementBudgetButton.focus({ preventScroll: true }), 0);
      return true;
    };

    const offerSwapBudgetConfirmation = ({ error, request, wineToReplace, trigger }) => {
      const proposal = createSwapBudgetProposal(
        error,
        request,
        storeCurrency,
        currencyPrecision,
        null,
        maximumBudget
      );
      if (!proposal || !refinementBudgetConfirmation || !refinementBudgetCopy
          || !acceptRefinementBudgetButton || !acceptRefinementBudgetLabel
          || !declineRefinementBudgetButton) return false;

      pendingRefinementBudgetProposal = {
        ...proposal,
        action: "swap",
        wineToReplace,
        trigger
      };
      if (refineStatus) refineStatus.hidden = true;
      if (refinementBudgetTitle) refinementBudgetTitle.textContent = "This swap is a little over budget";
      refinementBudgetCopy.textContent = proposal.prompt;
      acceptRefinementBudgetLabel.textContent = proposal.acceptLabel;
      refinementBudgetConfirmation.hidden = false;
      window.setTimeout(() => acceptRefinementBudgetButton.focus({ preventScroll: true }), 0);
      return true;
    };

    const announceRefinement = (message, isError = false) => {
      if (!refineStatus) return;
      refineStatus.textContent = message;
      refineStatus.hidden = false;
      refineStatus.classList.toggle("mnw-wine-finder__refinement-status--error", isError);
      refineStatus.setAttribute("role", isError ? "alert" : "status");
      refineStatus.setAttribute("aria-live", isError ? "assertive" : "polite");
      if (isError) {
        refineStatus.tabIndex = -1;
        refineStatus.focus({ preventScroll: true });
        refineStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };

    const submitRefinementRequest = async ({
      instruction,
      request = currentRequest,
      progressMessage = "Choosing your wines again…",
      pendingLabel = "Making changes…",
      successMessage = "Your wines have been updated.",
      clearInput = false,
      synchroniseBudgetInput = false,
      refinementMode = "FREE_TEXT"
    }) => {
      if (!refineEndpoint || !currentRecommendation || !currentRequest || !request
          || requestInFlight()) return false;

      const snapshot = createRefinementSnapshot(
        currentRecommendation,
        currentRequest,
        currentSelectionMode,
        getSelectedWineIds(resultsElement)
      );
      refinementInFlight = true;
      setBusy(true);
      const originalLabel = refineLabel?.textContent || "Make changes";
      setRefinementControlsBusy(true);
      if (refineLabel) refineLabel.textContent = pendingLabel;
      if (refineStatus) refineStatus.hidden = true;
      const trackedRefineEndpoint = workingDialog.start("REFINE", refineEndpoint);

      try {
        const result = await fetchJson(trackedRefineEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(createRefinementRequestPayload(
            request,
            currentRecommendation,
            instruction,
            refinementMode
          )),
          cache: "no-store"
        }, REQUEST_TIMEOUT_MS, "That took too long. We have kept your current wines.");

        validateRefinementResponse(result, configuredCategories);
        if (refinementMode === "BUDGET_ONLY") {
          preserveBudgetOnlyRequestState(request, result);
          preserveRetainedRecommendationEvidence(currentRecommendation, result);
        }
        storeCurrency = normaliseCurrencyCode(result.currency || storeCurrency);
        result.currency = storeCurrency;
        result.exactSelection = {
          summary: result.summary,
          total: result.total,
          explanation: String(result.customerMessage || "").trim(),
          matchedPreferences: result.matchedPreferences,
          unmetPreferences: result.unmetPreferences,
          wines: result.wines
        };

        previousRefinement = snapshot;
        currentRequest = result.refinedRequest;
        currentRecommendation = result;
        if (synchroniseBudgetInput) {
          const refinedBudget = Number(currentRequest?.budget);
          if (Number.isFinite(refinedBudget) && refinedBudget > 0) {
            budgetEdited = true;
            budgetInput.value = String(refinedBudget);
          }
        }
        dismissRefinementBudgetConfirmation();
        showRecommendationSelection("exact");
        if (clearInput && refineInput) refineInput.value = "";
        if (refineUndo) refineUndo.hidden = false;
        announceRefinement(result.refinementSummary || successMessage);
        return true;
      } catch (error) {
        workingDialog.finish({ restoreFocus: false });
        const confirmationOffered = offerRefinementBudgetConfirmation({
          error,
          request,
          instruction,
          clearInput
        });
        if (!confirmationOffered) {
          dismissRefinementBudgetConfirmation();
          announceRefinement(
            refinementFailureMessage(error, storeCurrency, currencyPrecision),
            true
          );
        }
        return false;
      } finally {
        refinementInFlight = false;
        setBusy(false);
        if (refineLabel) refineLabel.textContent = originalLabel;
        setRefinementControlsBusy(false);
        workingDialog.finish();
      }
    };

    refineForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!refineEndpoint || !currentRecommendation || !currentRequest
          || refinementInFlight || recommendationInFlight || cartInFlight) return;

      const instruction = String(refineInput?.value || "").replace(/\s+/g, " ").trim();
      if (!instruction) {
        announceRefinement("Tell us what you want to change.", true);
        refineInput?.focus({ preventScroll: true });
        return;
      }
      if (instruction.length > MAX_REFINEMENT_LENGTH) {
        announceRefinement(t("widget.refine.character_limit", "Please keep your message to {max} characters or fewer.", { max: MAX_REFINEMENT_LENGTH }), true);
        refineInput?.focus({ preventScroll: true });
        return;
      }

      dismissRefinementBudgetConfirmation();
      await submitRefinementRequest({ instruction, clearInput: true });
    });

    acceptRefinementBudgetButton?.addEventListener("click", async () => {
      if (!pendingRefinementBudgetProposal || refinementInFlight
          || recommendationInFlight || cartInFlight) return;
      const proposal = pendingRefinementBudgetProposal;
      dismissRefinementBudgetConfirmation();
      if (proposal.action === "swap") {
        await swapWine(proposal.wineToReplace, proposal.trigger, {
          request: proposal.request,
          synchroniseBudget: true,
          allowBudgetProposal: false
        });
        return;
      }
      await submitRefinementRequest({
        instruction: proposal.instruction,
        request: proposal.request,
        progressMessage: `Rebuilding your selection around ${proposal.formattedSuggestedBudget}…`,
        pendingLabel: "Updating budget…",
        successMessage: `Your selection now uses a budget of ${proposal.formattedSuggestedBudget}.`,
        clearInput: proposal.clearInput,
        synchroniseBudgetInput: true
      });
    });

    declineRefinementBudgetButton?.addEventListener("click", () => {
      if (!pendingRefinementBudgetProposal || refinementInFlight) return;
      const proposal = pendingRefinementBudgetProposal;
      dismissRefinementBudgetConfirmation();
      announceRefinement("No changes made. Your current selection has been kept.");
      if (proposal.action === "swap") {
        proposal.trigger?.focus({ preventScroll: true });
      } else {
        refineInput?.focus({ preventScroll: true });
      }
    });

    resultsElement?.addEventListener("change", (event) => {
      if (event.target?.matches("[data-mnw-wine-checkbox]")) renderBudgetImprovement();
    });

    refineUndo?.addEventListener("click", () => {
      if (!previousRefinement || requestInFlight()) return;
      const snapshot = previousRefinement;
      dismissRefinementBudgetConfirmation();
      previousRefinement = null;
      currentRecommendation = snapshot.recommendation;
      currentRequest = snapshot.request;
      budgetEdited = true;
      budgetInput.value = String(currentRequest.budget);
      showRecommendationSelection(snapshot.selectionMode);
      restoreSelectedWineIds(resultsElement, snapshot.selectedIds);
      refreshCurrentSelectedState();
      refineUndo.hidden = true;
      renderBudgetImprovement();
      announceRefinement("Last change undone.");
    });

    addSelectedButton.addEventListener("click", async () => {
      if (!currentRecommendation || requestInFlight()) return;
      const selectedWines = getSelectedWines(resultsElement, currentRecommendation.wines);
      if (selectedWines.length === 0) return;

      cartInFlight = true;
      setBusy(true);
      errorElement.hidden = true;
      const originalLabel = addSelectedLabel.textContent;
      addSelectedButton.disabled = true;
      addSelectedLabel.textContent = "Adding to basket…";
      setPhase("cart");
      const cartEventId = createEventId("cart");
      const cartItems = interactionItemsForWines(selectedWines);
      const selectionTotal = interactionSelectionTotal(cartItems);
      const cartStartedAt = performance.now();

      try {
        sendAnalytics(analyticsEnabled, eventsEndpoint, currentRecommendation.sessionId, "ADD_TO_CART_ATTEMPT", {
          eventId: `${cartEventId}:attempt`,
          selectionTotal,
          items: cartItems
        });
        const cartUrl = await addWinesToCart(
          cartEndpoint,
          wpNonce,
          currentRecommendation.sessionId,
          currentRecommendation.recommendationToken,
          selectedWines
        );
        sendAnalytics(analyticsEnabled, eventsEndpoint, currentRecommendation.sessionId, "ADD_TO_CART_SUCCEEDED", {
          eventId: `${cartEventId}:success`,
          selectionTotal,
          latencyMs: elapsedMilliseconds(cartStartedAt),
          items: cartItems
        });
        await closeDialogAfterCartSuccess(root, dialog, MODAL_CLOSE_ANIMATION_MS);
        window.location.assign(cartUrl);
      } catch (error) {
        sendAnalytics(analyticsEnabled, eventsEndpoint, currentRecommendation.sessionId, "ADD_TO_CART_FAILED", {
          eventId: `${cartEventId}:failure`,
          selectionTotal,
          errorCode: cartFailureCode(error),
          latencyMs: elapsedMilliseconds(cartStartedAt),
          items: cartItems
        });
        setPhase("results");
        showError(error.message || "The wines could not be added to the basket. Please try again.");
      } finally {
        cartInFlight = false;
        setBusy(false);
        addSelectedButton.disabled = false;
        addSelectedLabel.textContent = originalLabel;
        updateSelectedState({
          resultsElement,
          wines: currentRecommendation.wines,
          currency: currentRecommendation.currency || storeCurrency,
          currencyPrecision,
          requestedBudget: Number(currentRequest?.budget || currentRecommendation.requestedBudget || 0),
          resultSummaryElement: totalElement,
          selectedCountElement,
          selectedTotalElement,
          selectedBudgetStatusElement,
          addSelectedButton,
          addSelectedLabel
        });
      }
    });

    showBudgetAlternativeButton?.addEventListener("click", () => {
      showRecommendationSelection("alternative");
      selectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    showExactSelectionButton?.addEventListener("click", () => {
      showRecommendationSelection("exact");
      selectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    trySuggestedBudgetButton?.addEventListener("click", applySuggestedBudget);
    retryWithLowerBudgetButton?.addEventListener("click", () => applyRetryBudget("lower"));
    retryWithHigherBudgetButton?.addEventListener("click", () => applyRetryBudget("higher"));
    editPreferencesButton?.addEventListener("click", () => {
      beginNewRecommendationSession();
      currentRecommendation = null;
      previousRefinement = null;
      dismissRefinementBudgetConfirmation();
      if (refineUndo) refineUndo.hidden = true;
      if (refineStatus) refineStatus.hidden = true;
      selectionElement.hidden = true;
      if (budgetGuidance) budgetGuidance.hidden = true;
      form.hidden = false;
      if (wizardProgress) wizardProgress.hidden = false;
      setPhase("form");
      showWizardStep(3);
    });

    startAgainButton.addEventListener("click", () => {
      beginNewRecommendationSession();
      currentRecommendation = null;
      currentRequest = null;
      currentSelectionMode = "exact";
      previousRefinement = null;
      dismissRefinementBudgetConfirmation();
      if (refineUndo) refineUndo.hidden = true;
      if (refineStatus) refineStatus.hidden = true;
      selectionElement.hidden = true;
      if (budgetNotice) budgetNotice.hidden = true;
      if (budgetGuidance) budgetGuidance.hidden = true;
      hideRetryBudgetChoices();
      errorElement.hidden = true;
      statusElement.hidden = true;
      form.hidden = false;
      if (wizardProgress) wizardProgress.hidden = false;
      setPhase("form");
      showWizardStep(0);
    });

    loadWidgetConfiguration(configEndpoint)
      .then((configuration) => {
        widgetUiLocale = String(configuration.locale || requestedWidgetLocale()).trim() || "en";
        widgetMessages = Object.freeze(
          configuration.messages && typeof configuration.messages === "object"
            ? { ...configuration.messages }
            : {}
        );
        applyStaticWidgetTranslations(root);
        observeWidgetTranslations(root);
        storeCurrency = requireCurrencyCode(configuration.currency);
        serviceLocale = normaliseMarketLocale(configuration.marketLocale);
        storeCurrencySymbol = String(configuration.currencySymbol || "").trim() || null;
        currencyPrecision = requireIntegerInRange(configuration.currencyPrecision, 0, 4, "currency precision");
        minimumBottlePrice = requirePositiveNumber(configuration.minimumBottlePrice, "minimum bottle price");
        minimumOrder = requirePositiveNumber(configuration.minimumOrder, "minimum order");
        maximumBudget = requirePositiveNumber(configuration.maximumBudget, "maximum budget");
        if (maximumBudget < Math.max(minimumBottlePrice, minimumOrder)) {
          throw new Error("The linked merchant currency range is invalid.");
        }

        configuredCategories = normaliseConfiguredCategories(configuration.wineCategories);
        budgetButtonVisibility = normaliseBudgetButtonVisibility(configuration);
        applyCategoryConfiguration(root, breakdownInputs, configuredCategories);
        bottleCountInput.value = String(readBreakdownTotal(form));
        updateAllocationStatus(form, allocationStatus, submitButton);
        updateBreakdownMaximums(breakdownInputs);
        updateBreakdownControlStates(breakdownInputs);
        configurationReady = true;
        refreshBudgetMinimum(normaliseBottleCount(bottleCountInput.value));
        root.hidden = false;
        openButton.disabled = false;
        openButton.setAttribute("aria-busy", "false");
        openButton.removeAttribute("title");
        sendAnalytics(analyticsEnabled, eventsEndpoint, pageSessionId, "IMPRESSION");
      })
      .catch((error) => {
        configurationReady = false;
        root.hidden = true;
        openButton.disabled = true;
        openButton.setAttribute("aria-busy", "false");
        openButton.title = error?.message || "This shop's Wine Finder configuration is unavailable.";
        budgetHelp.textContent = "This shop's currency and spend limits are not configured.";
        if (budgetCurrencyElement) budgetCurrencyElement.textContent = "—";
      });
    bottleCountInput.value = String(readBreakdownTotal(form));
    updateBreakdownMaximums(breakdownInputs);
    updateAllocationStatus(form, allocationStatus, submitButton);
    updateBreakdownControlStates(breakdownInputs);
    setPhase("form");
    showWizardStep(0, { focus: false });
  };

  const readRecommendationForm = (form, configuredCategories = LEGACY_WINE_CATEGORIES) => {
    const data = new FormData(form);
    const categoryCounts = {};
    configuredCategories.forEach((category) => {
      const input = form.querySelector(`[data-mnw-category="${category}"]`);
      categoryCounts[category] = Number(input?.value || 0);
    });
    return {
      bottleCount: Number(data.get("bottleCount")),
      budget: Number(data.get("budget")),
      // Merchant tolerance applies to every new selection; no shopper opt-in control.
      // Do not inherit a removed checkbox from autofill/cached markup.
      strictBudget: false,
      numberRed: Number(categoryCounts.red || 0),
      numberWhite: Number(categoryCounts.white || 0),
      numberSparkling: Number(categoryCounts.sparkling || 0),
      numberDessert: Number(categoryCounts.dessert || 0),
      usualWines: String(data.get("usualWines") || "").trim(),
      foodPairings: String(data.get("foodPairings") || "").trim(),
      categoryCounts
    };
  };

  const validateRecommendationPayload = (
    payload,
    minimumBottlePrice,
    minimumOrder,
    maximumBudget,
    currency,
    currencyPrecision
  ) => {
    if (!Number.isInteger(payload.bottleCount) || payload.bottleCount < MIN_BOTTLE_COUNT || payload.bottleCount > MAX_BOTTLE_COUNT) {
      throw new Error(`Choose between ${MIN_BOTTLE_COUNT} and ${MAX_BOTTLE_COUNT} bottles.`);
    }
    const minimumBudget = Math.max(payload.bottleCount * minimumBottlePrice, minimumOrder);
    const formatter = createCurrencyFormatter(currency, currencyPrecision);
    if (!Number.isFinite(payload.budget) || payload.budget < minimumBudget) {
      const bottleLabel = payload.bottleCount === 1 ? "bottle" : "bottles";
      throw new Error(`The minimum budget for ${payload.bottleCount} ${bottleLabel} is ${formatter.format(minimumBudget)}.`);
    }
    if (payload.budget > maximumBudget) {
      throw new Error(`The maximum supported budget is ${formatter.format(maximumBudget)}.`);
    }
    const categoryKeys = payload.categoryCounts && typeof payload.categoryCounts === "object"
      ? Object.keys(payload.categoryCounts)
      : [];
    const allowedCategoryKeys = new Set(CATEGORY_DEFINITIONS.map((category) => category.key));
    if (categoryKeys.length > 0
        && (categoryKeys.length < 2 || categoryKeys.some((key) => !allowedCategoryKeys.has(key)))) {
      throw new Error("The available bottle categories are invalid. Refresh and try again.");
    }
    const counts = categoryKeys.length > 0
      ? Object.values(payload.categoryCounts)
      : [payload.numberRed, payload.numberWhite, payload.numberSparkling, payload.numberDessert];
    if (counts.some((count) => !Number.isInteger(count) || count < 0)) {
      throw new Error("Every bottle mix value must be a whole number of zero or more.");
    }
    const breakdownTotal = counts.reduce((sum, count) => sum + count, 0);
    if (breakdownTotal !== payload.bottleCount) {
      throw new Error(`The bottle mix adds up to ${breakdownTotal}, not ${payload.bottleCount}.`);
    }
    if (payload.usualWines.length > MAX_FREE_TEXT_LENGTH || payload.foodPairings.length > MAX_FREE_TEXT_LENGTH) {
      throw new Error("One of your answers is too long.");
    }
  };

  const renderWines = (
    container,
    wines,
    currency,
    openQuickView,
    swapWine,
    request,
    selectionStatus
  ) => {
    container.replaceChildren();
    const formatter = createCurrencyFormatter(currency);

    wines.forEach((wine, index) => {
      const card = document.createElement("article");
      card.className = "mnw-wine-card mnw-wine-card--selected";
      card.dataset.mnwWineCard = "true";
      card.dataset.mnwSelected = "true";

      const selectionRow = document.createElement("div");
      selectionRow.className = "mnw-wine-card__selection-row";
      const checkboxId = `mnw-select-${String(wine.sommWineId)}-${String(index)}`;
      const checkbox = document.createElement("input");
      checkbox.id = checkboxId;
      checkbox.className = "mnw-wine-card__checkbox";
      checkbox.type = "checkbox";
      checkbox.checked = true;
      checkbox.dataset.mnwWineCheckbox = "true";
      checkbox.dataset.sommWineId = String(wine.sommWineId);
      const checkboxLabel = document.createElement("label");
      checkboxLabel.className = "mnw-wine-card__checkbox-label";
      checkboxLabel.htmlFor = checkboxId;
      checkboxLabel.textContent = "Included";
      selectionRow.append(checkbox, checkboxLabel);

      const cardBody = document.createElement("div");
      cardBody.className = "mnw-wine-card__body mnw-wine-card__body--quick-view";
      cardBody.tabIndex = 0;
      cardBody.setAttribute("role", "button");
      cardBody.setAttribute("aria-label", `Quick view: ${wine.title || "Wine"}`);

      const imageWrap = document.createElement("div");
      imageWrap.className = "mnw-wine-card__image-wrap";
      if (wine.imageUrl) {
        const image = document.createElement("img");
        image.className = "mnw-wine-card__image";
        image.src = wine.imageUrl;
        image.alt = wine.title || "Wine";
        image.loading = "lazy";
        image.decoding = "async";
        image.addEventListener("error", () => {
          image.remove();
          imageWrap.classList.add("mnw-wine-card__image-wrap--empty");
          imageWrap.textContent = "Wine";
        }, { once: true });
        imageWrap.appendChild(image);
      } else {
        imageWrap.classList.add("mnw-wine-card__image-wrap--empty");
        imageWrap.textContent = "Wine";
      }

      const content = document.createElement("div");
      content.className = "mnw-wine-card__content";
      const title = document.createElement("h4");
      title.className = "mnw-wine-card__title";
      title.textContent = wine.title || "Wine";
      const location = [wine.region, wine.country]
        .map((value) => String(value || "").trim())
        .filter((value, itemIndex, values) => value && values.indexOf(value) === itemIndex)
        .join(", ");
      const vintageValue = typeof wine.vintage === "object"
        ? wine.vintage?.year
        : (wine.vintageYear || wine.vintage);
      const metadata = [location, String(vintageValue || "").trim()].filter(Boolean);
      const meta = document.createElement("p");
      meta.className = "mnw-wine-card__meta";
      meta.textContent = metadata.join(" · ");
      meta.hidden = metadata.length === 0;
      const price = document.createElement("p");
      price.className = "mnw-wine-card__price";
      price.textContent = formatter.format(Number(wine.price || 0));
      content.append(title, meta, price);

      const recommendationReason = directAddressRecommendationCopy(
        wine.recommendationReason || ""
      );
      const recommendationTags = recommendationTagsForWine(wine);
      if (recommendationReason || recommendationTags.length > 0) {
        const reason = document.createElement("div");
        reason.className = "mnw-wine-card__reason";

        if (recommendationTags.length > 0) {
          const reasonTags = document.createElement("div");
          reasonTags.className = "mnw-wine-card__reason-tags";
          renderRecommendationTags(reasonTags, recommendationTags);
          reason.appendChild(reasonTags);
        }

        if (recommendationReason) {
          const reasonLabel = document.createElement("span");
          reasonLabel.className = "mnw-wine-card__reason-label";
          reasonLabel.textContent = "Why we picked it";
          reason.appendChild(reasonLabel);

          const reasonCopy = document.createElement("p");
          reasonCopy.className = "mnw-wine-card__reason-copy";
          reasonCopy.textContent = recommendationReason;
          reason.appendChild(reasonCopy);
        }
        content.appendChild(reason);
      }

      const description = String(wine.description || "").trim();
      if (description) {
        const preview = document.createElement("p");
        preview.className = "mnw-wine-card__preview";
        preview.textContent = description;
        content.appendChild(preview);
      }

      const quickViewLabel = document.createElement("span");
      quickViewLabel.className = "mnw-wine-card__quick-view-label";
      quickViewLabel.textContent = "Quick view";
      quickViewLabel.setAttribute("aria-hidden", "true");
      content.appendChild(quickViewLabel);

      const cardActions = document.createElement("div");
      cardActions.className = "mnw-wine-card__actions";

      let swapButton = null;
      if (typeof swapWine === "function") {
        swapButton = document.createElement("button");
        swapButton.className = "mnw-wine-card__swap-button";
        swapButton.type = "button";
        swapButton.textContent = "Swap";
        swapButton.setAttribute("aria-label", `Swap ${wine.title || "wine"} with another`);
        swapButton.addEventListener("click", (event) => {
          event.stopPropagation();
          swapWine(wine, swapButton);
        });
        cardActions.appendChild(swapButton);
      }

      const selectionToggle = document.createElement("button");
      selectionToggle.className = "mnw-wine-card__selection-toggle";
      selectionToggle.type = "button";
      selectionToggle.dataset.mnwWineSelectionToggle = "true";
      selectionToggle.textContent = "Remove";
      selectionToggle.setAttribute("aria-label", `Remove ${wine.title || "wine"} from selection`);
      selectionToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event("change", { bubbles: true }));
      });
      cardActions.appendChild(selectionToggle);

      const showQuickView = () => openQuickView?.({
        ...wine,
        recommendationReason,
        currency
      }, cardBody);
      cardBody.addEventListener("click", showQuickView);
      cardBody.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        showQuickView();
      });

      cardBody.append(imageWrap, content);
      card.append(selectionRow, cardBody, cardActions);
      container.appendChild(card);
    });
  };

  const attachSelectionListeners = (options) => {
    options.resultsElement.querySelectorAll("[data-mnw-wine-checkbox]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const card = checkbox.closest("[data-mnw-wine-card]");
        updateWineCardSelectionState(card, checkbox);
        updateSelectedState(options);
      });
    });
    updateSelectedState(options);
  };

  const updateSelectedState = ({
    resultsElement, wines, currency, currencyPrecision, requestedBudget,
    resultSummaryElement, selectedCountElement,
    selectedTotalElement, selectedBudgetStatusElement,
    addSelectedButton, addSelectedLabel
  }) => {
    const selectedWines = getSelectedWines(resultsElement, wines);
    const summary = calculateSelectionSummary(
      selectedWines,
      currency,
      requestedBudget,
      currencyPrecision
    );
    selectedCountElement.textContent = `${summary.count} bottle${summary.count === 1 ? "" : "s"} selected`;
    selectedTotalElement.textContent = summary.formattedTotal;
    if (selectedBudgetStatusElement) {
      const budgetPosition = formatBudgetPosition(
        summary.total,
        summary.budget,
        currency,
        currencyPrecision
      );
      selectedBudgetStatusElement.textContent = budgetPosition.text;
      selectedBudgetStatusElement.dataset.mnwBudgetPosition = budgetPosition.state;
      selectedBudgetStatusElement.hidden = !budgetPosition.text;
    }
    if (resultSummaryElement) {
      resultSummaryElement.textContent = `${summary.formattedTotal} of ${summary.formattedBudget}`;
    }
    const action = selectionActionState(summary.count);
    addSelectedButton.disabled = action.disabled;
    addSelectedButton.setAttribute("aria-disabled", String(action.disabled));
    addSelectedLabel.textContent = action.label;
  };

  const selectionActionState = (count) => {
    const selectedCount = Number.isInteger(Number(count)) ? Math.max(0, Number(count)) : 0;
    return {
      disabled: selectedCount === 0,
      label: selectedCount === 0
        ? t("widget.selection.select_one", "Select at least one wine")
        : t(
            selectedCount === 1 ? "widget.selection.add_one" : "widget.selection.add_many",
            selectedCount === 1 ? "Add {count} wine to basket" : "Add {count} wines to basket",
            { count: selectedCount }
          )
    };
  };

  const updateWineCardSelectionState = (card, checkbox) => {
    if (!card || !checkbox) return;
    const selected = Boolean(checkbox.checked);
    card.classList.toggle("mnw-wine-card--selected", selected);
    card.dataset.mnwSelected = String(selected);
    const label = card.querySelector(".mnw-wine-card__checkbox-label");
    if (label) label.textContent = selected ? "Included" : "Removed";
    const selectionToggle = card.querySelector("[data-mnw-wine-selection-toggle]");
    if (selectionToggle) {
      const title = card.querySelector(".mnw-wine-card__title")?.textContent || "wine";
      selectionToggle.textContent = selected ? "Remove" : "Add back";
      selectionToggle.setAttribute(
        "aria-label",
        selected ? `Remove ${title} from selection` : `Add ${title} back to selection`
      );
    }
  };

  const formatSelectionHeadingSummary = (request, fallback = "") => {
    const categoryCounts = request?.categoryCounts && typeof request.categoryCounts === "object"
      ? request.categoryCounts
      : {};
    const frenchSummaryPlurals = Object.freeze({
      red: "rouges",
      white: "blancs",
      rose: "rosés",
      sparkling: "effervescents",
      orange: "oranges",
      petNat: "pét-nats",
      sherry: "xérès",
      otherFortified: "vins fortifiés",
      dessert: "vins de dessert"
    });
    const frenchLocale = /^fr(?:[-_]|$)/i.test(String(widgetUiLocale || ""));
    const portugueseLocale = /^pt(?:[-_]|$)/i.test(String(widgetUiLocale || ""));
    const categoryParts = CATEGORY_DEFINITIONS
      .map((category) => {
        const count = Number(categoryCounts[category.key] || 0);
        const singularLabel = t(`widget.category.${category.key}.summary`, category.label.toLowerCase());
        const label = (frenchLocale || portugueseLocale) && Number.isInteger(count) && count > 1
          ? t(
              `widget.category.${category.key}.plural`,
              (frenchLocale && frenchSummaryPlurals[category.key]) || category.plural
            ).toLowerCase()
          : singularLabel;
        return { label, count };
      })
      .filter((category) => Number.isInteger(category.count) && category.count > 0)
      .map((category) => t(
        "widget.selection.category_count",
        "{count} {category}",
        { count: category.count, category: category.label }
      ));
    const requestedCount = Number(request?.bottleCount || 0);
    const derivedCount = Object.values(categoryCounts)
      .reduce((sum, value) => sum + (Number.isFinite(Number(value)) ? Number(value) : 0), 0);
    const bottleCount = Number.isInteger(requestedCount) && requestedCount > 0
      ? requestedCount
      : derivedCount;
    if (!Number.isInteger(bottleCount) || bottleCount <= 0) return String(fallback || "");
    const bottleText = t(
      bottleCount === 1 ? "widget.selection.bottle_one" : "widget.selection.bottle_many",
      bottleCount === 1 ? "{count} bottle" : "{count} bottles",
      { count: bottleCount }
    );
    return [bottleText, ...categoryParts].join(" · ");
  };

  const formatBudgetPosition = (
    total,
    budget,
    currency,
    currencyPrecision = null,
    locale = null
  ) => {
    const numericTotal = Number(total || 0);
    const numericBudget = Number(budget || 0);
    if (!Number.isFinite(numericTotal) || !Number.isFinite(numericBudget) || numericBudget <= 0) {
      return { state: "none", text: "" };
    }
    const difference = numericBudget - numericTotal;
    if (Math.abs(difference) <= 0.0001) return {
      state: "on",
      text: t("widget.selection.on_budget", "On budget")
    };
    const formatter = createCurrencyFormatter(currency, currencyPrecision, locale);
    return difference > 0
      ? { state: "under", text: t("widget.selection.under_budget", "{amount} under budget", { amount: formatter.format(difference) }) }
      : { state: "over", text: t("widget.selection.over_budget", "{amount} over budget", { amount: formatter.format(Math.abs(difference)) }) };
  };

  const calculateSelectionSummary = (
    selectedWines,
    currency,
    requestedBudget,
    currencyPrecision = null,
    locale = null
  ) => {
    const wines = Array.isArray(selectedWines) ? selectedWines : [];
    const total = wines.reduce((sum, wine) => sum + Number(wine?.price || 0), 0);
    const budget = Number(requestedBudget || 0);
    const formatter = createCurrencyFormatter(currency, currencyPrecision, locale);
    return {
      count: wines.length,
      total,
      budget,
      formattedTotal: formatter.format(total),
      formattedBudget: formatter.format(budget)
    };
  };

  const createLoadingMessageController = (
    element,
    messages,
    intervalMilliseconds = 1800,
    scheduler = globalThis
  ) => {
    const safeMessages = Array.isArray(messages) && messages.length > 0
      ? messages.map((message) => String(message))
      : ["Building your selection…"];
    let timer = null;
    let index = 0;
    const stop = () => {
      if (timer !== null) scheduler.clearInterval(timer);
      timer = null;
    };
    const start = () => {
      stop();
      index = 0;
      if (element) element.textContent = safeMessages[index];
      timer = scheduler.setInterval(() => {
        index = (index + 1) % safeMessages.length;
        if (element) element.textContent = safeMessages[index];
      }, intervalMilliseconds);
    };
    return { start, stop, isRunning: () => timer !== null };
  };

  const clonePlainData = (value) => {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  };

  // The backend has ALREADY selected the better basket. This validates the
  // explanation/fallback; it never promotes a client-side upgrade or changes the budget.
  const validateBudgetImprovement = (recommendation, request, precision = 2) => {
    try {
      const improvement = recommendation?.budgetImprovement;
      const selected = recommendation?.wines;
      const baseline = improvement?.wines;
      if (!improvement || improvement.appliedToMainSelection !== true || request?.strictBudget === true
          || !Array.isArray(selected) || !selected.length || !Array.isArray(baseline)
          || baseline.length !== selected.length || !Array.isArray(improvement.baseWineIds)
          || !Array.isArray(improvement.selectedWineIds) || !Array.isArray(improvement.changes)
          || !improvement.changes.length || improvement.changes.length > selected.length
          || !Number.isInteger(precision) || precision < 0 || precision > 4) return null;
      const factor = 10 ** precision;
      const minor = (value) => {
        if (value === null || value === undefined || value === "") return NaN;
        const scaled = Number(value) * factor;
        const rounded = Math.round(scaled);
        return Number.isSafeInteger(rounded) && Math.abs(scaled - rounded) < 0.00001 ? rounded : NaN;
      };
      const ids = (wines) => wines.map((wine) => String(wine.sommWineId));
      const validWine = (wine) => wine && Number.isSafeInteger(Number(wine.sommWineId))
        && Number(wine.sommWineId) > 0 && /^\d+$/.test(String(wine.variantId || ""))
        && String(wine.title || "").trim() && Number.isSafeInteger(minor(wine.price)) && minor(wine.price) > 0;
      if (!selected.every(validWine) || !baseline.every(validWine)) return null;
      const sameIds = (actual, declared) => actual.length === declared.length
        && new Set(actual).size === actual.length && new Set(declared.map(String)).size === declared.length
        && declared.every((id) => actual.includes(String(id)));
      if (!sameIds(ids(selected), improvement.selectedWineIds)
          || !sameIds(ids(baseline), improvement.baseWineIds)) return null;
      const before = new Map(baseline.map((wine) => [String(wine.sommWineId), wine]));
      const after = new Map(selected.map((wine) => [String(wine.sommWineId), wine]));
      const removed = new Set();
      const inserted = new Set();
      const percent = improvement.tolerancePercent;
      if (!Number.isInteger(percent) || percent < 1 || percent > 20) return null;
      // Currency, not locale: EUR has the agreed 20% / EUR 5 safeguard. Other currencies
      // (and legacy responses without currency) retain their previous percentage cap.
      const euro = String(recommendation.currency || "").trim().toUpperCase() === "EUR";
      const bottlePercent = euro ? 20 : percent;
      const maximumBottleExtra = euro ? minor(5) : null;
      let changedCost = 0;
      for (const change of improvement.changes) {
        const from = String(change?.replacedWineId);
        const to = String(change?.replacementWineId);
        const oldWine = before.get(from);
        const newWine = after.get(to);
        if (!oldWine || !newWine || after.has(from) || before.has(to)
            || removed.has(from) || inserted.has(to) || !String(change.explanation || "").trim()) return null;
        const extra = minor(newWine.price) - minor(oldWine.price);
        // Integer minor-unit arithmetic; preserve strict rounding at fractional-cent boundaries.
        const sourceMinor = minor(oldWine.price);
        const percentNumerator = sourceMinor * bottlePercent;
        if (!Number.isSafeInteger(percentNumerator)) return null;
        const proportionalExtra = Math.floor(percentNumerator / 100);
        const permittedExtra = euro ? Math.min(proportionalExtra, maximumBottleExtra) : proportionalExtra;
        if (extra <= 0 || minor(change.addedCost) !== extra || extra > permittedExtra) return null;
        changedCost += extra;
        removed.add(from); inserted.add(to);
      }
      for (const [id, wine] of before) {
        if (removed.has(id)) continue;
        const retained = after.get(id);
        if (!retained || String(wine.variantId) !== String(retained.variantId)
            || minor(wine.price) !== minor(retained.price)) return null;
      }
      if ([...after.keys()].some((id) => !before.has(id) && !inserted.has(id))) return null;
      const budget = minor(request?.budget ?? recommendation.requestedBudget);
      const baseTotal = baseline.reduce((sum, wine) => sum + minor(wine.price), 0);
      const total = selected.reduce((sum, wine) => sum + minor(wine.price), 0);
      const maximum = minor(improvement.maximumTotal);
      if (![budget, baseTotal, total, changedCost, maximum].every(Number.isSafeInteger)
          || budget <= 0 || baseTotal > budget || total <= baseTotal
          || !Number.isInteger(percent) || percent < 1 || percent > 20
          || total > maximum || maximum > Math.floor(budget * (100 + percent) / 100)
          || minor(recommendation.total) !== total || minor(recommendation.requestedBudget) !== budget
          || minor(improvement.originalTotal) !== baseTotal || minor(improvement.total) !== total
          || total - baseTotal !== changedCost || minor(improvement.addedCost) !== changedCost
          || minor(improvement.aboveBudgetAmount) !== Math.max(0, total - budget)
          || !Array.isArray(improvement.matchedPreferences) || !Array.isArray(improvement.unmetPreferences)
          // No named preferences/foods can legitimately produce an empty semantic ledger.
          || typeof improvement.requirementInterpretation !== "string") return null;
      return improvement;
    } catch (_) {
      return null; // Malformed comparison metadata cannot destroy the server's main selection.
    }
  };

  const chooseWithinBudgetSelection = (recommendation, request, precision = 2) => {
    const improvement = validateBudgetImprovement(recommendation, request, precision);
    if (!improvement) return null;
    const fixedRequest = { ...clonePlainData(request), strictBudget: true };
    const baseline = {
      ...clonePlainData(recommendation),
      summary: improvement.summary,
      total: improvement.originalTotal,
      requestedBudget: fixedRequest.budget,
      overBudget: false,
      budgetDifference: 0,
      requirementInterpretation: improvement.requirementInterpretation,
      selectionStatus: improvement.selectionStatus,
      customerMessage: improvement.customerMessage,
      matchedPreferences: clonePlainData(improvement.matchedPreferences),
      unmetPreferences: clonePlainData(improvement.unmetPreferences),
      wines: clonePlainData(improvement.wines),
      budgetAlternative: null,
      budgetImprovement: null,
      budgetToleranceAllowance: null,
      refinedRequest: fixedRequest
    };
    baseline.exactSelection = {
      summary: baseline.summary, total: baseline.total,
      explanation: String(baseline.customerMessage || "").trim(),
      matchedPreferences: baseline.matchedPreferences,
      unmetPreferences: baseline.unmetPreferences, wines: baseline.wines
    };
    return { recommendation: baseline, request: fixedRequest };
  };

  // After an equal/cheaper swap the comparison may be stale, but swapping may remain available.
  // The backend independently checks live prices, merchant limits and non-increasing spend.
  const toleranceSwapAllowed = (recommendation, request, precision = 2) => {
    const allowance = recommendation?.budgetToleranceAllowance;
    if (!allowance || request?.strictBudget === true || !Number.isInteger(precision)
        || precision < 0 || precision > 4) return false;
    const factor = 10 ** precision;
    const minor = (value) => Math.round(Number(value) * factor);
    const budget = minor(request?.budget);
    const total = minor(recommendation?.total);
    const maximum = minor(allowance.maximumTotal);
    const initialTotal = minor(allowance.selectedTotal);
    return [budget, total, maximum, initialTotal].every(Number.isSafeInteger)
      && budget > 0 && total > budget && minor(allowance.requestedBudget) === budget
      && Number.isInteger(allowance.tolerancePercent) && allowance.tolerancePercent >= 1
      && allowance.tolerancePercent <= 20 && total <= initialTotal && initialTotal <= maximum
      && maximum <= Math.floor(budget * (100 + allowance.tolerancePercent) / 100);
  };

  const createRefinementSnapshot = (recommendation, request, selectionMode, selectedIds) => ({
    recommendation: clonePlainData(recommendation),
    request: clonePlainData(request),
    selectionMode: selectionMode === "alternative" ? "alternative" : "exact",
    selectedIds: new Set(Array.from(selectedIds || []).map(String))
  });

  const preserveBudgetOnlyRequestState = (request, result) => {
    if (!request || typeof request !== "object" || !result || typeof result !== "object") {
      return result;
    }
    const refined = result.refinedRequest && typeof result.refinedRequest === "object"
      ? result.refinedRequest
      : {};
    result.refinedRequest = {
      ...refined,
      colour: request.colour,
      bottleCount: request.bottleCount,
      occasion: request.occasion,
      style: request.style,
      budget: request.budget,
      strictBudget: request.strictBudget === true,
      numberRed: request.numberRed,
      numberWhite: request.numberWhite,
      numberSparkling: request.numberSparkling,
      numberDessert: request.numberDessert,
      usualWines: request.usualWines,
      foodPairings: request.foodPairings,
      categoryCounts: clonePlainData(request.categoryCounts || {})
    };
    return result;
  };

  const preserveRetainedRecommendationEvidence = (previousRecommendation, result) => {
    if (!previousRecommendation || !result || !Array.isArray(result.wines)) return result;
    const previousWines = Array.isArray(previousRecommendation.wines)
      ? previousRecommendation.wines
      : previousRecommendation.exactSelection?.wines;
    if (!Array.isArray(previousWines)) return result;

    const previousById = new Map(previousWines
      .filter((wine) => wine?.sommWineId !== undefined && wine?.sommWineId !== null)
      .map((wine) => [String(wine.sommWineId), wine]));
    result.wines = result.wines.map((wine) => {
      const previous = previousById.get(String(wine?.sommWineId));
      if (!previous) return wine;
      return {
        ...wine,
        recommendationLabel: String(wine?.recommendationLabel || "").trim()
          || previous.recommendationLabel,
        recommendationReason: String(wine?.recommendationReason || "").trim()
          || previous.recommendationReason
      };
    });

    result.matchedPreferences = normaliseDisplayList(result.matchedPreferences);
    result.unmetPreferences = normaliseDisplayList(result.unmetPreferences);
    return result;
  };

  const createRefinementRequestPayload = (
    request,
    recommendation,
    instruction,
    refinementMode = "FREE_TEXT"
  ) => ({
    originalRequest: request,
    originalRequirementInterpretation: String(recommendation?.requirementInterpretation || ""),
    currentWineIds: Array.isArray(recommendation?.wines)
      ? recommendation.wines.map((wine) => wine?.sommWineId)
      : [],
    instruction: String(instruction || ""),
    refinementMode: refinementMode === "BUDGET_ONLY" ? "BUDGET_ONLY" : "FREE_TEXT",
    sessionId: recommendation?.sessionId
  });

  const createBudgetRetryRefinement = (
    request,
    budget,
    currency,
    currencyPrecision = 2
  ) => {
    const precision = Number.isInteger(currencyPrecision)
      ? Math.max(0, Math.min(4, currencyPrecision))
      : 2;
    const targetBudget = roundMoney(budget, precision);
    if (!request || typeof request !== "object"
        || !Number.isFinite(targetBudget) || targetBudget <= 0) {
      throw new Error("The retry budget is invalid.");
    }
    const updatedRequest = clonePlainData(request);
    updatedRequest.budget = targetBudget;
    const currencyCode = normaliseCurrencyCode(currency);
    return {
      request: updatedRequest,
      instruction: `The shopper selected a new total order budget of ${currencyCode} ${targetBudget.toFixed(precision)}. Rebuild the selection for that budget while preserving all other order requirements.`
    };
  };

  const validateRefinementResponse = (result, configuredCategories = null) => {
    if (!result || !result.sessionId || !result.refinedRequest) {
      throw new Error("We could not finish that change. We have kept your current wines.");
    }
    const wines = Array.isArray(result.wines) ? result.wines : [];
    const bottleCount = Number(result.refinedRequest.bottleCount);
    const refinedCounts = result.refinedRequest.categoryCounts;
    const refinedCategoryKeys = refinedCounts && typeof refinedCounts === "object"
      ? Object.keys(refinedCounts)
      : [];
    if (Array.isArray(configuredCategories)
        && (refinedCategoryKeys.length !== configuredCategories.length
          || configuredCategories.some((category) => !refinedCategoryKeys.includes(category))
          || Object.values(refinedCounts).some((count) => !Number.isInteger(Number(count)) || Number(count) < 0)
          || Object.values(refinedCounts).reduce((sum, count) => sum + Number(count), 0) !== bottleCount)) {
      throw new Error("That change included a wine type this shop does not offer. We have kept your current wines.");
    }
    const ids = wines.map((wine) => String(wine?.sommWineId || ""));
    if (!Number.isInteger(bottleCount)
        || wines.length !== bottleCount
        || ids.some((id) => !/^\d+$/.test(id))
        || new Set(ids).size !== ids.length
        || wines.some((wine) => !Number.isFinite(Number(wine?.price)) || Number(wine.price) <= 0)) {
      throw new Error("We could not make that change. We have kept your current wines.");
    }
    return true;
  };

  const createRefinementBudgetProposal = (
    error,
    request,
    instruction,
    currency,
    currencyPrecision = null,
    locale = null,
    maximumBudget = null
  ) => {
    const details = error?.details;
    const suggestedBudget = Number(details?.suggestedBudget);
    const responseBudget = Number(details?.requestedBudget);
    const requestBudget = Number(request?.budget);
    const requestedBudget = Number.isFinite(responseBudget) && responseBudget > 0
      ? responseBudget
      : requestBudget;
    const maximum = Number(maximumBudget);
    const cleanInstruction = String(instruction || "").replace(/\s+/g, " ").trim();
    if (details?.code !== "BUDGET_INCREASE_REQUIRED"
        || !request || !cleanInstruction
        || !Number.isFinite(requestedBudget) || requestedBudget <= 0
        || !Number.isFinite(suggestedBudget) || suggestedBudget <= requestedBudget
        || (Number.isFinite(maximum) && maximum > 0 && suggestedBudget > maximum)) {
      return null;
    }

    const formatter = createCurrencyFormatter(currency, currencyPrecision, locale);
    const difference = suggestedBudget - requestedBudget;
    const formattedRequestedBudget = formatter.format(requestedBudget);
    const formattedSuggestedBudget = formatter.format(suggestedBudget);
    const formattedDifference = formatter.format(difference);
    return {
      instruction: cleanInstruction,
      request: {
        ...request,
        budget: suggestedBudget,
        ...(request.categoryCounts && typeof request.categoryCounts === "object"
          ? { categoryCounts: { ...request.categoryCounts } }
          : {})
      },
      requestedBudget,
      suggestedBudget,
      difference,
      formattedRequestedBudget,
      formattedSuggestedBudget,
      formattedDifference,
      prompt: t("widget.refine.budget_question", "That change would cost {suggested}, which is {difference} above your {current} budget. Is that okay?", {
        suggested: formattedSuggestedBudget, difference: formattedDifference, current: formattedRequestedBudget
      }),
      acceptLabel: `Yes, use ${formattedSuggestedBudget}`
    };
  };

  const createSwapBudgetProposal = (
    error,
    request,
    currency,
    currencyPrecision = null,
    locale = null,
    maximumBudget = null
  ) => {
    const details = error?.details;
    const suggestedBudget = Number(details?.suggestedBudget);
    const responseBudget = Number(details?.requestedBudget);
    const requestBudget = Number(request?.budget);
    const requestedBudget = Number.isFinite(responseBudget) && responseBudget > 0
      ? responseBudget
      : requestBudget;
    const maximum = Number(maximumBudget);
    if (details?.code !== "BUDGET_INCREASE_REQUIRED"
        || !request
        || !Number.isFinite(requestedBudget) || requestedBudget <= 0
        || !Number.isFinite(suggestedBudget) || suggestedBudget <= requestedBudget
        || (Number.isFinite(maximum) && maximum > 0 && suggestedBudget > maximum)) {
      return null;
    }

    const formatter = createCurrencyFormatter(currency, currencyPrecision, locale);
    const difference = suggestedBudget - requestedBudget;
    const formattedRequestedBudget = formatter.format(requestedBudget);
    const formattedSuggestedBudget = formatter.format(suggestedBudget);
    const formattedDifference = formatter.format(difference);
    return {
      request: {
        ...request,
        budget: suggestedBudget,
        ...(request.categoryCounts && typeof request.categoryCounts === "object"
          ? { categoryCounts: { ...request.categoryCounts } }
          : {})
      },
      requestedBudget,
      suggestedBudget,
      difference,
      formattedRequestedBudget,
      formattedSuggestedBudget,
      formattedDifference,
      prompt: `The nearest available replacement needs ${formattedSuggestedBudget}, ${formattedDifference} above your current ${formattedRequestedBudget} budget. Is that okay?`,
      acceptLabel: `Yes, use ${formattedSuggestedBudget}`
    };
  };

  const refinementFailureMessage = (
    error,
    currency,
    currencyPrecision = null,
    locale = null
  ) => {
    const suggestedBudget = Number(error?.details?.suggestedBudget);
    if (error?.details?.code === "BUDGET_INCREASE_REQUIRED"
        && Number.isFinite(suggestedBudget)
        && suggestedBudget > 0) {
      const formatted = createCurrencyFormatter(
        currency,
        currencyPrecision,
        locale
      ).format(suggestedBudget);
      return t("widget.refine.exact_needs", "That change needs at least {amount}. We have kept your current wines.", { amount: formatted });
    }
    const message = String(
      error?.message || "We could not make that change."
    ).trim();
    return /current selection has been kept/i.test(message)
      ? message
      : `${message}${/[.!?]$/.test(message) ? "" : "."} Your current selection has been kept.`;
  };

  const stableVisualPhase = (phase) => phase === "cart" ? "results" : phase;

  const trapModalFocus = (event, container) => {
    if (!event || !container) return false;
    const focusable = Array.from(container.querySelectorAll(
      "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )).filter((element) => !element.hidden
      && element.getAttribute?.("aria-hidden") !== "true"
      && (typeof element.getClientRects !== "function" || element.getClientRects().length > 0));
    if (focusable.length === 0) return false;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = typeof document !== "undefined" ? document.activeElement : event.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
      return true;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
      return true;
    }
    return false;
  };

  const closeDialogAfterCartSuccess = (root, dialog, duration = MODAL_CLOSE_ANIMATION_MS) => {
    if (!root || !dialog) return Promise.resolve();
    const dimensions = dialog.getBoundingClientRect();
    root.style.setProperty("--mnw-closing-width", `${dimensions.width}px`);
    root.style.setProperty("--mnw-closing-height", `${dimensions.height}px`);
    root.classList.add("mnw-wine-finder--closing");

    return new Promise((resolve) => {
      let completed = false;
      let timer = null;
      const finish = () => {
        if (completed) return;
        completed = true;
        if (timer !== null) globalThis.clearTimeout(timer);
        dialog.removeEventListener?.("animationend", onAnimationEnd);
        if (typeof dialog.close === "function" && dialog.open) dialog.close();
        else dialog.removeAttribute?.("open");
        root.classList.remove("mnw-wine-finder--closing");
        root.style.removeProperty("--mnw-closing-width");
        root.style.removeProperty("--mnw-closing-height");
        resolve();
      };
      const onAnimationEnd = (event) => {
        if (event.target === dialog) finish();
      };
      dialog.addEventListener?.("animationend", onAnimationEnd);
      timer = globalThis.setTimeout(finish, Math.max(0, duration) + 50);
    });
  };

  const getSelectedWines = (resultsElement, wines) => {
    const ids = new Set(Array.from(resultsElement.querySelectorAll("[data-mnw-wine-checkbox]:checked"))
      .map((checkbox) => checkbox.dataset.sommWineId));
    return wines.filter((wine) => ids.has(String(wine.sommWineId)));
  };

  const getSelectedWineIds = (resultsElement) => new Set(
    Array.from(resultsElement.querySelectorAll("[data-mnw-wine-checkbox]:checked"))
      .map((checkbox) => String(checkbox.dataset.sommWineId))
  );

  const restoreSelectedWineIds = (resultsElement, selectedIds, replacementId, replacedId) => {
    const replacementShouldBeSelected = selectedIds.has(String(replacedId));
    resultsElement.querySelectorAll("[data-mnw-wine-checkbox]").forEach((checkbox) => {
      checkbox.checked = checkbox.dataset.sommWineId === String(replacementId)
        ? replacementShouldBeSelected
        : selectedIds.has(String(checkbox.dataset.sommWineId));
      updateWineCardSelectionState(
        checkbox.closest("[data-mnw-wine-card]"),
        checkbox
      );
    });
  };

  const createPageSessionId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `wf-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  // Per-tab, first-party identity only. No preferences, wine selections or customer details are stored here.
  const visitIdsInMemory = new Map();
  const getOrCreateVisitId = (scope) => {
    const key = `mnw:visit:v1:${String(scope || "widget").split("?")[0]}`;
    const now = Date.now();
    const valid = (value) => value && /^[A-Za-z0-9._:-]{8,100}$/.test(value.id || "")
      && Number.isFinite(value.createdAt) && value.createdAt <= now
      && now - value.createdAt < 24 * 60 * 60 * 1000;
    let stored = visitIdsInMemory.get(key);
    try {
      const candidate = JSON.parse(window.sessionStorage.getItem(key) || "null");
      if (valid(candidate)) stored = candidate;
    } catch (_) { /* Storage may be blocked. Keep this page's in-memory identity. */ }
    if (!valid(stored)) stored = { id: createPageSessionId(), createdAt: now };
    visitIdsInMemory.set(key, stored);
    try { window.sessionStorage.setItem(key, JSON.stringify(stored)); } catch (_) { /* Page-only fallback. */ }
    return stored.id;
  };

  const createEventId = (prefix) => `${String(prefix || "event")}:${createPageSessionId()}`.slice(0, 100);

  const interactionItemsForWines = (wines) => (Array.isArray(wines) ? wines : [])
    .map((wine, index) => ({
      sommWineId: Number(wine?.sommWineId),
      externalProductId: String(wine?.variantId || "").trim() || null,
      positionNumber: index + 1,
      quantity: 1,
      value: Number(wine?.price || 0)
    }))
    .filter((item) => Number.isInteger(item.sommWineId)
      && item.sommWineId > 0
      && Number.isFinite(item.value)
      && item.value >= 0);

  const interactionSelectionTotal = (items) => Number((items || [])
    .reduce((total, item) => total + Number(item.value || 0), 0)
    .toFixed(4));

  const elapsedMilliseconds = (startedAt) => Math.max(
    0,
    Math.min(3600000, Math.round(performance.now() - startedAt))
  );

  const cartFailureCode = (error) => {
    const status = Number(error?.status);
    if (Number.isInteger(status) && status >= 400 && status <= 599) return `HTTP_${status}`;
    if (/too long|timed out|timeout/i.test(String(error?.message || ""))) return "CART_TIMEOUT";
    return "CART_REQUEST_FAILED";
  };

  const wordpressStatisticsConsentAllowed = () => {
    try {
      return typeof window.wp_has_consent !== "function"
        || window.wp_has_consent("statistics") === true;
    } catch (_) {
      return false;
    }
  };

  const sendAnalytics = (enabled, endpoint, sessionId, type, details = {}) => {
    if (!enabled || !endpoint || !wordpressStatisticsConsentAllowed()) return Promise.resolve(false);
    const body = JSON.stringify({ type, sessionId, ...details });
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body,
      cache: "no-store",
      credentials: "same-origin",
      keepalive: true
    }).then((response) => response.ok).catch(() => {
      // Analytics must never interrupt the customer's storefront journey.
      return false;
    });
  };

  const applyThemeStyles = (root) => {
    const fallbackAccent = usableThemeColour(root.dataset.fallbackAccent) || "#1f1f1f";
    const fallbackAccentContrast = ensureReadableForeground(
      fallbackAccent,
      usableThemeColour(root.dataset.fallbackAccentContrast) || "#ffffff"
    );

    if (root.dataset.inheritThemeStyles !== "true") {
      root.style.setProperty("--mnw-theme-accent", fallbackAccent);
      root.style.setProperty("--mnw-theme-accent-contrast", fallbackAccentContrast);
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    const heading = document.querySelector("h1, h2, .h1, .h2");
    const headingStyle = heading ? getComputedStyle(heading) : bodyStyle;
    const buttonStyle = findThemeButtonStyle(root);

    const accent = firstUsableThemeColour(
      buttonStyle?.backgroundColor,
      documentStyle.getPropertyValue("--color-button"),
      documentStyle.getPropertyValue("--color-primary-button"),
      documentStyle.getPropertyValue("--primary-button-background"),
      documentStyle.getPropertyValue("--button-background-color"),
      fallbackAccent
    );
    const accentContrast = ensureReadableForeground(
      accent,
      firstUsableThemeColour(
        buttonStyle?.color,
        documentStyle.getPropertyValue("--color-button-text"),
        documentStyle.getPropertyValue("--color-primary-button-text"),
        documentStyle.getPropertyValue("--primary-button-text-color"),
        documentStyle.getPropertyValue("--button-text-color"),
        fallbackAccentContrast
      )
    );
    const surface = firstUsableThemeColour(bodyStyle.backgroundColor, "#ffffff");
    const text = ensureReadableForeground(
      surface,
      firstUsableThemeColour(bodyStyle.color, "#1f1f1f")
    );

    root.style.setProperty("--mnw-theme-font", bodyStyle.fontFamily);
    root.style.setProperty("--mnw-theme-heading-font", headingStyle.fontFamily);
    root.style.setProperty("--mnw-theme-text", text);
    root.style.setProperty("--mnw-theme-surface", surface);
    root.style.setProperty("--mnw-theme-accent", accent);
    root.style.setProperty("--mnw-theme-accent-contrast", accentContrast);
    if (buttonStyle?.borderRadius) {
      root.style.setProperty("--mnw-theme-radius", buttonStyle.borderRadius);

      const themeRadius = Number.parseFloat(buttonStyle.borderRadius);
      if (Number.isFinite(themeRadius)) {
        root.style.setProperty("--mnw-theme-control-radius", `${Math.min(themeRadius, 16)}px`);
      }
    }
  };

  const findThemeButtonStyle = (root) => {
    const selectors = [
      ".button--primary",
      ".product-form__submit",
      "button[type='submit']",
      "a.button",
      "button.button",
      "button"
    ];

    for (const selector of selectors) {
      for (const element of document.querySelectorAll(selector)) {
        if (root.contains(element) || element.offsetParent === null || element.disabled) continue;
        const style = getComputedStyle(element);
        if (Number.parseFloat(style.opacity || "1") <= 0) continue;
        if (!usableThemeColour(style.backgroundColor)) continue;
        return style;
      }
    }
    return null;
  };

  const firstUsableThemeColour = (...values) => {
    for (const value of values) {
      const colour = usableThemeColour(value);
      if (colour) return colour;
    }
    return null;
  };

  const usableThemeColour = (value) => {
    const colour = String(value || "").trim();
    if (!colour || colour === "transparent" || colour === "rgba(0, 0, 0, 0)") return null;
    if (/^\d+(?:\.\d+)?(?:\s*,\s*|\s+)\d+(?:\.\d+)?(?:\s*,\s*|\s+)\d+(?:\.\d+)?$/.test(colour)) {
      return `rgb(${colour.replace(/\s+/g, ", ").replace(/,\s*,/g, ",")})`;
    }
    return colour;
  };

  const ensureReadableForeground = (background, preferredForeground) => {
    const backgroundRgb = parseCssColour(background);
    if (!backgroundRgb) return preferredForeground || "#ffffff";

    const preferredRgb = parseCssColour(preferredForeground);
    if (preferredRgb && contrastRatio(backgroundRgb, preferredRgb) >= 4.5) {
      return preferredForeground;
    }

    const light = { red: 255, green: 255, blue: 255 };
    const dark = { red: 17, green: 17, blue: 17 };
    return contrastRatio(backgroundRgb, light) >= contrastRatio(backgroundRgb, dark)
      ? "#ffffff"
      : "#111111";
  };

  const parseCssColour = (value) => {
    const colour = usableThemeColour(value);
    if (!colour) return null;

    const hexMatch = colour.match(/^#([0-9a-f]{3}|[0-9a-f]{6})(?:[0-9a-f]{2})?$/i);
    if (hexMatch) {
      const hex = hexMatch[1].length === 3
        ? hexMatch[1].split("").map((character) => `${character}${character}`).join("")
        : hexMatch[1];
      return {
        red: Number.parseInt(hex.slice(0, 2), 16),
        green: Number.parseInt(hex.slice(2, 4), 16),
        blue: Number.parseInt(hex.slice(4, 6), 16)
      };
    }

    const rgbMatch = colour.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (!rgbMatch) return null;
    return {
      red: Math.min(255, Number(rgbMatch[1])),
      green: Math.min(255, Number(rgbMatch[2])),
      blue: Math.min(255, Number(rgbMatch[3]))
    };
  };

  const contrastRatio = (first, second) => {
    const firstLuminance = relativeLuminance(first);
    const secondLuminance = relativeLuminance(second);
    const lighter = Math.max(firstLuminance, secondLuminance);
    const darker = Math.min(firstLuminance, secondLuminance);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const relativeLuminance = ({ red, green, blue }) => {
    const channels = [red, green, blue].map((channel) => {
      const value = channel / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
  };

  const addWinesToCart = async (cartEndpoint, wpNonce, sessionId, recommendationToken, wines) => {
    if (!cartEndpoint || !wpNonce || !recommendationToken) {
      throw new Error("The basket session is incomplete. Refresh the page and try again.");
    }
    const selected = wines.map((wine) => {
      const variantId = String(wine.variantId || "").trim();
      const sommWineId = Number(wine.sommWineId);
      if (!/^\d+$/.test(variantId) || !Number.isInteger(sommWineId) || sommWineId < 1) {
        throw new Error("One recommended wine is temporarily unavailable. Choose your wines again.");
      }
      return { variantId, sommWineId };
    });

    const result = await fetchJson(cartEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-WP-Nonce": wpNonce
      },
      body: JSON.stringify({
        sessionId: String(sessionId),
        recommendationToken: String(recommendationToken),
        wines: selected
      }),
      cache: "no-store"
    }, CART_TIMEOUT_MS, "The basket took too long to respond. Please try again.");
    return result.cartUrl || "/cart/";
  };

  const fetchJson = async (url, options, timeoutMs, timeoutMessage) => {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      const text = await response.text();
      let body = {};
      if (text) {
        try { body = JSON.parse(text); }
        catch { throw new Error("The service returned an unexpected response. Please try again."); }
      }
      if (!response.ok) {
        const rawMessage = body.error || body.description || body.message || `Request failed (${response.status}).`;
        const translatedMessage = translateKnownWidgetText(rawMessage);
        const safeMessage = widgetUiLocale.toLowerCase().startsWith("en") || translatedMessage !== rawMessage
          ? translatedMessage
          : t("widget.error.generic_request", "We could not complete that request. Please try again.");
        const error = new Error(safeMessage);
        error.details = body;
        error.status = response.status;
        throw error;
      }
      return body;
    } catch (error) {
      if (error.name === "AbortError") throw new Error(timeoutMessage);
      throw error;
    } finally {
      globalThis.clearTimeout(timeout);
    }
  };

  const directAddressRecommendationCopy = (value) => String(value || "")
    .replace(/\s+/g, " ")
    .trim();

  const normaliseRecommendationTags = (value) => {
    if (!Array.isArray(value)) return [];

    const tags = new Map();
    value.forEach((item) => {
      let type = String(item?.type || "").trim().toUpperCase();
      let label = String(item?.label || "").replace(/\s+/g, " ").trim();
      if (!label || (type !== "MATCH" && type !== "SUBSTITUTE")) return;
      tags.set(`${type}:${label.toLowerCase()}`, { type, label });
    });
    return Array.from(tags.values()).slice(0, 6);
  };

  const renderRecommendationTags = (container, tags) => {
    if (!container) return;
    container.replaceChildren();

    normaliseRecommendationTags(tags).forEach((tag) => {
      const chip = document.createElement("span");
      chip.className = `mnw-recommendation-tag mnw-recommendation-tag--${tag.type.toLowerCase()}`;
      chip.textContent = tag.type === "SUBSTITUTE"
        ? t("widget.recommendation.substitute", "Instead of: {label}", { label: tag.label })
        : tag.label;
      if (tag.type === "SUBSTITUTE") {
        chip.title = t(
          "widget.recommendation.substitute_title",
          "An alternative for {label}",
          { label: tag.label }
        );
      }
      container.appendChild(chip);
    });
  };

  const recommendationTagsForWine = (wine) =>
    normaliseRecommendationTags(wine?.recommendationTags);

  const normaliseDisplayList = (value) => {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value
      .map((item) => String(item || "").replace(/\s+/g, " ").trim())
      .filter(Boolean)));
  };

  const normaliseConfiguredCategories = (value) => {
    if (value === undefined || value === null) {
      return Array.from(LEGACY_WINE_CATEGORIES);
    }
    if (!Array.isArray(value)) {
      throw new Error("The shop's Wine Finder categories are invalid.");
    }
    const allowed = new Set(CATEGORY_DEFINITIONS.map((category) => category.key));
    const selected = Array.from(new Set(value.map((category) => String(category || "").trim())))
      .filter(Boolean);
    if (selected.length < 2 || selected.some((category) => !allowed.has(category))) {
      throw new Error("The shop must configure at least two valid Wine Finder categories.");
    }
    return CATEGORY_DEFINITIONS
      .map((category) => category.key)
      .filter((category) => selected.includes(category));
  };

  const recommendationNoticeCopy = (selection, fallback) => {
    const explanation = String(selection?.explanation || "").replace(/\s+/g, " ").trim();
    return explanation || String(fallback || "").trim();
  };

  const substitutionNoticeCopy = (selection, overBudget, monetaryFallback) => {
    const explanation = String(selection?.explanation || "").replace(/\s+/g, " ").trim();
    const generic = new Set([
      "there are a few compromises here. please check the notes before adding these wines to your basket.",
      "one or more requests could not be matched exactly, so the closest safe selection is shown honestly.",
      "we have stayed within your budget, with the compromises noted above.",
      "hier gibt es einige kompromisse. bitte lesen sie die hinweise, bevor sie die weine in den warenkorb legen.",
      "il y a quelques compromis. consultez les précisions avant d’ajouter ces vins au panier.",
      "há alguns compromissos. leia as notas antes de adicionar estes vinhos ao carrinho."
    ]);
    const specific = generic.has(explanation.toLowerCase()) ? "" : explanation;
    // Never lose the monetary disclosure merely because a specific caveat is present.
    const money = overBudget ? String(monetaryFallback || "").trim() : "";
    return [money, specific && specific !== money ? specific : ""].filter(Boolean).join(" ");
  };

  const applyCategoryConfiguration = (root, inputs, categories) => {
    const selected = new Set(categories);
    inputs.forEach((input) => {
      const enabled = selected.has(input.dataset.mnwCategory);
      input.disabled = !enabled;
      input.required = enabled;
      input.value = "0";
      const field = input.closest("[data-mnw-category-field]");
      if (field) field.hidden = !enabled;
    });
    const activeInputs = inputs.filter((input) => !input.disabled);
    if (activeInputs.length >= 2) {
      activeInputs[0].value = "3";
      activeInputs[1].value = "3";
    }
    root.dataset.mnwCategories = categories.join(",");
  };

  const refinementExamples = (categories) => {
    const definitions = categories
      .map((key) => CATEGORY_DEFINITIONS.find((category) => category.key === key))
      .filter(Boolean);
    const firstDefinition = definitions[0];
    const secondDefinition = definitions[1];
    const first = firstDefinition
      ? t(`widget.category.${firstDefinition.key}.plural`, firstDefinition.plural)
      : t("widget.unit.bottles", "bottles");
    const second = secondDefinition
      ? t(`widget.category.${secondDefinition.key}.plural`, secondDefinition.plural)
      : t("widget.category.other_bottles", "other bottles");
    return `Try “Make it 4 ${first} and 2 ${second}”, “Give me a better gift bottle” or “Make the selection more adventurous”.`;
  };

  const normaliseBottleCount = (value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return 6;
    return Math.max(MIN_BOTTLE_COUNT, Math.min(MAX_BOTTLE_COUNT, parsed));
  };

  const calculateDefaultBudget = (minimumBudget, maximumBudget, currencyPrecision) => {
    const upliftedBudget = roundMoney(
      minimumBudget * DEFAULT_BUDGET_MULTIPLIER,
      currencyPrecision
    );
    const roundedUpBudget = Math.ceil(
      upliftedBudget / DEFAULT_BUDGET_ROUNDING_UNIT
    ) * DEFAULT_BUDGET_ROUNDING_UNIT;
    return roundMoney(Math.min(roundedUpBudget, maximumBudget), currencyPrecision);
  };

  const calculateAdjustedBudgetValue = (
    currentBudget,
    minimumBudget,
    maximumBudget,
    direction,
    currencyPrecision = 2
  ) => {
    const minimum = Number(minimumBudget);
    const maximum = Number(maximumBudget);
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum < minimum) return null;

    const parsedCurrent = Number(currentBudget);
    const boundedCurrent = roundMoney(
      Math.max(minimum, Math.min(maximum, Number.isFinite(parsedCurrent) ? parsedCurrent : minimum)),
      currencyPrecision
    );
    if (direction !== -1 && direction !== 1) return boundedCurrent;

    return roundMoney(
      Math.max(
        minimum,
        Math.min(maximum, boundedCurrent + (direction * DEFAULT_BUDGET_ROUNDING_UNIT))
      ),
      currencyPrecision
    );
  };

  const calculateBudgetQuickChoices = (
    minimumBudget,
    maximumBudget,
    currencyPrecision = 2
  ) => {
    const minimum = Number(minimumBudget);
    const maximum = Number(maximumBudget);
    if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum <= 0 || maximum < minimum) {
      return [];
    }

    const roundedMinimum = roundMoney(minimum, currencyPrecision);
    const suggested = calculateDefaultBudget(roundedMinimum, maximum, currencyPrecision);
    const choiceGap = DEFAULT_BUDGET_ROUNDING_UNIT * 2;
    const candidates = [
      { value: roundedMinimum, kind: "minimum" },
      { value: suggested, kind: "suggested" },
      { value: roundMoney(suggested + choiceGap, currencyPrecision), kind: "standard" },
      { value: roundMoney(suggested + (choiceGap * 2), currencyPrecision), kind: "standard" }
    ];
    const seen = new Set();

    return candidates.filter((choice) => {
      if (choice.value < roundedMinimum || choice.value > maximum || seen.has(choice.value)) return false;
      seen.add(choice.value);
      return true;
    });
  };

  const updateBudgetMinimum = (
    budgetInput,
    budgetHelp,
    budgetCurrencyElement,
    bottleCount,
    minimumBottlePrice,
    minimumOrder,
    maximumBudget,
    currency,
    configuredSymbol,
    currencyPrecision,
    useSuggestedDefault = false
  ) => {
    const minimumBudget = roundMoney(
      Math.max(bottleCount * minimumBottlePrice, minimumOrder),
      currencyPrecision
    );
    const formatter = createCurrencyFormatter(currency, currencyPrecision);
    budgetInput.min = String(minimumBudget);
    budgetInput.max = String(roundMoney(maximumBudget, currencyPrecision));
    budgetInput.step = moneyStep(currencyPrecision);

    const currentValue = Number(budgetInput.value);
    const preferredValue = useSuggestedDefault
      ? calculateDefaultBudget(minimumBudget, maximumBudget, currencyPrecision)
      : Number.NaN;
    if (Number.isFinite(preferredValue) && preferredValue >= minimumBudget && preferredValue <= maximumBudget) {
      budgetInput.value = String(roundMoney(preferredValue, currencyPrecision));
    } else if (!Number.isFinite(currentValue) || currentValue < minimumBudget) {
      budgetInput.value = String(minimumBudget);
    } else if (currentValue > maximumBudget) {
      budgetInput.value = String(roundMoney(maximumBudget, currencyPrecision));
    }

    if (budgetCurrencyElement) {
      budgetCurrencyElement.textContent = configuredSymbol || currencySymbol(currency, currencyPrecision);
    }
    const bottleLabel = bottleCount === 1 ? "bottle" : "bottles";
    budgetHelp.textContent = `For ${bottleCount} ${bottleLabel}, the minimum budget is ${formatter.format(minimumBudget)}.`;
  };

  const readBreakdownTotal = (form) => Array.from(form.querySelectorAll("[data-mnw-breakdown]:not(:disabled)"))
    .reduce((sum, input) => {
      const value = Number(input.value);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

  const calculateAdjustedBreakdownValue = (
    currentValue,
    currentTotal,
    adjustment,
    maximumTotal = MAX_BOTTLE_COUNT
  ) => {
    const parsedValue = Number(currentValue);
    const value = Number.isInteger(parsedValue) && parsedValue >= 0
      ? Math.min(parsedValue, maximumTotal)
      : 0;
    const total = Number(currentTotal);
    if (adjustment === -1) return Math.max(0, value - 1);
    if (adjustment !== 1 || !Number.isFinite(total)
        || total >= maximumTotal || value >= maximumTotal) return value;
    return value + 1;
  };

  const updateBreakdownControlStates = (inputs) => {
    const activeInputs = inputs.filter((input) => !input.disabled);
    const total = activeInputs.reduce((sum, input) => {
      const value = Number(input.value);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

    inputs.forEach((input) => {
      const value = Number(input.value);
      const count = Number.isInteger(value) && value >= 0 ? value : 0;
      const field = input.closest("[data-mnw-category-field]");
      const stepper = input.closest("[data-mnw-bottle-stepper]");
      const decrease = stepper?.querySelector('[data-mnw-breakdown-adjust="-1"]');
      const increase = stepper?.querySelector('[data-mnw-breakdown-adjust="1"]');
      field?.classList.toggle("mnw-field--selected", !input.disabled && count > 0);
      if (decrease) decrease.disabled = input.disabled || count <= 0;
      if (increase) {
        increase.disabled = input.disabled || count >= MAX_BOTTLE_COUNT || total >= MAX_BOTTLE_COUNT;
      }
    });
  };

  const enhanceBreakdownControls = (inputs) => {
    inputs.forEach((input) => {
      if (input.closest("[data-mnw-bottle-stepper]")) return;
      const field = input.closest("[data-mnw-category-field]");
      const label = String(field?.querySelector("label")?.textContent || "Wine")
        .replace(/\s+/g, " ")
        .trim();
      const documentRef = input.ownerDocument;
      const stepper = documentRef.createElement("div");
      stepper.className = "mnw-bottle-stepper";
      stepper.dataset.mnwBottleStepper = "";
      stepper.setAttribute("role", "group");
      stepper.setAttribute("aria-label", `${label} bottles`);

      const createButton = (adjustment, symbol, action) => {
        const button = documentRef.createElement("button");
        button.type = "button";
        button.className = "mnw-bottle-stepper__button";
        button.dataset.mnwBreakdownAdjust = String(adjustment);
        button.setAttribute("aria-label", `${action} one ${label} bottle`);
        if (input.id) button.setAttribute("aria-controls", input.id);
        const icon = documentRef.createElement("span");
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = symbol;
        button.append(icon);
        button.addEventListener("click", () => {
          const currentTotal = inputs
            .filter((candidate) => !candidate.disabled)
            .reduce((sum, candidate) => {
              const candidateValue = Number(candidate.value);
              return sum + (Number.isFinite(candidateValue) ? candidateValue : 0);
            }, 0);
          const nextValue = calculateAdjustedBreakdownValue(
            input.value,
            currentTotal,
            adjustment
          );
          if (String(nextValue) !== input.value) {
            input.value = String(nextValue);
            const EventConstructor = documentRef.defaultView?.Event;
            if (EventConstructor) input.dispatchEvent(new EventConstructor("input", { bubbles: true }));
          }
        });
        return button;
      };

      const decrease = createButton(-1, "−", "Remove");
      const increase = createButton(1, "+", "Add");
      input.classList.add("mnw-bottle-stepper__value");
      input.parentNode.insertBefore(stepper, input);
      stepper.append(decrease, input, increase);
    });
    updateBreakdownControlStates(inputs);
  };

  const updateBreakdownMaximums = (inputs) => {
    inputs.forEach((input) => { input.max = String(MAX_BOTTLE_COUNT); });
  };

  const updateAllocationStatus = (form, statusElement, submitButton) => {
    const bottleCount = readBreakdownTotal(form);
    const valid = Number.isInteger(bottleCount)
      && bottleCount >= MIN_BOTTLE_COUNT
      && bottleCount <= MAX_BOTTLE_COUNT;
    const bottleLabel = `${bottleCount} ${bottleCount === 1 ? "bottle" : "bottles"} selected`;
    if (valid) {
      statusElement.textContent = bottleLabel;
    } else if (bottleCount < MIN_BOTTLE_COUNT) {
      statusElement.textContent = `${bottleLabel}. Choose at least ${MIN_BOTTLE_COUNT}.`;
    } else {
      statusElement.textContent = `${bottleLabel}. Choose no more than ${MAX_BOTTLE_COUNT}.`;
    }
    statusElement.classList.toggle("mnw-wine-finder__allocation-status--valid", valid);
    statusElement.classList.toggle("mnw-wine-finder__allocation-status--invalid", !valid);
    submitButton.disabled = !valid;
  };

  const normaliseCurrencyCode = (currency) => {
    const code = String(currency || "").trim().toUpperCase();
    return /^[A-Z]{3}$/.test(code) ? code : "XXX";
  };

  const requireCurrencyCode = (currency) => {
    const code = normaliseCurrencyCode(currency);
    if (code === "XXX") throw new Error("The linked merchant currency is invalid.");
    return code;
  };

  const requirePositiveNumber = (value, label) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error(`The linked merchant ${label} is invalid.`);
    }
    return parsed;
  };

  const requireIntegerInRange = (value, minimum, maximum, label) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
      throw new Error(`The linked merchant ${label} is invalid.`);
    }
    return parsed;
  };

  const normaliseMarketLocale = (locale) => {
    const parts = String(locale || "").trim().replace("_", "-").split("-");
    if (parts.length !== 2 || !/^[A-Za-z]{2}$/.test(parts[0]) || !/^[A-Za-z]{2}$/.test(parts[1])) {
      return null;
    }
    return `${parts[0].toLowerCase()}-${parts[1].toUpperCase()}`;
  };

  const createCurrencyFormatter = (currency, precision = null, locale = null) => {
    const code = normaliseCurrencyCode(currency);
    const options = { style: "currency", currency: code };
    if (Number.isInteger(precision)) {
      options.minimumFractionDigits = precision;
      options.maximumFractionDigits = precision;
    }
    return new Intl.NumberFormat(
      locale
        || serviceLocale
        || (typeof document !== "undefined" ? document.documentElement?.lang : null)
        || (typeof navigator !== "undefined" ? navigator.language : null)
        || "en",
      options
    );
  };

  const currencySymbol = (currency, precision = null) => {
    const code = normaliseCurrencyCode(currency);
    return createCurrencyFormatter(code, precision)
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || code;
  };

  const moneyStep = (precision) => precision <= 0
    ? "1"
    : (1 / (10 ** precision)).toFixed(precision);

  const roundMoney = (value, precision = 2) => {
    const factor = 10 ** precision;
    return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
  };

  const budgetSuggestionAdvances = (
    requestedBudget,
    suggestedBudget,
    precision = 2
  ) => {
    const requested = Number(requestedBudget);
    const suggested = Number(suggestedBudget);
    if (!Number.isFinite(suggested) || suggested <= 0) return false;
    if (!Number.isFinite(requested) || requested <= 0) return true;
    const safePrecision = Number.isInteger(precision)
      ? Math.max(0, Math.min(6, precision))
      : 2;
    const halfMinorUnit = 0.5 / (10 ** safePrecision);
    return suggested - requested > halfMinorUnit;
  };

  const calculateRetryBudgetChoices = (
    activeBudget,
    minimumBudget = null,
    maximumBudget = null
  ) => {
    const budget = Number(activeBudget);
    if (!Number.isFinite(budget) || budget <= 0) {
      return { lower: null, higher: null };
    }

    const minimum = Number(minimumBudget);
    const maximum = Number(maximumBudget);
    const lower = Math.round(budget * 0.9);
    const higher = Math.round(budget * 1.1);
    const lowerAllowed = lower > 0
      && lower < budget
      && (!Number.isFinite(minimum) || minimum <= 0 || lower >= minimum);
    const higherAllowed = higher > budget
      && (!Number.isFinite(maximum) || maximum <= 0 || higher <= maximum);

    return {
      lower: lowerAllowed ? lower : null,
      higher: higherAllowed ? higher : null
    };
  };

  const loadWidgetConfiguration = async (endpoint) => {
    if (!endpoint) throw new Error(t(
      "widget.config.endpoint_missing",
      "The Wine Finder configuration endpoint is missing."
    ));
    return fetchJson(endpointWithLocale(endpoint), {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    }, CONFIGURATION_TIMEOUT_MS, t(
      "widget.config.timeout",
      "The wine finder configuration took too long to load."
    ));
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      normaliseBudgetButtonVisibility,
      visibleRetryBudgetChoices,
      normaliseWorkingProgress,
      createProgressPoller,
      createProgressId,
      withProgressId,
      createWorkingDialog,
      calculateAdjustedBreakdownValue,
      calculateAdjustedBudgetValue,
      calculateBudgetQuickChoices,
      calculateRetryBudgetChoices,
      calculateSelectionSummary,
      budgetSuggestionAdvances,
      closeDialogAfterCartSuccess,
      createBudgetRetryRefinement,
      createCurrencyFormatter,
      createLoadingMessageController,
      createRefinementBudgetProposal,
      createSwapBudgetProposal,
      createRefinementRequestPayload,
      createRefinementSnapshot,
      formatBudgetPosition,
      formatSelectionHeadingSummary,
      normaliseConfiguredCategories,
      preserveBudgetOnlyRequestState,
      preserveRetainedRecommendationEvidence,
      recommendationNoticeCopy,
      substitutionNoticeCopy,
      readRecommendationForm,
      refinementFailureMessage,
      refinementExamples,
      fetchJson,
      selectionActionState,
      stableVisualPhase,
      trapModalFocus,
      validateBudgetImprovement,
      chooseWithinBudgetSelection,
      toleranceSwapAllowed,
      validateRecommendationPayload,
      validateRefinementResponse
    };
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initialiseAllWidgets);
    initialiseAllWidgets();
  }
})();
