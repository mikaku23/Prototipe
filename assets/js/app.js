const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");
const header = document.getElementById("header");
const themeBtn = document.getElementById("theme-toggle");
const langToggle = document.getElementById("lang-toggle");
const footer = document.querySelector(".footer p");

const typingText = document.getElementById("typing-text");
const heroTag = document.querySelector(".hero-tag");
const heroParagraph = document.querySelector(".hero p");
const heroButtons = document.querySelectorAll(".hero-buttons .btn");
const heroBadges = document.querySelectorAll(".hero-badges span");

const navLinks = document.querySelectorAll(".nav-list a");
const sections = document.querySelectorAll("section[id]");

const projectGrid = document.getElementById("project-grid");
const projectModal = document.getElementById("project-modal");
const projectModalGrid = document.getElementById("project-modal-grid");
const projectModalTitle = document.getElementById("project-modal-title");
const projectModalKicker = document.querySelector(".modal-kicker");
const projectModalDesc = document.querySelector(".project-modal-head p");

const statsTargets = {
  projects: document.querySelector('[data-stat="projects"]'),
  awards: document.querySelector('[data-stat="awards"]'),
  years: document.querySelector('[data-stat="years"]'),
  portfolioYear: document.querySelector('[data-stat="portfolioYear"]'),
};

const statsSection = document.getElementById("stats");
let statsAnimated = false;
let statsObserver = null;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const projectData = Array.isArray(window.PROJECT_DATA) ? [...window.PROJECT_DATA] : [];
const careerData = Array.isArray(window.TECH_CARRIER_DATA) ? [...window.TECH_CARRIER_DATA] : [];

const STORAGE_KEYS = {
  theme: "theme",
  lang: "lang",
};

