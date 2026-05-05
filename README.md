# VoteReady 🗳️

> A smart, beginner-friendly election guide for Indian first-time voters (18–25).

**Live Demo:** `https://voteready-frontend-xxxx-uc.a.run.app` *(replace after Cloud Run deploy)*

---

## What it does

- Step-by-step voting guide — from eligibility to ink mark
- AI assistant that remembers context and stays on topic (Indian elections only)
- Voter registration checker linked to ECI by state
- Mobile-first, fast, accessible

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | FastAPI (Python) |
| AI | OpenAI GPT-4o |
| Database | MongoDB Atlas |
| Deployment | Docker + Google Cloud Run |

## Local Setup

```bash
# 1. Clone
git clone https://github.com/yourname/voteready.git
cd voteready

# 2. Backend
cd backend
cp .env.example .env        # add your keys
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env.local  # set NEXT_PUBLIC_API_URL=http://localhost:8000
npm install
npm run dev
```

Open http://localhost:3000

## Docker (full stack)

```bash
docker-compose up --build
```

## Deploy to Cloud Run

```bash
# Build and push
gcloud builds submit --tag gcr.io/YOUR_PROJECT/voteready-backend ./backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/voteready-frontend ./frontend

# Deploy
gcloud run deploy voteready-backend \
  --image gcr.io/YOUR_PROJECT/voteready-backend \
  --set-env-vars OPENAI_API_KEY=sk-... \
  --allow-unauthenticated --region us-central1

gcloud run deploy voteready-frontend \
  --image gcr.io/YOUR_PROJECT/voteready-frontend \
  --set-env-vars NEXT_PUBLIC_API_URL=https://voteready-backend-xxxx-uc.a.run.app \
  --allow-unauthenticated --region us-central1
```

## Screenshots

*(Add 3 screenshots here before submission)*

## Team

Built in 8 hours for [Hackathon Name]
