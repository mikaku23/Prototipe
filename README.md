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
3. Add `OPENROUTER_API_KEY` and paste your key as the value. Do not put the key in HTML, CSS, frontend JavaScript, or a committed file.
4. Add `OPENROUTER_MODEL` with `deepseek/deepseek-chat:free` to start with the DeepSeek free endpoint. You can change this value later to another model ID available in OpenRouter.
5. Redeploy the project so the function receives the environment variables.

The DeepSeek free endpoint is currently listed as free by OpenRouter, but it is an older DeepSeek V3 endpoint and free variants are rate-limited (OpenRouter currently documents 20 requests/minute and 50 requests/day for free variants under the default tier). Free model availability, quotas, and identifiers can change. The selected model is configurable through `OPENROUTER_MODEL`.

## Local development

The chatbot endpoint requires a serverless runtime. Do not open `index.html` directly with `file://` and expect the AI endpoint to work.

1. Install the Vercel CLI.
2. Copy `.env.example` to `.env.local`.
3. Put your own key in `.env.local` (the file is excluded by `.gitignore`).
4. Run `vercel dev` from the project root.

## Security notes

- `api/chat.js` runs server-side. The browser never receives the OpenRouter key.
- `.env.local` and other `.env.*` secret files are ignored by Git. The safe `.env.example` remains tracked.
- Keep `api/chat.js` in Git: it is the server endpoint Vercel must deploy. Ignoring that file would break the chatbot.
- The endpoint validates request size and message length, accepts only user/assistant history, checks same-origin browser requests, applies best-effort per-instance rate limiting, uses a timeout, and does not trust client-supplied portfolio context.
- Prompt-injection instructions are explicitly treated as untrusted input. No prompt-only design can guarantee that an LLM is impossible to jailbreak; use usage limits and provider budget controls as additional safeguards.
- The in-memory rate limiter is best-effort and is not a substitute for a persistent distributed rate limiter or WAF on a high-traffic public site.

## Add a project

Edit `assets/js/DataProject.js`. Add a new object to `window.PROJECT_DATA`, set `featured: true` to display it on the main page, and supply a real GitHub repository URL in `githubUrl`. The project count updates automatically from the array length. A project with a blank `githubUrl` displays an Add placeholder rather than a broken link.

## Update the timeline and current focus

Edit `assets/js/TechCarier.js` for timeline events. The completed/current/upcoming marker is calculated from each event's `start` and `end` dates. The three cards in the **Now** section are intentionally placeholders; edit their copy in `index.html` when the information is ready.
