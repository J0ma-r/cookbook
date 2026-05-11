---
layout: default
title: My Cookbook
---

<div id="home-page">

<div class="hero">
  <p class="hero-eyebrow">Personal Collection</p>

  <h1>Recipes Made<br>with <em>Love</em></h1>

  <p>
    A curated collection of home-cooked favourites.
  </p>
</div>

<div class="grid" id="recipeGrid">

{% for recipe in site.recipes %}

<a class="card"
   href="{{ recipe.url | relative_url }}">

  <div class="card-img">

    <img src="{{ recipe.image | relative_url }}"
         alt="{{ recipe.title }}">

  </div>

  <div class="card-body">

    <h3 class="card-title">
      {{ recipe.title }}
    </h3>

    <p class="card-desc">
      {{ recipe.description }}
    </p>

  </div>

</a>

{% endfor %}

</div>

</div>