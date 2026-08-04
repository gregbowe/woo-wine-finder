(() => {
  "use strict";

  const MIN_BOTTLE_COUNT = 3;
  const MAX_BOTTLE_COUNT = 12;
  const MAX_FREE_TEXT_LENGTH = 500;
  const REQUEST_TIMEOUT_MS = 30000;
  const CART_TIMEOUT_MS = 15000;
  const SWAP_TIMEOUT_MS = 20000;
  const CONFIGURATION_TIMEOUT_MS = 10000;

  const initialiseAllWidgets = () => {
    document.querySelectorAll("[data-mnw-widget]").forEach(initialiseWidget);
  };

  const initialiseWidget = (root) => {
    if (root.dataset.mnwInitialised === "true") return;
    root.dataset.mnwInitialised = "true";

    const endpoint = root.dataset.endpoint;
    const configEndpoint = root.dataset.configEndpoint;
    const swapEndpoint = root.dataset.swapEndpoint;
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
    const retryWithBudgetButton = root.querySelector("[data-mnw-retry-with-budget]");
    const selectedCountElement = root.querySelector("[data-mnw-selected-count]");
    const selectedTotalElement = root.querySelector("[data-mnw-selected-total]");
    const addSelectedButton = root.querySelector("[data-mnw-add-selected]");
    const addSelectedLabel = root.querySelector("[data-mnw-add-selected-label]");
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

    let currentRecommendation = null;
    let currentRequest = null;
    let currentSelectionMode = "exact";
    let recommendationInFlight = false;
    let swapInFlight = false;
    let cartInFlight = false;
    let storeCurrency = null;
    let storeCurrencySymbol = null;
    let currencyPrecision = 2;
    let minimumBottlePrice = null;
    let minimumOrder = null;
    let maximumBudget = null;
    let configurationReady = false;
    let budgetEdited = false;
    let suggestedBudget = null;
    const pageSessionId = createPageSessionId();

    const refreshBudgetMinimum = (bottleCount, defaultBudget = null) => {
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
        defaultBudget
      );
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

      const recommendationLabel = String(wine.recommendationLabel || "Why it fits").trim();
      const recommendationReason = directAddressRecommendationCopy(
        wine.recommendationReason || ""
      );
      const recommendationTags = recommendationTagsForWine(wine, currentRequest);
      if (quickViewReasonRow && quickViewReason) {
        quickViewReasonRow.hidden = !recommendationReason && recommendationTags.length === 0;
        if (quickViewReasonTags) {
          renderRecommendationTags(quickViewReasonTags, recommendationTags);
          quickViewReasonTags.hidden = recommendationTags.length === 0;
        }
        if (quickViewReasonLabel) {
          quickViewReasonLabel.hidden = recommendationTags.length > 0;
          quickViewReasonLabel.textContent = recommendationLabel || "Why it fits";
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
      root.dataset.mnwPhase = phase;
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
    };

    const focusCurrentWizardStep = () => {
      const currentStep = wizardSteps[currentWizardStep];
      currentStep?.querySelector("input, textarea, select, button")?.focus({ preventScroll: true });
    };

    const showWizardStep = (index, { focus = true } = {}) => {
      currentWizardStep = Math.max(0, Math.min(wizardSteps.length - 1, index));
      wizardSteps.forEach((step, stepIndex) => {
        step.hidden = stepIndex !== currentWizardStep;
      });

      const currentStep = wizardSteps[currentWizardStep];
      const displayIndex = currentWizardStep + 1;
      const percentage = (displayIndex / wizardSteps.length) * 100;
      if (wizardCount) wizardCount.textContent = `Question ${displayIndex} of ${wizardSteps.length}`;
      if (wizardBar) wizardBar.style.width = `${percentage}%`;
      if (wizardTrack) {
        wizardTrack.setAttribute("aria-valuemax", String(wizardSteps.length));
        wizardTrack.setAttribute("aria-valuenow", String(displayIndex));
      }

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
          breakdownInputs[0]?.focus({ preventScroll: true });
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
      closeQuickView({ restoreFocus: false });
      if (typeof dialog.close === "function" && dialog.open) dialog.close();
      else dialog.removeAttribute("open");
      openButton.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("mnw-wine-finder-open");
      document.body.classList.remove("mnw-wine-finder-open");
      openButton.focus({ preventScroll: true });
    };

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
      if (retryWithBudgetButton) retryWithBudgetButton.hidden = true;
      form.requestSubmit();
    };

    const showBudgetGuidance = (details) => {
      const requested = Number(details?.requestedBudget || currentRequest?.budget || 0);
      const suggested = Number(details?.suggestedBudget || 0);
      if (!budgetGuidance || !budgetGuidanceCopy || !Number.isFinite(suggested) || suggested <= 0) {
        showError("We could not build a complete selection at that budget. Try increasing it or changing your request.");
        return;
      }
      const formatter = createCurrencyFormatter(storeCurrency, currencyPrecision);
      const difference = Math.max(0, suggested - requested);
      statusElement.hidden = true;
      errorElement.hidden = true;
      budgetGuidanceCopy.textContent = `We do not have enough exact matches in stock. A complete alternative selection starts at ${formatter.format(suggested)}${difference > 0 ? ` — ${formatter.format(difference)} above your current budget.` : "."}`;
      setSuggestedBudget(suggested, trySuggestedBudgetButton);
      budgetGuidance.hidden = false;
      budgetGuidance.focus({ preventScroll: true });
      budgetGuidance.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const renderRequestMatch = (selection) => {
      if (!requestMatch || !requestMatchTitle || !requestMatchItems
          || !requestMatchUnmet || !requestMatchUnmetCopy) return;

      const wines = Array.isArray(selection?.wines) ? selection.wines : [];
      const perWineTags = wines.flatMap((wine) => recommendationTagsForWine(wine, currentRequest));
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

      const resolvedLabels = summaryTags.map((tag) => tag.label);
      const unmet = normaliseDisplayList(selection?.unmetPreferences)
        .filter((item) => !resolvedLabels.some((label) => assessmentMatchesTag(item, label)))
        .slice(0, 4);

      renderRecommendationTags(requestMatchItems, summaryTags);

      requestMatch.hidden = summaryTags.length === 0 && unmet.length === 0;
      const partial = substituteTags.length > 0 || unmet.length > 0;
      requestMatch.classList.toggle("mnw-wine-finder__request-match--partial", partial);
      requestMatchTitle.textContent = partial
        ? "How we matched your request"
        : "Your brief, matched";
      requestMatchUnmet.hidden = unmet.length === 0;
      requestMatchUnmetCopy.textContent = unmet.join("; ");
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
      const formatter = createCurrencyFormatter(currency);
      const requestedBudget = Number(currentRecommendation.requestedBudget || currentRequest?.budget || 0);
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
      const allowSwap = currentSelectionMode === "exact"
        && selectionStatus !== "ALTERNATIVE_ONLY"
        && !exactOverBudget;

      renderWines(
        resultsElement,
        selection.wines,
        currency,
        openQuickView,
        allowSwap ? swapWine : null,
        currentRequest,
        selectionStatus
      );
      summaryElement.textContent = selection.summary || "Chosen from wines currently in stock.";
      totalElement.textContent = `Total: ${formatter.format(Number(selection.total || 0))}`;
      attachSelectionListeners({
        resultsElement,
        wines: selection.wines,
        currency,
        selectedCountElement,
        selectedTotalElement,
        addSelectedButton,
        addSelectedLabel
      });
      renderRequestMatch(selection);

      if (!budgetNotice || !budgetNoticeTitle || !budgetNoticeCopy) return;

      if (currentSelectionMode === "alternative") {
        const alternativeTotal = Number(alternative.total || 0);
        const underBudget = Math.max(0, requestedBudget - alternativeTotal);
        budgetNotice.hidden = false;
        budgetNotice.dataset.mnwBudgetState = "alternative";
        budgetNoticeTitle.textContent = "Closest alternatives";
        budgetNoticeCopy.textContent = `We replaced unavailable or expensive exact matches with similar styles. Total ${formatter.format(alternativeTotal)}${underBudget > 0.0001 ? ` — ${formatter.format(underBudget)} under budget.` : "."}`;
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (retryWithBudgetButton) retryWithBudgetButton.hidden = true;
        if (showExactSelectionButton) {
          showExactSelectionButton.hidden = false;
          showExactSelectionButton.textContent = `Show exact ${formatter.format(exactTotal)} selection`;
        }
        return;
      }

      if (alternativeOnly) {
        budgetNotice.hidden = false;
        budgetNotice.dataset.mnwBudgetState = exactOverBudget ? "over" : "alternative";
        budgetNoticeTitle.textContent = exactOverBudget
          ? "Closest complete selection"
          : "Considered substitutions";
        budgetNoticeCopy.textContent = exactOverBudget
          ? `We do not have enough exact matches in stock. This selection is ${formatter.format(Number(selection.total || 0))} — ${formatter.format(Math.max(0, Number(selection.total || 0) - requestedBudget))} over your ${formatter.format(requestedBudget)} budget.`
          : "We could not match every preference exactly, so we chose the closest suitable alternatives within budget.";
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) showExactSelectionButton.hidden = true;
        setSuggestedBudget(exactOverBudget ? Number(selection.total || 0) : 0, retryWithBudgetButton);
        return;
      }

      if (consideredSubstitutions) {
        budgetNotice.hidden = false;
        budgetNotice.dataset.mnwBudgetState = exactOverBudget ? "over" : "alternative";
        budgetNoticeTitle.textContent = "Considered substitutions";
        budgetNoticeCopy.textContent = exactOverBudget
          ? `These are the closest suitable alternatives from current stock. The total is ${formatter.format(Number(selection.total || 0))} — ${formatter.format(Math.max(0, Number(selection.total || 0) - requestedBudget))} over budget.`
          : "Some exact matches were unavailable, so we chose the closest suitable alternatives and stayed within budget.";
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) showExactSelectionButton.hidden = true;
        setSuggestedBudget(exactOverBudget ? Number(selection.total || 0) : 0, retryWithBudgetButton);
        return;
      }

      if (!exactOverBudget) {
        budgetNotice.hidden = true;
        if (showBudgetAlternativeButton) showBudgetAlternativeButton.hidden = true;
        if (showExactSelectionButton) showExactSelectionButton.hidden = true;
        if (retryWithBudgetButton) retryWithBudgetButton.hidden = true;
        return;
      }

      const difference = Number(currentRecommendation.budgetDifference || Math.max(0, exactTotal - requestedBudget));
      budgetNotice.hidden = false;
      budgetNotice.dataset.mnwBudgetState = "over";
      budgetNoticeTitle.textContent = "Exact matches are over budget";

      let notice = `Exact matches total ${formatter.format(exactTotal)} — ${formatter.format(difference)} over your ${formatter.format(requestedBudget)} budget.`;
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
      setSuggestedBudget(exactTotal, retryWithBudgetButton);
    };

    openButton.addEventListener("click", openDialog);
    closeButton.addEventListener("click", closeDialog);
    quickViewCloseButtons.forEach((button) => button.addEventListener("click", () => closeQuickView()));
    notePopupCloseButtons.forEach((button) => button.addEventListener("click", () => closeNotePopup()));
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
      if (!recommendationInFlight && !cartInFlight) closeDialog();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog && !recommendationInFlight && !cartInFlight) closeDialog();
    });
    dialog.addEventListener("close", () => {
      openButton.setAttribute("aria-expanded", "false");
      document.documentElement.classList.remove("mnw-wine-finder-open");
      document.body.classList.remove("mnw-wine-finder-open");
    });

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
    }));

    budgetInput.addEventListener("input", () => { budgetEdited = true; });

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
      statusElement.textContent = "Building your wine selection…";
      statusElement.hidden = false;
      statusElement.focus({ preventScroll: true });
      submitButton.disabled = true;
      submitLabel.textContent = "Finding wines…";

      try {
        const payload = readRecommendationForm(form);
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
        const result = await fetchJson(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
          cache: "no-store"
        }, REQUEST_TIMEOUT_MS, "The wine finder took too long to respond. Please try again.");

        if (!Array.isArray(result.wines) || result.wines.length === 0) {
          throw new Error("No suitable wines were found for those answers. Try a slightly larger budget or different mix.");
        }
        if (!result.sessionId) throw new Error("The wine finder response was incomplete. Please try again.");

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

        statusElement.hidden = true;
        form.hidden = true;
        if (wizardProgress) wizardProgress.hidden = true;
        selectionElement.hidden = false;
        setPhase("results");
        selectionElement.focus({ preventScroll: true });
        selectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (error) {
        currentRecommendation = null;
        if (error?.details?.code === "BUDGET_INCREASE_REQUIRED") {
          showBudgetGuidance(error.details);
        } else {
          currentRequest = null;
          showError(error.message || "We could not build the wine selection.");
        }
      } finally {
        recommendationInFlight = false;
        setBusy(false);
        submitButton.disabled = false;
        submitLabel.textContent = originalLabel;
        updateAllocationStatus(form, allocationStatus, submitButton);
      }
    });

    const swapWine = async (wineToReplace, trigger) => {
      if (!swapEndpoint || !currentRecommendation || !currentRequest || swapInFlight || cartInFlight) return;

      const selectedIds = getSelectedWineIds(resultsElement);
      const originalLabel = trigger.textContent;
      swapInFlight = true;
      setBusy(true);
      errorElement.hidden = true;
      trigger.disabled = true;
      trigger.textContent = "Finding another…";

      try {
        const response = await fetchJson(swapEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            request: currentRequest,
            wineToReplaceId: wineToReplace.sommWineId,
            currentWineIds: currentRecommendation.wines.map((wine) => wine.sommWineId)
          }),
          cache: "no-store"
        }, SWAP_TIMEOUT_MS, "The wine swap took too long. Please try again.");

        if (!response.wine?.sommWineId) throw new Error("No alternative wine was returned. Please try again.");
        currentRecommendation.wines = currentRecommendation.wines.map((wine) =>
          String(wine.sommWineId) === String(wineToReplace.sommWineId) ? response.wine : wine
        );
        currentRecommendation.total = response.total;
        currentRecommendation.sessionId = response.sessionId || currentRecommendation.sessionId;
        currentRecommendation.recommendationToken = response.recommendationToken || currentRecommendation.recommendationToken;
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
        sendAnalytics(analyticsEnabled, eventsEndpoint, pageSessionId, "SWAP");
      } catch (error) {
        showError(error.message || "That wine could not be swapped. Please try again.");
      } finally {
        swapInFlight = false;
        setBusy(false);
        if (trigger.isConnected) {
          trigger.disabled = false;
          trigger.textContent = originalLabel;
        }
      }
    };

    addSelectedButton.addEventListener("click", async () => {
      if (!currentRecommendation || cartInFlight) return;
      const selectedWines = getSelectedWines(resultsElement, currentRecommendation.wines);
      if (selectedWines.length === 0) return;

      cartInFlight = true;
      setBusy(true);
      errorElement.hidden = true;
      const originalLabel = addSelectedLabel.textContent;
      addSelectedButton.disabled = true;
      addSelectedLabel.textContent = "Adding to basket…";
      setPhase("cart");

      try {
        sendAnalytics(analyticsEnabled, eventsEndpoint, pageSessionId, "ADD_TO_CART");
        await addWinesToCart(
          cartEndpoint,
          wpNonce,
          currentRecommendation.sessionId,
          currentRecommendation.recommendationToken,
          selectedWines
        );
      } catch (error) {
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
          selectedCountElement,
          selectedTotalElement,
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
    retryWithBudgetButton?.addEventListener("click", applySuggestedBudget);
    editPreferencesButton?.addEventListener("click", () => {
      currentRecommendation = null;
      selectionElement.hidden = true;
      if (budgetGuidance) budgetGuidance.hidden = true;
      form.hidden = false;
      if (wizardProgress) wizardProgress.hidden = false;
      setPhase("form");
      showWizardStep(3);
    });

    startAgainButton.addEventListener("click", () => {
      currentRecommendation = null;
      currentRequest = null;
      currentSelectionMode = "exact";
      selectionElement.hidden = true;
      if (budgetNotice) budgetNotice.hidden = true;
      if (budgetGuidance) budgetGuidance.hidden = true;
      if (retryWithBudgetButton) retryWithBudgetButton.hidden = true;
      errorElement.hidden = true;
      statusElement.hidden = true;
      form.hidden = false;
      if (wizardProgress) wizardProgress.hidden = false;
      setPhase("form");
      showWizardStep(0);
    });

    loadWidgetConfiguration(configEndpoint)
      .then((configuration) => {
        storeCurrency = requireCurrencyCode(configuration.currency);
        storeCurrencySymbol = String(configuration.currencySymbol || "").trim() || null;
        currencyPrecision = requireIntegerInRange(configuration.currencyPrecision, 0, 4, "currency precision");
        minimumBottlePrice = requirePositiveNumber(configuration.minimumBottlePrice, "minimum bottle price");
        minimumOrder = requirePositiveNumber(configuration.minimumOrder, "minimum order");
        maximumBudget = requirePositiveNumber(configuration.maximumBudget, "maximum budget");
        if (maximumBudget < Math.max(minimumBottlePrice, minimumOrder)) {
          throw new Error("The linked merchant currency range is invalid.");
        }

        configurationReady = true;
        const configuredDefault = Number(configuration.defaultBudget);
        refreshBudgetMinimum(
          normaliseBottleCount(bottleCountInput.value),
          !budgetEdited && Number.isFinite(configuredDefault) ? configuredDefault : null
        );
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
    setPhase("form");
    showWizardStep(0, { focus: false });
  };

  const readRecommendationForm = (form) => {
    const data = new FormData(form);
    return {
      bottleCount: Number(data.get("bottleCount")),
      budget: Number(data.get("budget")),
      numberRed: Number(data.get("numberRed")),
      numberWhite: Number(data.get("numberWhite")),
      numberSparkling: Number(data.get("numberSparkling")),
      numberDessert: Number(data.get("numberDessert")),
      usualWines: String(data.get("usualWines") || "").trim(),
      foodPairings: String(data.get("foodPairings") || "").trim()
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
      throw new Error(`The minimum budget for ${payload.bottleCount} bottles is ${formatter.format(minimumBudget)}.`);
    }
    if (payload.budget > maximumBudget) {
      throw new Error(`The maximum supported budget is ${formatter.format(maximumBudget)}.`);
    }
    const counts = [payload.numberRed, payload.numberWhite, payload.numberSparkling, payload.numberDessert];
    if (counts.some((count) => !Number.isInteger(count) || count < 0)) {
      throw new Error("Every bottle mix value must be a whole number of zero or more.");
    }
    const breakdownTotal = counts.reduce((sum, count) => sum + count, 0);
    if (breakdownTotal !== payload.bottleCount) {
      throw new Error(`The bottle mix adds up to ${breakdownTotal}, not ${payload.bottleCount}.`);
    }
    if (!payload.usualWines) throw new Error("Tell us what sort of wines you usually like.");
    if (payload.usualWines.length > MAX_FREE_TEXT_LENGTH || payload.foodPairings.length > MAX_FREE_TEXT_LENGTH) {
      throw new Error("One of your answers is too long.");
    }
  };

  const fallbackRecommendationReason = (request, selectionStatus) => {
    const status = String(selectionStatus || "").trim().toUpperCase();
    if (status === "ALTERNATIVE_ONLY"
        || status === "CONSIDERED_SUBSTITUTIONS"
        || status === "CONSIDERED_SUBSTITUTIONS_OVER_BUDGET") {
      return "Chosen as the closest suitable alternative to your requested wines, within this shop's current range.";
    }
    const usualWines = String(request?.usualWines || "").trim();
    const foodPairings = String(request?.foodPairings || "").trim();
    if (usualWines && foodPairings) {
      return "Chosen to fit your wine preferences and the food you described.";
    }
    if (usualWines) {
      return "Chosen to match the wine preferences and style you described as closely as possible.";
    }
    if (foodPairings) {
      return "Chosen with the food pairing you described in mind.";
    }
    return "Chosen for balance, value and fit with the rest of your selection.";
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
      checkboxLabel.textContent = "Selected";
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
      const price = document.createElement("p");
      price.className = "mnw-wine-card__price";
      price.textContent = formatter.format(Number(wine.price || 0));
      content.append(title, price);

      const recommendationLabel = String(wine.recommendationLabel || "Why it fits").trim();
      const recommendationReason = directAddressRecommendationCopy(
        wine.recommendationReason || fallbackRecommendationReason(request, selectionStatus)
      );
      const recommendationTags = recommendationTagsForWine(wine, request);
      if (recommendationReason || recommendationTags.length > 0) {
        const reason = document.createElement("div");
        reason.className = "mnw-wine-card__reason";

        if (recommendationTags.length > 0) {
          const reasonTags = document.createElement("div");
          reasonTags.className = "mnw-wine-card__reason-tags";
          renderRecommendationTags(reasonTags, recommendationTags);
          reason.appendChild(reasonTags);
        } else {
          const reasonLabel = document.createElement("span");
          reasonLabel.className = "mnw-wine-card__reason-label";
          reasonLabel.textContent = recommendationLabel || "Why it fits";
          reason.appendChild(reasonLabel);
        }

        const reasonCopy = document.createElement("p");
        reasonCopy.className = "mnw-wine-card__reason-copy";
        reasonCopy.textContent = recommendationReason;
        reason.appendChild(reasonCopy);
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

      let swapButton = null;
      if (typeof swapWine === "function") {
        swapButton = document.createElement("button");
        swapButton.className = "mnw-wine-card__swap-button";
        swapButton.type = "button";
        swapButton.textContent = "Swap this wine";
        swapButton.setAttribute("aria-label", `Swap ${wine.title || "wine"} with another`);
        swapButton.addEventListener("click", () => swapWine(wine, swapButton));
      }

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
      card.append(selectionRow, cardBody);
      if (swapButton) card.appendChild(swapButton);
      container.appendChild(card);
    });
  };

  const attachSelectionListeners = (options) => {
    options.resultsElement.querySelectorAll("[data-mnw-wine-checkbox]").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const card = checkbox.closest("[data-mnw-wine-card]");
        card?.classList.toggle("mnw-wine-card--selected", checkbox.checked);
        updateSelectedState(options);
      });
    });
    updateSelectedState(options);
  };

  const updateSelectedState = ({
    resultsElement, wines, currency, selectedCountElement,
    selectedTotalElement, addSelectedButton, addSelectedLabel
  }) => {
    const selectedWines = getSelectedWines(resultsElement, wines);
    const total = selectedWines.reduce((sum, wine) => sum + Number(wine.price || 0), 0);
    selectedCountElement.textContent = `${selectedWines.length} wine${selectedWines.length === 1 ? "" : "s"} selected`;
    selectedTotalElement.textContent = `Selected total: ${createCurrencyFormatter(currency).format(total)}`;
    addSelectedButton.disabled = selectedWines.length === 0;
    addSelectedLabel.textContent = selectedWines.length === 0
      ? "Select at least one wine"
      : `Add ${selectedWines.length} selected wine${selectedWines.length === 1 ? "" : "s"}`;
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
      checkbox.closest("[data-mnw-wine-card]")
        ?.classList.toggle("mnw-wine-card--selected", checkbox.checked);
    });
  };

  const createPageSessionId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `wf-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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
    if (!enabled || !endpoint || !wordpressStatisticsConsentAllowed()) return;
    const body = JSON.stringify({ type, sessionId, ...details });
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body,
      cache: "no-store",
      credentials: "same-origin"
    }).catch(() => {
      // Analytics must never interrupt the customer's storefront journey.
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
    window.location.assign(result.cartUrl || "/cart/");
  };

  const fetchJson = async (url, options, timeoutMs, timeoutMessage) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      const text = await response.text();
      let body = {};
      if (text) {
        try { body = JSON.parse(text); }
        catch { throw new Error("The service returned an unexpected response. Please try again."); }
      }
      if (!response.ok) {
        const error = new Error(body.error || body.description || body.message || `Request failed (${response.status}).`);
        error.details = body;
        error.status = response.status;
        throw error;
      }
      return body;
    } catch (error) {
      if (error.name === "AbortError") throw new Error(timeoutMessage);
      throw error;
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const directAddressRecommendationCopy = (value) => String(value || "")
    .replace(/\bthe shopper's\b/gi, "your")
    .replace(/\bshopper's\b/gi, "your")
    .replace(/\bthe customer's\b/gi, "your")
    .replace(/\bcustomer's\b/gi, "your")
    .replace(/\bfor the shopper\b/gi, "for you")
    .replace(/\bfor the customer\b/gi, "for you")
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
        ? `Sub: ${tag.label}`
        : tag.label;
      if (tag.type === "SUBSTITUTE") {
        chip.title = `Considered substitute for ${tag.label}`;
      }
      container.appendChild(chip);
    });
  };

  const recommendationTagsForWine = (wine) =>
    normaliseRecommendationTags(wine?.recommendationTags);

  const assessmentMatchesTag = (assessment, tagLabel) => {
    const assessmentText = normaliseComparisonText(assessment);
    const tagText = normaliseComparisonText(tagLabel);
    if (!assessmentText || !tagText) return false;
    return assessmentText === tagText
      || assessmentText.includes(tagText)
      || tagText.includes(assessmentText);
  };

  const normaliseComparisonText = (value) => String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const normaliseDisplayList = (value) => {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value
      .map((item) => String(item || "").replace(/\s+/g, " ").trim())
      .filter(Boolean)));
  };

  const normaliseBottleCount = (value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed)) return 6;
    return Math.max(MIN_BOTTLE_COUNT, Math.min(MAX_BOTTLE_COUNT, parsed));
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
    defaultBudget = null
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
    const preferredValue = Number(defaultBudget);
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
    budgetHelp.textContent = `Minimum ${formatter.format(minimumBudget)} for ${bottleCount} bottles.`;
  };

  const readBreakdownTotal = (form) => ["numberRed", "numberWhite", "numberSparkling", "numberDessert"]
    .reduce((sum, name) => {
      const value = Number(form.elements.namedItem(name).value);
      return sum + (Number.isFinite(value) ? value : 0);
    }, 0);

  const updateBreakdownMaximums = (inputs) => {
    inputs.forEach((input) => { input.max = String(MAX_BOTTLE_COUNT); });
  };

  const updateAllocationStatus = (form, statusElement, submitButton) => {
    const bottleCount = readBreakdownTotal(form);
    const valid = Number.isInteger(bottleCount)
      && bottleCount >= MIN_BOTTLE_COUNT
      && bottleCount <= MAX_BOTTLE_COUNT;
    const bottleLabel = `${bottleCount} ${bottleCount === 1 ? "bottle" : "bottles"} selected.`;
    if (valid) {
      statusElement.textContent = bottleLabel;
    } else if (bottleCount < MIN_BOTTLE_COUNT) {
      statusElement.textContent = `${bottleLabel} Choose at least ${MIN_BOTTLE_COUNT}.`;
    } else {
      statusElement.textContent = `${bottleLabel} Choose no more than ${MAX_BOTTLE_COUNT}.`;
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

  const createCurrencyFormatter = (currency, precision = null) => {
    const code = normaliseCurrencyCode(currency);
    const options = { style: "currency", currency: code };
    if (Number.isInteger(precision)) {
      options.minimumFractionDigits = precision;
      options.maximumFractionDigits = precision;
    }
    return new Intl.NumberFormat(
      document.documentElement.lang || navigator.language || "en",
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

  const loadWidgetConfiguration = async (endpoint) => {
    if (!endpoint) throw new Error("The Wine Finder configuration endpoint is missing.");
    return fetchJson(endpoint, {
      method: "GET",
      headers: { "Accept": "application/json" },
      cache: "no-store"
    }, CONFIGURATION_TIMEOUT_MS, "The wine finder configuration took too long to load.");
  };

  document.addEventListener("DOMContentLoaded", initialiseAllWidgets);
  initialiseAllWidgets();
})();
