import { KB } from "./chatbot-data.js";

function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’`]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(text = "") {
  const n = normalize(text);
  return n ? n.split(" ") : [];
}

function includesAny(text, list) {
  return list.some((item) => text.includes(item));
}

function weightedScore(text, list) {
  let score = 0;
  for (const item of list) {
    if (text.includes(item)) {
      score += Math.max(1, Math.min(5, item.length / 4));
    }
  }
  return score;
}

function tokenOverlapScore(text, list) {
  const textTokens = new Set(tokens(text));
  let score = 0;
  for (const phrase of list) {
    const phraseTokens = tokens(phrase);
    if (!phraseTokens.length) continue;
    const hit = phraseTokens.every((t) => textTokens.has(t));
    if (hit) score += Math.max(1.2, phraseTokens.length);
  }
  return score;
}

function editDistance(a, b) {
  const s1 = normalize(a);
  const s2 = normalize(b);
  const m = s1.length;
  const n = s2.length;
  if (!m) return n;
  if (!n) return m;

  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

function fuzzyContains(text, term, maxDistance = 1) {
  const nText = normalize(text);
  const nTerm = normalize(term);
  if (!nText || !nTerm) return false;
  if (nText.includes(nTerm)) return true;

  const textTokens = tokens(text);
  if (
    textTokens.some(
      (t) =>
        Math.abs(t.length - nTerm.length) <= 2 &&
        editDistance(t, nTerm) <= maxDistance,
    )
  ) {
    return true;
  }

  if (nTerm.length <= 4) {
    return textTokens.some((t) => t.startsWith(nTerm) || nTerm.startsWith(t));
  }

  return false;
}

function withBullets(items) {
  return items.map((item) => `- ${item}`).join("\n");
}

function chooseBestCategory(candidates) {
  return candidates.sort((a, b) => b.score - a.score)[0] || null;
}

const PROFILE_ALIASES = [
  "haliq",
  "muhammad haliq",
  "muhammad haliq maulana",
  "haliq maulana",
  "maulana",
  "mhm",
  "mikaku23",
  "mikaku",
  "miku23",
  "miku",
  "hliq",
  "haliqksp",
  "mhm assistant",
];

const INTENTS = {
  profile: [
    "siapa haliq",
    "haliq itu siapa",
    "siapa muhammad haliq",
    "siapa muhammad haliq maulana",
    "profil haliq",
    "profil mhm",
    "profil mikaku23",
    "tentang haliq",
    "tentang kamu",
    "siapa kamu",
    "nama lengkap",
    "nama panggilan",
    "nama asli",
    "identitas",
    "perkenalan",
    "bio",
    "biografi",
    "about me",
    "who is haliq",
    "who is mhm",
    "who is mikaku23",
    ...PROFILE_ALIASES,
  ],
  school: [
    "sekolah",
    "smkn 1 karang baru",
    "smk negeri 1 karang baru",
    "smkn",
    "alamat sekolah",
    "jurusan",
    "rpl",
    "pplg",
    "pembelajaran",
    "visi",
    "misi",
    "fasilitas",
    "kontak sekolah",
    "email sekolah",
    "telepon sekolah",
    "siswa",
    "kompetensi keahlian",
  ],
  achievements: [
    "prestasi",
    "achievement",
    "award",
    "juara",
    "medali",
    "medallion",
    "lks",
    "lksn",
    "provinsi",
    "provincial",
    "nasional",
    "national",
    "penghargaan",
    "pencapaian",
    "winner",
    "champion",
    "1st place",
  ],
  projects: [
    "project",
    "projects",
    "proyek",
    "portofolio",
    "portfolio",
    "aplikasi",
    "tech note",
    "technote",
    "technote app",
    "technote app 1 0",
    "technote app 2 0",
    "absensi",
    "storage",
    "perpustakaan",
    "library",
    "demo",
    "github",
    "source code",
    "web",
  ],
  contact: [
    "kontak",
    "contact",
    "hubungi",
    "reach",
    "email",
    "instagram",
    "ig",
    "github",
    "wa",
    "whatsapp",
    "telegram",
  ],
  career: [
    "career",
    "karier",
    "experience",
    "pengalaman",
    "timeline",
    "riwayat",
    "perjalanan",
    "internship",
    "magang",
    "technote app development",
    "web development",
    "laravel",
    "computer fundamentals",
  ],
  stack: [
    "stack",
    "tech stack",
    "teknologi",
    "tools",
    "bahasa pemrograman",
    "framework",
    "php",
    "laravel",
    "mysql",
    "javascript",
    "bootstrap",
    "api",
    "git",
    "github",
    "chart js",
    "chartjs",
  ],
};

function profileReply() {
  return [
    `Muhammad Haliq Maulana, juga dikenal sebagai Mikaku23 dan MHM.`,
    `Saya adalah siswa Software Engineering (RPL) di SMKN 1 Karang Baru.`,
    `Fokus utama saya: Laravel Developer, Web Developer, dan pengembangan sistem berbasis web.`,
    `Kalau kamu tanya “siapa Haliq”, “Haliq itu siapa”, “profil Haliq”, “MHM”, atau “Mikaku23”, aku akan arahkan ke profil ini.`,
  ].join("\n");
}

function schoolReply() {
  return [
    `${KB.school.name}`,
    `Didirikan: ${KB.school.founded}`,
    `Alamat: ${KB.school.address}`,
    `Telepon: ${KB.school.phone}`,
    `Email: ${KB.school.email}`,
    `Visi: ${KB.school.vision}`,
    `Misi:\n${withBullets(KB.school.mission)}`,
    `Jurusan: ${KB.school.major}`,
  ].join("\n\n");
}

function achievementReply() {
  return `Prestasi yang tercatat saat ini:\n${withBullets(KB.achievements)}`;
}

function projectReply() {
  return `Proyek utama:\n${KB.projects.map((p) => `- ${p.name}: ${p.desc}`).join("\n")}`;
}

function contactReply() {
  return [
    `Kontak tersedia:`,
    `GitHub: ${KB.contact.github}`,
    `Email: ${KB.contact.email}`,
    `Instagram: ${KB.contact.instagram}`,
  ].join("\n");
}

function careerReply() {
  return [
    "Ringkasan perjalanan karier:",
    "- July 2023 – June 2024: Computer Fundamentals",
    "- July 2024 – June 2025: Web Development & Laravel",
    "- August 2025 – December 2025: Internship at STMIK Triguna Dharma",
    "- January 2026 – March 2026: TechNote App Development",
    "- June 2026 – July 2026: TechNote App 2.0 Development",
  ].join("\n");
}

function stackReply() {
  return [
    "Tech stack yang dipakai:",
    "- HTML",
    "- CSS",
    "- JavaScript",
    "- PHP",
    "- Laravel",
    "- MySQL",
    "- API",
    "- Bootstrap",
    "- Git",
    "- GitHub",
  ].join("\n");
}

function helpReply() {
  return [
    "Topik yang bisa ditanya:",
    "- profil / Haliq / Mikaku23 / MHM",
    "- sekolah / SMKN 1 Karang Baru",
    "- prestasi / LKS / medallion",
    "- proyek / TechNote / absensi / storage / perpustakaan",
    "- pengalaman / karier / timeline",
    "- kontak / email / Instagram / GitHub",
    "- tech stack / Laravel / PHP / MySQL",
  ].join("\n");
}

function greetReply() {
  return "Halo. Aku siap bantu jawab tentang profil Haliq, sekolah, prestasi, proyek, pengalaman, tech stack, dan kontak. Ketik “bantuan” untuk daftar topik.";
}

function categorize(text) {
  const clean = normalize(text);

  const categories = [
    {
      key: "profile",
      score:
        (looksLikeProfileQuestion(clean) ? 10 : 0) +
        weightedScore(clean, INTENTS.profile) +
        tokenOverlapScore(clean, [
          "muhammad haliq maulana",
          "muhammad haliq",
          "haliq maulana",
          "siapa haliq",
        ]) +
        (fuzzyContains(clean, "haliq", 1) ? 6 : 0) +
        (fuzzyContains(clean, "mhm", 0) ? 5 : 0) +
        (fuzzyContains(clean, "mikaku23", 1) ? 5 : 0) +
        (fuzzyContains(clean, "maulana", 1) ? 2 : 0),
    },
    {
      key: "school",
      score:
        weightedScore(clean, INTENTS.school) +
        tokenOverlapScore(clean, [
          "smkn 1 karang baru",
          "smk negeri 1 karang baru",
          "jurusan rpl",
          "visi misi",
        ]) +
        (clean === "sekolah" ? 5 : 0) +
        (clean.includes("sekolah") ? 2 : 0),
    },
    {
      key: "achievements",
      score:
        weightedScore(clean, INTENTS.achievements) +
        tokenOverlapScore(clean, [
          "provincial champion",
          "medallion of excellence",
          "lks nasional",
          "lksn 2025",
        ]) +
        (clean === "prestasi" ? 5 : 0) +
        (clean.includes("prestasi") ? 2 : 0),
    },
    {
      key: "projects",
      score:
        weightedScore(clean, INTENTS.projects) +
        tokenOverlapScore(clean, [
          "technote app 2 0",
          "technote app 1 0",
          "absensi siswa",
          "storage barang",
          "website perpustakaan",
        ]) +
        (clean === "proyek" || clean === "project" ? 5 : 0),
    },
    {
      key: "contact",
      score:
        weightedScore(clean, INTENTS.contact) +
        tokenOverlapScore(clean, ["github", "instagram", "email"]) +
        (clean === "kontak" || clean === "contact" ? 5 : 0),
    },
    {
      key: "career",
      score:
        weightedScore(clean, INTENTS.career) +
        tokenOverlapScore(clean, [
          "technote app development",
          "web development laravel",
        ]) +
        (clean === "pengalaman" || clean === "career" ? 4 : 0),
    },
    {
      key: "stack",
      score:
        weightedScore(clean, INTENTS.stack) +
        tokenOverlapScore(clean, ["tech stack", "laravel mysql javascript"]) +
        (clean === "tech stack" ? 4 : 0),
    },
  ];

  return chooseBestCategory(categories);
}

function looksLikeProfileQuestion(text) {
  const clean = normalize(text);

  const questionPatterns = [
    "siapa",
    "siapa itu",
    "itu siapa",
    "siapakah",
    "profil",
    "profile",
    "about",
    "tentang",
    "bio",
    "biografi",
    "perkenalan",
    "nama",
    "nama lengkap",
    "nama asli",
  ];

  const hasAlias = PROFILE_ALIASES.some((alias) =>
    fuzzyContains(clean, alias, 1),
  );
  const hasQuestionWord = questionPatterns.some((q) => clean.includes(q));
  const hasProfileTarget =
    clean.includes("haliq") ||
    clean.includes("mhm") ||
    clean.includes("mikaku23") ||
    clean.includes("muhammad haliq") ||
    clean.includes("muhammad haliq maulana");

  if (hasAlias && hasQuestionWord) return true;

  if (
    hasProfileTarget &&
    (clean.startsWith("siapa") ||
      clean.startsWith("profil") ||
      clean.startsWith("tentang") ||
      clean.startsWith("bio") ||
      clean.startsWith("nama"))
  ) {
    return true;
  }

  return false;
}

function smallTalkReply(text) {
  if (includesAny(text, ["terima kasih", "makasih", "thanks", "thx"])) {
    return "Sama-sama. Kalau mau, tanya saja topik lain seperti profil, prestasi, proyek, atau kontak.";
  }

  if (
    includesAny(text, [
      "halo",
      "hai",
      "hello",
      "hi",
      "assalamualaikum",
      "pagi",
      "siang",
      "sore",
      "malam",
    ])
  ) {
    return greetReply();
  }

  if (includesAny(text, ["siapa kamu", "nama kamu", "nama bot", "siapa bot"])) {
    return `Namaku ${KB.botName}. Aku dipakai sebagai asisten portofolio untuk menjawab data Haliq.`;
  }

  return null;
}

function localReply(input) {
  const text = normalize(input);

  const smallTalk = smallTalkReply(text);
  if (smallTalk) {
    return { reply: smallTalk, section: null };
  }

  if (
    includesAny(text, [
      "bantuan",
      "menu",
      "fitur",
      "apa yang bisa",
      "bisa apa",
      "help",
      "topik",
    ])
  ) {
    return { reply: helpReply(), section: null };
  }

  const best = categorize(text);

  if (best && best.score >= 2.5) {
    switch (best.key) {
      case "profile":
        return { reply: profileReply(), section: "about" };
      case "school":
        return { reply: schoolReply(), section: "about" };
      case "achievements":
        return { reply: achievementReply(), section: "achievements" };
      case "projects":
        return { reply: projectReply(), section: "projects" };
      case "contact":
        return { reply: contactReply(), section: "contact" };
      case "career":
        return { reply: careerReply(), section: "experience" };
      case "stack":
        return { reply: stackReply(), section: "about" };
      default:
        break;
    }
  }

  if (
    includesAny(text, [
      "haliq",
      "muhammad haliq",
      "muhammad haliq maulana",
      "mikaku23",
      "mhm",
      "hliq",
      "profile",
      "profil",
      "sekolah",
      "prestasi",
    ])
  ) {
    if (includesAny(text, ["profile", "profil", "siapa", "tentang"])) {
      return { reply: profileReply(), section: "about" };
    }
    if (includesAny(text, ["sekolah"])) {
      return { reply: schoolReply(), section: "about" };
    }
    if (includesAny(text, ["prestasi"])) {
      return { reply: achievementReply(), section: "achievements" };
    }
  }

  return {
    reply:
      "Aku belum yakin maksudnya ke topik mana. Coba pakai kata kunci ini: Haliq / profil, sekolah, prestasi, proyek, pengalaman, tech stack, atau kontak.",
    section: null,
  };
}

async function callProxy(message) {
  const cfg = window.CHATBOT_CONFIG || {};
  if (!cfg.useOpenRouter || !cfg.proxyUrl) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(cfg.proxyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        context: KB,
      }),
      signal: controller.signal,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Proxy error");

    return {
      reply: data.reply || "",
      section: data.section || null,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function buildResponse(message) {
  try {
    const remote = await callProxy(message);
    if (remote?.reply) return remote;
  } catch (err) {
    console.error("OpenRouter proxy gagal, fallback ke lokal:", err);
  }

  return localReply(message);
}
