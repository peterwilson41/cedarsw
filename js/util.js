const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

// True once any part of el is within ratio of the viewport height.
const inView = (el, ratio = 0.9) => {
  const r = el.getBoundingClientRect();
  return r.top < innerHeight * ratio && r.bottom > 0;
};

// rAF-throttled scroll/resize handler. Runs once straight away.
const onScroll = (fn) => {
  let queued = false;
  const tick = () => { queued = false; fn(); };
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(tick); } }, { passive: true });
  addEventListener('resize', tick);
  fn();
};

export { reduced, inView, onScroll };
