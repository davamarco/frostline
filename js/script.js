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
  function updateHeader() {
    siteHeader.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader(); /* run once on load in case page is already scrolled */
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


/* ── Booking Modal ────────────────────────────────────────── */

(function initBookingModal() {
  const modal       = document.getElementById('booking-modal');
  const backdrop    = document.getElementById('booking-backdrop');
  const closeBtn    = document.getElementById('booking-close');
  const form        = document.getElementById('booking-form');
  const success     = document.getElementById('booking-success');
  const decBtn      = document.getElementById('bk-decrement');
  const incBtn      = document.getElementById('bk-increment');
  const peopleVal   = document.getElementById('bk-people-val');
  const peopleInput = document.getElementById('bk-people');
  const dateInput   = document.getElementById('bk-date');
  if (!modal) return;

  if (dateInput) dateInput.min = new Date().toISOString().slice(0, 10);

  let count       = 1;
  let returnFocus = null;
  let autoClose   = null;

  function openModal() {
    returnFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeBtn.focus());
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    clearTimeout(autoClose);
    setTimeout(() => {
      form.hidden    = false;
      success.hidden = true;
      form.reset();
      clearAllErrors();
      count = 1;
      peopleVal.textContent = '1';
      peopleInput.value     = '1';
    }, 380);
    if (returnFocus) returnFocus.focus();
  }

  document.querySelectorAll('.js-book').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });

  decBtn.addEventListener('click', () => {
    if (count > 1) { count--; peopleVal.textContent = count; peopleInput.value = count; }
  });
  incBtn.addEventListener('click', () => {
    if (count < 20) { count++; peopleVal.textContent = count; peopleInput.value = count; }
  });

  function showFieldError(input, msg) {
    const field = input.closest('.booking-field');
    field.classList.add('booking-field--error');
    let errEl = field.querySelector('.booking-field__error');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.className = 'booking-field__error';
      errEl.setAttribute('role', 'alert');
      field.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearFieldError(input) {
    const field = input.closest('.booking-field');
    field.classList.remove('booking-field--error');
    const errEl = field.querySelector('.booking-field__error');
    if (errEl) errEl.remove();
  }

  function clearAllErrors() {
    form.querySelectorAll('.booking-field--error').forEach(f => {
      f.classList.remove('booking-field--error');
      const errEl = f.querySelector('.booking-field__error');
      if (errEl) errEl.remove();
    });
  }

  const firstInput = document.getElementById('bk-first');
  const timeSelect = document.getElementById('bk-time');

  [firstInput, dateInput, timeSelect].forEach(el => {
    if (!el) return;
    el.addEventListener('input',  () => clearFieldError(el));
    el.addEventListener('change', () => clearFieldError(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearAllErrors();

    const invalid = [];

    if (!firstInput || !firstInput.value.trim()) {
      showFieldError(firstInput, 'Please enter your first name');
      invalid.push(firstInput);
    }
    if (!dateInput || !dateInput.value) {
      showFieldError(dateInput, 'Please choose a date');
      invalid.push(dateInput);
    }
    if (!timeSelect || !timeSelect.value) {
      showFieldError(timeSelect, 'Please select a time');
      invalid.push(timeSelect);
    }

    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    form.hidden    = true;
    success.hidden = false;
    autoClose      = setTimeout(closeModal, 4200);
  });
})();


/* ── Plan Detail Modal ────────────────────────────────────── */

(function initPlanModal() {
  const modal      = document.getElementById('plan-modal');
  const backdrop   = document.getElementById('plan-backdrop');
  const closeBtn   = document.getElementById('plan-close');
  const tagEl      = document.getElementById('plan-tag');
  const titleEl    = document.getElementById('plan-modal-title');
  const amountEl   = document.getElementById('plan-amount');
  const periodEl   = document.getElementById('plan-period');
  const descEl     = document.getElementById('plan-desc');
  const includesEl = document.getElementById('plan-includes');
  const metaEl     = document.getElementById('plan-meta');
  const bookBtn    = document.getElementById('plan-book');
  if (!modal) return;

  const CHECK = '<svg class="plan-check" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="2,8 6,13 14,3"/></svg>';

  const PLANS = {
    'day-pass': {
      tag: 'Lift Passes', title: 'Day Pass', amount: '$89', period: '/ day',
      desc: 'Full mountain access for a single day. Perfect for a quick trip or testing the slopes.',
      includes: ['All 4 lifts', 'All 15 trails', 'Freeride zone', 'Terrain park'],
      meta: [{ label: 'Valid', value: 'any one day of the season · 8:00 AM– 4:30 PM' }]
    },
    'three-day': {
      tag: 'Lift Passes', title: '3-Day Pass', amount: '$239', period: null,
      desc: 'Three days on the mountain at 10% off single-day rates. Our most popular choice.',
      includes: ['All lifts & trails', 'Freeride zone', 'Terrain park', 'Priority lift access'],
      meta: [{ label: 'Valid', value: 'any 3 days of the season · save $28 vs daily' }]
    },
    'season': {
      tag: 'Lift Passes', title: 'Season Pass', amount: '$749', period: null,
      desc: 'Unlimited riding all season long. Best value for regular riders.',
      includes: ['Unlimited lift access', 'All trails', 'Freeride & park', '10% off rentals', 'Guest discounts'],
      meta: [{ label: 'Valid', value: 'entire season · no blackout dates' }]
    },
    'group-lesson': {
      tag: 'Lessons', title: 'Group Lesson', amount: '$59', period: '/ 2 hrs',
      desc: 'Learn with a certified instructor in a small group. All levels welcome.',
      includes: ['2-hour session', 'Certified instructor', 'Max 6 people', 'All ages'],
      meta: [{ label: 'Note', value: 'lift pass not included' }]
    },
    'private-lesson': {
      tag: 'Lessons', title: 'Private Lesson', amount: '$129', period: '/ 2 hrs',
      desc: 'One-on-one coaching tailored to your level. Fastest way to improve.',
      includes: ['2-hour private session', 'Personal instructor', 'Flexible focus', 'All levels'],
      meta: [{ label: 'Note', value: 'lift pass not included' }]
    },
    'kids-camp': {
      tag: 'Lessons', title: 'Kids Camp', amount: '$99', period: '/ day',
      desc: 'Full-day program for young riders, ages 6–12. Safe, fun, supervised.',
      includes: ['Full-day supervision', 'Certified coaches', 'Lunch', 'Helmet & safety gear'],
      meta: [{ label: 'Hours', value: '9:00 AM– 3:00 PM' }]
    },
    'board-boots': {
      tag: 'Rentals', title: 'Board + Boots', amount: '$45', period: '/ day',
      desc: 'Snowboard and boots, ready to ride. Great for riders who have their own gear basics.',
      includes: ['Snowboard', 'Boots', 'Daily tuning'],
      meta: [{ label: 'Note', value: 'helmet and goggles not included' }]
    },
    'full-kit': {
      tag: 'Rentals', title: 'Full Kit', amount: '$65', period: '/ day',
      desc: 'Everything you need in one package. Just show up and ride.',
      includes: ['Snowboard', 'Boots', 'Helmet', 'Goggles', 'Daily tuning'],
      meta: [{ label: 'Best for', value: 'first-timers and travelers' }]
    },
    'helmet': {
      tag: 'Rentals', title: 'Helmet Only', amount: '$15', period: '/ day',
      desc: 'Safety-certified helmet rental. Add-on for riders with their own board.',
      includes: ['Certified helmet', 'Size fitting'],
      meta: [{ label: 'Note', value: 'available with any pass or lesson' }]
    }
  };

  let returnFocus = null;

  function openPlan(key) {
    const plan = PLANS[key];
    if (!plan) return;

    tagEl.textContent    = plan.tag;
    titleEl.textContent  = plan.title;
    amountEl.textContent = plan.amount;
    if (plan.period) {
      periodEl.textContent = plan.period;
      periodEl.hidden      = false;
    } else {
      periodEl.textContent = '';
      periodEl.hidden      = true;
    }
    descEl.textContent = plan.desc;

    includesEl.innerHTML = plan.includes
      .map(item => `<li class="plan-list__item">${CHECK}<span>${item}</span></li>`)
      .join('');

    metaEl.innerHTML = plan.meta
      .map(m => `<p class="plan-meta__row"><span class="plan-meta__label">${m.label}:</span> ${m.value}</p>`)
      .join('');

    returnFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => closeBtn.focus());
  }

  function closePlan() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (returnFocus) returnFocus.focus();
  }

  document.querySelectorAll('.price-card[data-plan]').forEach(card => {
    card.addEventListener('click', () => openPlan(card.dataset.plan));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPlan(card.dataset.plan);
      }
    });
  });

  closeBtn.addEventListener('click', closePlan);
  backdrop.addEventListener('click', closePlan);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closePlan();
  });

  /* Book Now → close plan modal, open booking modal */
  bookBtn.addEventListener('click', () => {
    closePlan();
    setTimeout(() => {
      const bModal = document.getElementById('booking-modal');
      const bClose = document.getElementById('booking-close');
      if (bModal) {
        bModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        if (bClose) requestAnimationFrame(() => bClose.focus());
      }
    }, 100);
  });
})();


/* ── Welcome Letter Animation ─────────────────────────────── */

(function initWelcome() {
  const el = document.querySelector('.intro__welcome');
  if (!el) return;

  if (prefersReducedMotion) {
    el.classList.add('visible');
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  observer.observe(el);
})();


/* ── Page Fade Transitions ────────────────────────────────── */

(function initPageTransitions() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    /* Skip anchors, external URLs, mailto, tel */
    if (href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto:') || href.startsWith('tel:')) return;
    /* Only .html internal page links */
    if (!href.match(/\.html$/)) return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const target = href;
      document.body.classList.add('page-exit');
      setTimeout(() => { window.location.href = target; }, 320);
    });
  });
})();
