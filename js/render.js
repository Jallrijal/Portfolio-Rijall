/**
 * render.js - Portfolio Dynamic DOM Renderer
 * Membaca data portofolio dari storage.js dan membangun DOM tiap section.
 * Mendukung live update ketika localStorage dimodifikasi (termasuk kasus array kosong).
 */

import { getData, SECTIONS } from './storage.js';

/**
 * Sanitasi string untuk mencegah XSS injection.
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Ekstraksi array item secara fleksibel (mendukung format array langsung maupun objek bertingkat).
 */
export function extractArray(data, key = 'items') {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data[key])) return data[key];
  return [];
}

/**
 * Render Header & Floating Pill Navbar
 */
export function renderHeader() {
  return `
  <header class="site-header" id="site-header">
    <div class="nav-progress" aria-hidden="true"></div>
    <div class="nav-container">
      <nav class="navbar" aria-label="Navigasi Utama">
        <a href="#home" class="brand-logo" aria-label="Kembali ke Beranda">
          <span class="brand-badge" aria-hidden="true">R</span>
          <span class="brand-text">Rijal<span class="brand-dot">.</span></span>
        </a>

        <!-- Desktop & Mobile Navigation Menu Wrapper -->
        <div class="nav-menu-wrapper" id="nav-menu-wrapper">
          <ul class="nav-list" role="menubar">
            <li class="nav-item">
              <a href="#home" class="nav-link active" data-section="home">
                <i class="fa-solid fa-house nav-icon" aria-hidden="true"></i>
                <span class="nav-label"><span data-text="Home">Home</span></span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#about" class="nav-link" data-section="about">
                <i class="fa-solid fa-user nav-icon" aria-hidden="true"></i>
                <span class="nav-label"><span data-text="About">About</span></span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#tools" class="nav-link" data-section="tools">
                <i class="fa-solid fa-screwdriver-wrench nav-icon" aria-hidden="true"></i>
                <span class="nav-label"><span data-text="Tools">Tools</span></span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#projects" class="nav-link" data-section="projects">
                <i class="fa-solid fa-briefcase nav-icon" aria-hidden="true"></i>
                <span class="nav-label"><span data-text="Projects">Projects</span></span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#experience" class="nav-link" data-section="experience">
                <i class="fa-solid fa-timeline nav-icon" aria-hidden="true"></i>
                <span class="nav-label"><span data-text="Experience">Experience</span></span>
              </a>
            </li>
            <li class="nav-item">
              <a href="#contact" class="nav-link" data-section="contact">
                <i class="fa-solid fa-envelope nav-icon" aria-hidden="true"></i>
                <span class="nav-label"><span data-text="Contact">Contact</span></span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Action Controls: Theme Switcher, CMS Button, Mobile Toggle -->
        <div class="nav-actions">
          <button type="button" class="theme-toggle" id="theme-toggle" aria-label="Ubah tema gelap atau terang" aria-pressed="true" title="Ganti Mode Tema">
            <i class="fa-solid fa-moon icon-theme-moon" aria-hidden="true"></i>
            <i class="fa-solid fa-sun icon-theme-sun" aria-hidden="true"></i>
          </button>

          <a href="./login.html" class="cms-nav-btn" aria-label="Akses CMS Pengelolaan Portofolio">
            <i class="fa-solid fa-sliders" aria-hidden="true"></i>
            <span class="cms-nav-text">CMS</span>
          </a>

          <button type="button" class="mobile-toggle" id="mobile-toggle" aria-expanded="false" aria-controls="nav-menu-wrapper" aria-label="Buka menu navigasi">
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
            <span class="hamburger-bar"></span>
          </button>
        </div>
      </nav>
    </div>
  </header>`;
}

/**
 * 1. Render Section Home (Hero)
 */
