let currentTag = 'all';
let servings = null;
let baseServings = null;

function setTag(el, tag) {
  document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentTag = tag;
  filterCards();
}

function filterCards() {
  const input = document.getElementById('searchInput');
  const q = input ? input.value.toLowerCase() : '';
  const cards = document.querySelectorAll('.grid .card');
  let visible = 0;
  cards.forEach(card => {
    const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
    const tags = card.dataset.tags || '';
    const matchTag = currentTag === 'all' || tags.includes(currentTag);
    const matchQ = !q || title.includes(q) || desc.includes(q);
    const show = matchTag && matchQ;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const empty = document.getElementById('emptyState');
  if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
}

function changeServings(delta) {
  const list = document.querySelector('.ing-list[data-base-servings]');
  if (!list) return;
  if (baseServings === null) {
    baseServings = parseInt(list.dataset.baseServings, 10) || 4;
    servings = baseServings;
  }
  servings = Math.max(1, servings + delta);
  const countEl = document.getElementById('servCount');
  if (countEl) countEl.textContent = servings;

  list.querySelectorAll('.ing-amount[data-base]').forEach(el => {
    const base = parseFloat(el.dataset.base);
    const unit = el.dataset.unit || '';
    let scaled = (base / baseServings) * servings;
    scaled = Math.round(scaled * 100) / 100;
    el.textContent = unit ? `${scaled} ${unit}` : `${scaled}`;
  });
}
