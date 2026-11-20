(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const projects = Array.isArray(window.PROJECT_DATA) ? window.PROJECT_DATA : [];
  const career = Array.isArray(window.TECH_CARRIER_DATA) ? window.TECH_CARRIER_DATA : [];
  const themeButton = $("#theme-toggle");
  const languageSwitch = $("#lang-toggle");
  const menuButton = $("#menu-btn");
  const navMenu = $("#nav-menu");
  const modalLayer = $("#project-modal");
  const modalPanel = $(".projects-modal-panel");
  const projectGrid = $("#project-grid");
  const projectModalGrid = $("#project-modal-grid");
  const storage = {
    get(key, fallback) {
      try { return localStorage.getItem(key) || fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch { /* Storage can be unavailable in private contexts. */ }
    }
  };

  const I18N = {
    id: {
      "nav.home": "Beranda", "nav.about": "Tentang", "nav.achievements": "Prestasi", "nav.projects": "Proyek", "nav.now": "Sekarang", "nav.journey": "Perjalanan", "nav.contact": "Kontak",
      "hero.eyebrow": "TEKNIK INFORMATIKA · UNIVERSITAS MALIKUSSALEH", "hero.kicker": "Perangkat lunak, sistem, dan pengalaman digital yang bermakna", "hero.awardProvincial": "Juara 1 · LKS Provinsi 2025", "hero.awardNational": "Medallion of Excellence · LKS Nasional 2025", "hero.rolePrefix": "Sedang mengeksplorasi", "hero.description": "Saya mahasiswa Teknik Informatika di Universitas Malikussaleh dengan latar belakang Rekayasa Perangkat Lunak dari SMKN 1 Karang Baru. Saya tertarik membangun aplikasi web dan sistem digital yang terstruktur, aman, efisien, dan berangkat dari kebutuhan nyata. Pengalaman proyek membawa saya bekerja dengan Laravel, PHP, JavaScript, dan MySQL, sembari terus memperdalam algoritma, C++, Linux Ubuntu, serta integrasi AI.", "hero.projectsCta": "Lihat proyek", "hero.location": "Aceh, Indonesia", "hero.availability": "Terbuka untuk kolaborasi", "hero.portraitCaption": "Mahasiswa Teknik Informatika", "hero.noteOne": "Dari ide menjadi sistem yang berguna", "hero.noteTwo": "Pengakuan tingkat provinsi & nasional", "hero.scroll": "Gulir untuk menjelajah",
      "about.eyebrow": "TENTANG SAYA", "about.title": "Fondasi yang dibangun melalui rasa ingin tahu.", "about.lead": "Perjalanan dari pendidikan vokasi ke Teknik Informatika membentuk cara saya memahami teknologi: mulai dari kebutuhan, lalu merancang solusi yang dapat digunakan.", "about.profileLabel": "PROFIL", "about.profileTitle": "Dari rekayasa perangkat lunak ke informatika.", "about.profileText": "Saya mahasiswa Teknik Informatika di Universitas Malikussaleh, dengan fondasi Rekayasa Perangkat Lunak (RPL) dari SMKN 1 Karang Baru. Latar belakang SMK membentuk pengalaman awal dalam pengembangan web, perancangan sistem, basis data, pengujian, dan pemecahan masalah. Saat ini saya melanjutkan pengembangan kemampuan di bidang software engineering, algoritma, pemrograman, dan sistem digital. Saya terbiasa membangun proyek menggunakan PHP/Laravel, JavaScript, dan MySQL, serta terus mengeksplorasi C++, Linux Ubuntu, dan integrasi API.", "about.focus": "Tertarik pada software engineering, aplikasi web, dan sistem cerdas.", "about.educationLabel": "PENDIDIKAN", "about.current": "SAAT INI", "about.university": "Teknik Informatika · Informatics Engineering", "about.universityPeriod": "2026 — Sekarang", "about.alumni": "ALUMNI", "about.vocational": "Rekayasa Perangkat Lunak (RPL)", "about.vocationalPeriod": "2023 — 2026", "about.stackLabel": "TECH STACK & TOOLS", "about.stackTitle": "Teknologi yang digunakan dan dipelajari.",
      "achievements.eyebrow": "PENCAPAIAN", "achievements.title": "Prestasi dan pengakuan.", "achievements.lead": "Dua pencapaian dari kompetisi keterampilan siswa tingkat provinsi dan nasional pada 2025.",
      "projects.eyebrow": "KARYA TERPILIH", "projects.title": "Proyek yang dibangun dari masalah nyata.", "projects.lead": "Kumpulan aplikasi, eksperimen, dan sistem digital yang saya kembangkan selama proses belajar.", "projects.viewAll": "Lihat semua proyek", "projects.modalEyebrow": "ARSIP PROYEK", "projects.modalTitle": "Semua proyek", "projects.modalDescription": "Rangkuman proyek, prototipe, dan eksperimen yang pernah dikembangkan.", "projects.githubAdd": "Tambahkan tautan GitHub", "projects.add": "Add", "projects.pinned": "PROYEK UTAMA",
      "now.eyebrow": "SAAT INI", "now.title": "Hal yang sedang menjadi fokus.", "now.lead": "Ruang ini disiapkan untuk pembaruan fokus, hal yang sedang dipelajari, dan arah kolaborasi berikutnya.", "now.focusLabel": "FOKUS SAAT INI", "now.focusTitle": "Fokus saat ini", "now.focusDesc": "Tambahkan fokus utama atau pekerjaan yang sedang berjalan.", "now.learningLabel": "CATATAN BELAJAR", "now.learningTitle": "Sedang dipelajari", "now.learningDesc": "Tambahkan topik, teknologi, atau konsep yang sedang diperdalam.", "now.collabLabel": "KOLABORASI", "now.collabTitle": "Terbuka untuk kolaborasi", "now.collabDesc": "Tambahkan jenis kolaborasi, kontribusi, atau diskusi yang diminati.",
      "journey.eyebrow": "PERJALANAN", "journey.title": "Linimasa belajar dan membangun.", "journey.lead": "Perjalanan pendidikan, pengalaman, dan proyek disusun sebagai alur waktu yang terus berkembang.", "journey.complete": "Selesai", "journey.current": "Berlangsung", "journey.upcoming": "Berikutnya",
      "stats.eyebrow": "RINGKASAN", "stats.title": "Beberapa angka dalam perjalanan ini.", "stats.projects": "Proyek utama", "stats.projectsNote": "Terdaftar di portofolio ini", "stats.awards": "Penghargaan kompetisi", "stats.awardsNote": "Provinsi & nasional, 2025", "stats.years": "Tahun belajar", "stats.yearsNote": "Sejak 2023 · SMK hingga universitas", "stats.year": "Tahun portofolio", "stats.yearNote": "Diperbarui otomatis",
      "contact.eyebrow": "ADA HAL YANG INGIN DIDISKUSIKAN?", "contact.title": "Mari membangun sesuatu yang bermakna.", "contact.description": "Terbuka untuk diskusi, kolaborasi, dan pengembangan proyek. Hubungi saya melalui kanal berikut.", "footer.note": "Dirancang dengan perhatian. Dibangun dengan rasa ingin tahu."
    },
    en: {
      "nav.home": "Home", "nav.about": "About", "nav.achievements": "Awards", "nav.projects": "Projects", "nav.now": "Now", "nav.journey": "Journey", "nav.contact": "Contact",
      "hero.eyebrow": "INFORMATICS ENGINEERING · UNIVERSITAS MALIKUSSALEH", "hero.kicker": "Software, systems & thoughtful digital experiences", "hero.awardProvincial": "1st Place · LKS Provincial 2025", "hero.awardNational": "Medallion of Excellence · LKS National 2025", "hero.rolePrefix": "Currently exploring", "hero.description": "I am an Informatics Engineering student at Universitas Malikussaleh with a Software Engineering background from SMKN 1 Karang Baru. I am interested in building structured, secure, and useful web applications and digital systems. Project experience has introduced me to Laravel, PHP, JavaScript, and MySQL, while I continue deepening my knowledge of algorithms, C++, Linux Ubuntu, and AI integration.", "hero.projectsCta": "Explore projects", "hero.location": "Aceh, Indonesia", "hero.availability": "Open to collaborations", "hero.portraitCaption": "Informatics Engineering Student", "hero.noteOne": "From ideas to useful systems", "hero.noteTwo": "Provincial & national recognition", "hero.scroll": "Scroll to explore",
      "about.eyebrow": "ABOUT ME", "about.title": "A foundation built through curiosity.", "about.lead": "The transition from vocational education to Informatics Engineering shapes how I approach technology: start with a need, then design a solution people can use.", "about.profileLabel": "PROFILE", "about.profileTitle": "From software engineering to informatics.", "about.profileText": "I am an Informatics Engineering student at Universitas Malikussaleh, with a Software Engineering (RPL) foundation from SMKN 1 Karang Baru. My vocational background introduced me to web development, system design, databases, testing, and problem-solving. I am now continuing to develop my skills in software engineering, algorithms, programming, and digital systems. I build projects with PHP/Laravel, JavaScript, and MySQL, while continuing to explore C++, Linux Ubuntu, and API integration.", "about.focus": "Interested in software engineering, web applications, and intelligent systems.", "about.educationLabel": "EDUCATION", "about.current": "CURRENT", "about.university": "Informatics Engineering", "about.universityPeriod": "2026 — Present", "about.alumni": "ALUMNI", "about.vocational": "Software Engineering (RPL)", "about.vocationalPeriod": "2023 — 2026", "about.stackLabel": "TECH STACK & TOOLS", "about.stackTitle": "Tools I work and learn with.",
      "achievements.eyebrow": "MILESTONES", "achievements.title": "Achievements & recognition.", "achievements.lead": "Two achievements from provincial and national student skills competitions in 2025.",
      "projects.eyebrow": "SELECTED WORK", "projects.title": "Projects shaped by real problems.", "projects.lead": "A collection of applications, experiments, and digital systems developed throughout my learning journey.", "projects.viewAll": "View all projects", "projects.modalEyebrow": "PROJECT ARCHIVE", "projects.modalTitle": "All projects", "projects.modalDescription": "A broader view of the projects, prototypes, and experiments developed over time.", "projects.githubAdd": "Add GitHub URL", "projects.add": "Add", "projects.pinned": "FEATURED PROJECT",
      "now.eyebrow": "CURRENTLY", "now.title": "What I am focused on now.", "now.lead": "A space for updates on current priorities, learning topics, and future collaboration interests.", "now.focusLabel": "CURRENT FOCUS", "now.focusTitle": "Current focus", "now.focusDesc": "Add the main focus or work currently in progress.", "now.learningLabel": "LEARNING NOTES", "now.learningTitle": "Currently learning", "now.learningDesc": "Add topics, technologies, or concepts being explored.", "now.collabLabel": "COLLABORATION", "now.collabTitle": "Open to collaboration", "now.collabDesc": "Add collaboration, contribution, or discussion interests.",
      "journey.eyebrow": "THE JOURNEY", "journey.title": "A timeline of learning and building.", "journey.lead": "Education, experience, and projects are arranged as a timeline that continues to evolve.", "journey.complete": "Completed", "journey.current": "In progress", "journey.upcoming": "Upcoming",
      "stats.eyebrow": "AT A GLANCE", "stats.title": "A few numbers along the way.", "stats.projects": "Major projects", "stats.projectsNote": "Listed in this portfolio", "stats.awards": "Competition honors", "stats.awardsNote": "Provincial & national, 2025", "stats.years": "Years learning", "stats.yearsNote": "Since 2023 · vocational to university", "stats.year": "Portfolio year", "stats.yearNote": "Automatically updated",
      "contact.eyebrow": "HAVE SOMETHING IN MIND?", "contact.title": "Let's build something meaningful.", "contact.description": "Open to discussion, collaboration, and project development. Reach me through the channels below.", "footer.note": "Designed with care. Built with curiosity."
    }
  };

  const ACHIEVEMENTS = [
    {
      icon: "ri-trophy-line",
      meta: { id: "LKSN Tingkat Provinsi · Juni 2025", en: "LKSN Provincial Level · June 2025" },
      title: { id: "Juara 1 IT Software Solutions for Business", en: "1st Place · IT Software Solutions for Business" },
      place: { id: "Meulaboh, Aceh Barat", en: "Meulaboh, West Aceh" }
    },
    {
      icon: "ri-medal-line",
      meta: { id: "LKSN Tingkat Nasional · Agustus 2025", en: "LKSN National Level · August 2025" },
      title: { id: "Medallion of Excellence · IT Software for Business", en: "Medallion of Excellence · IT Software for Business" },
      place: { id: "Jakarta / Jawa Barat", en: "Jakarta / West Java" }
    }
  ];

  let language = storage.get("mhm-language", "id") === "en" ? "en" : "id";
  let theme = storage.get("mhm-theme", "dark") === "light" ? "light" : "dark";
  let typingTimer = null;
  let typingIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let modalReturnFocus = null;
  const closeTimers = new WeakMap();
  let scrollTicking = false;

  const words = {
    id: ["Software Development", "Web Application", "System Design", "Laravel & PHP", "Problem Solving"],
    en: ["Software Development", "Web Applications", "System Design", "Laravel & PHP", "Problem Solving"]
  };

  function text(key) { return I18N[language][key] || key; }
  function localize(value) {
    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";
    return value[language] || value.id || value.en || "";
  }
  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function safeGitHubURL(value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      return url.protocol === "https:" && (url.hostname === "github.com" || url.hostname.endsWith(".github.com")) ? url.href : "";
    } catch { return ""; }
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === "en" ? "en" : "id";
    storage.set("mhm-language", language);
    document.documentElement.lang = language;
    document.body.dataset.language = language;
    if (languageSwitch) languageSwitch.dataset.active = language;
    $$("[data-lang]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.lang === language)));
    $$('[data-i18n]').forEach((element) => {
      const key = element.dataset.i18n;
      if (I18N[language][key]) element.textContent = text(key);
    });
    if (themeButton) themeButton.setAttribute("aria-label", language === "id" ? "Ganti tema" : "Switch theme");
    renderAchievements();
    renderProjects();
    renderTimeline();
    startTyping(true);
    updatePageMeta();
    window.dispatchEvent(new CustomEvent("portfolio:languagechange", { detail: { language } }));
  }

  function updatePageMeta() {
    document.title = language === "id"
      ? "Muhammad Haliq Maulana — Mahasiswa Teknik Informatika"
      : "Muhammad Haliq Maulana — Informatics Engineering";
  }

  function setTheme(nextTheme) {
    theme = nextTheme === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = theme;
    storage.set("mhm-theme", theme);
    if (themeButton) {
      const icon = $("i", themeButton);
      if (icon) icon.className = theme === "dark" ? "ri-sun-line" : "ri-moon-line";
      themeButton.title = theme === "dark" ? (language === "id" ? "Aktifkan mode terang" : "Switch to light mode") : (language === "id" ? "Aktifkan mode gelap" : "Switch to dark mode");
      themeButton.setAttribute("aria-label", themeButton.title);
    }
    const themeMeta = $('meta[name="theme-color"]');
    if (themeMeta) themeMeta.content = theme === "dark" ? "#08152d" : "#f5f8fe";
  }

  function startTyping(reset = false) {
    const output = $("#typing-text");
    if (!output) return;
    if (typingTimer) window.clearTimeout(typingTimer);
    if (reset) { typingIndex = 0; charIndex = 0; deleting = false; }
    if (reduceMotion) { output.textContent = words[language][0]; return; }
    const list = words[language];
    const word = list[typingIndex % list.length];
    if (!deleting) {
      charIndex = Math.min(charIndex + 1, word.length);
      output.textContent = word.slice(0, charIndex);
      if (charIndex >= word.length) {
        deleting = true;
        typingTimer = window.setTimeout(startTyping, 1250);
        return;
      }
    } else {
      charIndex = Math.max(0, charIndex - 1);
      output.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        typingIndex = (typingIndex + 1) % list.length;
      }
    }
    typingTimer = window.setTimeout(startTyping, deleting ? 36 : 75);
  }

  function renderAchievements() {
    const container = $("#achievement-grid");
    if (!container) return;
    container.innerHTML = ACHIEVEMENTS.map((award, index) => `
      <article class="achievement-card reveal" style="--reveal-delay:${index * 90}ms">
        <div class="achievement-top"><span class="achievement-icon"><i class="${escapeHTML(award.icon)}" aria-hidden="true"></i></span><span class="achievement-meta">${escapeHTML(localize(award.meta))}</span></div>
        <h3>${escapeHTML(localize(award.title))}</h3>
        <p>${escapeHTML(localize(award.place))}</p>
      </article>
    `).join("");
    observeReveals(container);
  }

  function createProjectCard(project, index, compact = false) {
    const image = project.image ? `<img src="${escapeHTML(project.image)}" alt="${escapeHTML(project.title)} interface preview" loading="lazy" decoding="async" />` : `
      <div class="project-art" aria-hidden="true"><span class="project-art-icon"><i class="${escapeHTML(project.icon || "ri-code-box-line")}"></i></span><span class="project-art-label">MHM · ${escapeHTML(project.id.toUpperCase())}</span></div>`;
    const github = safeGitHubURL(project.githubUrl);
    const tags = (project.tags || []).map((tag) => `<span>${escapeHTML(tag)}</span>`).join("");
    const collab = project.collaboration ? `<span class="project-collaboration"><i class="ri-git-branch-line" aria-hidden="true"></i>${escapeHTML(project.collaboration)}</span>` : "";
    const placeholder = project.placeholder;
    const action = github
      ? `<a class="project-github" href="${escapeHTML(github)}" target="_blank" rel="noopener noreferrer"><i class="ri-github-line" aria-hidden="true"></i> GitHub <i class="ri-arrow-up-right-line" aria-hidden="true"></i></a>`
      : `<span class="project-add"><i class="ri-add-circle-line" aria-hidden="true"></i>${escapeHTML(placeholder ? text("projects.add") : text("projects.githubAdd"))}</span>`;
    return `
      <article class="project-card ${compact ? "project-card-compact" : ""} reveal" data-project-id="${escapeHTML(project.id)}" style="--reveal-delay:${Math.min(index % 4, 3) * 65}ms">
        <div class="project-cover">${image}${project.featured ? `<span class="project-badge"><i class="ri-pushpin-line" aria-hidden="true"></i>${escapeHTML(text("projects.pinned"))}</span>` : ""}</div>
        <div class="project-content">
          <div class="project-meta-row"><span class="project-status">${escapeHTML(localize(project.status))}</span><span class="project-number">${String(index + 1).padStart(2, "0")}</span></div>
          <h3>${escapeHTML(project.title)}</h3>
          <p class="project-summary">${escapeHTML(localize(project.summary))}</p>
          ${collab}
          ${tags ? `<div class="project-tags">${tags}</div>` : ""}
          <div class="project-actions">${action}</div>
        </div>
      </article>
    `;
  }

  function sortedProjects() {
    return [...projects].sort((a, b) => Number(b.order || 0) - Number(a.order || 0));
  }

  function renderProjects() {
    if (!projectGrid) return;
    const all = sortedProjects();
    const featured = all.filter((project) => project.featured);
    projectGrid.innerHTML = featured.map((project, index) => createProjectCard(project, index, true)).join("");
    observeReveals(projectGrid);
    if (modalPanel?.classList.contains("is-open")) renderProjectArchive();
  }

  function renderProjectArchive() {
    if (!projectModalGrid) return;
    projectModalGrid.innerHTML = sortedProjects().map((project, index) => createProjectCard(project, index, false)).join("");
    observeReveals(projectModalGrid);
  }

  function statusFor(item, now = new Date()) {
    const start = new Date(`${item.start}T00:00:00`);
    const end = item.end ? new Date(`${item.end}T23:59:59`) : null;
    if (start > now) return "upcoming";
    if (!end || now <= end) return "current";
    return "complete";
  }

  function renderTimeline() {
    const container = $("#timeline-entries");
    if (!container) return;
    const statusLabels = { complete: text("journey.complete"), current: text("journey.current"), upcoming: text("journey.upcoming") };
    const now = new Date();
    container.innerHTML = career.map((item, index) => {
      const status = statusFor(item, now);
      return `
        <article class="timeline-entry is-${status} reveal" data-timeline-id="${escapeHTML(item.id)}" style="--reveal-delay:${Math.min(index % 3, 2) * 50}ms">
          <span class="timeline-node" aria-hidden="true"></span>
          <div class="timeline-card">
            <div class="timeline-card-top"><span class="timeline-period">${escapeHTML(localize(item.period))}</span><span class="timeline-status">${escapeHTML(statusLabels[status])}</span></div>
            <h3>${escapeHTML(localize(item.title))}</h3>
            <p>${escapeHTML(localize(item.summary))}</p>
          </div>
        </article>
      `;
    }).join("");
    observeReveals(container);
    updateTimelineProgress();
  }

  function animateNumber(element, target, delay = 0) {
    if (!element) return;
    if (reduceMotion) { element.textContent = String(target); return; }
    window.setTimeout(() => {
      const duration = 850;
      const start = performance.now();
      const tick = (time) => {
        const progress = Math.min(1, (time - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
  }

  let statsStarted = false;
  function renderStats() {
    const currentYear = new Date().getFullYear();
    const startYear = 2023;
    const values = {
      projects: projects.length,
      awards: ACHIEVEMENTS.length,
      years: Math.max(1, currentYear - startYear + 1),
      portfolioYear: currentYear
    };
    Object.entries(values).forEach(([key, value], index) => {
      const element = $(`[data-stat="${key}"]`);
      if (!element) return;
      element.dataset.target = String(value);
      if (statsStarted) element.textContent = String(value);
      else animateNumber(element, value, index * 110);
    });
    statsStarted = true;
    const footerYear = $("#footer-year");
    if (footerYear) footerYear.textContent = String(currentYear);
  }

  function observeReveals(scope = document) {
    const elements = $$(".reveal:not(.is-revealed)", scope);
    if (!elements.length) return;
    if (typeof IntersectionObserver === "undefined" || reduceMotion) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -35px 0px" });
    elements.forEach((element) => observer.observe(element));
  }

  function clamp(number, min, max) { return Math.min(max, Math.max(min, number)); }
  function openGenie(panel, originElement) {
    if (!panel) return;
    const pendingClose = closeTimers.get(panel);
    if (pendingClose) window.clearTimeout(pendingClose);
    closeTimers.delete(panel);
    panel.classList.remove("is-closing");
    panel.classList.add("is-visible");
    panel.setAttribute("aria-hidden", "false");
    const panelRect = panel.getBoundingClientRect();
    const originRect = originElement?.getBoundingClientRect();
    let x = panelRect.width * .5;
    let y = panelRect.height * .5;
    if (originRect) {
      x = clamp(originRect.left + originRect.width / 2 - panelRect.left, 0, panelRect.width);
      y = clamp(originRect.top + originRect.height / 2 - panelRect.top, 0, panelRect.height);
    }
    panel.style.setProperty("--genie-origin-x", `${panelRect.width ? (x / panelRect.width) * 100 : 50}%`);
    panel.style.setProperty("--genie-origin-y", `${panelRect.height ? (y / panelRect.height) * 100 : 50}%`);
    void panel.offsetWidth;
    requestAnimationFrame(() => panel.classList.add("is-open"));
  }
  function closeGenie(panel, onClosed) {
    if (!panel || !panel.classList.contains("is-visible")) { onClosed?.(); return; }
    panel.classList.remove("is-open");
    panel.classList.add("is-closing");
    panel.setAttribute("aria-hidden", "true");
    const pendingClose = closeTimers.get(panel);
    if (pendingClose) window.clearTimeout(pendingClose);
    const timer = window.setTimeout(() => {
      panel.classList.remove("is-visible", "is-closing");
      panel.style.removeProperty("--genie-origin-x");
      panel.style.removeProperty("--genie-origin-y");
      closeTimers.delete(panel);
      onClosed?.();
    }, reduceMotion ? 20 : 365);
    closeTimers.set(panel, timer);
  }
  window.GenMotion = { open: openGenie, close: closeGenie };

  function openProjectModal(trigger) {
    if (!modalLayer || !modalPanel) return;
    modalReturnFocus = trigger || document.activeElement;
    renderProjectArchive();
    modalLayer.classList.add("is-visible");
    document.body.classList.add("modal-open");
    openGenie(modalPanel, trigger);
    window.setTimeout(() => $(".modal-close", modalPanel)?.focus(), reduceMotion ? 0 : 180);
  }
  function closeProjectModal() {
    if (!modalLayer || !modalPanel) return;
    closeGenie(modalPanel, () => {
      modalLayer.classList.remove("is-visible");
      document.body.classList.remove("modal-open");
      modalReturnFocus?.focus?.();
      modalReturnFocus = null;
    });
  }

  function setMenu(open) {
    if (!navMenu || !menuButton) return;
    navMenu.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? (language === "id" ? "Tutup navigasi" : "Close navigation") : (language === "id" ? "Buka navigasi" : "Open navigation"));
    const icon = $("i", menuButton);
    if (icon) icon.className = open ? "ri-close-line" : "ri-menu-3-line";
  }

  function updateTimelineProgress() {
    const timeline = $("#career-timeline");
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const focusLine = window.innerHeight * .58;
    const progress = clamp((focusLine - rect.top) / Math.max(rect.height, 1), 0, 1) * 100;
    document.documentElement.style.setProperty("--timeline-progress", `${progress}%`);
  }

  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    const bar = $("#page-progress");
    if (bar) bar.style.width = `${progress}%`;
    const header = $("#header");
    if (header) header.classList.toggle("has-scrolled", window.scrollY > 24);
    const sections = $$('main section[id]');
    let active = "home";
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= 150) active = section.id;
    });
    $$(".nav-list a").forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${active}`));
    updateTimelineProgress();
    scrollTicking = false;
  }

  themeButton?.addEventListener("click", () => setTheme(theme === "dark" ? "light" : "dark"));
  languageSwitch?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lang]");
    if (button && button.dataset.lang !== language) setLanguage(button.dataset.lang);
  });
  menuButton?.addEventListener("click", () => setMenu(!navMenu.classList.contains("is-open")));
  $$(".nav-list a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  $("#projects-all-trigger")?.addEventListener("click", (event) => openProjectModal(event.currentTarget));
  modalLayer?.addEventListener("click", (event) => {
    if (event.target.closest("[data-modal-close]")) closeProjectModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (modalPanel?.classList.contains("is-visible")) closeProjectModal();
      if (navMenu?.classList.contains("is-open")) setMenu(false);
    }
    if (event.key === "Tab" && modalPanel?.classList.contains("is-open")) {
      const focusable = $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', modalPanel).filter((el) => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener("scroll", () => {
    if (!scrollTicking) { requestAnimationFrame(updateScrollUI); scrollTicking = true; }
  }, { passive: true });
  window.addEventListener("resize", updateScrollUI, { passive: true });
  window.addEventListener("load", () => document.body.classList.add("is-loaded"), { once: true });

  setTheme(theme);
  setLanguage(language);
  renderStats();
  observeReveals();
  updateScrollUI();
})();