export function renderHome(data) {
  if (!data) return '<section id="home" class="section hero-section" aria-labelledby="hero-name"></section>';

  const badge = data.badge ? `
    <div class="badge-status">
      <span class="badge-status-dot" aria-hidden="true"></span>
      <span>${escapeHtml(data.badge)}</span>
    </div>` : '';

  const name = escapeHtml(data.name || 'Rijal Imamul Haq');
  const greeting = 'Halo, saya';

  const typewriterRoles = extractArray(data.typewriterRoles);
  const rolesHtml = typewriterRoles.length > 0 ? `
    <div class="hero-roles-box">
      <span class="hero-roles-prefix">Fokus:</span>
      <span class="hero-role-text" id="typewriter-text">${escapeHtml(typewriterRoles[0])}</span>
    </div>` : '';

  const bioHtml = data.bio ? `<p class="hero-bio">${escapeHtml(data.bio)}</p>` : '';

  const ctaButtons = extractArray(data.ctaButtons);
  const ctaHtml = ctaButtons.length > 0 ? `
    <div class="hero-cta-group">
      ${ctaButtons.map(btn => `
        <a href="${escapeHtml(btn.url || '#')}" class="btn ${btn.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}" ${btn.id ? `id="${escapeHtml(btn.id)}"` : ''}>
          ${btn.icon ? `<i class="${escapeHtml(btn.icon)}" aria-hidden="true"></i>` : ''}
          <span>${escapeHtml(btn.label || '')}</span>
        </a>
      `).join('')}
    </div>` : '';

  const stats = extractArray(data.stats);
  const statsHtml = stats.length > 0 ? `
    <div class="hero-stats-grid">
      ${stats.map(st => `
        <article class="stat-card" ${st.id ? `id="${escapeHtml(st.id)}"` : ''}>
          <div class="stat-icon-wrapper" aria-hidden="true">
            <i class="${escapeHtml(st.icon || 'fa-solid fa-chart-simple')}"></i>
          </div>
          <div class="stat-body">
            <span class="stat-number">${escapeHtml(st.value ?? '')}${escapeHtml(st.suffix || '')}</span>
            <span class="stat-label">${escapeHtml(st.label || '')}</span>
          </div>
        </article>
      `).join('')}
    </div>` : '';

  const avatarSrc = data.avatar || './assets/Profil/Img-Profil.jpeg';
  const stickerA = typewriterRoles[0] ? `<span class="sticker sticker-a">${escapeHtml(typewriterRoles[0])}</span>` : '';
  const stickerB = typewriterRoles[1] ? `<span class="sticker sticker-b">${escapeHtml(typewriterRoles[1])}</span>` : '';
  const avatarHtml = `
    <div class="hero-visual" aria-hidden="false">
      <div class="profile-card">
        <div class="profile-avatar-frame">
          <img src="${escapeHtml(avatarSrc)}" alt="Foto Profil ${name}" class="profile-avatar-img" width="360" height="360" loading="eager" onerror="this.remove()">
        </div>
        <div class="spin-badge" aria-hidden="true">
          <svg viewBox="0 0 120 120">
            <defs><path id="spin-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs>
            <text><textPath href="#spin-circle" textLength="286">OPEN FOR WORK • OPEN FOR WORK • </textPath></text>
          </svg>
          <i class="fa-solid fa-arrow-down spin-badge-core"></i>
        </div>
        ${stickerA}
        ${stickerB}
      </div>
    </div>`;

  const metaHtml = `
    <div class="hero-meta" aria-hidden="true">
      <span>Portfolio &copy; ${new Date().getFullYear()}</span>
      <span class="hero-clock" id="hero-clock">WIB --:--:--</span>
      <span class="hero-scroll">Scroll <i class="fa-solid fa-arrow-down"></i></span>
    </div>`;

  return `
  <section id="home" class="section hero-section" aria-labelledby="hero-name">
    <div class="section-container hero-container">
      ${metaHtml}
      <div class="hero-content">
        ${badge}
        <h1 class="hero-heading" id="hero-name">
          <span class="hero-greeting">${greeting}</span>
          <span class="hero-title-name">${name}</span>
        </h1>
        ${rolesHtml}
        ${bioHtml}
        ${ctaHtml}
        ${statsHtml}
      </div>
      ${avatarHtml}
    </div>
  </section>`;
}

