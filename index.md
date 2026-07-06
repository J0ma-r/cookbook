---
layout: default
title: My Cookbook
---

{% assign cats = site.recipes | map: "category" | uniq | sort %}

<div id="home-page">

<div class="hero">
  <p class="hero-eyebrow">Personal Collection</p>

  <h1>Recipes Made<br>with <em>Love</em></h1>

  <p>
    A curated collection of home-cooked favourites.
  </p>

  <div class="hero-stats">
    <div class="stat">
      <span class="stat-num">{{ site.recipes | size }}</span>
      <span class="stat-label">Recipes</span>
    </div>
    <div class="stat">
      <span class="stat-num">{{ cats | size }}</span>
      <span class="stat-label">Categories</span>
    </div>
  </div>
</div>

<div class="filters">
  <div class="filters-top">
    <h2 class="section-title">All Recipes</h2>
    <div class="search-wrap">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
      <input class="search-input" id="searchInput" type="text" placeholder="Search recipes&hellip;" oninput="filterCards()">
    </div>
  </div>

  <div class="tag-row">
    <button class="tag active" onclick="setTag(this, 'all')">All</button>
    {% for cat in cats %}
    <button class="tag" onclick="setTag(this, '{{ cat | downcase }}')">{{ cat }}</button>
    {% endfor %}
  </div>
</div>

<div class="grid" id="recipeGrid">

{% for recipe in site.recipes %}

<a class="card"
   href="{{ recipe.url | relative_url }}"
   data-tags="{{ recipe.category | downcase }}">

  <div class="card-img">

    <img src="{{ recipe.image | relative_url }}"
         alt="{{ recipe.title }}"
         loading="lazy">

    <span class="card-badge badge-{{ recipe.category | downcase }}">{{ recipe.category }}</span>

  </div>

  <div class="card-body">

    <div class="card-meta">
      {% if recipe.time %}
      <span class="meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        {{ recipe.time }}
      </span>
      {% endif %}
      {% if recipe.servings %}
      <span class="meta-item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16M6 19V9a6 6 0 0 1 12 0v10"/></svg>
        Serves {{ recipe.servings }}
      </span>
      {% endif %}
    </div>

    <h3 class="card-title">
      {{ recipe.title }}
    </h3>

    <p class="card-desc">
      {{ recipe.description }}
    </p>

    <div class="card-footer">
      <span class="difficulty">
        {% for i in (1..3) %}<span class="dot{% if i <= recipe.difficulty %} filled{% endif %}"></span>{% endfor %}
      </span>
      <span class="view-link">View recipe &rarr;</span>
    </div>

  </div>

</a>

{% endfor %}

</div>

<div class="empty" id="emptyState" style="display:none">
  <div class="empty-icon">🍽️</div>
  <p>No recipes match your search.</p>
</div>

</div>
