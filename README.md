# Muhammad Haliq Maulana — Portfolio 2026

Static HTML/CSS/JavaScript portfolio with an Apple-inspired glass interface, responsive layouts, anchored macOS Genie Motion panels, a dynamic project archive, and an OpenRouter-powered AI assistant.

## Project structure

- `index.html` — portfolio structure and SEO metadata.
- `assets/css/style.css` — design system, themes, responsive layout, Genie Motion panel styles, and timeline.
- `assets/css/chatbot.css` — AI assistant layout and motion.
- `assets/js/DataProject.js` — project data. Add or edit projects here.
- `assets/js/TechCarier.js` — journey timeline data.
- `assets/js/app.js` — language, theme, rendering, statistics, timeline, and shared Genie Motion controller.
- `assets/js/chatbot-*.js` — client-side chat interface and API request logic.
- `api/chat.js` — Vercel server-side function that securely calls OpenRouter. This file must be deployed with the site; it contains no API key.
- `.env.example` — safe environment-variable template.

## Configure OpenRouter on Vercel

1. Create or select an API key in your OpenRouter account.
2. Open the Vercel project → **Settings → Environment Variables**.
3. Add `OPENROUTER_API_KEY` as **Secret** and paste your key as the value. Never put the key in HTML, CSS, frontend JavaScript, or a committed file.
4. Add `OPENROUTER_MODEL` as **Config** with the value `deepseek/deepseek-chat`. The server also defaults to this model when the variable is omitted.
5. Optionally set `SITE_URL` to `https://haliqportfolio.vercel.app`.
6. Apply the variables to Production (and Preview if you want chatbot functionality on preview deployments), then redeploy.

The chatbot now uses the same default model ID as the supplied Laravel `OpenRouterService`: `deepseek/deepseek-chat`. The model can be changed later through the server-side `OPENROUTER_MODEL` variable without editing frontend code. OpenRouter currently lists this model as a paid endpoint; check the live model page for current pricing before using it at scale.

## Local development

The chatbot endpoint requires a serverless runtime. Do not open `index.html` directly with `file://` and expect the AI endpoint to work.

1. Install the Vercel CLI.
2. Copy `.env.example` to `.env.local`.
3. Put your own key in `.env.local` (the file is excluded by `.gitignore`).
4. Set `OPENROUTER_MODEL=deepseek/deepseek-chat` in `.env.local` (or leave it out to use the same server-side default).
5. Run `vercel dev` from the project root.

## Security notes

- `api/chat.js` runs server-side. The browser never receives the OpenRouter key.
- `.env.local` and other `.env.*` secret files are ignored by Git. The safe `.env.example` remains tracked.
- Keep `api/chat.js` in Git: it is the server endpoint Vercel must deploy. Ignoring that file would break the chatbot.
- The endpoint validates request size and message length, accepts only user/assistant history, checks same-origin browser requests, applies best-effort per-instance rate limiting, uses a timeout, and does not trust client-supplied portfolio context.
- Upstream OpenRouter errors are mapped to safe client error codes; sanitized provider status/details are written to Vercel Runtime Logs. API keys and bearer tokens are redacted from those log messages.
- Prompt-injection instructions are explicitly treated as untrusted input. No prompt-only design can guarantee that an LLM is impossible to jailbreak; use usage limits and provider budget controls as additional safeguards.
- The in-memory rate limiter is best-effort and is not a substitute for a persistent distributed rate limiter or WAF on a high-traffic public site.

## Add a project

Edit `assets/js/DataProject.js`. Add a new object to `window.PROJECT_DATA`, set `featured: true` to display it on the main page, and supply a real GitHub repository URL in `githubUrl`. The project count updates automatically from the array length. A project with a blank `githubUrl` displays an Add placeholder rather than a broken link.

## Update the timeline and current focus

Edit `assets/js/TechCarier.js` for timeline events. The completed/current/upcoming marker is calculated from each event's `start` and `end` dates. The three cards in the **Now** section are intentionally placeholders; edit their copy in `index.html` when the information is ready.

### Chatbot model routing

The default model is `deepseek/deepseek-chat`, matching the supplied Laravel service. `OPENROUTER_MODEL` can override it server-side. `OPENROUTER_API_KEY` remains a Secret and is never sent to the browser.
