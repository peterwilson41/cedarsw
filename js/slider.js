// Testimonial carousel — prev/next + dots, one card per step.
export function initSlider() {
  const track = document.getElementById('tslideTrack');
  if (!track) return;

  const count = track.children.length;
  const prev = document.getElementById('tPrev');
  const next = document.getElementById('tNext');
  const dotsWrap = document.getElementById('tDots');
  let current = 0;

  const dots = Array.from({ length: count }, (_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 't-dot';
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => go(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  const render = () => {
    track.style.transform = `translateX(calc(${-current} * (var(--tslide-w) + 24px)))`;
    if (prev) prev.disabled = current === 0;
    if (next) next.disabled = current === count - 1;
    dots.forEach((d, i) => d.classList.toggle('is-active', i === current));
  };
  const go = (n) => { current = Math.max(0, Math.min(count - 1, n)); render(); };

  prev?.addEventListener('click', () => go(current - 1));
  next?.addEventListener('click', () => go(current + 1));
  render();
}
