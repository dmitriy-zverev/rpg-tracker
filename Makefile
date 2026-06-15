.PHONY: help install api front migrate migrate-new seed db test build

BACKEND_DIR := backend
FRONTEND_DIR := frontend
DB_PATH := $(BACKEND_DIR)/data/rpg_tracker.db

PORT ?= 8000

help: ## Show available commands
	@grep -E '^[a-zA-Z0-9_-]+:.*##' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*## "}; {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}'

install: ## Install backend (uv) and frontend (npm) dependencies
	cd $(BACKEND_DIR) && uv sync --extra dev
	cd $(FRONTEND_DIR) && npm install

api: ## Run FastAPI dev server (auto-picks next free port from PORT)
	bash scripts/dev-api.sh

front: ## Run Vite dev server (proxies to .api-port or PORT)
	@api_port=$$(cat .api-port 2>/dev/null || echo $(PORT)); \
	echo "Proxy /api -> http://localhost:$$api_port" >&2; \
	cd $(FRONTEND_DIR) && API_PORT=$$api_port npm run dev

migrate: ## Apply Alembic migrations
	cd $(BACKEND_DIR) && uv run alembic upgrade head

migrate-new: ## Create migration: make migrate-new MSG="initial schema"
	cd $(BACKEND_DIR) && uv run alembic revision --autogenerate -m "$(MSG)"

seed: ## Load SQL seed into empty DB (skips if quests exist)
	cd $(BACKEND_DIR) && uv run python -m rpg_tracker.seed.load

db: ## Open SQLite shell
	sqlite3 $(DB_PATH)

test: ## Run backend tests
	cd $(BACKEND_DIR) && uv run pytest -q

build: ## Build frontend for production
	cd $(FRONTEND_DIR) && npm run build
