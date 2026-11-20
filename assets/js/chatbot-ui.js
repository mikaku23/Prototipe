import { buildResponse } from "./chatbot-engine.js";

export function initChatbot() {
  if (document.getElementById("chat-popup")) return;

  const floating = document.createElement("div");
  floating.id = "floating-chat";
  floating.innerHTML = `
    <button id="chat-toggle" type="button" aria-label="Buka MHM AI" aria-expanded="false" aria-controls="chat-popup" title="MHM AI">
      <i class="ri-sparkling-2-line" aria-hidden="true"></i>
    </button>
  `;

  const popup = document.createElement("section");
  popup.id = "chat-popup";
  popup.className = "genie-panel";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-modal", "false");
  popup.setAttribute("aria-label", "MHM AI portfolio assistant");
  popup.setAttribute("aria-hidden", "true");
  popup.innerHTML = `
    <div class="chat-header">
      <div class="chat-brand">
        <span class="chat-brand-icon"><i class="ri-sparkling-2-line" aria-hidden="true"></i></span>
        <span class="chat-brand-copy"><strong class="chat-name">MHM AI</strong><small class="chat-subtitle">Asisten portofolio Muhammad Haliq</small></span>
      </div>
      <button class="chat-close" id="chat-close" type="button" aria-label="Tutup chatbot"><i class="ri-close-line" aria-hidden="true"></i></button>
    </div>
    <div class="chat-status-row"><span class="chat-status-dot"></span><span class="chat-status-label">AI assistant</span><span class="chat-status-separator"></span><span>OpenRouter API</span></div>
    <div class="chat-messages" id="chat-messages" aria-live="polite" aria-relevant="additions">
      <div class="chat-welcome" id="chat-welcome"><strong>Halo, saya MHM AI.</strong><br />Tanyakan profil, pendidikan, prestasi, proyek, teknologi yang digunakan, atau pertanyaan umum. Jawaban AI diproses melalui API server.</div>
    </div>
    <div class="chat-suggestions" id="chat-suggestions">
      <button class="chat-suggestion" type="button" data-prompt="Ceritakan profil dan latar belakang pendidikan Haliq.">Profil Haliq</button>
      <button class="chat-suggestion" type="button" data-prompt="Jelaskan TechNote App 2.0 dan fitur utamanya.">TechNote 2.0</button>
      <button class="chat-suggestion" type="button" data-prompt="Apa tujuan dan arsitektur utama Tracking Barang Kampus?">Tracking Barang</button>
    </div>
    <form class="chat-composer" id="chat-form" autocomplete="off">
      <textarea id="chat-input" rows="1" maxlength="1800" placeholder="Tulis pertanyaan..." aria-label="Tulis pertanyaan"></textarea>
      <button id="chat-send" type="submit" aria-label="Kirim pesan"><i class="ri-arrow-up-line" aria-hidden="true"></i></button>
    </form>
    <div class="chat-disclaimer" id="chat-disclaimer">Jangan kirim kata sandi, API key, atau informasi pribadi sensitif.</div>
  `;

  document.body.append(floating, popup);

  const toggle = document.getElementById("chat-toggle");
  const close = document.getElementById("chat-close");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");
  const messages = document.getElementById("chat-messages");
  const suggestions = document.getElementById("chat-suggestions");
  const history = [];
  let isSending = false;
  let triggerBeforeOpen = null;

  const copy = {
    id: {
      name: "MHM AI", subtitle: "Asisten portofolio Muhammad Haliq", welcome: "Halo, saya MHM AI.\nTanyakan profil, pendidikan, prestasi, proyek, teknologi yang digunakan, atau pertanyaan umum. Jawaban AI diproses melalui API server.", placeholder: "Tulis pertanyaan...", disclaimer: "Jangan kirim kata sandi, API key, atau informasi pribadi sensitif.", ready: "AI assistant", typing: "Sedang menyusun jawaban...", failed: "Chatbot belum dapat terhubung. Periksa konfigurasi API OpenRouter di environment Vercel.", limited: "Batas permintaan tercapai. Coba lagi sebentar lagi.", unavailable: "Layanan AI sedang tidak tersedia. Coba lagi nanti.", tooLong: "Pesan terlalu panjang. Maksimum 1.800 karakter.", suggestions: ["Profil Haliq", "TechNote 2.0", "Tracking Barang"]
    },
    en: {
      name: "MHM AI", subtitle: "Muhammad Haliq's portfolio assistant", welcome: "Hello, I'm MHM AI.\nAsk about the profile, education, achievements, projects, technologies, or general topics. AI responses are processed through the server API.", placeholder: "Ask a question...", disclaimer: "Do not send passwords, API keys, or sensitive personal information.", ready: "AI assistant", typing: "Preparing an answer...", failed: "The chatbot could not connect. Check the OpenRouter API environment configuration on Vercel.", limited: "Request limit reached. Please try again shortly.", unavailable: "The AI service is temporarily unavailable. Please try again later.", tooLong: "Your message is too long. Maximum length is 1,800 characters.", suggestions: ["Haliq's profile", "TechNote 2.0", "Campus tracking"]
    }
  };
  let activeLanguage = document.documentElement.lang === "en" ? "en" : "id";

  function updateLanguage(language) {
    activeLanguage = language === "en" ? "en" : "id";
    const labels = copy[activeLanguage];
    popup.querySelector(".chat-name").textContent = labels.name;
    popup.querySelector(".chat-subtitle").textContent = labels.subtitle;
    popup.querySelector(".chat-status-label").textContent = labels.ready;
    input.placeholder = labels.placeholder;
    input.setAttribute("aria-label", labels.placeholder);
    document.getElementById("chat-disclaimer").textContent = labels.disclaimer;
    const welcome = document.getElementById("chat-welcome");
    if (welcome && messages.children.length === 1) welcome.textContent = labels.welcome;
    [...suggestions.querySelectorAll(".chat-suggestion")].forEach((button, index) => {
      if (labels.suggestions[index]) button.textContent = labels.suggestions[index];
    });
  }

  function scrollToBottom() { messages.scrollTop = messages.scrollHeight; }

  function addMessage(content, role = "assistant", error = false) {
    const node = document.createElement("div");
    node.className = `chat-message ${role}${error ? " error" : ""}`;
    node.textContent = String(content);
    messages.appendChild(node);
    requestAnimationFrame(() => node.classList.add("is-visible"));
    scrollToBottom();
    return node;
  }

  function addTyping() {
    const node = document.createElement("div");
    node.className = "chat-typing";
    node.setAttribute("role", "status");
    node.setAttribute("aria-label", copy[activeLanguage].typing);
    node.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(node);
    scrollToBottom();
    return node;
  }

  function openChat() {
    triggerBeforeOpen = toggle;
    toggle.setAttribute("aria-expanded", "true");
    window.GenMotion?.open(popup, toggle);
    window.setTimeout(() => input.focus({ preventScroll: true }), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 190);
  }

  function closeChat() {
    toggle.setAttribute("aria-expanded", "false");
    input.blur();
    window.GenMotion?.close(popup, () => {
      triggerBeforeOpen?.focus?.({ preventScroll: true });
      triggerBeforeOpen = null;
    });
    if (!window.GenMotion) popup.classList.remove("is-visible", "is-open");
  }

  function errorMessage(error) {
    if (error?.status === 429) return copy[activeLanguage].limited;
    if (error?.status === 503 || error?.message === "CHAT_NOT_CONFIGURED") return copy[activeLanguage].failed;
    if (error?.message === "MESSAGE_TOO_LONG") return copy[activeLanguage].tooLong;
    return copy[activeLanguage].unavailable;
  }

  async function sendMessage(value = input.value) {
    const message = String(value || "").trim();
    if (!message || isSending) return;
    if (message.length > 1800) { addMessage(copy[activeLanguage].tooLong, "assistant", true); return; }

    isSending = true;
    send.disabled = true;
    input.value = "";
    input.style.height = "auto";
    suggestions.hidden = true;
    addMessage(message, "user");
    const priorHistory = history.slice(-10);
    history.push({ role: "user", content: message });
    const typing = addTyping();

    try {
      const result = await buildResponse(message, priorHistory);
      typing.remove();
      addMessage(result.reply, "assistant");
      history.push({ role: "assistant", content: result.reply });
      while (history.length > 12) history.shift();
    } catch (error) {
      typing.remove();
      addMessage(errorMessage(error), "assistant", true);
      history.pop();
    } finally {
      isSending = false;
      send.disabled = false;
      input.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener("click", () => {
    if (popup.classList.contains("is-open")) closeChat();
    else openChat();
  });
  close.addEventListener("click", closeChat);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage();
  });
  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
  });
  suggestions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prompt]");
    if (button) sendMessage(button.dataset.prompt);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && popup.classList.contains("is-open")) closeChat();
  });
  window.addEventListener("portfolio:languagechange", (event) => updateLanguage(event.detail?.language));
  updateLanguage(activeLanguage);
}
