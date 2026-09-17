// ---------- Fold-out accordions (ZEITECHT overview) ----------
document.querySelectorAll('.foldout-toggle').forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-target');
    const panel = document.getElementById(targetId);
    const isOpen = panel.classList.contains('open');

    document.querySelectorAll('.foldout-panel').forEach((p) => p.classList.remove('open'));
    document.querySelectorAll('.foldout-toggle .sign').forEach((s) => (s.textContent = '+'));

    if (!isOpen) {
      panel.classList.add('open');
      btn.querySelector('.sign').textContent = '\u2212';
    }
  });
});

// ---------- Filter bar (Arbeiten) ----------
const filterButtons = document.querySelectorAll('.filter-bar button');
const entries = document.querySelectorAll('[data-status]');

function applyFilter(filter) {
  let firstVisible = true;
  entries.forEach((entry) => {
    const matches = filter === 'alle' || entry.getAttribute('data-status') === filter;
    entry.style.display = matches ? '' : 'none';
    if (matches) {
      entry.setAttribute('data-first-visible', firstVisible ? 'true' : 'false');
      firstVisible = false;
    }
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.getAttribute('data-filter'));
  });
});

if (filterButtons.length) applyFilter('alle');

// ---------- Carousel dots (Aktuelles / Einblicke) ----------
document.querySelectorAll('.carousel').forEach((carousel) => {
  const dotsContainer = carousel.parentElement.querySelector('.carousel-dots');
  if (!dotsContainer) return;
  const cards = carousel.querySelectorAll('.card');
  const dots = dotsContainer.querySelectorAll('.dot');

  carousel.addEventListener('scroll', () => {
    const scrollLeft = carousel.scrollLeft;
    let activeIndex = 0;
    cards.forEach((card, i) => {
      if (card.offsetLeft - carousel.offsetLeft <= scrollLeft + 20) activeIndex = i;
    });
    dots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
  });
});

// Aktuelles "next batch" arrow: advances by one card-width click
document.querySelectorAll('.carousel-next-arrow').forEach((arrow) => {
  arrow.addEventListener('click', (e) => {
    e.stopPropagation();
    const carousel = arrow.closest('.carousel-section').querySelector('.carousel');
    const cardWidth = carousel.querySelector('.card').offsetWidth + 16;
    carousel.scrollBy({ left: cardWidth * 2, behavior: 'smooth' });
  });
});

// ---------- Lightbox (Auszug lesen / Inszenierungsschluessel) ----------
function openLightbox(contentHtml) {
  let overlay = document.getElementById('lightbox-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'lightbox-overlay';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(46,42,36,0.55)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '999';
    overlay.style.padding = '20px';
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }
  const panel = document.createElement('div');
  panel.style.background = '#FDFCFA';
  panel.style.maxWidth = '640px';
  panel.style.maxHeight = '85vh';
  panel.style.overflowY = 'auto';
  panel.style.padding = '32px';
  panel.innerHTML = contentHtml;
  overlay.innerHTML = '';
  overlay.appendChild(panel);
}

document.querySelectorAll('[data-lightbox]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const template = document.getElementById(trigger.getAttribute('data-lightbox'));
    if (template) openLightbox(template.innerHTML);
  });
});

// ---------- Info-strip: hide any item, remaining ones reflow (CSS flex handles the reflow;
// this only toggles the data-hidden attribute, e.g. from a future admin setting) ----------
// Usage: add data-hidden="true" to any .info-strip .item in the template to hide it permanently.

// ---------- Ueber mich: cycling portrait ----------
document.querySelectorAll('.photo-cycle').forEach((container) => {
  const images = JSON.parse(container.getAttribute('data-images') || '[]');
  if (images.length <= 1) return;
  let index = 0;
  const imgEl = container.querySelector('img, .ph');
  const dots = container.parentElement.querySelectorAll('.photo-dots .dot');
  container.addEventListener('click', () => {
    index = (index + 1) % images.length;
    if (imgEl.tagName === 'IMG') imgEl.src = images[index];
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  });
});

// ---------- SPARKS ----------
const sparksDisplay = document.querySelector('.sparks-display');
if (sparksDisplay) {
  const prompts = JSON.parse(sparksDisplay.getAttribute('data-prompts') || '[]');
  const promptEl = sparksDisplay.querySelector('.prompt');
  let current = -1;
  function showNext() {
    let next = Math.floor(Math.random() * prompts.length);
    if (prompts.length > 1 && next === current) next = (next + 1) % prompts.length;
    current = next;
    promptEl.textContent = prompts[current];
  }
  showNext();
  sparksDisplay.addEventListener('click', showNext);
}