/**
 * 2. Render Section About Me
 */
export function renderAbout(data) {
  if (!data) return '<section id="about" class="section about-section" aria-labelledby="about-heading"></section>';

  const title = escapeHtml(data.title || 'About Me');
  const subtitle = escapeHtml(data.subtitle || 'Mengenal Lebih Dekat');
  const avatarSrc = data.avatar || './assets/Profil/Img-Profil.jpeg';

  const personalInfo = extractArray(data.personalInfo);
  const personalInfoHtml = personalInfo.length > 0 ? `
    <ul class="personal-info-list" role="list">
      ${personalInfo.map(info => `
        <li class="personal-info-item" ${info.id ? `id="${escapeHtml(info.id)}"` : ''}>
          <div class="info-icon" aria-hidden="true">
            <i class="${escapeHtml(info.icon || 'fa-solid fa-circle-info')}"></i>
          </div>
          <div class="info-content">
            <span class="info-label">${escapeHtml(info.label || '')}</span>
            <span class="info-value">${escapeHtml(info.value || '')}</span>
          </div>
        </li>
      `).join('')}
    </ul>` : '';

  const paragraphs = extractArray(data.paragraphs);
  const paragraphsHtml = paragraphs.length > 0 ? `
    <div class="about-text-content">
      ${paragraphs.map(p => `
        <p class="about-paragraph">${escapeHtml(typeof p === 'string' ? p : p.text || '')}</p>
      `).join('')}
    </div>` : '';

  const resumeBtn = data.resumeUrl && data.resumeUrl !== '#' ? `
    <div class="about-action">
      <a href="${escapeHtml(data.resumeUrl)}" class="btn btn-primary" download target="_blank" rel="noopener noreferrer">
        <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>
        <span>${escapeHtml(data.resumeButtonLabel || 'Download CV')}</span>
      </a>
    </div>` : (data.resumeButtonLabel ? `
    <div class="about-action">
      <a href="${escapeHtml(data.resumeUrl || '#contact')}" class="btn btn-primary">
        <i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i>
        <span>${escapeHtml(data.resumeButtonLabel || 'Download CV')}</span>
      </a>
    </div>` : '');

  return `
  <section id="about" class="section about-section" aria-labelledby="about-heading">
    <div class="section-container">
      <header class="section-header">
        <p class="section-subtitle">${subtitle}</p>
        <h2 class="section-title" id="about-heading">${title}</h2>
      </header>

      <div class="about-grid">
        <div class="about-card-left">
          <div class="about-photos">
            <div class="about-avatar-wrapper">
              <img src="${escapeHtml(avatarSrc)}" alt="Potret ${title}" class="about-avatar-img" loading="lazy" onerror="this.remove()">
            </div>
            <div class="about-photo-2" aria-hidden="true">
              <img src="./assets/Profil/12.jpeg" alt="" loading="lazy" onerror="this.remove()">
            </div>
            <span class="sticker about-sticker">Halo!</span>
          </div>
          ${personalInfoHtml}
        </div>

        <div class="about-card-right">
          ${paragraphsHtml}
          ${resumeBtn}
        </div>
      </div>
    </div>
  </section>`;
}

/**
 * 3. Render Section Tools
 */
