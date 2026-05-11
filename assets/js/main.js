let currentTag = 'all';
  let servings = 4;
  const baseServings = 4;
 
  function setTag(el, tag) {
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    currentTag = tag;
    filterCards();
  }
 
  function filterCards() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    let visible = 0;
    cards.forEach(card => {
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const tags = card.dataset.tags || '';
      const matchTag = currentTag === 'all' || tags.includes(currentTag);
      const matchQ = !q || title.includes(q);
      const show = matchTag && matchQ;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    document.getElementById('emptyState').style.display = visible === 0 ? 'block' : 'none';
  }
 
  function showRecipe() {
    document.getElementById('home-page').style.display = 'none';
    const rp = document.getElementById('recipe-page');
    rp.classList.add('active');
    window.scrollTo(0, 0);
  }
 
  function showHome() {
    document.getElementById('home-page').style.display = '';
    const rp = document.getElementById('recipe-page');
    rp.classList.remove('active');
    window.scrollTo(0, 0);
  }
 
  function changeServings(delta) {
    servings = Math.max(1, servings + delta);
    document.getElementById('servCount').textContent = servings;
    document.querySelectorAll('.ing-amount[data-base]').forEach(el => {
      const base = parseFloat(el.dataset.base);
      const scaled = Math.round((base / baseServings) * servings * 10) / 10;
      const orig = el.textContent.replace(/[\d.]+/, '');
      el.textContent = scaled + orig.trim().replace(/^[\d.]+/, '');
    });
  }