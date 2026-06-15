from pathlib import Path
from typing import Annotated

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DB = BACKEND_ROOT / "data" / "rpg_tracker.db"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: Annotated[str, Field(default=f"sqlite:///{DEFAULT_DB}")]
    cors_origins: Annotated[list[str], Field(default=["http://localhost:5173"])]
    pomodoro_focus_minutes: Annotated[int, Field(default=25, ge=1, le=120)]
    pomodoro_break_minutes: Annotated[int, Field(default=5, ge=1, le=60)]


settings = Settings()
