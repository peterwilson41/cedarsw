// Testimonial carousel — infinite loop, one step per arrow press.
export function initSlider() {
  const track = document.getElementById('tslideTrack');
  if (!track || track.children.length < 2) return;

  const prev = document.getElementById('tPrev');
  const next = document.getElementById('tNext');
  prev?.removeAttribute('disabled');

  const EASE = 'transform var(--dur-slow) var(--ease-out)';
  let busy = false;

  // distance from one card to the next, incl. gap
  const step = () => {
    const [a, b] = track.children;
    return b.offsetLeft - a.offsetLeft;
  };

  const DUR = 600; // matches --dur-slow

  const advance = () => {
    if (busy) return;
    busy = true;
    track.style.transition = EASE;
    track.style.transform = `translateX(${-step()}px)`;
    setTimeout(() => {
      track.style.transition = 'none';
      track.appendChild(track.firstElementChild);
      track.style.transform = 'none';
      void track.offsetWidth; // flush
      busy = false;
    }, DUR);
  };

  const retreat = () => {
    if (busy) return;
    busy = true;
    track.style.transition = 'none';
    track.insertBefore(track.lastElementChild, track.firstElementChild);
    track.style.transform = `translateX(${-step()}px)`;
    void track.offsetWidth; // flush before animating back
    track.style.transition = EASE;
    track.style.transform = 'none';
    setTimeout(() => { busy = false; }, DUR + 40);
  };

  next?.addEventListener('click', advance);
  prev?.addEventListener('click', retreat);
}
