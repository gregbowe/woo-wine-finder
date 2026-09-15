"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const source = fs.readFileSync(path.join(__dirname, "../assets/js/wine-finder.js"), "utf8");

test("Portuguese bottle summaries use singular and plural labels independently", () => {
  const start = source.indexOf("  const formatSelectionHeadingSummary = (");
  const end = source.indexOf("  const formatBudgetPosition = (", start);
  const messages = {
    "widget.category.red.summary": "tinto", "widget.category.red.plural": "tintos",
    "widget.category.white.summary": "branco", "widget.category.white.plural": "brancos",
    "widget.selection.bottle_one": "{count} garrafa", "widget.selection.bottle_many": "{count} garrafas"
  };
  const context = vm.createContext({
    widgetUiLocale: "pt-PT",
    CATEGORY_DEFINITIONS: [
      {key: "red", label: "Red", plural: "Reds"},
      {key: "white", label: "White", plural: "Whites"}
    ],
    t: (key, fallback, variables = {}) => (messages[key] || fallback)
      .replace(/\{(\w+)\}/g, (_, name) => String(variables[name] ?? ""))
  });
  vm.runInContext(source.slice(start, end) + "\nglobalThis.summary = formatSelectionHeadingSummary;", context);
  assert.equal(context.summary({bottleCount: 4, categoryCounts: {red: 3, white: 1}}), "4 garrafas · 3 tintos · 1 branco");
  assert.equal(context.summary({bottleCount: 1, categoryCounts: {red: 1}}), "1 garrafa · 1 tinto");
});
