// Header menu, footer year, contact form acknowledgement.
export function initNav() {
  const year = new Date().getFullYear();
  document.querySelectorAll('#year').forEach((el) => { el.textContent = year; });

  const header = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  toggle?.addEventListener('click', () => {
    const open = header.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });

  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    form.classList.add('is-hidden');
    document.getElementById('formThanks')?.classList.remove('is-hidden');
  });
}
