/**
 * main.js - Core Portfolio Script
 * Menginisialisasi rendering dinamis DOM dari render.js dan mengelola interaktivitas UI:
 * - Tema gelap/terang (Theme Toggle)
 * - Navigasi mobile (Drawer)
 * - Scroll spy & smooth scroll
 * - Animasi teks peran rotasi (Typewriter)
 * - Filter kategori Tools
 * - Animasi masuk GSAP & ScrollTrigger
 */

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
   6. GSAP Scroll Trigger Entrance Animations
   ========================================================================== */
function initGsapAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Bersihkan trigger lama sebelum membuat baru (agar tidak duplikat saat re-render)
  const allTriggers = ScrollTrigger.getAll();
  allTriggers.forEach(t => t.kill());

  // Animasi Hero
  if (document.querySelector('.hero-content > *')) {
    gsap.from('.hero-content > *', {
      y: 20,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  if (document.querySelector('.hero-visual')) {
    gsap.from('.hero-visual', {
      scale: 0.95,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      delay: 0.15
    });
  }

  // Animasi reveal section headers saat di-scroll
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 25,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    });
  });

  // Animasi kartu project bertahap
  gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.55,
      delay: (index % 3) * 0.08,
      ease: 'power2.out'
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
