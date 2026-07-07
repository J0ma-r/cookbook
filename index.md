---
layout: default
title: The Virtual Cookbook
---

{% assign cats = site.recipes | map: "category" | uniq | sort %}
{% assign diffwords = "Easy,Medium,Hard" | split: "," %}
{% assign tagstr = "" %}
{% for r in site.recipes %}{% for t in r.tags %}{% assign tagstr = tagstr | append: t | append: "," %}{% endfor %}{% endfor %}
{% assign alltags = tagstr | split: "," | uniq | sort %}

<div class="landing">

  <section class="home-hero">
    <p class="hero-eyebrow">Home Cooking</p>
    <h1>The Virtual<br><em>Cookbook</em></h1>
    <p class="hero-sub">A recipe for any occasion.</p>

    <form class="home-search" action="{{ '/recipes/' | relative_url }}" method="get" role="search">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>
      <input type="text" name="q" placeholder="Search recipes or ingredients&hellip;" aria-label="Search recipes or ingredients">
    </form>

    <div class="hero-actions">
      <a class="btn-primary" href="{{ '/recipes/' | relative_url }}">Browse all recipes</a>
    </div>

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
  </section>

  <section class="home-section">
    <p class="home-section-label">Jump to a category</p>
    <div class="quick-links">
      {% for cat in cats %}
      <a class="quick-link" href="{{ '/recipes/' | relative_url }}#{{ cat | downcase }}">{{ cat }}</a>
      {% endfor %}
      {% for t in alltags %}
      <a class="quick-link quick-link-attr" href="{{ '/recipes/' | relative_url }}#{{ t | downcase }}">{{ t }}</a>
      {% endfor %}
    </div>
  </section>

  {% assign featured = site.recipes | where_exp: "r", "r.featured" %}
  {% if featured.size > 0 %}
  <section class="home-section">
    <div class="section-head">
      <h2 class="section-title">Featured</h2>
      <a class="view-all" href="{{ '/recipes/' | relative_url }}">View all &rarr;</a>
    </div>

    <div class="grid">
      {% for recipe in featured %}
      {% assign di = recipe.difficulty | minus: 1 %}
      <a class="card" href="{{ recipe.url | relative_url }}">
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
  </section>
  {% endif %}

</div>
