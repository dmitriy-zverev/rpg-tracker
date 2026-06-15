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


settings = Settings()
