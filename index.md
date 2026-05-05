---
layout: default
title: My Cookbook
---

# 🍲 My Cookbook

## Recipes

<ul>
{% for recipe in site.recipes %}
  <li>
    <a href="{{ recipe.url }}">{{ recipe.title }}</a>
  </li>
{% endfor %}
</ul>