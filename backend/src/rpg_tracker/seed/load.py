import sqlite3
from pathlib import Path

from sqlmodel import Session, select

from rpg_tracker.config import settings
from rpg_tracker.infrastructure.db import engine, init_db
from rpg_tracker.infrastructure.models import Domain, PlayerProfile, Quest, RoadmapStage, SkillBranch

SEED_SQL_PATH = Path(__file__).parent / "data.sql"


def database_path() -> str:
    return settings.database_url.removeprefix("sqlite:///")


def is_seeded() -> bool:
    with Session(engine) as session:
        return session.exec(select(Quest)).first() is not None


def apply_seed_sql() -> None:
    sql = SEED_SQL_PATH.read_text(encoding="utf-8")
    connection = sqlite3.connect(database_path())
    try:
        connection.executescript(sql)
        connection.commit()
    finally:
        connection.close()


def seed_counts() -> dict[str, int]:
    with Session(engine) as session:
        return {
            "domains": len(session.exec(select(Domain)).all()),
            "stages": len(session.exec(select(RoadmapStage)).all()),
            "branches": len(session.exec(select(SkillBranch)).all()),
            "quests": len(session.exec(select(Quest)).all()),
            "player": len(session.exec(select(PlayerProfile)).all()),
        }


def seed() -> None:
    init_db()

    if is_seeded():
        print("Seed skipped: database already contains quests")
        return

    if not SEED_SQL_PATH.is_file():
        raise FileNotFoundError(f"Missing seed file: {SEED_SQL_PATH}")

    apply_seed_sql()
    print(f"Seed complete: {seed_counts()}")


if __name__ == "__main__":
    seed()
