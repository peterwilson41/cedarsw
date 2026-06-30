import { reduced, inView, onScroll } from './util.js';

// All the scroll-driven flourishes.
export function initScrollFx() {
  parallaxImages();
  scrubMomentImages();
  pinnedStages();
  connectorThreads();
  servicesCarousel();
}

// Flank images + the inner of each moment image drift slightly against the scroll.
function parallaxImages() {
  if (reduced) return;
  const imgs = [...document.querySelectorAll('.flank__img, .moment__img-inner')];
  if (!imgs.length) return;

  onScroll(() => {
    const mid = innerHeight / 2;
    for (const el of imgs) {
      const r = el.getBoundingClientRect();
      const factor = parseFloat(el.dataset.factor || '0.04');
      const cap = parseFloat(el.dataset.max || '50');
      const shift = Math.max(-cap, Math.min(cap, (mid - (r.top + r.height / 2)) * factor));
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    }
  });
}

// Big "moment" images scale up from their bottom corner as you scroll past.
function scrubMomentImages() {
  if (reduced) return;
  const imgs = [...document.querySelectorAll('.moment__img, .origin__media')];
  if (!imgs.length) return;

  onScroll(() => {
    for (const el of imgs) {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.62)));
      const eased = 1 - (1 - p) ** 3;
      el.style.transform = `scale(${(0.6 + 0.4 * eased).toFixed(4)})`;
      el.style.opacity = Math.min(1, eased * 1.35).toFixed(3);
    }
  });
}

// Pinned "the line" stages — swap one paragraph per scroll step, grow the thread.
function pinnedStages() {
  document.querySelectorAll('[data-line-stage]').forEach((stage) => {
    const paras = [...stage.querySelectorAll('[data-line-para]')];
    const fill = stage.querySelector('[data-thread] .thread__fill');
    const setActive = (i) => paras.forEach((p, n) => p.classList.toggle('is-active', n === i));

    // Below the pinned breakpoint (or reduced motion) just show everything.
    if (reduced || innerWidth <= 960) {
      paras.forEach((p) => p.classList.add('is-active'));
      if (fill) fill.style.transform = 'scaleY(1)';
      return;
    }

    setActive(0);
    onScroll(() => {
      const r = stage.getBoundingClientRect();
      const total = stage.offsetHeight - innerHeight;
      const prog = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setActive(Math.min(paras.length - 1, Math.floor(prog * paras.length)));
      if (fill) fill.style.transform = `scaleY(${prog.toFixed(3)})`;
    });
  });
}

function connectorThreads() {
  const threads = [...document.querySelectorAll('[data-thread-enter]')];
  if (!threads.length) return;
  if (reduced) { threads.forEach((t) => t.classList.add('is-in')); return; }

  const check = () => {
    for (let i = threads.length - 1; i >= 0; i--) {
      if (inView(threads[i], 0.7)) threads.splice(i, 1)[0].classList.add('is-in');
    }
    if (!threads.length) removeEventListener('scroll', check);
  };
  addEventListener('scroll', check, { passive: true });
  check();
}

// What We Do — the sticky image swaps as each service row reaches the top.
function servicesCarousel() {
  const wrap = document.querySelector('[data-wd-carousel]');
  if (!wrap) return;
  const track = wrap.querySelector('.wd-carousel__track');
  const items = wrap.querySelectorAll('.wd-carousel__item');
  const steps = [...document.querySelectorAll('[data-wd-step]')];
  if (!steps.length || !items.length) return;

  const per = Math.max(1, Math.ceil(steps.length / items.length));
  const unit = () => (items.length > 1 ? items[1].offsetLeft - items[0].offsetLeft : 0);
  let shown = -1;

  onScroll(() => {
    const line = Math.min(innerHeight * 0.32, 240);
    let step = 0;
    steps.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) step = i; });
    const idx = Math.min(items.length - 1, Math.floor(step / per));
    if (idx !== shown) { shown = idx; track.style.transform = `translateX(${-idx * unit()}px)`; }
  });
}
