// Menu móvel
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('is-open', !open);
  });
}

// Ano no rodapé
document.querySelectorAll('[data-year]').forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Slider principal
const slider = document.querySelector('.main-slider');
if (slider) {
  const slides = [...slider.querySelectorAll('.slide')];
  const dots = [...slider.querySelectorAll('.slider-dots button')];
  let current = 0;
  let timer;
  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle('is-active', n === current));
    dots.forEach((d, n) => d.toggleAttribute('aria-current', n === current));
    dots.forEach((d, n) => n === current && d.setAttribute('aria-current', 'true'));
  };
  const start = () => {
    clearInterval(timer);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = setInterval(() => show(current + 1), 7000);
    }
  };
  dots.forEach((d, n) => d.addEventListener('click', () => { show(n); start(); }));
  start();
}

// Carrosséis (serviços, frota)
document.querySelectorAll('[data-carousel]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const track = document.getElementById(btn.dataset.carousel);
    if (!track) return;
    const card = track.firstElementChild;
    const step = card ? card.getBoundingClientRect().width + 30 : track.clientWidth;
    const dir = btn.classList.contains('prev') ? -1 : 1;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
    if (dir === 1 && atEnd) track.scrollTo({ left: 0 });
    else if (dir === -1 && track.scrollLeft <= 5) track.scrollTo({ left: track.scrollWidth });
    else track.scrollBy({ left: dir * step });
  });
});

// Aparecimento suave ao fazer scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Formulário de contacto (sem backend ainda)
const form = document.querySelector('.form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const note = form.querySelector('.form-status');
    if (note) note.textContent = 'Obrigado! (Envio provisório: o formulário ainda não está ligado a um serviço de email.)';
    form.reset();
  });
}

// Ocorrências: fonte única de dados (por agora ficheiro de demonstração).
// Quando houver chave do Fogos.pt, basta mudar OCORRENCIAS_URL para a função do Vercel.
const OCORRENCIAS_URL = 'assets/data/ocorrencias-demo.json';
window.carregarOcorrencias = () =>
  fetch(OCORRENCIAS_URL, { cache: 'no-store' })
    .then((r) => r.json())
    .then((json) => json.ocorrencias.map((o) => ({
      ...o,
      data: o.data ? new Date(o.data) : new Date(Date.now() - (o.minutos_atras || 0) * 60000),
    })).sort((a, b) => b.data - a.data));

// Contador de ocorrências ativas na barra superior
const occCount = document.querySelector('[data-occ-count]');
if (occCount) {
  const occLabel = document.querySelector('[data-occ-label]');
  const refreshCount = () => window.carregarOcorrencias().then((lista) => {
    const n = lista.filter((o) => o.estado !== 'Concluída').length;
    occCount.textContent = n;
    if (occLabel) occLabel.textContent = n === 1 ? 'ocorrência ativa' : 'ocorrências ativas';
  }).catch(() => {});
  refreshCount();
  setInterval(refreshCount, 120000);
}
