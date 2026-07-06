# Adding a recipe

Create a new file in `_recipes/`, e.g. `_recipes/tomato-soup.md`.

Copy this template:

```markdown
---
layout: recipe
title: Tomato Soup
image: /assets/images/tomato-soup.jpg
description: A short one-line description shown on the card.
category: Soup            # becomes the badge + filter tag
time: 25 min             # shown on card and recipe page
servings: 4              # base servings; the +/- stepper scales from this
difficulty: 1            # 1, 2, or 3 dots
ingredients:
  - name: Tomatoes, chopped
    amount: 800
    unit: g
  - name: Garlic clove
    amount: 2
    unit: ""             # leave unit empty for countable items
  - name: Salt
    amount: 0            # amount 0 = non-scaling line
    unit: to taste
---

<div class="step">
  <div class="step-num">1</div>
  <p class="step-text">First instruction. Use <strong>bold</strong> for emphasis.</p>
</div>

<div class="step">
  <div class="step-num">2</div>
  <p class="step-text">Second instruction.</p>
</div>
```

Notes:
- Drop the photo in `assets/images/` and point `image:` at it.
- `category` automatically creates a new filter tag and recipe count.
- For a colored badge, add a `.badge-<category>` rule in `style.css`
  (lowercase). Unknown categories get a neutral default badge.
- `amount: 0` ingredients (salt, pepper, "to taste") don't scale with servings.

Serving scaling & units:
- The recipe page lets the reader change the serving count (stepper, editable
  field, and quick 1/2/4/6/8 presets). Amounts rescale from the `servings` you
  set as the base.
- Use **one clean unit** per ingredient so scaling stays accurate. Recognised
  units auto-convert to avoid awkward fractions:
  - Volume: `tsp`, `tbsp`, `cup`, `ml`, `L` (metric: cup 250 ml, tbsp 15, tsp 5).
    Fractional spoons become `ml`; large volumes become `L`.
  - Weight: `g`, `kg`.
  - Countable: `piece(s)`, `clove(s)`, `egg(s)`, `slice(s)`, `can(s)`, etc.
  - Anything else (`to taste`, `a handful`, `pinch`…) is treated as non-scaling
    text — pair it with `amount: 0`.
- Avoid dual units like `cups (219 g)`; pick one (grams are best for baking).
