from typing import Annotated

from fastapi import Depends, HTTPException
from sqlmodel import Session

from rpg_tracker.application.tracker_service import TrackerService
from rpg_tracker.domain.exceptions import QuestNotFoundError
from rpg_tracker.infrastructure.db import get_session

SessionDep = Annotated[Session, Depends(get_session)]


def get_tracker_service(session: SessionDep) -> TrackerService:
    return TrackerService(session)


TrackerServiceDep = Annotated[TrackerService, Depends(get_tracker_service)]


def quest_not_found_handler(exc: QuestNotFoundError) -> HTTPException:
    return HTTPException(status_code=404, detail=f"Quest {exc.quest_id} not found")