export function renderTools(data) {
  if (!data) return '<section id="tools" class="section tools-section" aria-labelledby="tools-heading"></section>';

  const title = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.title) ? data.title : 'Tools & Technologies');
  const subtitle = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.subtitle) ? data.subtitle : 'Keahlian & Perangkat yang Sering Digunakan');

  const items = extractArray(data, 'items');

  // Kategori filter dinamis
  let categories = [];
  if (typeof data === 'object' && !Array.isArray(data) && Array.isArray(data.categories) && data.categories.length > 0) {
    categories = data.categories;
  } else if (items.length > 0) {
    const rawCategories = items.map(i => i.category).filter(Boolean);
    categories = ['Semua', ...Array.from(new Set(rawCategories))];
  }

  const filterChipsHtml = categories.length > 0 ? `
    <div class="tools-filter-wrapper" role="tablist" aria-label="Filter Kategori Tools">
      ${categories.map((cat, idx) => `
        <button type="button" class="filter-chip ${idx === 0 ? 'active' : ''}" data-filter="${escapeHtml(cat === 'Semua' ? 'all' : cat)}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}">
          ${escapeHtml(cat)}
        </button>
      `).join('')}
    </div>` : '';

  const toolCardsHtml = items.map(item => `
    <article class="tool-card" data-category="${escapeHtml(item.category || '')}" ${item.id ? `id="${escapeHtml(item.id)}"` : ''}>
      <div class="tool-icon-box" aria-hidden="true">
        <i class="${escapeHtml(item.iconClass || '')}"></i>
      </div>
      <div class="tool-info">
        <div class="tool-header-row">
          <h3 class="tool-name">${escapeHtml(item.name || '')}</h3>
          ${item.proficiency ? `<span class="tool-level">${escapeHtml(item.proficiency)}</span>` : ''}
        </div>
        <p class="tool-desc">${escapeHtml(item.description || '')}</p>
      </div>
    </article>
  `).join('');

  return `
  <section id="tools" class="section tools-section" aria-labelledby="tools-heading">
    <div class="section-container">
      <header class="section-header">
        <p class="section-subtitle">${subtitle}</p>
        <h2 class="section-title" id="tools-heading">${title}</h2>
      </header>

      ${filterChipsHtml}

      <div class="tools-grid" id="tools-grid">
        ${toolCardsHtml}
      </div>
    </div>
  </section>`;
}

/**
 * 4. Render Section Projects
 */
export function renderProjects(data) {
  if (!data) return '<section id="projects" class="section projects-section" aria-labelledby="projects-heading"></section>';

  const title = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.title) ? data.title : 'Featured Projects');
  const subtitle = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.subtitle) ? data.subtitle : 'Karya Pilihan yang Pernah Saya Kembangkan');

  const items = extractArray(data, 'items');

  const projectCardsHtml = items.map(proj => {
    const tags = extractArray(proj.tags);
    const tagsHtml = tags.length > 0 ? `
      <div class="project-tags-list" aria-label="Teknologi yang digunakan">
        ${tags.map(t => `<span class="project-tag-chip">${escapeHtml(t)}</span>`).join('')}
      </div>` : '';

    const demoBtn = proj.demoUrl && proj.demoUrl !== '#' ? `
      <a href="${escapeHtml(proj.demoUrl)}" class="btn btn-sm btn-primary project-btn" target="_blank" rel="noopener noreferrer" aria-label="Lihat demo langsung ${escapeHtml(proj.title || '')}">
        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
        <span>Live Demo</span>
      </a>` : '';

    const repoBtn = proj.repoUrl && proj.repoUrl !== '#' ? `
      <a href="${escapeHtml(proj.repoUrl)}" class="btn btn-sm btn-secondary project-btn" target="_blank" rel="noopener noreferrer" aria-label="Lihat repositori GitHub ${escapeHtml(proj.title || '')}">
        <i class="fa-brands fa-github" aria-hidden="true"></i>
        <span>Source Code</span>
      </a>` : '';

    return `
    <article class="project-card ${proj.featured ? 'is-featured' : ''}" ${proj.id ? `id="${escapeHtml(proj.id)}"` : ''}>
      <div class="project-thumbnail-wrapper">
        <img src="${escapeHtml(proj.image || './assets/Project/Project K-link.png')}" alt="Tangkapan layar proyek ${escapeHtml(proj.title || '')}" class="project-img" loading="lazy" onerror="this.remove()">
        ${proj.category ? `<span class="project-category-badge">${escapeHtml(proj.category)}</span>` : ''}
      </div>
      <div class="project-card-body">
        <h3 class="project-title">${escapeHtml(proj.title || '')}</h3>
        <p class="project-summary">${escapeHtml(proj.summary || proj.description || '')}</p>
        ${tagsHtml}
        <div class="project-actions-row">
          ${demoBtn}
          ${repoBtn}
        </div>
      </div>
    </article>`;
  }).join('');

  return `
  <section id="projects" class="section projects-section" aria-labelledby="projects-heading">
    <div class="section-container">
      <header class="section-header">
        <p class="section-subtitle">${subtitle}</p>
        <h2 class="section-title" id="projects-heading">${title}</h2>
      </header>

      <div class="projects-grid" id="projects-grid">
        ${projectCardsHtml}
      </div>
    </div>
  </section>`;
}

