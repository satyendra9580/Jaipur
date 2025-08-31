# Candidate Profile Playground

A minimal full‑stack playground that stores a candidate profile in MongoDB and exposes it via a small API with a basic React UI to query projects and skills.

- Backend: Node.js + Express + MongoDB (Mongoose)
- Frontend: React (Vite)
- API features: profile CRUD, project queries by skill, top skills, text search, health endpoint

---

## Architecture

- `backend/`: Express API + Mongoose models
  - Collections: `profiles`, `projects`
  - Endpoints:
    - `GET /health`
    - `GET /api/profile`
    - `POST /api/profile`
    - `PUT /api/profile`
    - `GET /api/projects?skill=python&q=...&limit=50`
    - `POST /api/projects`
    - `GET /api/skills/top?limit=10`
    - `GET /api/search?q=...`
  - Seeding: `backend/seed/seed.js` (uses env vars; idempotent)

- `frontend/`: Vite + React minimal UI
  - Views: Profile, Project list (filter by skill), Search
  - Calls the hosted API (CORS configured). Set `VITE_API_BASE_URL` when deploying.

See `schema.md` for collections and indexes.

---

## Setup (Local)

1) Configure backend env

- Copy env template and edit values:

```bash
copy backend\.env.example backend\.env
```

- Set at least `MONGODB_URI` and optionally `CORS_ORIGIN`.

2) Install dependencies

```bash
# Backend
npm install --prefix backend

# Frontend
npm install --prefix frontend
```

3) Seed the database (fill your real info in `backend/.env` first)

```bash
npm run seed --prefix backend
```

4) Run dev servers

```bash
# Backend API (http://localhost:4000)
npm run dev --prefix backend

# Frontend (http://localhost:5173)
npm run dev --prefix frontend
```

Front-end uses `VITE_API_BASE_URL` if defined; otherwise it defaults to `http://localhost:4000`.

---

## Setup (Production / Hosting)

- Backend (Express):
  - Set environment variables: `MONGODB_URI`, `PORT` (e.g., 4000), `CORS_ORIGIN` to your frontend origin.

- Frontend (Vite React):
  - Deploy to Netlify/Vercel/Cloudflare Pages.
  - Set build command: `npm run build`
  - Publish directory: `frontend/dist`
  - Environment variable at build time: `VITE_API_BASE_URL` = your backend URL 

---

## API Quick Reference

- Health: `GET /health`
- Profile CRUD:
  - `GET /api/profile`
  - `POST /api/profile` 
  - `PUT /api/profile` 
- Projects:
  - `GET /api/projects?skill=python` 
  - `POST /api/projects` 
- Skills:
  - `GET /api/skills/top?limit=10`
- Search:
  - `GET /api/search?q=react`

## Schema

See `schema.md` for detailed schema and indexes.

---

## Known Limitations

- No authentication; single-profile assumption.
- Simple validation only; minimal error handling.
- Text search relies on MongoDB text indexes; stemming/language not tuned.
- `skills/top` aggregates from `projects.skills` only.

---

## Resume

- Resume: [https://drive.google.com/file/d/1h0IqOy5_bMrRVt7kDPp5bi1P2xuX0gwA/view?usp=sharing]
