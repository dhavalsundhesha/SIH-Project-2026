<<<<<<< HEAD
# DHAROHAR — Bharat Guardian

Full-stack educational game platform: explore Indian states, collect artifacts,
play quizzes and missions, read history stories, and chat with the Mittu AI guide.

## Stack
- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **AI service:** Python FastAPI + Cloud AI (Anthropic Claude) — powers Mittu AI chat

## Project structure
```
dharohar/
├── backend/       Express API + MongoDB models
├── ai-service/    FastAPI microservice (Mittu AI chat)
└── frontend/      Next.js app (all pages: auth, guardian select, explore,
                   museum, quiz, missions, stories, Mittu AI, awards)
```

## 1. AI service (start first)
```bash
cd ai-service
python3 -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # fill in CLOUD_AI_API_KEY
uvicorn main:app --reload --port 8000
```

## 2. Backend
```bash
cd backend
npm install
cp .env.example .env        # set MONGO_URI, JWT_SECRET
npm run seed                # populates guardians, states, artifacts, quiz, missions, awards, stories
npm run dev
```

## 3. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
Visit **http://localhost:3000**.

## Flow
1. Landing page → Sign up / Login / Continue as Guest
2. Choose Your Guardian (Explorer / Historian / Artist / Protector)
3. Home dashboard → Explore Bharat, Museum, Quiz, Missions, Stories, Mittu AI, Awards
4. XP, Level and streak update live in the navbar as you play

## Notes
- All XP/level/streak logic lives on the backend (`models/User.js`, controllers) —
  the frontend just reflects what the API returns.
- `npm run seed` is safe to re-run; it clears and re-inserts reference data
  (states, artifacts, quizzes, missions, awards, stories) without touching user accounts.
- Mittu AI gracefully shows a friendly error if `CLOUD_AI_API_KEY` isn't set yet —
  the rest of the app works fully without it.
=======
# SIH-Project-2026
>>>>>>> 47ba7fb230f8de19a9f5608fa08cd40012390407
