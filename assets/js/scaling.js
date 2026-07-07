/* ============================================================
   Serving scaling with unit-aware formatting.
   Pure functions — no DOM. Loaded before main.js in the browser
   (functions become globals) and require()-d directly by the tests.
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

// Export for the Node test runner; harmless in the browser (module is undefined).
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    VOLUME_ML, WEIGHT_G, COUNT_PLURAL, COUNT_SINGULAR, FRACTIONS,
    unitToken, trimNumber, roundTo, isWholeNumber, asFraction,
    formatMl, formatG, formatCount, formatMeasure
  };
}
