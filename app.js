'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const menuButton = $('.menu-toggle');
const mobileNav = $('#mobile-nav');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); mobileNav.hidden = true; }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
});
$$('a,button', mobileNav).forEach(el => el.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

const chapters = [
  { image: 'director', alt: 'Первая встреча Билби и птенца в пустыне', caption: 'Иногда друзья появляются совсем неожиданно.' },
  { image: 'friendship', alt: 'Билби протягивает лапу птенцу на тёплом камне', caption: 'Забота начинается с самого простого — быть рядом.' },
  { image: 'cliff', alt: 'Билби и его маленький друг вместе на зелёном утёсе', caption: 'Теперь этот большой мир они открывают вдвоём.' }
];
let chapterTimer;
$$('[data-chapter]').forEach(button => button.addEventListener('click', () => {
  const chapter = chapters[Number(button.dataset.chapter)];
  $$('[data-chapter]').forEach(b => { const active = b === button; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
  const img = $('#chapter-image');
  clearTimeout(chapterTimer);
  img.style.opacity = '.2';
  chapterTimer = setTimeout(() => {
    img.src = `assets/${chapter.image}.webp`;
    img.alt = chapter.alt;
    img.onload = () => { img.style.opacity = '1'; };
    if (img.complete) img.style.opacity = '1';
    $('#chapter-note').textContent = chapter.caption;
    $('#chapter-announcement').textContent = chapter.caption;
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 140);
}));

let toastTimer;
function showToast(message) {
  clearTimeout(toastTimer);
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2700);
}
let favorites = {};
try { const saved = JSON.parse(localStorage.getItem('bilby-favorite-heroes') || '{}'); if (saved && typeof saved === 'object' && !Array.isArray(saved)) favorites = saved; } catch {}
function updateFavorite(button) {
  const key = button.dataset.favorite;
  const active = favorites[key] === true;
  button.setAttribute('aria-pressed', String(active));
  const name = key === 'bilby' ? 'Билби' : 'птенца';
  button.setAttribute('aria-label', active ? `Убрать ${name} из любимых героев` : `Добавить ${name} в любимые герои`);
}
$$('[data-favorite]').forEach(button => {
  updateFavorite(button);
  button.addEventListener('click', () => {
    const key = button.dataset.favorite;
    favorites[key] = favorites[key] !== true;
    try { localStorage.setItem('bilby-favorite-heroes', JSON.stringify(favorites)); } catch {}
    updateFavorite(button);
    showToast(favorites[key] ? (key === 'bilby' ? 'Билби теперь в вашем сердце ♡' : 'Птенец теперь в вашем сердце ♡') : 'Герой убран из избранного');
  });
});

const frames = [
  { image: 'friendship', caption: 'Самое начало дружбы', alt: 'Билби протягивает лапу белому птенцу, сидящему на камне' },
  { image: 'bird', caption: 'Маленькое большое чудо', alt: 'Крошечный белый птенец на оранжевом песке' },
  { image: 'berries', caption: 'У счастья ягодный вкус', alt: 'Билби на земле перед россыпью красных ягод' },
  { image: 'cliff', caption: 'Когда рядом — спокойно', alt: 'Билби и птенец на травянистом утёсе' },
  { image: 'director', caption: 'Встреча, которая меняет всё', alt: 'Неожиданная встреча Билби и птенца в пустыне' },
  { image: 'frame10', caption: 'Счастье быть собой', alt: 'Радостный Билби поднял лапы у моря' }
];
const lightbox = $('#lightbox');
const watchDialog = $('#watch-dialog');
let frameIndex = 0;
function showFrame(index) {
  frameIndex = (index + frames.length) % frames.length;
  const frame = frames[frameIndex];
  const img = $('#lightbox-image');
  img.src = `assets/${frame.image}.webp`;
  img.alt = frame.alt;
  $('#lightbox-counter').textContent = `${String(frameIndex + 1).padStart(2, '0')} / ${String(frames.length).padStart(2, '0')}`;
  $('#lightbox-caption').textContent = frame.caption;
}
function openDialog(dialog) { closeMenu(); dialog.showModal(); document.body.classList.add('modal-open'); }
$$('[data-image]').forEach(button => button.addEventListener('click', () => { showFrame(Number(button.dataset.image)); openDialog(lightbox); }));
$('.lightbox-prev').addEventListener('click', () => showFrame(frameIndex - 1));
$('.lightbox-next').addEventListener('click', () => showFrame(frameIndex + 1));
lightbox.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); showFrame(frameIndex - 1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); showFrame(frameIndex + 1); }
});
let touchStartX = 0;
let touchStartY = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; touchStartY = e.changedTouches[0].screenY; }, { passive: true });
lightbox.addEventListener('touchend', e => {
  const deltaX = e.changedTouches[0].screenX - touchStartX;
  const deltaY = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY)) showFrame(frameIndex + (deltaX < 0 ? 1 : -1));
}, { passive: true });
$$('[data-watch]').forEach(button => button.addEventListener('click', () => {
  openDialog(watchDialog);
  const iframe = document.createElement('iframe');
  iframe.src = 'https://player.vimeo.com/video/321083424?h=491b97e733&autoplay=1&title=0&byline=0&portrait=0';
  iframe.title = 'Билби — короткометражный мультфильм DreamWorks';
  iframe.allow = 'autoplay; fullscreen; picture-in-picture';
  iframe.allowFullscreen = true;
  $('#video-container').replaceChildren(iframe);
}));
$$('[data-close]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.close).close()));
[lightbox, watchDialog].forEach(dialog => {
  dialog.addEventListener('close', () => { if (!lightbox.open && !watchDialog.open) document.body.classList.remove('modal-open'); if (dialog === watchDialog) $('#video-container').replaceChildren(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  $$('.reveal').forEach(el => observer.observe(el));
}
