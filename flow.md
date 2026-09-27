# VoteReady — flow map

## Runtime flow
1. `/` (`app/page.tsx`) landing → "Start the guide" → `/guide`.
2. `/guide` (`app/guide/page.tsx`) renders the 8 steps from a hard-coded `STEPS` array. Progress/expanded state is in React state only (resets on reload).
3. "Ask AI" opens `components/ChatWidget.tsx` (bottom sheet). It POSTs `{messages, current_step}` to `${NEXT_PUBLIC_API_URL}/chat`.
4. `backend/main.py` `/chat`: validates (roles user/assistant only, ≤40 msgs, ≤2000 chars each), drops the leading canned greeting, maps roles to Gemini (`assistant`→`model`), calls Gemini with the neutral system prompt + current step, and returns `{reply}`.
   - No key → 503. Gemini error → 502. The widget shows a "call 1950" fallback for any non-200 response.

## Directory map
- `app/` — Next.js App Router pages, `layout.tsx`, `globals.css` (all custom classes: glass, card, bottom-sheet, chat-*, animations)
- `components/ChatWidget.tsx` — chat UI
- `hooks/useSwipe.ts` — touch swipe handlers (used by the guide for step navigation)
- `backend/` — FastAPI app, `requirements.txt`, `test_main.py`, `.env.example`
- `render.yaml` — Render blueprint for the backend

## Conventions
- Env: frontend `NEXT_PUBLIC_API_URL`; backend `GEMINI_API_KEY`, `GEMINI_MODEL` (optional), `ALLOWED_ORIGINS` (comma-separated).
- Chat output is plain text (rendered with `white-space: pre-wrap`); the system prompt forbids Markdown.

## Current state (2026-09-27)
- Builds and runs locally; backend tests pass.
- Not yet deployed: needs a valid Gemini key and the Render + Vercel setup steps in the README.
- `GET /guide` in the backend duplicates the frontend's STEPS and is unused by the UI.
