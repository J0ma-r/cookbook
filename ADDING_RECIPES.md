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
