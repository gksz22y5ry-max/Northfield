const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

const handleScroll = () => {
  if (!header) return;
  const shouldShrink = window.scrollY > 20;
  header.classList.toggle('shrink', shouldShrink);
};

handleScroll();
window.addEventListener('scroll', handleScroll, { passive: true });

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileMenu.hidden = isOpen;
  });
}

const revealItems = document.querySelectorAll('.reveal');
if (revealItems.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const accordions = document.querySelectorAll('[data-accordion]');
accordions.forEach((accordion) => {
  accordion.querySelectorAll('.accordion-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const panel = trigger.nextElementSibling;
      trigger.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) {
        panel.hidden = isExpanded;
      }
    });
  });
});

const pricingToggle = document.querySelector('#pricing-toggle');
const pricingLayout = document.querySelector('[data-pricing]');

const updatePricingState = () => {
  if (!pricingLayout || !pricingToggle) return;
  pricingLayout.classList.toggle('handover', pricingToggle.checked);
  pricingLayout.classList.toggle('support', !pricingToggle.checked);
};

if (pricingToggle && pricingLayout) {
  updatePricingState();
  pricingToggle.addEventListener('change', updatePricingState);
}

const contactForm = document.querySelector('[data-contact-form]');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let isValid = true;

    const fields = contactForm.querySelectorAll('input[required], textarea[required]');
    fields.forEach((field) => {
      const error = field.parentElement?.querySelector('.error');
      if (!field.value.trim()) {
        isValid = false;
        if (error) error.textContent = 'This field is required.';
        field.setAttribute('aria-invalid', 'true');
      } else if (field.type === 'email') {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        if (!isEmailValid) {
          isValid = false;
          if (error) error.textContent = 'Enter a valid email address.';
          field.setAttribute('aria-invalid', 'true');
        } else {
          if (error) error.textContent = '';
          field.removeAttribute('aria-invalid');
        }
      } else {
        if (error) error.textContent = '';
        field.removeAttribute('aria-invalid');
      }
    });

    const success = contactForm.querySelector('.form-success');
    if (isValid) {
      if (success) success.textContent = 'Thanks! Your message is ready to send.';
      contactForm.reset();
    } else if (success) {
      success.textContent = '';
    }
  });
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const smoothLinks = document.querySelectorAll('a[href^="#"]');
smoothLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      const headerOffset = header ? header.offsetHeight + 8 : 0;
      const elementPosition = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    }
  });
});