/**
 * 5. Render Section Experience
 */
export function renderExperience(data) {
  if (!data) return '<section id="experience" class="section experience-section" aria-labelledby="experience-heading"></section>';

  const title = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.title) ? data.title : 'Experience');
  const subtitle = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.subtitle) ? data.subtitle : 'Jejak Langkah & Perjalanan Karier');

  const items = extractArray(data, 'items');

  const timelineCardsHtml = items.map(exp => {
    const isIntern = exp.type && (exp.type.toLowerCase().includes('intern') || exp.type.toLowerCase().includes('magang'));
    const achievements = extractArray(exp.achievements);
    const achievementsHtml = achievements.length > 0 ? `
      <ul class="timeline-achievements" role="list">
        ${achievements.map(ach => `<li>${escapeHtml(typeof ach === 'string' ? ach : ach.text || '')}</li>`).join('')}
      </ul>` : '';

    return `
    <article class="timeline-item" ${exp.id ? `id="${escapeHtml(exp.id)}"` : ''}>
      <div class="timeline-marker" aria-hidden="true">
        <span class="timeline-dot"></span>
      </div>
      <div class="timeline-card">
        <div class="timeline-card-header">
          ${exp.type ? `<span class="timeline-badge ${isIntern ? 'badge-intern' : ''}">${escapeHtml(exp.type)}</span>` : ''}
          <span class="timeline-period">${escapeHtml(exp.period || '')}</span>
        </div>
        <h3 class="timeline-role">${escapeHtml(exp.role || '')}</h3>
        <p class="timeline-company">${escapeHtml(exp.company || '')}${exp.location ? ` &bull; ${escapeHtml(exp.location)}` : ''}</p>
        ${exp.description ? `<p class="timeline-desc">${escapeHtml(exp.description)}</p>` : ''}
        ${achievementsHtml}
      </div>
    </article>`;
  }).join('');

  return `
  <section id="experience" class="section experience-section" aria-labelledby="experience-heading">
    <div class="section-container">
      <header class="section-header">
        <p class="section-subtitle">${subtitle}</p>
        <h2 class="section-title" id="experience-heading">${title}</h2>
      </header>

      <div class="timeline-container" id="experience-timeline">
        ${timelineCardsHtml}
      </div>
    </div>
  </section>`;
}

/**
 * 6. Render Section Contact
 */
