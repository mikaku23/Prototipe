const MAX_MESSAGE_LENGTH = 1800;

export async function buildResponse(message, history = []) {
  const cleanMessage = String(message || "").trim();
  if (!cleanMessage) throw new Error("EMPTY_MESSAGE");
  if (cleanMessage.length > MAX_MESSAGE_LENGTH) throw new Error("MESSAGE_TOO_LONG");

  const endpoint = window.CHATBOT_CONFIG?.endpoint || "/api/chat";
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ message: cleanMessage, history: history.slice(-10) }),
    signal: AbortSignal.timeout ? AbortSignal.timeout(25000) : undefined
  });

  let payload = {};
  try { payload = await response.json(); } catch { /* The API may return a non-JSON proxy error. */ }
  if (!response.ok) {
    const error = new Error(payload.error || "CHAT_REQUEST_FAILED");
    error.status = response.status;
    throw error;
  }
  if (typeof payload.reply !== "string" || !payload.reply.trim()) throw new Error("EMPTY_AI_RESPONSE");
  return { reply: payload.reply.trim() };
}
