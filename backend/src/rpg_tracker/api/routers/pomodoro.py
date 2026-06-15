from fastapi import APIRouter

from rpg_tracker.api.deps import PomodoroServiceDep
from rpg_tracker.api.schemas import PomodoroConfigResponse

pomodoro_router = APIRouter(prefix="/api/v1/pomodoro", tags=["pomodoro"])


@pomodoro_router.get("/config", response_model=PomodoroConfigResponse)
def get_pomodoro_config(service: PomodoroServiceDep) -> PomodoroConfigResponse:
    durations = service.get_durations()
    return PomodoroConfigResponse(
        focus_seconds=durations.focus_seconds,
        break_seconds=durations.break_seconds,
    )
