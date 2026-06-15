from typing import Annotated

from fastapi import APIRouter, Path

from rpg_tracker.api.deps import TrackerServiceDep
from rpg_tracker.api.schemas import QuestListResponse, QuestResponse, QuestUpdateRequest
from rpg_tracker.domain.enums import QuestStatus
from rpg_tracker.domain.exceptions import QuestNotFoundError
from fastapi import HTTPException, Query

quests_router = APIRouter(prefix="/api/v1/quests", tags=["quests"])


@quests_router.get("/", response_model=QuestListResponse)
def list_quests(
    service: TrackerServiceDep,
    stage_id: Annotated[int | None, Query()] = None,
    domain: Annotated[str | None, Query(max_length=64)] = None,
    status: Annotated[QuestStatus | None, Query()] = None,
) -> QuestListResponse:
    quests = service.list_quests(stage_index=stage_id, domain=domain, status=status)
    return QuestListResponse(quests=[_quest_response(q) for q in quests])


@quests_router.patch("/{quest_id}", response_model=QuestResponse)
def update_quest(
    quest_id: Annotated[int, Path(ge=1)],
    body: QuestUpdateRequest,
    service: TrackerServiceDep,
) -> QuestResponse:
    try:
        quest = service.update_quest(
            quest_id,
            status=body.status,
            notes=body.notes,
            evidence=body.evidence,
            start_date=body.start_date,
            deadline=body.deadline,
        )
    except QuestNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    return _quest_response(quest)


def _quest_response(quest) -> QuestResponse:
    return QuestResponse(
        id=quest.id,
        stage_index=quest.stage_index,
        stage_name=quest.stage_name,
        domain=quest.domain,
        quest_type=quest.quest_type,
        title=quest.title,
        priority=quest.priority,
        status=quest.status,
        estimated_hours=quest.estimated_hours,
        xp=quest.xp,
        earned_xp=quest.earned_xp,
        progress=quest.progress,
        notes=quest.notes,
        evidence=quest.evidence,
        start_date=quest.start_date,
        deadline=quest.deadline,
    )