const I18N = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      achievements: "Achievements",
      projects: "Projects",
      career: "Tech Career",
      contact: "Contact",
    },
    hero: {
      tag: "WEB DEVELOPER",
      badges: [
        "🏆 Provincial Champion 2025",
        "🥇 Medallion of Excellence National LKS 2025",
      ],
      typing: [
        "Laravel Developer",
        "Web Developer",
        "Frontend Developer",
        "Backend Developer",
        "Fullstack Learner",
      ],
      paragraph:
        "I am a Software Engineering (RPL) student at SMKN 1 Karang Baru with a strong passion for technology and software development. Throughout my studies, I have gained knowledge and experience in various areas of computer science and programming, ranging from system design and application development to website testing, ensuring optimal quality and functionality. I am skilled in building web applications using PHP and the Laravel Framework, and capable of developing responsive, well-structured, and user-oriented web solutions that meet both functional and technical requirements.",
      viewProjects: "View Projects",
      github: "GitHub",
    },
    about: {
      span: "ABOUT",
      title: "About Me",
      profileTitle: "Profile",
      profileText:
        "I am a Software Engineering (RPL) student at SMKN 1 Karang Baru with a strong passion for technology and software development. I focus on building responsive, structured, and user-oriented web solutions.",
      stackTitle: "Tech Stack",
    },
    achievements: {
      span: "ACHIEVEMENTS",
      title: "Achievements & Awards",
      items: [
        {
          meta: "LKSN Provincial Level • June 2025",
          title: "1st Place IT Software Solutions for Business",
          location: "Meulaboh, Aceh Barat",
        },
        {
          meta: "LKSN National Level • August 2025",
          title: "Medallion of Excellence IT Software for Business",
          location: "Jakarta / West Java",
        },
      ],
    },
    projects: {
      span: "PORTFOLIO",
      title: "Featured Projects",
      moreTitle: "View all projects",
      modalKicker: "All Projects",
      modalTitle: "View all projects",
      modalDesc:
        "The full project list is compact, fast to browse, and optimized for desktop and mobile.",
      comingSoon: "Coming Soon",
      demo: "Demo",
      github: "GitHub",
      emptyExtra: "No extra projects.",
    },
    career: {
      span: "TECH CAREER",
      title: "Tech Career Timeline",
    },
    stats: {
      projects: "Major Projects",
      awards: "National Awards",
      years: "Years Learning",
      portfolioYear: "Portfolio Year",
    },
    contact: {
      title: "Let's Connect",
      desc: "Open for discussion, collaboration, and project development.",
    },
    modalClose: "Close projects",
    language: {
      id: "ID",
      en: "EN",
    },
    theme: {
      dark: "Dark",
      light: "Light",
    },
  },
  id: {
    nav: {
      home: "Beranda",
      about: "Tentang",
      achievements: "Prestasi",
      projects: "Proyek",
      career: "Karier Teknologi",
      contact: "Kontak",
    },
    hero: {
      tag: "PENGEMBANG WEB",
      badges: [
        "🏆 Juara Provinsi 2025",
        "🥇 Medali Keunggulan Nasional LKS 2025",
      ],
      typing: [
        "Pengembang Laravel",
        "Pengembang Web",
        "Pengembang Frontend",
        "Pengembang Backend",
        "Pembelajar Fullstack",
      ],
      paragraph:
        "Saya adalah siswa Rekayasa Perangkat Lunak (RPL) di SMKN 1 Karang Baru yang punya minat besar pada teknologi dan pengembangan perangkat lunak. Selama belajar, saya memperoleh pengetahuan dan pengalaman di berbagai bidang ilmu komputer dan pemrograman, mulai dari perancangan sistem, pengembangan aplikasi, hingga pengujian website agar kualitas dan fungsinya optimal. Saya terbiasa membangun aplikasi web menggunakan PHP dan Framework Laravel, serta mampu mengembangkan solusi web yang responsif, terstruktur, dan berorientasi pada pengguna sesuai kebutuhan fungsional maupun teknis.",
      viewProjects: "Lihat Proyek",
      github: "GitHub",
    },
    about: {
      span: "TENTANG",
      title: "Tentang Saya",
      profileTitle: "Profil",
      profileText:
        "Saya adalah siswa Rekayasa Perangkat Lunak (RPL) di SMKN 1 Karang Baru yang punya minat besar pada teknologi dan pengembangan perangkat lunak. Fokus saya adalah membangun solusi web yang responsif, terstruktur, dan berorientasi pada pengguna.",
      stackTitle: "Tech Stack",
    },
    achievements: {
      span: "PRESTASI",
      title: "Prestasi & Penghargaan",
      items: [
        {
          meta: "Tingkat Provinsi LKSN • Juni 2025",
          title: "Juara 1 IT Software Solutions for Business",
          location: "Meulaboh, Aceh Barat",
        },
        {
          meta: "Tingkat Nasional LKSN • Agustus 2025",
          title: "Medali Keunggulan IT Software for Business",
          location: "Jakarta / Jawa Barat",
        },
      ],
    },
    projects: {
      span: "PORTOFOLIO",
      title: "Proyek Unggulan",
      moreTitle: "Lihat semua project",
      modalKicker: "Semua Project",
      modalTitle: "Lihat semua project",
      modalDesc:
        "Daftar project lengkap dibuat ringkas, cepat dibuka, dan tetap nyaman di desktop maupun mobile.",
      comingSoon: "Segera Hadir",
      demo: "Demo",
      github: "GitHub",
      emptyExtra: "Tidak ada project tambahan.",
    },
    career: {
      span: "KARIER TEKNOLOGI",
      title: "Tech Career Timeline",
    },
    stats: {
      projects: "Proyek Utama",
      awards: "Penghargaan Nasional",
      years: "Tahun Belajar",
      portfolioYear: "Tahun Portofolio",
    },
    contact: {
      title: "Mari Terhubung",
      desc: "Terbuka untuk diskusi, kolaborasi, dan pengembangan proyek.",
    },
    modalClose: "Tutup project",
    language: {
      id: "ID",
      en: "EN",
    },
    theme: {
      dark: "Gelap",
      light: "Terang",
    },
  },
};

let currentLang = localStorage.getItem(STORAGE_KEYS.lang) || "en";
let currentTheme = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
let currentSortedProjects = [];
let typeTimer = null;
let typingState = { wordIndex: 0, charIndex: 0, deleting: false };

function t(path) {
  return path.split(".").reduce((acc, key) => acc?.[key], I18N[currentLang]) ?? path;
}

function localize(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value[currentLang] ?? value.en ?? value.id ?? "";
}