export function renderContact(data) {
  if (!data) return '<section id="contact" class="section contact-section" aria-labelledby="contact-heading"></section>';

  const title = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.title) ? data.title : 'Contact');
  const subtitle = escapeHtml((typeof data === 'object' && !Array.isArray(data) && data?.subtitle) ? data.subtitle : 'Mari Terhubung & Berkolaborasi');
  const intro = data?.description ? `<p class="contact-intro">${escapeHtml(data.description)}</p>` : '';

  const items = extractArray(data, 'items');

  const contactCardsHtml = items.map(ct => {
    const isHttp = ct.url && ct.url.startsWith('http');
    const platformClass = ct.platform ? `icon-${escapeHtml(ct.platform.toLowerCase().replace(/\s+/g, ''))}` : '';

    return `
    <a href="${escapeHtml(ct.url || '#')}" class="contact-item-card" ${ct.id ? `id="${escapeHtml(ct.id)}"` : ''} ${isHttp ? 'target="_blank" rel="noopener noreferrer"' : ''} aria-label="${escapeHtml(ct.platform || 'Kontak')}: ${escapeHtml(ct.label || '')}">
      <div class="contact-item-icon ${platformClass}" aria-hidden="true">
        <i class="${escapeHtml(ct.iconClass || 'fa-solid fa-link')}"></i>
      </div>
      <div class="contact-item-details">
        <span class="contact-platform">${escapeHtml(ct.platform || '')}</span>
        <span class="contact-label">${escapeHtml(ct.label || '')}</span>
      </div>
      <div class="contact-arrow" aria-hidden="true">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </div>
    </a>`;
  }).join('');

  return `
  <section id="contact" class="section contact-section" aria-labelledby="contact-heading">
    <div class="section-container">
      <header class="section-header">
        <p class="section-subtitle">${subtitle}</p>
        <h2 class="section-title" id="contact-heading">${title}</h2>
      </header>

      <div class="contact-card-main">
        <p class="contact-giant" aria-hidden="true">Mari bikin<br>sesuatu<em>.</em></p>
        ${intro}
        <div class="contact-links-grid" id="contact-links-grid">
          ${contactCardsHtml}
        </div>
      </div>
    </div>
  </section>`;
}

/**
 * 7. Render Footer
 * Sesuai kebutuhan: "Tambahkan link kecil 'Login' di footer."
 */
export function renderFooter(homeData) {
  const brandName = escapeHtml(homeData?.name || 'Rijal Imamul Haq');
  const currentYear = new Date().getFullYear();

  return `
  <footer class="site-footer">
    <div class="footer-container">
      <div class="footer-top">
        <div class="footer-brand">
          <span class="brand-badge" aria-hidden="true">R</span>
          <span class="brand-text">${brandName}</span>
        </div>
        <p class="footer-tagline">Web Developer &bull; Frontend Specialist</p>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">&copy; ${currentYear} ${brandName}. Seluruh hak cipta dilindungi.</p>
        <div class="footer-links">
          <a href="#home" class="footer-link">Kembali ke Atas</a>
          <span class="footer-divider" aria-hidden="true">&bull;</span>
          <!-- Link kecil Login sesuai spesifikasi PRD & instruksi user -->
          <a href="./login.html" class="footer-link footer-login-link" aria-label="Akses login ke halaman CMS">Login</a>
        </div>
      </div>
    </div>
  </footer>`;
}

/**
 * Marquee berjalan dari nama tools.
 */
export function renderMarquee(tools) {
  const names = extractArray(tools, 'items').map(i => i && i.name).filter(Boolean);
  if (names.length === 0) return '';
  const row = (list) => list.map(n => `<span class="marquee-item">${escapeHtml(n)}</span>`).join('');
  const group = (list) => `<div class="marquee-group">${row(list)}</div>`;
  const second = ['Clean code', 'Responsive', 'Accessible', 'Fast', 'Detail', 'Open for work'];
  return `
  <div class="bands" aria-hidden="true">
    <div class="marquee band-a"><div class="marquee-track">${group(names)}${group(names)}</div></div>
    <div class="marquee band-b"><div class="marquee-track">${group(second)}${group(second)}</div></div>
  </div>`;
}

/**
 * Render Keseluruhan Aplikasi ke Container DOM
 */
