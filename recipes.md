---
layout: default
title: All Recipes
permalink: /recipes/
---

{% assign cats = site.recipes | map: "category" | uniq | sort %}
{% assign diffwords = "Easy,Medium,Hard" | split: "," %}
{% assign tagstr = "" %}
{% for r in site.recipes %}{% for t in r.tags %}{% assign tagstr = tagstr | append: t | append: "," %}{% endfor %}{% endfor %}
{% assign alltags = tagstr | split: "," | uniq | sort %}

<div id="browse-page">

  <div class="browse-head">
    <h1 class="page-title">All Recipes</h1>
    <p class="page-sub">Search by name or ingredient, or filter by tag. Pick more than one tag to combine.</p>
  </div>

  <div class="filters">
    <div class="filters-top">
      <div class="search-wrap">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
        <input class="search-input" id="searchInput" type="text" placeholder="Search recipes or ingredients&hellip;" oninput="filterCards()">
      </div>
      <p class="difficulty-legend">
        <span class="difficulty"><span class="dot filled"></span><span class="dot"></span><span class="dot"></span></span> Easy
        <span class="difficulty"><span class="dot filled"></span><span class="dot filled"></span><span class="dot"></span></span> Medium
        <span class="difficulty"><span class="dot filled"></span><span class="dot filled"></span><span class="dot filled"></span></span> Hard
      </p>
    </div>

    <div class="tag-row">
      <button class="tag active" data-tag="all" onclick="toggleTag(this, 'all')">All</button>
      {% for cat in cats %}
      <button class="tag" data-tag="{{ cat | downcase }}" onclick="toggleTag(this, '{{ cat | downcase }}')">{{ cat }}</button>
      {% endfor %}
      <span class="tag-divider" aria-hidden="true"></span>
      {% for t in alltags %}
      <button class="tag tag-attr" data-tag="{{ t | downcase }}" onclick="toggleTag(this, '{{ t | downcase }}')">{{ t }}</button>
      {% endfor %}
    </div>
  </div>

  <div class="grid" id="recipeGrid">
    {% for recipe in site.recipes %}
    {% assign di = recipe.difficulty | minus: 1 %}
    <a class="card"
       href="{{ recipe.url | relative_url }}"
       data-tags="{{ recipe.category | downcase }}{% for t in recipe.tags %} {{ t | downcase }}{% endfor %}"
       data-ingredients="{% for ing in recipe.ingredients %}{{ ing.name | downcase | escape }} {% endfor %}">
      <div class="card-img">
        <img src="{{ recipe.image | relative_url }}" alt="{{ recipe.title }}" loading="lazy">
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
        <h3 class="card-title">{{ recipe.title }}</h3>
        <p class="card-desc">{{ recipe.description }}</p>
        <div class="card-footer">
          <span class="difficulty" title="Difficulty: {{ diffwords[di] }}">
            {% for i in (1..3) %}<span class="dot{% if i <= recipe.difficulty %} filled{% endif %}"></span>{% endfor %}
            <span class="diff-label">{{ diffwords[di] }}</span>
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
