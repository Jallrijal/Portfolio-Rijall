/**
 * main.js - Core Portfolio Script
 * Menginisialisasi rendering dinamis DOM dari render.js dan mengelola interaktivitas UI:
 * - Tema gelap/terang (Theme Toggle)
 * - Navigasi mobile (Drawer)
 * - Scroll spy & smooth scroll
 * - Animasi teks peran rotasi (Typewriter)
 * - Filter kategori Tools
 * - Animasi masuk GSAP & ScrollTrigger (dengan ScrollTrigger)
 */

// Flag: hero hanya dianimasikan sekali saat halaman pertama kali dimuat,
// bukan setiap kali re-render dipicu oleh perubahan data.
let heroHasAnimated = false;

import { renderApp } from './render.js';

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  function getSavedTheme() {
    return localStorage.getItem('theme') || 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  // Terapkan tema awal
  applyTheme(getSavedTheme());

  // Lepaskan listener lama jika ada
  themeToggle.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTheme = getSavedTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  };
}

/* ==========================================================================
   2. Mobile Drawer Navigation & Keyboard Access
   ========================================================================== */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu-wrapper');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!mobileToggle || !navMenu) return;

  function toggleMenu(isOpen) {
    const willOpen = typeof isOpen === 'boolean' ? isOpen : !navMenu.classList.contains('is-open');
    navMenu.classList.toggle('is-open', willOpen);
    mobileToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  }

  mobileToggle.onclick = (e) => {
    e.stopPropagation();
    toggleMenu();
  };

  navLinks.forEach((link) => {
    link.onclick = () => {
      toggleMenu(false);
    };
  });

  document.onkeydown = (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
      mobileToggle.focus();
    }
  };

  document.onclick = (e) => {
    if (navMenu.classList.contains('is-open')) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    }
  };
}

/* ==========================================================================
   3. Active Section Indicator (Scroll Spy) & Smooth Scrolling
   ========================================================================== */
let activeObserver = null;

function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  if (sections.length === 0 || navLinks.length === 0) return;

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const targetSection = link.getAttribute('data-section');
      if (targetSection === sectionId) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          setActiveLink(link.getAttribute('data-section'));
          if (window.history && window.history.pushState) {
            window.history.pushState(null, '', targetId);
          }
        }
      }
    });
  });

  if (activeObserver) {
    activeObserver.disconnect();
  }

  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -60% 0px',
    threshold: 0
  };

  activeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    activeObserver.observe(section);
  });
}

/* ==========================================================================
   4. Animated Role Rotator (Typewriter Subtitle)
   ========================================================================== */
let typewriterTimeout = null;

function initTypewriter(customRoles) {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }

  const defaultRoles = [
    'Web Developer',
    'Frontend Specialist',
    'UI/UX Enthusiast'
  ];

  const roles = (Array.isArray(customRoles) && customRoles.length > 0) ? customRoles : defaultRoles;
  target.textContent = roles.join(' · ');
  return;

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 120;
  const pauseEnd = 2200;
  const pauseStart = 500;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.textContent = roles[0] || '';
    return;
  }

  function type() {
    const currentRole = roles[roleIndex] || '';

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 60;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 110;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingDelay = pauseEnd;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = pauseStart;
    }

    typewriterTimeout = setTimeout(type, typingDelay);
  }

  typewriterTimeout = setTimeout(type, pauseStart);
}

/* ==========================================================================
   5. Tools Category Filter
   ========================================================================== */
function initToolsFilter() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const toolCards = document.querySelectorAll('.tool-card');

  if (filterChips.length === 0 || toolCards.length === 0) return;

  filterChips.forEach((chip) => {
    chip.onclick = () => {
      filterChips.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');

      const selectedCategory = chip.getAttribute('data-filter');

      toolCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    };
  });
}

/* ==========================================================================
   6. GSAP Animations: Hero Entrance + Scroll Reveal per Section
   ========================================================================== */

/**
 * Helper: buat ScrollTrigger reveal untuk sekumpulan elemen dengan stagger.
 * @param {string|Element[]} targets - Selector atau array elemen.
 * @param {object} triggerEl - Elemen pemicu ScrollTrigger.
 * @param {object} fromVars - Properti awal animasi (from).
 * @param {object} opts - Opsi tambahan (duration, stagger, ease, delay).
 */
