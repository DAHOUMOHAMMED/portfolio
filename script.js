/* =========================================================
   1. BASCULE FR / EN
   Chaque élément avec data-fr et data-en est traduit.
   Le choix est mémorisé dans le navigateur (localStorage).
   ========================================================= */
const langButtons = document.querySelectorAll('.lang-btn');

function setLang(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-fr]').forEach(el => {
    // innerHTML pour autoriser <strong> dans les textes
    el.innerHTML = el.dataset[lang];
  });
  langButtons.forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  try { localStorage.setItem('lang', lang); } catch (e) {}
}

langButtons.forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

let saved = 'fr';
try { saved = localStorage.getItem('lang') || 'fr'; } catch (e) {}
setLang(saved);

/* =========================================================
   2. SCROLLSPY : surligne le lien de la section visible
   IntersectionObserver prévient quand une section
   entre dans la zone centrale de l'écran.
   ========================================================= */
const sections = document.querySelectorAll('main section[id]');
const links = document.querySelectorAll('.nav-links a');

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l =>
        l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });   // zone de détection = ligne au milieu de l'écran

sections.forEach(s => spy.observe(s));

/* =========================================================
   3. BOUTON RETOUR EN HAUT
   ========================================================= */
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  toTop.classList.toggle('show', window.scrollY > 500);
});
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =========================================================
   4. ANNÉE AUTOMATIQUE DANS LE FOOTER
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();

/* =========================================================
   5. FOND ANIMÉ : points qui bougent, reliés s'ils sont proches
   ========================================================= */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H, points;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  const count = Math.min(70, Math.floor(W * H / 22000));   // moins de points sur petit écran
  points = Array.from({ length: count }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35
  }));
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  for (const p of points) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > W) p.vx *= -1;     // rebond sur les bords
    if (p.y < 0 || p.y > H) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(14,165,164,.45)';
    ctx.fill();
  }
  // lignes entre points proches (distance < 140 px)
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const d = Math.hypot(dx, dy);
      if (d < 140) {
        ctx.strokeStyle = `rgba(37,99,235,${0.15 * (1 - d / 140)})`;
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y);
        ctx.lineTo(points[j].x, points[j].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(draw);
}

// Respecte les utilisateurs qui désactivent les animations
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  resize();
  draw();
  window.addEventListener('resize', resize);
}
