import { buildResponse } from "./chatbot-engine.js";

export function initChatbot() {
  const floating = document.createElement("div");
  floating.id = "floating-chat";
  floating.innerHTML = `
    <button id="chat-toggle" aria-label="Buka chatbot" title="Chatbot">
      <img src="assets/images/chatbot.png" alt="chatbot" class="chat-logo" />
    </button>
  `;

  const botName =
    (window.CHATBOT_CONFIG && window.CHATBOT_CONFIG.botName) || "MHM Assistant";

  const popup = document.createElement("div");
  popup.id = "chat-popup";
  popup.setAttribute("role", "dialog");
  popup.setAttribute("aria-label", "Chatbot portofolio");
  popup.innerHTML = `
    <div class="chat-header">
      <div class="chat-title">
        <img src="assets/images/chatbot.png" alt="chatbot" class="chat-header-logo" />
        <div class="chat-title-text">
          <span class="chat-title-name">${botName}</span>
          <small>Ask about Haliq, projects, and more</small>
        </div>
      </div>
      <button id="chat-close" aria-label="Tutup chat">&times;</button>
    </div>

    <div id="chat-messages" class="chat-messages" aria-live="polite"></div>

    <form id="chat-form" class="chat-form" autocomplete="off">
      <input id="chat-input" type="text" placeholder="Tulis pertanyaan..." />
      <button id="chat-send" type="submit">Kirim</button>
    </form>
  `;

  document.body.appendChild(floating);
  document.body.appendChild(popup);

  const toggleBtn = document.getElementById("chat-toggle");
  const closeBtn = document.getElementById("chat-close");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const sendBtn = document.getElementById("chat-send");

  function scrollBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addMessage(text, type = "bot") {
    const el = document.createElement("div");
    el.className = `msg ${type}`;
    el.textContent = text;
    chatMessages.appendChild(el);
    requestAnimationFrame(() => el.classList.add("enter"));
    scrollBottom();
  }

  function addTyping() {
    const wrap = document.createElement("div");
    wrap.className = "typing-wrapper";
    wrap.innerHTML = `
      <div class="typing">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
    chatMessages.appendChild(wrap);
    requestAnimationFrame(() => {
      wrap.querySelector(".typing")?.classList.add("show");
    });
    scrollBottom();
    return wrap;
  }

  function removeNode(node) {
    if (!node) return;
    const typing = node.querySelector(".typing");
    if (typing) typing.classList.add("fade-out");
    setTimeout(() => node.remove(), 220);
  }

  function openChat() {
    popup.classList.add("ready");
    setTimeout(() => chatInput.focus(), 50);
  }

  function closeChat() {
    popup.classList.remove("ready");
    chatInput.blur();
  }

  async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    addMessage(text, "user");
    chatInput.value = "";
    sendBtn.disabled = true;

    const typing = addTyping();

    try {
      const result = await buildResponse(text);
      await new Promise((r) => setTimeout(r, 250));
      removeNode(typing);
      addMessage(result.reply, "bot");

      if (result.section) {
        const target = document.getElementById(result.section);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      console.error(error);
      removeNode(typing);
      addMessage("Terjadi kesalahan saat memproses pesan.", "bot");
    } finally {
      sendBtn.disabled = false;
    }
  }

  toggleBtn.addEventListener("click", () => {
    if (popup.classList.contains("ready")) closeChat();
    else openChat();
  });

  closeBtn.addEventListener("click", closeChat);

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    sendMessage();
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  addMessage("Halo. Ketik “bantuan” untuk melihat daftar topik..", "bot");
}
