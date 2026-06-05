const menuBtn = document.getElementById("menu-btn");
const navMenu = document.getElementById("nav-menu");
const header = document.getElementById("header");
const themeBtn = document.getElementById("theme-toggle");
const typingText = document.getElementById("typing-text");
const footer = document.querySelector(".footer p");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-list a");
const revealElements = document.querySelectorAll(
  ".reveal, .about-card, .achievement-card, .project-card, .career-item, .stat-card, .contact-card",
);

menuBtn?.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  const icon = menuBtn.querySelector("i");
  if (navMenu.classList.contains("show")) {
    icon.classList.replace("ri-menu-line", "ri-close-line");
  } else {
    icon.classList.replace("ri-close-line", "ri-menu-line");
  }
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
    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${current}`,
    );
  });
}
window.addEventListener("scroll", activeMenu);

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
  document.body.classList.add("light");
  themeBtn.innerHTML = '<i class="ri-sun-line"></i>';
}

themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeBtn.innerHTML = isLight
    ? '<i class="ri-sun-line"></i>'
    : '<i class="ri-moon-line"></i>';
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

const words = [
  "Laravel Developer",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Learner",
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  if (!typingText) return;
  const currentWord = words[wordIndex];

  if (!deleting) {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeEffect, 1400);
      return;
    }
  } else {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, deleting ? 52 : 92);
}
typeEffect();

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

revealElements.forEach((el) => revealObserver.observe(el));

function animateCounter(element, target) {
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    element.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(tick);
    else element.textContent = target;
  }

  requestAnimationFrame(tick);
}

document.querySelectorAll("[data-counter]").forEach((counter) => {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(counter, Number(counter.dataset.counter));
          obs.unobserve(counter);
        }
      });
    },
    { threshold: 0.7 },
  );

  observer.observe(counter);
});

const heroImage = document.querySelector(".profile-card");
let rafId = null;

window.addEventListener("mousemove", (e) => {
  if (!heroImage || window.innerWidth < 992) return;

  if (rafId) cancelAnimationFrame(rafId);

  rafId = requestAnimationFrame(() => {
    const x = (window.innerWidth / 2 - e.clientX) / 70;
    const y = (window.innerHeight / 2 - e.clientY) / 70;
    heroImage.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
});

document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });
});

window.addEventListener("mouseleave", () => {
  if (heroImage) heroImage.style.transform = "";
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

if (footer) {
  footer.innerHTML = `© ${new Date().getFullYear()} Muhammad Haliq Maulana`;
}