function revealOnScroll(targets, triggerEl, fromVars = {}, opts = {}) {
  const els = typeof targets === 'string' ? gsap.utils.toArray(targets) : targets;
  if (!els || els.length === 0) return;

  const defaults = {
    duration: 0.6,
    stagger: 0.08,
    ease: 'power2.out',
    delay: 0
  };
  const { duration, stagger, ease, delay } = { ...defaults, ...opts };

  gsap.from(els, {
    scrollTrigger: {
      trigger: triggerEl || els[0],
      start: 'top 88%',
      toggleActions: 'play none none none',
      once: true
    },
    ...fromVars,
    duration,
    stagger,
    ease,
    delay,
    clearProps: 'opacity,transform'
  });
}

/** Pecah teks menjadi karakter bertopeng (untuk reveal judul besar). */
function splitChars(el) {
  if (!el || el.dataset.split) return [];
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.dataset.split = '1';
  el.innerHTML = Array.from(text).map((c) =>
    c === ' ' ? ' ' : `<span class="ch-wrap" aria-hidden="true"><span class="ch">${c}</span></span>`
  ).join('');
  return el.querySelectorAll('.ch');
}

/** Pecah teks menjadi kata (untuk reveal mengikuti scroll). */
function splitWords(el) {
  if (!el || el.dataset.split) return [];
  const text = el.textContent;
  el.setAttribute('aria-label', text);
  el.dataset.split = '1';
  el.innerHTML = text.split(/\s+/).map((w) => `<span class="word" aria-hidden="true">${w}</span>`).join(' ');
  return el.querySelectorAll('.word');
}

/** Bungkus judul section agar bisa naik dari balik topeng. */
function maskTitle(el) {
  if (!el || el.dataset.split) return null;
  el.dataset.split = '1';
  el.innerHTML = `<span class="mask"><span>${el.innerHTML}</span></span>`;
  return el.querySelector('.mask > span');
}

/** Navbar: progress bar scroll, sembunyi saat scroll turun, solid setelah hero. */
let scrollUiBound = false;
function initScrollUi() {
  if (scrollUiBound) return;
  scrollUiBound = true;
  let lastY = window.scrollY;
  window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (!header) return;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);
    header.classList.toggle('is-solid', y > 40);
    const menuOpen = document.getElementById('nav-menu-wrapper')?.classList.contains('is-open');
    header.classList.toggle('is-hidden', y > lastY && y > 400 && !menuOpen);
    lastY = y;
  }, { passive: true });
}

