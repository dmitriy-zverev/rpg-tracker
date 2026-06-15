import sqlite3
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine

from rpg_tracker.infrastructure.db import get_session
from rpg_tracker.infrastructure.models import Domain, PlayerProfile, Quest, RoadmapStage, SkillBranch  # noqa: F401
from rpg_tracker.main import app
from rpg_tracker.seed.load import SEED_SQL_PATH

API_PREFIX = "/api/v1"


@pytest.fixture
def client(tmp_path: Path) -> Generator[TestClient, None, None]:
    db_path = tmp_path / "test.db"
    engine = create_engine(
        f"sqlite:///{db_path}",
        connect_args={"check_same_thread": False},
    )
    SQLModel.metadata.create_all(engine)

    connection = sqlite3.connect(db_path)
    try:
        connection.executescript(SEED_SQL_PATH.read_text(encoding="utf-8"))
        connection.commit()
    finally:
        connection.close()

    def override_get_session() -> Generator[Session, None, None]:
        with Session(engine) as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_dashboard_includes_campaigns(client: TestClient) -> None:
    response = client.get(f"{API_PREFIX}/dashboard/")
    assert response.status_code == 200
    body = response.json()
    assert body["campaign"]["slug"] == "tutorial"
    assert len(body["campaigns"]) == 2
    assert body["suggested_quest"]["campaign_slug"] == "tutorial"


def test_list_campaigns(client: TestClient) -> None:
    response = client.get(f"{API_PREFIX}/campaigns/")
    assert response.status_code == 200
    slugs = [campaign["slug"] for campaign in response.json()["campaigns"]]
    assert slugs == ["tutorial", "systems-engineer"]


def test_get_campaign_detail(client: TestClient) -> None:
    response = client.get(f"{API_PREFIX}/campaigns/tutorial")
    assert response.status_code == 200
    body = response.json()
    assert body["slug"] == "tutorial"
    assert len(body["acts"]) == 1


def test_get_unknown_campaign_returns_404(client: TestClient) -> None:
    response = client.get(f"{API_PREFIX}/campaigns/unknown-campaign")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_unknown_quest_returns_404(client: TestClient) -> None:
    response = client.patch(f"{API_PREFIX}/quests/99999", json={"status": "done"})
    assert response.status_code == 404


def test_roadmap_defaults_to_systems_engineer(client: TestClient) -> None:
    response = client.get(f"{API_PREFIX}/roadmap/stages")
    assert response.status_code == 200
    stages = response.json()["stages"]
    assert len(stages) == 18
    assert stages[0]["index"] == 0


def test_roadmap_tutorial_campaign(client: TestClient) -> None:
    response = client.get(f"{API_PREFIX}/roadmap/stages", params={"campaign_slug": "tutorial"})
    assert response.status_code == 200
    stages = response.json()["stages"]
    assert len(stages) == 2
    assert stages[0]["index"] == 100
