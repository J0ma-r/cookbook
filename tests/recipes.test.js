'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');
const { unitToken, VOLUME_ML, WEIGHT_G, COUNT_PLURAL, COUNT_SINGULAR } = require('../assets/js/scaling.js');

const ROOT = path.join(__dirname, '..');
const RECIPES = path.join(ROOT, '_recipes');

const COURSES = new Set(['Breakfast', 'Starters', 'Mains', 'Sides', 'Desserts']);
const ALLOWED_TAGS = new Set(['Vegetarian', 'Healthy', 'Warm', 'Cold']);
// Units the scaler recognises, plus intentional free-text fallbacks.
const KNOWN_UNITS = new Set([
  ...Object.keys(VOLUME_ML), ...Object.keys(WEIGHT_G),
  ...Object.keys(COUNT_PLURAL), ...Object.keys(COUNT_SINGULAR)
]);
const ALLOWED_FALLBACK_UNITS = new Set(['x']); // e.g. ribeye "2 x 500 g"

function parseFrontMatter(text, file) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(m, `${file}: missing YAML front matter`);
  return yaml.load(m[1]);
}

const files = fs.readdirSync(RECIPES).filter(f => f.endsWith('.md'));

test('there are recipe files to validate', () => {
  assert.ok(files.length > 0, 'no recipes found in _recipes/');
});

for (const file of files) {
  test(`recipe: ${file}`, () => {
    const fm = parseFrontMatter(fs.readFileSync(path.join(RECIPES, file), 'utf8'), file);

    assert.equal(fm.layout, 'recipe', 'layout must be "recipe"');
    assert.ok(fm.title && typeof fm.title === 'string', 'title is required');

    // Category is one of the five courses.
    assert.ok(COURSES.has(fm.category), `category "${fm.category}" is not a valid course`);

    // Difficulty is an integer 1..3.
    assert.ok(Number.isInteger(fm.difficulty) && fm.difficulty >= 1 && fm.difficulty <= 3,
      `difficulty must be 1, 2 or 3 (got ${fm.difficulty})`);

    // Tags: non-empty list from the allowed set.
    assert.ok(Array.isArray(fm.tags) && fm.tags.length > 0, 'tags must be a non-empty list');
    for (const t of fm.tags) {
      assert.ok(ALLOWED_TAGS.has(t), `unknown tag "${t}" (typo?)`);
    }

    if ('featured' in fm) {
      assert.equal(typeof fm.featured, 'boolean', 'featured must be a boolean');
    }

    // Image is declared and the file exists on disk.
    assert.ok(typeof fm.image === 'string' && fm.image.startsWith('/assets/images/'),
      'image must point into /assets/images/');
    assert.ok(fs.existsSync(path.join(ROOT, fm.image.replace(/^\//, ''))),
      `image file missing: ${fm.image}`);

    // Ingredients: each has a name, a numeric amount (>= 0) and a string unit.
    assert.ok(Array.isArray(fm.ingredients) && fm.ingredients.length > 0, 'ingredients required');
    for (const ing of fm.ingredients) {
      assert.ok(ing.name && typeof ing.name === 'string', `ingredient missing name: ${JSON.stringify(ing)}`);
      assert.equal(typeof ing.amount, 'number', `"${ing.name}": amount must be a number`);
      assert.ok(ing.amount >= 0, `"${ing.name}": amount must be >= 0`);
      assert.equal(typeof ing.unit, 'string', `"${ing.name}": unit must be a string`);

      // A scalable ingredient (amount > 0) must use a unit the scaler understands,
      // otherwise it silently renders wrong. amount 0 = free-text ("to taste") is fine.
      if (ing.amount > 0) {
        const tok = unitToken(ing.unit);
        assert.ok(KNOWN_UNITS.has(tok) || ALLOWED_FALLBACK_UNITS.has(tok),
          `"${ing.name}": unrecognised unit "${ing.unit}" for a scalable amount`);
      }
    }
  });
}