function initGsapAnimations() {
  initScrollUi();
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.getAll().forEach(t => t.kill());
  gsap.globalTimeline.clear();

  /* HERO: nama naik per huruf, elemen lain menyusul */
  const nameChars = splitChars(document.querySelector('.hero-title-name'));
  if (!heroHasAnimated) {
    heroHasAnimated = true;
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (nameChars.length) tl.from(nameChars, { yPercent: 115, duration: 1.1, stagger: 0.035 }, 0.1);
    tl.from('.hero-greeting, .badge-status, .hero-roles-box, .hero-bio, .hero-cta-group .btn',
      { y: 24, opacity: 0, duration: 0.9, stagger: 0.08, clearProps: 'opacity,transform' }, 0.45);
    tl.from('.hero-stats-grid > *', { y: 20, opacity: 0, duration: 0.8, stagger: 0.1, clearProps: 'opacity,transform' }, 0.9);
    tl.from('.hero-visual', { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' }, 0.3);
  } else if (nameChars.length) {
    gsap.set(nameChars, { yPercent: 0 });
  }

  // Parallax gambar di dalam bingkai
  gsap.utils.toArray('.profile-avatar-img, .about-avatar-img').forEach((img) => {
    gsap.fromTo(img, { yPercent: -7 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* Judul section naik dari balik topeng */
  gsap.utils.toArray('.section:not(.hero-section) .section-title').forEach((title) => {
    const inner = maskTitle(title);
    if (!inner) return;
    gsap.from(inner, {
      yPercent: 105, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: title, start: 'top 90%', once: true }
    });
  });
  gsap.utils.toArray('.section-header').forEach((h) => {
    gsap.from(h.querySelector('.section-subtitle'), {
      opacity: 0, y: 12, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: h, start: 'top 90%', once: true }
    });
  });

  /* ABOUT: paragraf pertama menyala kata demi kata mengikuti scroll */
  const lead = document.querySelector('.about-paragraph');
  const words = splitWords(lead);
  if (words.length) {
    gsap.fromTo(words, { opacity: 0.15 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: lead, start: 'top 82%', end: 'bottom 45%', scrub: true }
    });
  }
  gsap.utils.toArray('.about-paragraph:not(:first-child), .about-action, .personal-info-item').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true }, clearProps: 'opacity,transform' });
  });

  /* PROJECTS: gambar terbuka dari bawah + zoom-out, teks menyusul */
  gsap.utils.toArray('.project-card').forEach((card) => {
    const frame = card.querySelector('.project-thumbnail-wrapper');
    const img = card.querySelector('.project-img');
    const body = card.querySelectorAll('.project-card-body > *');
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 80%', once: true } });
    tl.from(frame, { clipPath: 'inset(100% 0 0 0)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' }, 0);
    if (img) tl.from(img, { scale: 1.35, duration: 1.6, ease: 'expo.out', clearProps: 'transform' }, 0);
    tl.from(body, { y: 28, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'opacity,transform' }, 0.25);
  });

  /* Baris tools / experience / contact masuk berurutan */
  ['.tool-card', '.timeline-item', '.contact-item-card'].forEach((sel) => {
    ScrollTrigger.batch(sel, {
      start: 'top 92%', once: true,
      onEnter: (batch) => gsap.from(batch, { opacity: 0, y: 28, duration: 0.8, stagger: 0.08, ease: 'power3.out', clearProps: 'opacity,transform' })
    });
  });
  gsap.from('.contact-intro', { opacity: 0, y: 24, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.contact-intro', start: 'top 90%', once: true }, clearProps: 'opacity,transform' });

  /* Footer: nama besar naik */
  gsap.from('.footer-brand .brand-text', { yPercent: 40, opacity: 0, duration: 1.2, ease: 'power4.out',
    scrollTrigger: { trigger: '.site-footer', start: 'top 85%', once: true }, clearProps: 'opacity,transform' });

  ScrollTrigger.refresh();
}


/* ==========================================================================
   Extras: jam hero, kursor kustom, tombol magnetik, count-up, tumpukan proyek
   ========================================================================== */
let clockTimer = null;
function initHeroClock() {
  const el = document.getElementById('hero-clock');
  if (!el) return;
  if (clockTimer) clearInterval(clockTimer);
  const fmt = new Intl.DateTimeFormat('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const tick = () => { el.textContent = 'WIB ' + fmt.format(new Date()).replace(/\./g, ':'); };
  tick();
  clockTimer = setInterval(tick, 1000);
}

let cursorEl = null;
function initCursor() {
  if (cursorEl || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (typeof gsap === 'undefined') return;
  cursorEl = document.createElement('div');
  cursorEl.className = 'cursor-follow';
  cursorEl.setAttribute('aria-hidden', 'true');
  cursorEl.textContent = 'Lihat';
  document.body.appendChild(cursorEl);
  const moveX = gsap.quickTo(cursorEl, 'x', { duration: 0.45, ease: 'power3' });
  const moveY = gsap.quickTo(cursorEl, 'y', { duration: 0.45, ease: 'power3' });
  window.addEventListener('mousemove', (e) => { moveX(e.clientX); moveY(e.clientY); }, { passive: true });
  document.addEventListener('mouseover', (e) => {
    const on = e.target.closest && e.target.closest('.project-thumbnail-wrapper');
    cursorEl.classList.toggle('is-on', !!on);
  });
}

function initMagnetic() {
  if (typeof gsap === 'undefined' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.btn, .cms-nav-btn, .theme-toggle').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.25, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
  });
}

function initCountUp() {
  if (typeof gsap === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.stat-number').forEach((el) => {
    const m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = m[2];
    const state = { v: 0 };
    el.textContent = '0' + suffix;
    gsap.to(state, {
      v: target, duration: 1.8, delay: 1.1, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(state.v) + suffix; }
    });
  });
}

function initProjectStack() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(min-width: 62rem)').matches) return;
  const cards = gsap.utils.toArray('.project-card');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: 0.94, opacity: 0.35, ease: 'none',
      scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 15%', scrub: true }
    });
  });
}

/* ==========================================================================
   7. Inisialisasi Seluruh Fitur Interaktif setelah Render DOM
   ========================================================================== */
function setupInteractiveBehaviors(eventDetail) {
  initThemeToggle();
  initMobileMenu();
  initScrollSpy();

  const typewriterRoles = eventDetail?.home?.typewriterRoles;
  initTypewriter(typewriterRoles);

  initToolsFilter();
  initHeroClock();
  initCursor();
  initMagnetic();
  initGsapAnimations();
  initCountUp();
  initProjectStack();
}

// Tangkap event saat render.js selesai membangun DOM
window.addEventListener('portfolio:rendered', (e) => {
  setupInteractiveBehaviors(e.detail);
});

// Jalankan proses render aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', async () => {
  await renderApp();
});
