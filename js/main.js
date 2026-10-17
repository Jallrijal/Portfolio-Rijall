/**
 * Main JavaScript Portfolio - Rijal Imamul Haq
 * Fitur:
 * 1. Dark Mode & Light Mode Switcher dengan penyimpanan localStorage
 * 2. Mobile Drawer Navigation & Aksesibilitas Keyboard (Escape, Tab)
 * 3. Smooth Scroll & Active Section Indicator (IntersectionObserver Scroll Spy)
 * 4. Animated Role Rotator (Typewriter Effect)
 * 5. Interaktivitas Filter Kategori Tools
 * 6. GSAP Scroll Trigger Entrance Animations
 */

function initApp() {
  initTheme();
  initMobileMenu();
  initScrollSpy();
  initTypewriter();
  initToolsFilter();
  initGsapAnimations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   1. Theme Switcher (Dark & Light Mode via localStorage)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  const THEME_STORAGE_KEY = 'theme';
  const root = document.documentElement;

  // Baca tema saat ini (default: 'dark')
  function getCurrentTheme() {
    return root.getAttribute('data-theme') || localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  }

  // Terapkan tema ke elemen root & update aria
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem('portfolio_theme', theme);
    } catch (e) {
      console.warn('LocalStorage tidak dapat diakses untuk menyimpan tema:', e);
    }

    const isDark = theme === 'dark';
    themeToggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    themeToggle.setAttribute('title', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
  }

  // Sinkronkan state awal tombol
  applyTheme(getCurrentTheme());

  // Event listener klik tombol
  themeToggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const currentTheme = getCurrentTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
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

  mobileToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Tutup menu saat salah satu link navigasi ditekan
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Tutup menu saat menekan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
      toggleMenu(false);
      mobileToggle.focus();
    }
  });

  // Tutup menu jika pengguna mengklik area luar menu
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('is-open')) {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        toggleMenu(false);
      }
    }
  });
}

/* ==========================================================================
   3. Active Section Indicator (Scroll Spy) & Smooth Scrolling
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  if (sections.length === 0 || navLinks.length === 0) return;

  // Set active link
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

  // Smooth scroll click handler
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
          setActiveLink(link.getAttribute('data-section'));
          if (history.pushState) {
            history.pushState(null, '', targetId);
          }
        }
      }
    });
  });

  // Gunakan IntersectionObserver untuk penanda section aktif secara performan
  const observerOptions = {
    root: null,
    rootMargin: '-15% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
}

/* ==========================================================================
   4. Animated Role Rotator (Typewriter Subtitle)
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriter-text');
  if (!target) return;

  const roles = [
    'Web Developer',
    'Frontend Specialist',
    'UI/UX Enthusiast'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 120;
  const pauseEnd = 2200;
  const pauseStart = 500;

  // Jika pengguna menyetel preferensi minim animasi
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    target.textContent = roles[0];
    return;
  }

  function type() {
    const currentRole = roles[roleIndex];

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

    setTimeout(type, typingDelay);
  }

  setTimeout(type, pauseStart);
}

/* ==========================================================================
   5. Tools Category Filter
   ========================================================================== */
function initToolsFilter() {
  const filterChips = document.querySelectorAll('.filter-chip');
  const toolCards = document.querySelectorAll('.tool-card');

  if (filterChips.length === 0 || toolCards.length === 0) return;

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      // Perbarui status chip aktif
      filterChips.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      chip.classList.add('active');
      chip.setAttribute('aria-selected', 'true');

      const selectedCategory = chip.getAttribute('data-filter');

      // Tampilkan atau sembunyikan kartu tools
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
    });
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

  // Animasi masuk awal pada Hero
  gsap.from('.hero-content > *', {
    y: 25,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out'
  });

  gsap.from('.hero-visual', {
    scale: 0.94,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.2
  });

  // Animasi section title reveal saat di-scroll
  gsap.utils.toArray('.section-header').forEach((header) => {
    gsap.from(header, {
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      y: 30,
      opacity: 0,
      duration: 0.7,
      ease: 'power2.out'
    });
  });

  // Animasi kartu project bertahap
  gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      },
      y: 35,
      opacity: 0,
      duration: 0.65,
      delay: (index % 3) * 0.1,
      ease: 'power2.out'
    });
  });
}
