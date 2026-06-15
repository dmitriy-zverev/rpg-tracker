# RPG Tracker

Real-life skill progression as a pixel RPG. Track quests, roadmap stages, and skill branches with XP earned from completed work.

## Stack

- **Backend:** FastAPI, SQLModel, SQLite, Alembic
- **Frontend:** React, TypeScript, Vite, TanStack Query, React Router

## Prerequisites

- [uv](https://docs.astral.sh/uv/) (Python)
- Node.js 20+

## Setup

### Backend

```bash
cd backend
uv sync --extra dev
```

Create database schema (run migrations yourself — no migration files are committed):

```bash
uv run alembic revision --autogenerate -m "initial schema"
uv run alembic upgrade head
```

Seed loads reference data into an empty database (idempotent — skips if quests exist):

```bash
uv run python -m rpg_tracker.seed.load
```

Requires migrations first. Runtime source of truth is **SQLite only** (`backend/data/rpg_tracker.db`).

Start API:

```bash
uv run fastapi dev
```

API: `http://localhost:8000` · Health: `GET /health`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App: `http://localhost:5173` — Vite proxies `/api` to the backend.

Optional: set `VITE_API_URL=http://localhost:8000` if not using the dev proxy.

## Screens

| Route | Screen |
|-------|--------|
| `/` | Dashboard — player HUD, quest stats, domain XP, stage progress |
| `/roadmap` | 18-stage learning map with expandable curriculum |
| `/quests` | Quest log — filter, status updates, evidence/notes |
| `/skills` | 7 skill branches with progress and next unlock |

## Tests

```bash
cd backend
uv run pytest -q
```

```bash
cd frontend
npm run build
```

## Project layout

```
backend/src/rpg_tracker/
  domain/          # XP engine, enums
  application/     # TrackerService
  infrastructure/  # SQLModel, repositories
  api/             # FastAPI routers
  seed/            # SQL bootstrap + load CLI

frontend/src/
  app/game-shell/  # Party strip + nav
  features/        # dashboard, roadmap, quests, skills
  shared/          # API client, UI primitives
  styles/          # Dungeon Ledger pixel theme
```

Bootstrap SQL lives in `backend/src/rpg_tracker/seed/data.sql`. After seed, edit data via API or `make db`.
