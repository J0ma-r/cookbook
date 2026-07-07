'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../assets/js/scaling.js');
const { formatMeasure, unitToken, asFraction, formatMl, formatG } = S;

test('unitToken strips qualifiers and lowercases', () => {
  assert.equal(unitToken('tsp (optional)'), 'tsp');
  assert.equal(unitToken('Cups'), 'cups');
  assert.equal(unitToken('  g '), 'g');
  assert.equal(unitToken(''), '');
});

test('asFraction maps standard cooking fractions', () => {
  assert.equal(asFraction(0.25), '¼');
  assert.equal(asFraction(0.5), '½');
  assert.equal(asFraction(0.75), '¾');
  assert.equal(asFraction(1.5), '1½');
  assert.equal(asFraction(2), '2');
  assert.equal(asFraction(0.4), null); // not a measurable fraction
});

test('whole spoons stay as spoons', () => {
  assert.equal(formatMeasure(1, 'tsp', 1), '1 tsp');
  assert.equal(formatMeasure(3, 'tsp', 1), '3 tsp');
  assert.equal(formatMeasure(2, 'tbsp', 1), '2 tbsp');
});

test('fractional spoons convert to ml (no ½ tsp)', () => {
  assert.equal(formatMeasure(1, 'tsp', 0.5), '2.5 ml');
  assert.equal(formatMeasure(1, 'tbsp', 0.5), '8 ml'); // 7.5 ml -> nearest 1
});

test('cups keep standard fractions with correct singular/plural', () => {
  assert.equal(formatMeasure(1, 'cup', 1), '1 cup');
  assert.equal(formatMeasure(2, 'cups', 1), '2 cups');
  assert.equal(formatMeasure(1, 'cup', 0.5), '½ cup');   // regression: not "½ cups"
  assert.equal(formatMeasure(2, 'cups', 0.25), '½ cup');
  assert.equal(formatMeasure(3, 'cups', 0.5), '1½ cups');
});

test('awkward cup fractions convert to ml', () => {
  assert.equal(formatMeasure(1, 'cup', 1 / 15), '17 ml'); // ~16.7 -> nearest 1
});

test('volume rolls up to litres, weight to kilograms', () => {
  assert.equal(formatMeasure(1, 'litre', 1), '1 L');
  assert.equal(formatMeasure(250, 'ml', 1), '250 ml');
  assert.equal(formatMeasure(500, 'g', 2), '1 kg');
  assert.equal(formatMeasure(500, 'g', 1), '500 g');
});

test('trace amounts become "a pinch" (regression: no "0 ml"/"0 g")', () => {
  assert.equal(formatMeasure(2, 'ml', 2 / 30), 'a pinch');
  assert.equal(formatMl(0.1), 'a pinch');
  assert.equal(formatG(0.2), 'a pinch');
});

test('counts round to quarters with correct singular/plural', () => {
  assert.equal(formatMeasure(4, 'pieces', 1), '4 pieces');
  assert.equal(formatMeasure(4, 'pieces', 0.25), '1 piece');   // singular at 1
  assert.equal(formatMeasure(1, 'piece', 0.5), '½ piece');     // singular under 1
  assert.equal(formatMeasure(5, 'pieces', 0.25), '1¼ pieces'); // plural above 1
});

test('unknown units keep their text and just scale the number', () => {
  assert.equal(formatMeasure(2, 'x 500 g', 0.5), '1 x 500 g');
  assert.equal(formatMeasure(1, 'loaf', 1), '1 loaf');
});
