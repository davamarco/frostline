/* ============================================================
   FROSTLINE RESORT — script.js
   ============================================================ */


/* ── Burger Menu ──────────────────────────────────────────── */

const burger  = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

if (burger && navMenu) {
  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    navMenu.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
    burger.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation menu' : 'Open navigation menu'
    );
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navMenu.querySelectorAll('.nav__link, .nav__cta-mobile').forEach(el => {
    el.addEventListener('click', closeMobileNav);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && burger.classList.contains('open')) {
      closeMobileNav();
    }
  });
}

function closeMobileNav() {
  burger.classList.remove('open');
  navMenu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'Open navigation menu');
  document.body.style.overflow = '';
}


/* ── Header Shrink on Scroll ──────────────────────────────── */

const siteHeader = document.getElementById('site-header');

if (siteHeader) {
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}


/* ── Scroll Reveal ────────────────────────────────────────── */

const prefersReducedMotion =
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  revealEls.forEach(el => observer.observe(el));
})();


/* ── Stat Counters ────────────────────────────────────────── */

(function initCounters() {
  const counterEls = document.querySelectorAll('.stat__number[data-target]');
  if (!counterEls.length) return;

  function runCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1600;
    const start    = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      /* ease-out cubic */
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));
})();


/* ── Gallery Lightbox ─────────────────────────────────────── */

(function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbClose  = document.getElementById('lightbox-close');
  if (!lightbox) return;

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Make each gallery item keyboard-accessible */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      openLightbox(img.src, img.alt);
    });

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const img = item.querySelector('img');
        openLightbox(img.src, img.alt);
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);

  /* Click on backdrop closes lightbox */
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target === lbImg) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
})();


/* ── Activities Deck Reveal ───────────────────────────────── */

(function initActivities() {
  const deck = document.getElementById('activities-deck');
  if (!deck) return;

  /* Reduced motion: reveal immediately, skip observer */
  if (prefersReducedMotion) {
    deck.classList.add('act-deck--animating');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      deck.classList.add('act-deck--animating');
      observer.disconnect();   /* fires once */
    });
  }, {
    rootMargin: '0px 0px -15% 0px',
    threshold: 0.15,
  });

  observer.observe(deck);
})();
