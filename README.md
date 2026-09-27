# VoteReady 🗳️

> A beginner-friendly, politically neutral election guide for first-time Indian voters (18–25).

**Live demo:** _add your Vercel URL here after deploying_

## What it does

- 8-step voting guide, from eligibility to the ink mark, with progress tracking
- AI assistant (Gemini) that knows which step you're on and stays strictly neutral and on topic
- Direct links to the official ECI portals (registration, e-EPIC, booth search, candidate affidavits)
- Mobile-first: swipe between steps, bottom-sheet chat

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15 (App Router) + Tailwind CSS — deployed on **Vercel** |
| Backend | FastAPI (Python) — deployed on **Render** |
| AI | Google Gemini 2.5 Flash (`google-genai`) |

## Local setup

```bash
# Backend (terminal 1)
cd backend
python -m venv .venv && .venv/Scripts/activate   # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env                              # add GEMINI_API_KEY from https://aistudio.google.com/apikey
uvicorn main:app --reload --port 8000

# Frontend (terminal 2, repo root)
cp .env.example .env.local                        # NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Open http://localhost:3000. Backend tests: `cd backend && python test_main.py`.

## Deploy

**1. Backend → Render**
1. Render dashboard → **New → Blueprint** → pick this repo (it reads `render.yaml`).
2. Set `GEMINI_API_KEY`. Set `ALLOWED_ORIGINS` to `*` for now.
3. Deploy, then copy the URL (e.g. `https://voteready-backend.onrender.com`) and check `/health`.

**2. Frontend → Vercel**
1. Vercel → **Add New Project** → import this repo (Next.js is auto-detected, root directory `./`).
2. Add env var `NEXT_PUBLIC_API_URL` = your Render URL (no trailing slash).
3. Deploy.

**3. Lock CORS:** back on Render, set `ALLOWED_ORIGINS` to your Vercel URL and redeploy.

> Render's free tier sleeps after ~15 min idle, so the first chat message after a pause can take ~30–50 s.

## Screenshots

_Add screenshots here._

## Disclaimer

Not affiliated with the Election Commission of India. Always verify at [voters.eci.gov.in](https://voters.eci.gov.in) or call the voter helpline **1950**.
