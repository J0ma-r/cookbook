---
layout: default
title: My Cookbook
---

# 🍲 My Cookbook

<div class="recipe-grid">
{% for recipe in site.recipes %}
  <a class="recipe-card" href="{{ recipe.url | relative_url }}">
    
    {% if recipe.image %}
      <img src="{{ recipe.image | relative_url }}" alt="{{ recipe.title }}">
    {% endif %}
    
    <h3>{{ recipe.title }}</h3>
    
  </a>
{% endfor %}
</div>