from fastapi import APIRouter

from rpg_tracker.api.deps import CampaignServiceDep, TrackerServiceDep
from rpg_tracker.api.mappers import (
    campaign_detail_to_response,
    campaign_summary_to_response,
    quest_to_response,
)
from rpg_tracker.api.schemas import (
    DashboardResponse,
    DomainSummaryResponse,
    PlayerResponse,
    StageSummaryResponse,
)

dashboard_router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])


@dashboard_router.get("/", response_model=DashboardResponse)
def get_dashboard(
    service: TrackerServiceDep,
    campaign_service: CampaignServiceDep,
) -> DashboardResponse:
    data = service.get_dashboard()
    campaign = campaign_service.get_recommended_detail()
    campaigns = campaign_service.list_summaries()
    player = data["player"]
    current = data["current_quest"]
    suggested = data["suggested_quest"]
    up_next = data["up_next_quests"]

    return DashboardResponse(
        player=PlayerResponse(name=player.name, title=player.title),
        level=data["level"],
        rank=data["rank"],
        total_xp=data["total_xp"],
        xp_to_next_level=data["xp_to_next_level"],
        quest_counts=data["quest_counts"],
        domains=[DomainSummaryResponse(**domain) for domain in data["domains"]],
        stages=[StageSummaryResponse(**stage) for stage in data["stages"]],
        campaign=campaign_detail_to_response(campaign),
        campaigns=[campaign_summary_to_response(item) for item in campaigns],
        current_quest=quest_to_response(current) if current is not None else None,
        suggested_quest=quest_to_response(suggested) if suggested is not None else None,
        up_next_quests=[quest_to_response(quest) for quest in up_next],
    )
