from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from rpg_tracker.domain.exceptions import (
    ActiveQuestConflictError,
    CampaignNotFoundError,
    QuestLockedError,
    QuestNotFoundError,
)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(QuestNotFoundError)
    def quest_not_found(_request: Request, exc: QuestNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(CampaignNotFoundError)
    def campaign_not_found(_request: Request, exc: CampaignNotFoundError) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})

    @app.exception_handler(ActiveQuestConflictError)
    def active_quest_conflict(_request: Request, exc: ActiveQuestConflictError) -> JSONResponse:
        return JSONResponse(status_code=409, content={"detail": str(exc)})

    @app.exception_handler(QuestLockedError)
    def quest_locked(_request: Request, exc: QuestLockedError) -> JSONResponse:
        return JSONResponse(status_code=422, content={"detail": str(exc)})
