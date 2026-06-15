from fastapi import APIRouter

from rpg_tracker.api.deps import TrackerServiceDep
from rpg_tracker.api.schemas import (
    DashboardResponse,
    DomainSummaryResponse,
    PlayerResponse,
    StageSummaryResponse,
)

dashboard_router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@dashboard_router.get("/", response_model=DashboardResponse)
def get_dashboard(service: TrackerServiceDep) -> DashboardResponse:
    data = service.get_dashboard()
    player = data["player"]
    return DashboardResponse(
        player=PlayerResponse(name=player.name, title=player.title),
        level=data["level"],
        rank=data["rank"],
        total_xp=data["total_xp"],
        xp_to_next_level=data["xp_to_next_level"],
        quest_counts=data["quest_counts"],
        domains=[DomainSummaryResponse(**d) for d in data["domains"]],
        stages=[StageSummaryResponse(**s) for s in data["stages"]],
    )
