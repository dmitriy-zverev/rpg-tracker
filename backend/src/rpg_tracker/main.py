from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from rpg_tracker.api.routers import api_routers
from rpg_tracker.config import settings

app = FastAPI(title="RPG Tracker API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in api_routers:
    app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
