/* ============================================================
   Browse page: search + multi-select category filtering
   ============================================================ */
const activeTags = new Set();

function syncAllButton() {
  const allBtn = document.querySelector('.tag[data-tag="all"]');
  if (allBtn) allBtn.classList.toggle('active', activeTags.size === 0);
}

function toggleTag(el, tag) {
  if (tag === 'all') {
    activeTags.clear();
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  } else {
    el.classList.toggle('active');
    if (el.classList.contains('active')) activeTags.add(tag);
    else activeTags.delete(tag);
  }
  syncAllButton();
  filterCards();
}

function filterCards() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const q = input.value.toLowerCase();
  const cards = document.querySelectorAll('.card');
  let visible = 0;
  cards.forEach(card => {
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const tags = (card.dataset.tags || '').split(/\s+/);
    // Multi-select is OR: show a card if it matches ANY selected tag.
    const matchTag = activeTags.size === 0 || [...activeTags].some(t => tags.includes(t));
    const matchQ = !q || title.includes(q);
    const show = matchTag && matchQ;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const empty = document.getElementById('emptyState');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

// Preselect a filter when arriving via a /recipes/#category link from the home page.
function applyHashFilter() {
  const hash = decodeURIComponent((location.hash || '').replace('#', '')).toLowerCase();
  if (!hash) return;
  const btn = document.querySelector('.tag[data-tag="' + hash.replace(/"/g, '') + '"]');
  if (btn && !btn.classList.contains('active')) toggleTag(btn, hash);
}

/* ============================================================
   Recipe page: serving scaling with unit-aware formatting
   ============================================================ */

// Canonical sizes. Metric (South African) measures: cup = 250 ml, tbsp = 15 ml, tsp = 5 ml.
const VOLUME_ML = { tsp: 5, tbsp: 15, cup: 250, cups: 250, ml: 1, l: 1000, litre: 1000, liter: 1000 };
const WEIGHT_G = { g: 1, gram: 1, grams: 1, kg: 1000, kilogram: 1000 };

// Countable units and their plural forms.
const COUNT_PLURAL = {
  piece: 'pieces', clove: 'cloves', packet: 'packets', slice: 'slices', tin: 'tins',
  can: 'cans', loaf: 'loaves', knob: 'knobs', bulb: 'bulbs', stalk: 'stalks',
  sheet: 'sheets', egg: 'eggs', medium: 'medium', large: 'large', small: 'small'
};
const COUNT_SINGULAR = {
  pieces: 'piece', cloves: 'clove', packets: 'packet', slices: 'slice', tins: 'tin',
  cans: 'can', loaves: 'loaf', knobs: 'knob', bulbs: 'bulb', stalks: 'stalk',
  sheets: 'sheet', eggs: 'egg', medium: 'medium', large: 'large', small: 'small'
};

// Standard cooking fractions people can actually measure.
const FRACTIONS = [
  [0.125, '⅛'], // 1/8
  [0.25, '¼'],  // 1/4
  [1 / 3, '⅓'], // 1/3
  [0.5, '½'],   // 1/2
  [2 / 3, '⅔'], // 2/3
  [0.75, '¾']   // 3/4
];

let baseServings = 4;
let servings = 4;

function unitToken(unit) {
  // Strip any "(...)" qualifier and take the first word, lowercased.
  return String(unit || '').toLowerCase().replace(/\(.*?\)/g, '').trim().split(/\s+/)[0] || '';
}

function trimNumber(x, dp = 2) {
  const f = Math.pow(10, dp);
  return String(Math.round(x * f) / f);
}

function roundTo(x, step) {
  return Math.round(x / step) * step;
}

function isWholeNumber(x) {
  return Math.abs(x - Math.round(x)) < 0.02;
}

// Express x as an integer + a standard fraction (e.g. "1½"), or null if it doesn't map cleanly.
function asFraction(x) {
  const whole = Math.floor(x + 1e-6);
  const frac = x - whole;
  if (frac < 0.03) return String(whole);
  for (const [value, glyph] of FRACTIONS) {
    if (Math.abs(frac - value) < 0.035) {
      return (whole > 0 ? whole : '') + glyph;
    }
  }
  return null;
}

function formatMl(ml) {
  if (ml >= 1000) return trimNumber(ml / 1000, 2) + ' L';
  let r;
  if (ml >= 20) r = roundTo(ml, 5);
  else if (ml >= 5) r = roundTo(ml, 1);
  else r = roundTo(ml, 0.5);
  if (r <= 0) return 'a pinch';
  return trimNumber(r, 2) + ' ml';
}

function formatG(g) {
  if (g >= 1000) return trimNumber(g / 1000, 2) + ' kg';
  const r = g >= 100 ? roundTo(g, 5) : roundTo(g, 1);
  if (r <= 0) return 'a pinch';
  return trimNumber(r, 1) + ' g';
}

function formatCount(amt, token) {
  const rounded = roundTo(amt, 0.25); // eggs/onions round to sensible quarters
  const value = rounded > 0 ? rounded : amt;
  const frac = rounded > 0 ? asFraction(rounded) : null;
  const n = frac != null ? frac : trimNumber(value, 2);
  const singular = value <= 1.02; // "½ piece", "1 piece", but "1¼ pieces"
  const word = singular ? (COUNT_SINGULAR[token] || token) : (COUNT_PLURAL[token] || token);
  return word ? n + ' ' + word : n;
}

// Scale a base amount by the current factor and format it so it never shows an
// awkward fraction — small spoon/cup fractions become ml, big volumes become L, etc.
function formatMeasure(base, unit, factor) {
  const amt = base * factor;
  const tok = unitToken(unit);

  if (Object.prototype.hasOwnProperty.call(VOLUME_ML, tok)) {
    if (tok === 'tsp' || tok === 'tbsp') {
      // No fractional spoons — convert to ml instead.
      if (isWholeNumber(amt) && Math.round(amt) >= 1) return Math.round(amt) + ' ' + tok;
      return formatMl(amt * VOLUME_ML[tok]);
    }
    if (tok === 'cup' || tok === 'cups') {
      const frac = asFraction(amt);
      if (frac != null && amt >= 0.245) {
        return frac + ' ' + (amt <= 1.02 ? 'cup' : 'cups');
      }
      return formatMl(amt * 250);
    }
    return formatMl(amt * VOLUME_ML[tok]); // ml, l, litre
  }

  if (Object.prototype.hasOwnProperty.call(WEIGHT_G, tok)) {
    return formatG(amt * WEIGHT_G[tok]);
  }

  if (Object.prototype.hasOwnProperty.call(COUNT_PLURAL, tok) ||
      Object.prototype.hasOwnProperty.call(COUNT_SINGULAR, tok)) {
    return formatCount(amt, tok);
  }

  // Fallback: unknown unit — scale the number, keep the unit text as written.
  const frac = asFraction(amt);
  return (frac != null ? frac : trimNumber(amt, 2)) + (unit ? ' ' + unit : '');
}

function renderIngredients() {
  const factor = servings / baseServings;
  document.querySelectorAll('.ing-amount[data-base]').forEach(el => {
    const base = parseFloat(el.dataset.base);
    if (isNaN(base)) return;
    el.textContent = formatMeasure(base, el.dataset.unit || '', factor);
  });
}

function updatePresets() {
  document.querySelectorAll('.serv-preset').forEach(chip => {
    chip.classList.toggle('active', parseFloat(chip.dataset.serv) === servings);
  });
}

function setServings(n) {
  n = parseInt(n, 10);
  if (isNaN(n) || n < 1) n = 1;
  if (n > 99) n = 99;
  servings = n;
  const input = document.getElementById('servCount');
  if (input) input.value = String(n);
  updatePresets();
  renderIngredients();
}

function changeServings(delta) {
  setServings(servings + delta);
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('servCount');
  if (input) {
    baseServings = parseFloat(input.dataset.baseServings) || 4;
    servings = baseServings;
    input.value = String(servings);
    updatePresets();
    renderIngredients();
  }
  // Browse page only
  if (document.getElementById('recipeGrid')) {
    applyHashFilter();
    filterCards();
  }
});
