// Cookie consent — Google Analytics stays unloaded until the visitor opts in.
const KEY = 'cw-cookie-consent';
const GA_ID = 'G-ZC2KKE2GDV';

function loadAnalytics() {
  if (window.__ga) return;
  window.__ga = true;

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.append(tag);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
}

function showBanner(onChoice) {
  const el = document.createElement('div');
  el.className = 'cookie-banner';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Cookie consent');
  el.innerHTML = `
    <p class="cookie-banner__text">This website uses cookies. By continuing to use this website you are giving consent to cookies being used. <a href="privacy.html">Privacy Policy</a></p>
    <div class="cookie-banner__actions">
      <button class="btn btn--outline" type="button" data-reject>Reject</button>
      <button class="btn btn--primary" type="button" data-accept>Accept</button>
    </div>`;

  const dismiss = () => { el.classList.add('is-out'); setTimeout(() => el.remove(), 360); };
  el.querySelector('[data-accept]').onclick = () => { onChoice('granted'); dismiss(); };
  el.querySelector('[data-reject]').onclick = () => { onChoice('denied'); dismiss(); };
  document.body.append(el);
}

export function initCookies() {
  let choice = null;
  try { choice = localStorage.getItem(KEY); } catch { /* private mode */ }

  if (choice === 'granted') { loadAnalytics(); return; }
  if (choice === 'denied') return;

  showBanner((value) => {
    try { localStorage.setItem(KEY, value); } catch { /* private mode */ }
    if (value === 'granted') loadAnalytics();
  });
}
