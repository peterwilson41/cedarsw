import { reduced, onScroll } from './util.js';

export function initScrollFx() {
  scrubScale();
  servicesCarousel();
}

// Spilling images grow from their anchored corner as they enter, scrubbed to scroll.
function scrubScale() {
  if (reduced) return;
  const imgs = [...document.querySelectorAll('.origin__media')];
  if (!imgs.length) return;

  onScroll(() => {
    for (const el of imgs) {
      const { top } = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - top) / (innerHeight * 0.62)));
      const eased = 1 - (1 - p) ** 3;
      el.style.transform = `scale(${(0.6 + 0.4 * eased).toFixed(4)})`;
      el.style.opacity = Math.min(1, eased * 1.35).toFixed(3);
    }
  });
}

// What We Do: the sticky image swaps as each service row passes the trigger line.
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
    const trigger = Math.min(innerHeight * 0.32, 240);
    let step = 0;
    steps.forEach((s, i) => { if (s.getBoundingClientRect().top <= trigger) step = i; });
    const idx = Math.min(items.length - 1, Math.floor(step / per));
    if (idx !== shown) { shown = idx; track.style.transform = `translateX(${-idx * unit()}px)`; }
  });
}