function setBodyTheme(theme) {
  currentTheme = theme === "light" ? "light" : "dark";
  document.body.classList.toggle("light", currentTheme === "light");
  document.documentElement.dataset.theme = currentTheme;

  const icon = themeBtn?.querySelector("i");
  if (icon) {
    icon.className = currentTheme === "light" ? "ri-sun-line" : "ri-moon-line";
  }

  themeBtn?.setAttribute(
    "aria-label",
    currentTheme === "light" ? `${t("theme.light")} mode` : `${t("theme.dark")} mode`,
  );

  localStorage.setItem(STORAGE_KEYS.theme, currentTheme);
}

function animateThemeToggle() {
  if (!themeBtn) return;
  themeBtn.classList.remove("is-animating");
  void themeBtn.offsetWidth; // restart animation
  themeBtn.classList.add("is-animating");
  window.setTimeout(() => themeBtn.classList.remove("is-animating"), 420);
}

function setLanguage(lang) {
  currentLang = lang === "id" ? "id" : "en";
  localStorage.setItem(STORAGE_KEYS.lang, currentLang);
  document.documentElement.lang = currentLang;
  document.body.dataset.lang = currentLang;

  document.querySelectorAll(".nav-list a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === "#home") link.textContent = t("nav.home");
    if (href === "#about") link.textContent = t("nav.about");
    if (href === "#achievements") link.textContent = t("nav.achievements");
    if (href === "#projects") link.textContent = t("nav.projects");
    if (href === "#experience") link.textContent = t("nav.career");
    if (href === "#contact") link.textContent = t("nav.contact");
  });

  if (heroTag) heroTag.textContent = t("hero.tag");
  heroBadges[0] && (heroBadges[0].textContent = t("hero.badges.0"));
  heroBadges[1] && (heroBadges[1].textContent = t("hero.badges.1"));
  if (heroParagraph) heroParagraph.textContent = t("hero.paragraph");
  if (heroButtons[0]) heroButtons[0].textContent = t("hero.viewProjects");
  if (heroButtons[1]) heroButtons[1].textContent = t("hero.github");

  const aboutTitleSpan = document.querySelector("#about .section-title span");
  const aboutTitle = document.querySelector("#about .section-title h2");
  const aboutCards = document.querySelectorAll("#about .about-card");
  if (aboutTitleSpan) aboutTitleSpan.textContent = t("about.span");
  if (aboutTitle) aboutTitle.textContent = t("about.title");
  if (aboutCards[0]) {
    const h3 = aboutCards[0].querySelector("h3");
    const p = aboutCards[0].querySelector("p");
    if (h3) h3.textContent = t("about.profileTitle");
    if (p) p.textContent = t("about.profileText");
  }
  if (aboutCards[1]) {
    const h3 = aboutCards[1].querySelector("h3");
    if (h3) h3.textContent = t("about.stackTitle");
  }

  const achievementTitleSpan = document.querySelector("#achievements .section-title span");
  const achievementTitle = document.querySelector("#achievements .section-title h2");
  if (achievementTitleSpan) achievementTitleSpan.textContent = t("achievements.span");
  if (achievementTitle) achievementTitle.textContent = t("achievements.title");
  document.querySelectorAll("#achievements .achievement-card").forEach((card, index) => {
    const meta = card.querySelector(".achievement-meta");
    const h3 = card.querySelector("h3");
    const p = card.querySelector("p");
    const item = t(`achievements.items.${index}`);
    if (meta) meta.textContent = item?.meta || meta.textContent;
    if (h3) h3.textContent = item?.title || h3.textContent;
    if (p) p.textContent = item?.location || p.textContent;
  });

  const projectTitleSpan = document.querySelector("#projects .section-title span");
  const projectTitle = document.querySelector("#projects .section-title h2");
  if (projectTitleSpan) projectTitleSpan.textContent = t("projects.span");
  if (projectTitle) projectTitle.textContent = t("projects.title");
  if (projectModalKicker) projectModalKicker.textContent = t("projects.modalKicker");
  if (projectModalTitle) projectModalTitle.textContent = t("projects.modalTitle");
  if (projectModalDesc) projectModalDesc.textContent = t("projects.modalDesc");

  const careerTitleSpan = document.querySelector("#experience .section-title span");
  const careerTitle = document.querySelector("#experience .section-title h2");
  if (careerTitleSpan) careerTitleSpan.textContent = t("career.span");
  if (careerTitle) careerTitle.textContent = t("career.title");

  const statCards = document.querySelectorAll(".stats .stat-card");
  if (statsTargets.projects && statCards[0]) statCards[0].querySelector("p").textContent = t("stats.projects");
  if (statsTargets.awards && statCards[1]) statCards[1].querySelector("p").textContent = t("stats.awards");
  if (statsTargets.years && statCards[2]) statCards[2].querySelector("p").textContent = t("stats.years");
  if (statsTargets.portfolioYear && statCards[3]) statCards[3].querySelector("p").textContent = t("stats.portfolioYear");

  const modalClose = document.querySelector(".project-modal-close");
  if (modalClose) modalClose.setAttribute("aria-label", t("modalClose"));

  const contactTitle = document.querySelector("#contact .contact-card h2");
  const contactDesc = document.querySelector("#contact .contact-card p");
  if (contactTitle) contactTitle.textContent = t("contact.title");
  if (contactDesc) contactDesc.textContent = t("contact.desc");

  if (footer) footer.innerHTML = `© ${new Date().getFullYear()} Muhammad Haliq Maulana`;

  syncLanguageToggle();
  resetTypingEffect();
  renderProjects();
  if (projectModal?.classList.contains("show")) {
    renderProjectModal(currentSortedProjects);
  }
  renderCareerTimeline();
  renderStats();
}