export async function renderApp(container = document.getElementById('app')) {
  if (!container) {
    console.error('Target container #app tidak ditemukan di halaman.');
    return;
  }

  try {
    // Muat seluruh section secara asinkron dari storage.js
    const [home, about, tools, projects, experience, contact] = await Promise.all([
      getData('home'),
      getData('about'),
      getData('tools'),
      getData('projects'),
      getData('experience'),
      getData('contact')
    ]);

    const headerHtml = renderHeader();
    const homeHtml = renderHome(home);
    const aboutHtml = renderAbout(about);
    const toolsHtml = renderTools(tools);
    const projectsHtml = renderProjects(projects);
    const experienceHtml = renderExperience(experience);
    const contactHtml = renderContact(contact);
    const footerHtml = renderFooter(home);

    container.innerHTML = `
      ${headerHtml}
      <main id="main-content">
        ${homeHtml}
        ${renderMarquee(tools)}
        ${aboutHtml}
        ${toolsHtml}
        ${projectsHtml}
        ${experienceHtml}
        ${contactHtml}
      </main>
      ${footerHtml}
    `;

    // Kirim event kustom bahwa rendering selesai untuk re-inisialisasi interaksi
    window.dispatchEvent(new CustomEvent('portfolio:rendered', {
      detail: { home, about, tools, projects, experience, contact }
    }));

    return { home, about, tools, projects, experience, contact };
  } catch (error) {
    console.error('Gagal membangun DOM portfolio:', error);
  }
}

/**
 * Observer Otomatis untuk Perubahan localStorage (Cross-tab & Same-tab DevTools)
 */
let debounceTimer = null;
function scheduleReRender() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    renderApp();
  }, 100);
}

// 1. Storage event dari tab atau window lain
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (e) => {
    if (!e.key || e.key.startsWith('portfolio_') || SECTIONS.includes(e.key)) {
      scheduleReRender();
    }
  });
}

// 2. Intercept localStorage.setItem & removeItem di tab saat ini
// Memungkinkan perubahan via DevTools Console (e.g. localStorage.setItem('portfolio_projects', '[]'))
// langsung memicu re-render DOM secara otomatis!
if (typeof window !== 'undefined' && window.localStorage && typeof window.addEventListener === 'function') {
  const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  window.localStorage.setItem = function(key, value) {
    originalSetItem(key, value);
    if (typeof key === 'string' && (key.startsWith('portfolio_') || SECTIONS.includes(key))) {
      window.dispatchEvent(new CustomEvent('portfolio:storage-update', { detail: { key, value } }));
    }
  };

  const originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);
  window.localStorage.removeItem = function(key) {
    originalRemoveItem(key);
    if (typeof key === 'string' && (key.startsWith('portfolio_') || SECTIONS.includes(key))) {
      window.dispatchEvent(new CustomEvent('portfolio:storage-update', { detail: { key } }));
    }
  };

  const originalClear = window.localStorage.clear.bind(window.localStorage);
  window.localStorage.clear = function() {
    originalClear();
    window.dispatchEvent(new CustomEvent('portfolio:storage-update', { detail: { cleared: true } }));
  };

  window.addEventListener('portfolio:storage-update', () => {
    scheduleReRender();
  });
}

// Expose fungsi render secara global
if (typeof window !== 'undefined') {
  window.PortfolioRender = {
    renderApp,
    renderHeader,
    renderHome,
    renderAbout,
    renderTools,
    renderProjects,
    renderExperience,
    renderContact,
    renderFooter,
    escapeHtml,
    extractArray
  };
  window.renderPortfolio = renderApp;
}

export default {
  renderApp,
  renderHeader,
  renderHome,
  renderAbout,
  renderTools,
  renderProjects,
  renderExperience,
  renderContact,
  renderFooter,
  renderMarquee,
  escapeHtml,
  extractArray
};
