from typing import Annotated

from fastapi import APIRouter, Path

from rpg_tracker.api.deps import CampaignServiceDep
from rpg_tracker.api.mappers import campaign_detail_to_response, campaign_summary_to_response
from rpg_tracker.api.schemas import CampaignDetailResponse, CampaignListResponse

campaigns_router = APIRouter(prefix="/api/v1/campaigns", tags=["campaigns"])


@campaigns_router.get("/", response_model=CampaignListResponse)
def list_campaigns(service: CampaignServiceDep) -> CampaignListResponse:
    campaigns = service.list_summaries()
    return CampaignListResponse(
        campaigns=[campaign_summary_to_response(campaign) for campaign in campaigns]
    )


@campaigns_router.get("/{slug}", response_model=CampaignDetailResponse)
def get_campaign(
    slug: Annotated[str, Path(min_length=1, max_length=64, pattern=r"^[a-z0-9-]+$")],
    service: CampaignServiceDep,
) -> CampaignDetailResponse:
    detail = service.get_detail(slug)
    return campaign_detail_to_response(detail)