function syncLanguageToggle() {
  if (!langToggle) return;
  const buttons = langToggle.querySelectorAll(".lang-btn");
  buttons.forEach((btn) => {
    const lang = btn.dataset.lang;
    const active = lang === currentLang;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  const indicator = langToggle.querySelector(".lang-toggle-indicator");
  const activeBtn = langToggle.querySelector(`.lang-btn[data-lang="${currentLang}"]`);
  if (indicator && activeBtn) {
    const parentRect = langToggle.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    const offset = btnRect.left - parentRect.left;
    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${offset}px)`;
  }

  const idBtn = langToggle.querySelector('.lang-btn[data-lang="id"]');
  const enBtn = langToggle.querySelector('.lang-btn[data-lang="en"]');
  if (idBtn) idBtn.textContent = t("language.id");
  if (enBtn) enBtn.textContent = t("language.en");
}

function resetTypingEffect() {
  if (typeTimer) window.clearTimeout(typeTimer);
  typingState = { wordIndex: 0, charIndex: 0, deleting: false };
  if (typingText) typingText.textContent = "";
  runTypingEffect();
}

function runTypingEffect() {
  if (!typingText) return;
  const words = t("hero.typing");
  const currentWord = words[typingState.wordIndex] || "";

  if (!typingState.deleting) {
    typingText.textContent = currentWord.substring(0, typingState.charIndex + 1);
    typingState.charIndex += 1;

    if (typingState.charIndex === currentWord.length) {
      typingState.deleting = true;
      typeTimer = window.setTimeout(runTypingEffect, 1000);
      return;
    }
  } else {
    typingText.textContent = currentWord.substring(0, Math.max(0, typingState.charIndex - 1));
    typingState.charIndex -= 1;

    if (typingState.charIndex <= 0) {
      typingState.deleting = false;
      typingState.wordIndex = (typingState.wordIndex + 1) % words.length;
      typingState.charIndex = 0;
    }
  }

  typeTimer = window.setTimeout(runTypingEffect, typingState.deleting ? 48 : 92);
}

function animateCounter(element, target, delay = 0) {
  if (!element) return;

  const numericTarget = Math.max(0, Math.floor(Number(target) || 0));
  const targetText = String(numericTarget);
  const digitCount = Math.max(1, targetText.length);

  if (prefersReducedMotion || numericTarget === 0) {
    element.textContent = targetText;
    return;
  }

  const duration = 1200;
  const scrambleEnd = 0.64;
  const start = performance.now() + delay;

  function randomDigits() {
    let result = "";
    for (let index = 0; index < digitCount; index += 1) {
      result += String(Math.floor(Math.random() * 10));
    }
    return result;
  }

  function tick(now) {
    if (now < start) {
      requestAnimationFrame(tick);
      return;
    }

    const progress = Math.min((now - start) / duration, 1);
    let display = targetText;

    if (progress < scrambleEnd) {
      const revealCount = Math.max(0, Math.floor((progress / scrambleEnd) * digitCount));
      const fixedStart = digitCount - revealCount;
      const scrambled = targetText
        .split("")
        .map((digit, index) => (index < fixedStart ? String(Math.floor(Math.random() * 10)) : digit))
        .join("");

      display = scrambled === targetText ? randomDigits() : scrambled;
    } else {
      const local = (progress - scrambleEnd) / (1 - scrambleEnd);
      const eased = 1 - Math.pow(1 - local, 3);
      display = String(Math.floor(numericTarget * eased)).padStart(digitCount, "0");
      if (progress >= 1) display = targetText;
    }

    element.textContent = display;

    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 },
);

function observeReveals(scope = document) {
  scope.querySelectorAll(".reveal:not(.revealed)").forEach((el) => revealObserver.observe(el));
}

function createTagList(tags = [], limit = 3) {
  const visible = tags.slice(0, limit);
  const extra = tags.length - visible.length;
  return `
    <div class="project-tech">
      ${visible.map((tag) => `<span>${tag}</span>`).join("")}
      ${extra > 0 ? `<span class="tag-more">+${extra}</span>` : ""}
    </div>
  `;
}

function createProjectCard(project, compact = true) {
  const summaryClass = compact ? "project-summary" : "project-summary project-summary-full";
  const demoDisabled = !project.demoUrl || project.demoUrl === "#";

  return `
    <article class="project-card reveal" data-project-id="${project.id}">
      <div class="project-preview">
        <img src="${project.image}" alt="${project.title}" loading="lazy" />
        ${project.pinned ? '<div class="project-badge">Pinned</div>' : ""}
      </div>
      <div class="project-content">
        <div class="project-title-row">
          <h3>${project.title}</h3>
        </div>
        <p class="${summaryClass}">${localize(project.summary)}</p>
        ${createTagList(project.tags, compact ? 3 : 4)}
        <div class="project-buttons">
          ${
            demoDisabled
              ? `<button type="button" class="btn btn-primary btn-disabled" disabled>${t("projects.comingSoon")}</button>`
              : `<a href="${project.demoUrl}" class="btn btn-primary">${t("projects.demo")}</a>`
          }
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">${t("projects.github")}</a>
        </div>
      </div>
    </article>
  `;
}

function createMoreCard() {
  return `
    <button class="project-more-card reveal" type="button" id="project-more-trigger" aria-label="${t("projects.moreTitle")}">
      <span class="project-more-arrow" aria-hidden="true"><span>&lt;</span></span>
      <span class="project-more-title">${t("projects.moreTitle")}</span>
    </button>
  `;
}

function sortProjects(list) {
  return [...list].sort((a, b) => {
    const pinDiff = Number(b.pinned) - Number(a.pinned);
    if (pinDiff !== 0) return pinDiff;
    return Number(b.order || 0) - Number(a.order || 0);
  });
}

function renderProjects() {
  if (!projectGrid) return;

  const sorted = sortProjects(projectData);
  currentSortedProjects = sorted;
  const featured = sorted.slice(0, 2);
  const hasMore = sorted.length > 2;

  projectGrid.innerHTML = `
    ${featured.map((project) => createProjectCard(project, true)).join("")}
    ${hasMore ? createMoreCard() : ""}
  `;

  const moreTrigger = document.getElementById("project-more-trigger");
  if (moreTrigger) {
    moreTrigger.addEventListener("click", () => openProjectModal(currentSortedProjects));
  }

  bindProjectMouseMove(projectGrid);
  observeReveals(projectGrid);
}

function renderProjectModal(sortedProjects) {
  if (!projectModalGrid) return;
  projectModalGrid.innerHTML = sortedProjects.map((project) => createProjectCard(project, false)).join("");
  bindProjectMouseMove(projectModalGrid);
  observeReveals(projectModalGrid);
}

function openProjectModal(sortedProjects) {
  if (!projectModal) return;
  renderProjectModal(sortedProjects);
  projectModal.classList.add("show");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("show");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function renderCareerTimeline() {
  const careerTimeline = document.getElementById("career-timeline");
  if (!careerTimeline) return;

  careerTimeline.innerHTML = careerData
    .map((item, index) => {
      const sideClass = index % 2 === 0 ? "career-entry left" : "career-entry right";
      return `
        <article class="${sideClass} reveal">
          <div class="career-marker" aria-hidden="true"></div>
          <div class="career-card">
            <span class="career-year">${item.period}</span>
            <h3>${localize(item.title)}</h3>
            <p>${localize(item.summary)}</p>
          </div>
        </article>
      `;
    })
    .join("");

  observeReveals(careerTimeline);
}



function getStatValues() {
  const currentYear = new Date().getFullYear();
  const yearsLearning = Math.max(0, currentYear - 2023);

  return {
    projects: projectData.length,
    awards: 2,
    years: yearsLearning,
    portfolioYear: currentYear,
  };
}

function renderStats() {
  const values = getStatValues();

  Object.entries(values).forEach(([key, value]) => {
    const el = statsTargets[key];
    if (!el) return;

    el.dataset.target = String(value);
    el.textContent = statsAnimated ? String(value) : "0";
  });
}

function playStatsAnimation() {
  if (statsAnimated) return;
  statsAnimated = true;

  const values = getStatValues();
  Object.entries(values).forEach(([key, value], index) => {
    const el = statsTargets[key];
    if (el) animateCounter(el, value, index * 140);
  });
}

function observeStats() {
  if (!statsSection || statsObserver || typeof IntersectionObserver === "undefined") return;

  statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playStatsAnimation();
          statsObserver.disconnect();
          statsObserver = null;
        }
      });
    },
    {
      threshold: 0.35,
      rootMargin: "0px 0px -10% 0px",
    },
  );

  statsObserver.observe(statsSection);
}

function bindProjectMouseMove(container) {
  if (!container) return;
  container.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".project-card");
    if (!card || !container.contains(card)) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
}

const heroImage = document.querySelector(".profile-card");
let heroRafId = null;
window.addEventListener("mousemove", (e) => {
  if (!heroImage || window.innerWidth < 992) return;
  if (heroRafId) cancelAnimationFrame(heroRafId);
  heroRafId = requestAnimationFrame(() => {
    const x = (window.innerWidth / 2 - e.clientX) / 70;
    const y = (window.innerHeight / 2 - e.clientY) / 70;
    heroImage.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
});

window.addEventListener("mouseleave", () => {
  if (heroImage) heroImage.style.transform = "";
});

menuBtn?.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  const icon = menuBtn.querySelector("i");
  if (!icon) return;
  if (navMenu.classList.contains("show")) icon.classList.replace("ri-menu-line", "ri-close-line");
  else icon.classList.replace("ri-close-line", "ri-menu-line");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    const icon = menuBtn?.querySelector("i");
    if (icon) icon.classList.replace("ri-close-line", "ri-menu-line");
  });
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scroll", window.scrollY > 50);
});

function activeMenu() {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 160;
    const sectionHeight = section.offsetHeight;
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}
window.addEventListener("scroll", activeMenu);
activeMenu();

const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
setBodyTheme(savedTheme || "dark");

themeBtn?.addEventListener("click", () => {
  animateThemeToggle();
  const nextTheme = document.body.classList.contains("light") ? "dark" : "light";
  setBodyTheme(nextTheme);
});

langToggle?.addEventListener("click", (event) => {
  const button = event.target instanceof HTMLElement ? event.target.closest(".lang-btn") : null;
  if (!button) return;
  const nextLang = button.dataset.lang || "en";
  if (nextLang === currentLang) return;
  setLanguage(nextLang);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProjectModal();
});

projectModal?.addEventListener("click", (event) => {
  const target = event.target;
  if (target instanceof HTMLElement && target.closest("[data-modal-close]")) {
    closeProjectModal();
  }
});

window.addEventListener("resize", syncLanguageToggle);

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

setLanguage(currentLang);
syncLanguageToggle();
renderProjects();
renderCareerTimeline();
renderStats();
observeStats();
observeReveals();

if (footer) {
  footer.innerHTML = `© ${new Date().getFullYear()} Muhammad Haliq Maulana`;
}
