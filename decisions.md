# Decisions

## 2026-09-27 — Make the uploaded repo runnable and deployable
- **Gemini instead of OpenAI GPT-4o.** The free tier fits a portfolio demo, and it's the same SDK/model (`google-genai`, `gemini-2.5-flash`) as EventHub/real-estate-portal. `thinking_budget=0` because 2.5-flash's default thinking eats the output-token budget and FAQ answers don't need it.
- **Vercel (frontend) + Render (backend)** (user's choice). No Docker: Render builds Python natively from `render.yaml`. Removed `deploy.sh`/`docker-compose.yml` (Cloud Run, referenced non-existent `./backend` and `./frontend` Docker builds).
- **Frontend stays at repo root** (Vercel's default), backend moves to `backend/`. This is the smallest restructure.
- **Removed MongoDB from the docs.** Nothing ever used it.
- **Backend validation at the trust boundary:** roles limited to `user`/`assistant` (blocks injecting a `system` turn), and message count/length capped (limits cost abuse on a public endpoint). CORS is locked via `ALLOWED_ORIGINS`.
- **Leading assistant messages are dropped before calling Gemini**, because the UI's greeting is the first message and Gemini expects the conversation to start with a user turn.
- **Removed the whole-sheet swipe-down-to-close in ChatWidget.** It fired when scrolling up through chat history on phones. The drag handle still closes it.
- **Plain-text replies:** the chat doesn't render Markdown, so the prompt asks for plain text instead of adding a Markdown renderer dependency.
- `.env.local` untracked. It only held a public URL, but env files shouldn't live in git.
