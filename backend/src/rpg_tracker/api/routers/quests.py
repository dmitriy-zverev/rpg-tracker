from typing import Annotated

from fastapi import APIRouter, Path, Query

from rpg_tracker.api.deps import TrackerServiceDep
from rpg_tracker.api.mappers import quest_to_response
from rpg_tracker.api.schemas import QuestListResponse, QuestResponse, QuestUpdateRequest
from rpg_tracker.domain.enums import QuestStatus

quests_router = APIRouter(prefix="/api/v1/quests", tags=["quests"])


@quests_router.get("/", response_model=QuestListResponse)
def list_quests(
    service: TrackerServiceDep,
    stage_id: Annotated[int | None, Query(ge=0, description="Filter by roadmap stage index")] = None,
    domain: Annotated[str | None, Query(max_length=64)] = None,
    status: Annotated[QuestStatus | None, Query()] = None,
) -> QuestListResponse:
    quests = service.list_quests(stage_index=stage_id, domain=domain, status=status)
    return QuestListResponse(quests=[quest_to_response(quest) for quest in quests])


@quests_router.patch("/{quest_id}", response_model=QuestResponse)
def update_quest(
    quest_id: Annotated[int, Path(ge=1, description="Quest ID")],
    body: QuestUpdateRequest,
    service: TrackerServiceDep,
) -> QuestResponse:
    quest = service.update_quest(
        quest_id,
        status=body.status,
        notes=body.notes,
        evidence=body.evidence,
        start_date=body.start_date,
        deadline=body.deadline,
    )
    return quest_to_response(quest)
