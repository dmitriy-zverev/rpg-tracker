from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rpg_tracker.api.exception_handlers import register_exception_handlers
from rpg_tracker.api.routers import api_routers
from rpg_tracker.api.schemas import HealthResponse
from rpg_tracker.config import settings
from rpg_tracker.infrastructure.db import init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="RPG Tracker API",
    version="0.1.0",
    description="Campaign-based learning tracker with quests, acts, and XP progression.",
    lifespan=lifespan,
)

register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in api_routers:
    app.include_router(router)


@app.get("/health", response_model=HealthResponse, tags=["health"])
def health() -> HealthResponse:
    return HealthResponse(status="ok")
