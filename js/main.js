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
    return localStorage.getItem('theme') || 'dark';
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

function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);

  // Matikan semua trigger lama sebelum membuat yang baru.
  // Ini adalah kunci kebenaran saat konten di-render ulang secara dinamis.
  ScrollTrigger.getAll().forEach(t => t.kill());
  // Juga bersihkan animasi yang mungkin tertahan di elemen lama
  gsap.globalTimeline.clear();

  /* ------------------------------------------------------------------
     HERO ENTRANCE — hanya dijalankan sekali saat pertama kali render.
     Saat re-render (mis. dari CMS), elemen sudah terlihat: skip.
  ------------------------------------------------------------------ */
  if (!heroHasAnimated) {
    heroHasAnimated = true;

    const heroChildren = gsap.utils.toArray('.hero-content > *');
    if (heroChildren.length > 0) {
      gsap.from(heroChildren, {
        y: 28,
        opacity: 0,
        duration: 0.75,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,transform'
      });
    }

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      gsap.from(heroVisual, {
        x: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
        clearProps: 'opacity,transform'
      });
    }
  }

  /* ------------------------------------------------------------------
     SECTION HEADERS — setiap section header muncul saat di-scroll
  ------------------------------------------------------------------ */
  gsap.utils.toArray('.section-header').forEach((header) => {
    revealOnScroll([header], header, { y: 28, opacity: 0 }, { duration: 0.65 });
  });

  /* ------------------------------------------------------------------
     ABOUT — kartu kiri (info) dan kanan (teks) masuk bergantian
  ------------------------------------------------------------------ */
  const aboutLeft = document.querySelector('.about-card-left');
  const aboutRight = document.querySelector('.about-card-right');
  if (aboutLeft) {
    revealOnScroll([aboutLeft], aboutLeft, { x: -30, opacity: 0 }, { duration: 0.7 });
  }
  if (aboutRight) {
    revealOnScroll([aboutRight], aboutRight, { x: 30, opacity: 0 }, { duration: 0.7, delay: 0.1 });
  }

  // Personal info items masuk satu per satu
  const infoItems = gsap.utils.toArray('.personal-info-item');
  if (infoItems.length > 0) {
    revealOnScroll(infoItems, aboutLeft || infoItems[0], { x: -16, opacity: 0 }, { stagger: 0.06, delay: 0.25 });
  }

  /* ------------------------------------------------------------------
     TOOLS — kartu masuk bertahap dalam baris
  ------------------------------------------------------------------ */
  const toolCards = gsap.utils.toArray('.tool-card');
  if (toolCards.length > 0) {
    const toolsGrid = document.querySelector('.tools-grid');
    revealOnScroll(toolCards, toolsGrid || toolCards[0], { y: 24, opacity: 0 }, { stagger: 0.06, duration: 0.5 });
  }

  /* ------------------------------------------------------------------
     PROJECTS — kartu masuk bertahap
  ------------------------------------------------------------------ */
  const projectCards = gsap.utils.toArray('.project-card');
  if (projectCards.length > 0) {
    const projectsGrid = document.querySelector('.projects-grid');
    revealOnScroll(projectCards, projectsGrid || projectCards[0], { y: 30, opacity: 0 }, { stagger: 0.1, duration: 0.6 });
  }

  /* ------------------------------------------------------------------
     EXPERIENCE — timeline items masuk dari bawah dengan stagger
  ------------------------------------------------------------------ */
  const timelineItems = gsap.utils.toArray('.timeline-item');
  if (timelineItems.length > 0) {
    const timelineContainer = document.querySelector('.timeline-container');
    revealOnScroll(timelineItems, timelineContainer || timelineItems[0], { y: 24, opacity: 0 }, { stagger: 0.12, duration: 0.55 });
  }

  /* ------------------------------------------------------------------
     CONTACT — kartu kontak masuk bertahap
  ------------------------------------------------------------------ */
  const contactCards = gsap.utils.toArray('.contact-item-card');
  if (contactCards.length > 0) {
    const contactGrid = document.querySelector('.contact-links-grid');
    revealOnScroll(contactCards, contactGrid || contactCards[0], { y: 20, opacity: 0 }, { stagger: 0.08, duration: 0.5 });
  }

  // Refresh semua ScrollTrigger setelah elemen baru terpasang
  ScrollTrigger.refresh();
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
  initGsapAnimations();
}

// Tangkap event saat render.js selesai membangun DOM
window.addEventListener('portfolio:rendered', (e) => {
  setupInteractiveBehaviors(e.detail);
});

// Jalankan proses render aplikasi saat DOM siap
document.addEventListener('DOMContentLoaded', async () => {
  await renderApp();
});
