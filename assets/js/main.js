/* ============================================================
   Browse page: search + multi-select category filtering
   ============================================================ */
const activeTags = new Set();

function syncAllButton() {
  const allBtn = document.querySelector('.tag[data-tag="all"]');
  if (allBtn) allBtn.classList.toggle('active', activeTags.size === 0);
}

function toggleTag(el, tag) {
  if (tag === 'all') {
    activeTags.clear();
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  } else {
    el.classList.toggle('active');
    if (el.classList.contains('active')) activeTags.add(tag);
    else activeTags.delete(tag);
  }
  syncAllButton();
  filterCards();
}

function filterCards() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const q = input.value.trim().toLowerCase();
  const cards = document.querySelectorAll('.card');
  let visible = 0;
  cards.forEach(card => {
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const ingredients = card.dataset.ingredients || '';
    const tags = (card.dataset.tags || '').split(/\s+/);
    // Multi-select is AND: show a card only if it matches EVERY selected tag.
    const matchTag = activeTags.size === 0 || [...activeTags].every(t => tags.includes(t));
    // Search matches the recipe name OR any ingredient.
    const matchQ = !q || title.includes(q) || ingredients.includes(q);
    const show = matchTag && matchQ;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const empty = document.getElementById('emptyState');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

// Preselect a filter when arriving via a /recipes/#category link from the home page.
function applyHashFilter() {
  const hash = decodeURIComponent((location.hash || '').replace('#', '')).toLowerCase();
  if (!hash) return;
  const btn = document.querySelector('.tag[data-tag="' + hash.replace(/"/g, '') + '"]');
  if (btn && !btn.classList.contains('active')) toggleTag(btn, hash);
}

/* ============================================================
   Recipe page: serving scaling (formatMeasure lives in scaling.js,
   loaded before this file)
   ============================================================ */

let baseServings = 4;
let servings = 4;

function renderIngredients() {
  const factor = servings / baseServings;
  document.querySelectorAll('.ing-amount[data-base]').forEach(el => {
    const base = parseFloat(el.dataset.base);
    if (isNaN(base)) return;
    el.textContent = formatMeasure(base, el.dataset.unit || '', factor);
  });
}

function updatePresets() {
  document.querySelectorAll('.serv-preset').forEach(chip => {
    chip.classList.toggle('active', parseFloat(chip.dataset.serv) === servings);
  });
}

function setServings(n) {
  n = parseInt(n, 10);
  if (isNaN(n) || n < 1) n = 1;
  if (n > 99) n = 99;
  servings = n;
  const input = document.getElementById('servCount');
  if (input) input.value = String(n);
  updatePresets();
  renderIngredients();
}

function changeServings(delta) {
  setServings(servings + delta);
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('servCount');
  if (input) {
    baseServings = parseFloat(input.dataset.baseServings) || 4;
    servings = baseServings;
    input.value = String(servings);
    updatePresets();
    renderIngredients();
  }
  // Browse page only
  if (document.getElementById('recipeGrid')) {
    // Search term arriving from the home page search box (/recipes/?q=...)
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const searchInput = document.getElementById('searchInput');
    if (q && searchInput) searchInput.value = q;
    applyHashFilter();
    filterCards();
  }
});
