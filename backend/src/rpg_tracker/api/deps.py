from typing import Annotated

from fastapi import Depends
from sqlmodel import Session

from rpg_tracker.application.campaign_service import CampaignService
from rpg_tracker.application.pomodoro_service import PomodoroService
from rpg_tracker.application.tracker_service import TrackerService
from rpg_tracker.infrastructure.db import get_session

SessionDep = Annotated[Session, Depends(get_session)]


def get_tracker_service(session: SessionDep) -> TrackerService:
    return TrackerService(session)


def get_pomodoro_service() -> PomodoroService:
    return PomodoroService()


TrackerServiceDep = Annotated[TrackerService, Depends(get_tracker_service)]
PomodoroServiceDep = Annotated[PomodoroService, Depends(get_pomodoro_service)]


def get_campaign_service(tracker: TrackerServiceDep) -> CampaignService:
    return CampaignService(tracker)


CampaignServiceDep = Annotated[CampaignService, Depends(get_campaign_service)]
