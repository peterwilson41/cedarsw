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

    const val = (id) => document.getElementById(id)?.value.trim() || '';
    const name = val('cf-name');
    const email = val('cf-email');
    const phone = val('cf-phone');
    const location = val('cf-loc');
    const message = val('cf-msg');

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      location && `Location: ${location}`,
      '',
      message,
    ].filter((l) => l !== false && l !== undefined).join('\n');

    const subject = name ? `Enquiry from ${name}` : 'Enquiry via cedarswoods.com';
    window.location.href = `mailto:connect@cedarswoods.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    form.classList.add('is-hidden');
    document.getElementById('formThanks')?.classList.remove('is-hidden');
  });
}
