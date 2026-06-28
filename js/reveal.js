import { reduced, inView } from './util.js';

// Scroll-in motion: fade blocks, line-by-line headings, staggered service rows.
export function initReveals() {
  if (reduced) return;
  fadeBlocks();
  lineHeadings();
  staggerServices();
}

function watch(items, reveal, ratio) {
  const pending = [...items];
  const check = () => {
    for (let i = pending.length - 1; i >= 0; i--) {
      if (inView(pending[i], ratio)) reveal(pending.splice(i, 1)[0]);
    }
    if (!pending.length) removeEventListener('scroll', check);
  };
  addEventListener('scroll', check, { passive: true });
  check();
}

function fadeBlocks() {
  const blocks = document.querySelectorAll('.reveal');
  blocks.forEach((el) => el.classList.add('is-armed'));
  watch(blocks, (el) => el.classList.replace('is-armed', 'is-in'), 0.92);
}

function lineHeadings() {
  const heads = document.querySelectorAll('[data-line-reveal]');
  heads.forEach(splitIntoLines);
  watch(heads, (el) => el.classList.add('is-in'), 0.9);
}

// Lay the words out, read where the browser wraps, then re-wrap each line
// in a clipped span so it can slide up independently.
function splitIntoLines(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.textContent = '';

  const probes = words.map((w) => {
    const s = document.createElement('span');
    s.textContent = w;
    s.style.display = 'inline-block';
    el.append(s, ' ');
    return s;
  });

  const lines = [];
  let line = null;
  let top = null;
  for (const s of probes) {
    if (top === null || Math.abs(s.offsetTop - top) < 4) {
      if (!line) { line = []; lines.push(line); top = s.offsetTop; }
      line.push(s.textContent);
    } else {
      line = [s.textContent];
      lines.push(line);
      top = s.offsetTop;
    }
  }

  el.textContent = '';
  lines.forEach((parts, i) => {
    const outer = document.createElement('span');
    outer.className = 'lr-line';
    const inner = document.createElement('span');
    inner.className = 'lr-inner';
    inner.style.transitionDelay = `${i * 95}ms`;
    inner.textContent = parts.join(' ');
    outer.append(inner);
    el.append(outer);
  });
}

function staggerServices() {
  const items = [...document.querySelectorAll('.services__list .service')];
  if (!items.length) return;
  items.forEach((el) => el.classList.add('svc-armed'));

  const check = () => {
    const batch = items.filter((el) => !el.classList.contains('svc-in') && inView(el, 0.85));
    batch.forEach((el, k) => {
      el.style.transitionDelay = `${k * 90}ms`;
      el.classList.replace('svc-armed', 'svc-in');
    });
    if (items.every((el) => el.classList.contains('svc-in'))) removeEventListener('scroll', check);
  };
  addEventListener('scroll', check, { passive: true });
  check();
}
