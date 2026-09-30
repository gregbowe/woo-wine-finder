(function () {
  'use strict';

  var root = document.querySelector('[data-mnw-palate-root]');
  if (!root) return;
  var $ = function (selector) { return root.querySelector(selector); };
  var config = window.MyNextWineWooPalate || {};
  var text = function (key, fallback) { return config[key] || fallback; };
  var format = function (value) {
    var args = Array.prototype.slice.call(arguments, 1);
    var index = 0;
    return String(value || '').replace(/%[sd]/g, function () {
      var replacement = args[index++];
      return replacement === undefined || replacement === null ? '' : String(replacement);
    });
  };
  var configured = root.getAttribute('data-configured') === 'true';
  var budgetToleranceInput = $('[data-mnw-budget-tolerance]');
  var explanationVoiceInputs = Array.prototype.slice.call(root.querySelectorAll('[data-mnw-explanation-voice]'));
  var discoveryInputs = Array.prototype.slice.call(root.querySelectorAll('[data-mnw-discovery-style]'));
  var pairingInputs = Array.prototype.slice.call(root.querySelectorAll('[data-mnw-pairing-style]'));
  var favouriteSearch = $('[data-mnw-favourite-search]');
  var favouriteResults = $('[data-mnw-favourite-results]');
  var favouriteList = $('[data-mnw-favourite-list]');
  var favouriteEmpty = $('[data-mnw-favourite-empty]');
  var pairingList = $('[data-mnw-pairing-list]');
  var pairingEmpty = $('[data-mnw-pairing-empty]');
  var palateJson = $('[data-mnw-palate-json]');
  var palateStatus = $('[data-mnw-palate-status]');
  var saveButton = $('[data-mnw-save-palate]');
  var dialog = $('[data-mnw-pairing-dialog]');
  var pairingDish = $('[data-mnw-pairing-dish]');
  var pairingRationale = $('[data-mnw-pairing-rationale]');
  var pairingSearch = $('[data-mnw-pairing-search]');
  var pairingResults = $('[data-mnw-pairing-results]');
  var pairingWines = $('[data-mnw-pairing-wines]');
  var pairingError = $('[data-mnw-pairing-error]');
  var pairingTitle = $('[data-mnw-pairing-title]');
  var confirmPairing = $('[data-mnw-confirm-pairing]');
  var dirty = false;
  var editingPairingIndex = -1;
  var pairingWineDraft = [];
  var favouriteTimer = null;
  var pairingTimer = null;

  function safeWine(wine) {
    return {
      id: Number(wine && wine.id || 0),
      name: String(wine && wine.name || text('wine', 'Wine')),
      imageSrc: String(wine && wine.imageSrc || ''),
      price: Number(wine && wine.price || 0),
      storeId: String(wine && wine.storeId || '')
    };
  }

  function normalise(value) {
    value = value || {};
    var discovery = ['FAMILIAR', 'BALANCED', 'DISCOVERY_LED'].indexOf(value.discoveryStyle) >= 0
      ? value.discoveryStyle : 'BALANCED';
    var pairing = ['CLASSIC', 'BALANCED', 'ADVENTUROUS'].indexOf(value.pairingStyle) >= 0
      ? value.pairingStyle : 'BALANCED';
    var explanationVoice = ['SHOP_VOICE', 'NO_BS', 'CONNOISSEUR'].indexOf(value.explanationVoice) >= 0
      ? value.explanationVoice : 'NO_BS';
    return {
      budgetTolerancePercent: Number.isInteger(value.budgetTolerancePercent)
        && value.budgetTolerancePercent >= 0 && value.budgetTolerancePercent <= 20
        ? value.budgetTolerancePercent : 0,
      explanationVoice: explanationVoice,
      discoveryStyle: discovery,
      pairingStyle: pairing,
      staffFavourites: Array.isArray(value.staffFavourites)
        ? value.staffFavourites.map(safeWine).filter(function (wine) { return wine.id > 0; }).slice(0, 12)
        : [],
      signaturePairings: Array.isArray(value.signaturePairings)
        ? value.signaturePairings.slice(0, 12).map(function (item) {
            return {
              dish: String(item && item.dish || ''),
              rationale: String(item && item.rationale || ''),
              wines: Array.isArray(item && item.wines)
                ? item.wines.map(safeWine).filter(function (wine) { return wine.id > 0; }).slice(0, 3)
                : []
            };
          }).filter(function (item) { return item.dish && item.wines.length; })
        : []
    };
  }

  var initial = {};
  try { initial = JSON.parse(root.getAttribute('data-initial-palate') || '{}'); }
  catch (ignore) { initial = {}; }
  var palate = normalise(initial);

  function payload() {
    return {
      budgetTolerancePercent: palate.budgetTolerancePercent,
      explanationVoice: palate.explanationVoice,
      discoveryStyle: palate.discoveryStyle,
      pairingStyle: palate.pairingStyle,
      staffFavouriteWineIds: palate.staffFavourites.map(function (wine) { return wine.id; }),
      signaturePairings: palate.signaturePairings.map(function (pairing) {
        return {
          dish: pairing.dish,
          rationale: pairing.rationale,
          preferredWineIds: pairing.wines.map(function (wine) { return wine.id; })
        };
      })
    };
  }

  function syncPayload() {
    if (palateJson) palateJson.value = JSON.stringify(payload());
  }

  function markDirty() {
    dirty = true;
    syncPayload();
    if (palateStatus) palateStatus.textContent = configured
      ? text('unsavedChanges', 'Unsaved changes.')
      : text('connectBeforeSaving', 'Connect the store from Setup before saving.');
    if (saveButton) saveButton.disabled = !configured;
  }

  function thumb(wine) {
    if (wine.imageSrc) {
      var image = document.createElement('img');
      image.className = 'mnw-palate-admin__wine-thumb';
      image.src = wine.imageSrc;
      image.alt = '';
      image.loading = 'lazy';
      return image;
    }
    var placeholder = document.createElement('span');
    placeholder.className = 'mnw-palate-admin__wine-thumb mnw-palate-admin__wine-thumb--placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    return placeholder;
  }

  function wineRow(wine, removeHandler) {
    var row = document.createElement('div');
    row.className = 'mnw-palate-admin__wine-row';
    var name = document.createElement('strong');
    name.textContent = wine.name;
    var remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'mnw-palate-admin__remove';
    remove.textContent = '×';
    remove.setAttribute('aria-label', format(text('removeWine', 'Remove %s'), wine.name));
    remove.addEventListener('click', removeHandler);
    row.appendChild(thumb(wine));
    row.appendChild(name);
    row.appendChild(remove);
    return row;
  }

  function renderFavourites() {
    favouriteList.replaceChildren();
    palate.staffFavourites.forEach(function (wine) {
      favouriteList.appendChild(wineRow(wine, function () {
        palate.staffFavourites = palate.staffFavourites.filter(function (item) { return item.id !== wine.id; });
        renderFavourites();
        markDirty();
      }));
    });
    favouriteEmpty.hidden = palate.staffFavourites.length > 0;
  }

  function pairingWineChip(wine) {
    var chip = document.createElement('span');
    chip.className = 'mnw-palate-admin__pairing-wine';
    var name = document.createElement('span');
    name.textContent = wine.name;
    chip.appendChild(thumb(wine));
    chip.appendChild(name);
    return chip;
  }

  function renderPairings() {
    pairingList.replaceChildren();
    palate.signaturePairings.forEach(function (pairing, index) {
      var row = document.createElement('div');
      row.className = 'mnw-palate-admin__pairing-row';
      var copy = document.createElement('div');
      copy.className = 'mnw-palate-admin__pairing-copy';
      var dish = document.createElement('strong');
      dish.textContent = pairing.dish;
      var detail = document.createElement('small');
      detail.textContent = format(
        text(pairing.wines.length === 1 ? 'preferredWine' : 'preferredWines',
          pairing.wines.length === 1 ? '%d preferred wine' : '%d preferred wines'),
        pairing.wines.length
      );
      copy.appendChild(dish);
      copy.appendChild(detail);
      var wines = document.createElement('div');
      wines.className = 'mnw-palate-admin__pairing-wines';
      pairing.wines.forEach(function (wine) { wines.appendChild(pairingWineChip(wine)); });
      var actions = document.createElement('div');
      var edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'mnw-palate-admin__pairing-action';
      edit.textContent = text('edit', 'Edit');
      edit.addEventListener('click', function () { openDialog(index); });
      var remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'mnw-palate-admin__pairing-action';
      remove.textContent = text('remove', 'Remove');
      remove.addEventListener('click', function () {
        palate.signaturePairings.splice(index, 1);
        renderPairings();
        markDirty();
      });
      actions.appendChild(edit);
      actions.appendChild(remove);
      row.appendChild(copy);
      row.appendChild(wines);
      row.appendChild(actions);
      pairingList.appendChild(row);
    });
    pairingEmpty.hidden = palate.signaturePairings.length > 0;
  }

  function renderPairingWineDraft() {
    pairingWines.replaceChildren();
    pairingWineDraft.forEach(function (wine) {
      pairingWines.appendChild(wineRow(wine, function () {
        pairingWineDraft = pairingWineDraft.filter(function (item) { return item.id !== wine.id; });
        renderPairingWineDraft();
      }));
    });
  }

  function render() {
    if (budgetToleranceInput) budgetToleranceInput.value = String(palate.budgetTolerancePercent);
    explanationVoiceInputs.forEach(function (input) { input.checked = input.value === palate.explanationVoice; });
    discoveryInputs.forEach(function (input) { input.checked = input.value === palate.discoveryStyle; });
    pairingInputs.forEach(function (input) { input.checked = input.value === palate.pairingStyle; });
    renderFavourites();
    renderPairings();
    syncPayload();
    if (saveButton) saveButton.disabled = !dirty || !configured;
  }

  function money(amount) {
    try {
      return new Intl.NumberFormat(String(config.locale || '').replace('_', '-') || undefined, { style: 'currency', currency: config.currency || 'EUR' }).format(amount || 0);
    } catch (ignore) {
      return String(amount || '');
    }
  }

  function showResults(container, wines, excludedIds, chooseHandler) {
    var excluded = new Set(excludedIds || []);
    container.replaceChildren();
    wines.filter(function (wine) { return !excluded.has(wine.id); }).forEach(function (wine) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'mnw-palate-admin__search-result';
      var name = document.createElement('span');
      name.textContent = wine.name;
      var price = document.createElement('small');
      price.textContent = money(wine.price);
      button.appendChild(thumb(wine));
      button.appendChild(name);
      button.appendChild(price);
      button.addEventListener('click', function () {
        chooseHandler(wine);
        container.hidden = true;
      });
      container.appendChild(button);
    });
    if (!container.childElementCount) {
      var empty = document.createElement('div');
      empty.className = 'mnw-palate-admin__search-result';
      empty.textContent = text('noResults', 'No matching available wines.');
      container.appendChild(empty);
    }
    container.hidden = false;
  }

  function search(query, container, excludedIds, chooseHandler) {
    var body = new URLSearchParams();
    body.set('action', 'mynextwine_woo_store_palate_search');
    body.set('nonce', config.nonce || '');
    body.set('query', query);
    window.fetch(config.ajaxUrl, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: body.toString()
    }).then(function (response) { return response.json(); })
      .then(function (response) {
        if (!response.success) throw new Error(response.data && response.data.message || config.searchFailed);
        var wines = response.data && Array.isArray(response.data.wines)
          ? response.data.wines.map(safeWine) : [];
        showResults(container, wines, excludedIds, chooseHandler);
      }).catch(function (error) {
        palateStatus.textContent = error.message || text('searchFailed', 'Wine search failed.');
      });
  }

  function openDialog(index) {
    editingPairingIndex = typeof index === 'number' ? index : -1;
    var pairing = editingPairingIndex >= 0 ? palate.signaturePairings[editingPairingIndex] : null;
    pairingDish.value = pairing ? pairing.dish : '';
    pairingRationale.value = pairing ? pairing.rationale : '';
    pairingSearch.value = '';
    pairingWineDraft = pairing ? pairing.wines.map(safeWine) : [];
    pairingError.textContent = '';
    pairingTitle.textContent = pairing ? text('editPairing', 'Edit pairing') : text('addAPairing', 'Add a pairing');
    confirmPairing.textContent = pairing ? text('savePairing', 'Save pairing') : text('addPairing', 'Add pairing');
    renderPairingWineDraft();
    dialog.showModal();
    pairingDish.focus();
  }

  if (budgetToleranceInput) budgetToleranceInput.addEventListener('input', function () {
    palate.budgetTolerancePercent = Number(budgetToleranceInput.value);
    markDirty();
  });

  explanationVoiceInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      if (!input.checked) return;
      palate.explanationVoice = input.value;
      markDirty();
      render();
    });
  });

  discoveryInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      if (!input.checked) return;
      palate.discoveryStyle = input.value;
      markDirty();
      render();
    });
  });
  pairingInputs.forEach(function (input) {
    input.addEventListener('change', function () {
      if (!input.checked) return;
      palate.pairingStyle = input.value;
      markDirty();
      render();
    });
  });

  favouriteSearch.addEventListener('input', function () {
    window.clearTimeout(favouriteTimer);
    var query = favouriteSearch.value.trim();
    if (query.length < 2) { favouriteResults.hidden = true; return; }
    favouriteTimer = window.setTimeout(function () {
      search(query, favouriteResults, palate.staffFavourites.map(function (wine) { return wine.id; }), function (wine) {
        if (palate.staffFavourites.length >= 12) {
          palateStatus.textContent = text('maxStaffFavourites', 'Choose no more than 12 staff favourites.');
          return;
        }
        palate.staffFavourites.push(wine);
        favouriteSearch.value = '';
        renderFavourites();
        markDirty();
      });
    }, 250);
  });
  favouriteSearch.addEventListener('blur', function () {
    window.setTimeout(function () { favouriteResults.hidden = true; }, 180);
  });

  $('[data-mnw-add-pairing]').addEventListener('click', function () {
    if (palate.signaturePairings.length >= 12) {
      palateStatus.textContent = text('maxSignaturePairings', 'Choose no more than 12 signature pairings.');
      return;
    }
    openDialog(-1);
  });
  root.querySelectorAll('[data-mnw-close-pairing]').forEach(function (button) {
    button.addEventListener('click', function () { dialog.close(); });
  });
  pairingSearch.addEventListener('input', function () {
    window.clearTimeout(pairingTimer);
    var query = pairingSearch.value.trim();
    if (query.length < 2) { pairingResults.hidden = true; return; }
    pairingTimer = window.setTimeout(function () {
      search(query, pairingResults, pairingWineDraft.map(function (wine) { return wine.id; }), function (wine) {
        if (pairingWineDraft.length >= 3) {
          pairingError.textContent = text('maxPairingWines', 'Choose up to three wines for this pairing.');
          return;
        }
        pairingWineDraft.push(wine);
        pairingSearch.value = '';
        pairingError.textContent = '';
        renderPairingWineDraft();
      });
    }, 250);
  });
  pairingSearch.addEventListener('blur', function () {
    window.setTimeout(function () { pairingResults.hidden = true; }, 180);
  });
  confirmPairing.addEventListener('click', function () {
    var dish = pairingDish.value.replace(/\s+/g, ' ').trim();
    var rationale = pairingRationale.value.replace(/\s+/g, ' ').trim();
    if (!dish) { pairingError.textContent = text('describePairing', 'Describe the specific dish or pairing.'); pairingDish.focus(); return; }
    if (!pairingWineDraft.length) { pairingError.textContent = text('choosePairingWine', 'Choose at least one preferred wine.'); pairingSearch.focus(); return; }
    var duplicate = palate.signaturePairings.some(function (item, index) {
      return index !== editingPairingIndex && item.dish.toLowerCase() === dish.toLowerCase();
    });
    if (duplicate) { pairingError.textContent = text('duplicatePairing', 'A signature pairing for this dish already exists.'); return; }
    var saved = { dish: dish, rationale: rationale, wines: pairingWineDraft.map(safeWine) };
    if (editingPairingIndex >= 0) palate.signaturePairings[editingPairingIndex] = saved;
    else palate.signaturePairings.push(saved);
    renderPairings();
    markDirty();
    dialog.close();
  });

  $('[data-mnw-palate-form]').addEventListener('submit', function (event) {
    if (budgetToleranceInput && !budgetToleranceInput.reportValidity()) {
      event.preventDefault();
      return;
    }
    if (!configured) {
      event.preventDefault();
      palateStatus.textContent = text('connectBeforeSaving', 'Connect the store from Setup before saving.');
      return;
    }
    syncPayload();
    if (saveButton) saveButton.disabled = true;
    palateStatus.textContent = text('saving', 'Saving…');
  });

  render();
})();
