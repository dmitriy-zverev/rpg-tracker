from rpg_tracker.application.campaign_service import (
    ActSummaryDTO,
    CampaignDetailDTO,
    CampaignSummaryDTO,
)
from rpg_tracker.application.tracker_service import QuestDTO
from rpg_tracker.api.schemas import (
    ActSummaryResponse,
    CampaignDetailResponse,
    CampaignSummaryResponse,
    QuestResponse,
)


def quest_to_response(quest: QuestDTO) -> QuestResponse:
    return QuestResponse.model_validate(quest)


def act_summary_to_response(act: ActSummaryDTO) -> ActSummaryResponse:
    return ActSummaryResponse.model_validate(act)


def campaign_summary_to_response(campaign: CampaignSummaryDTO) -> CampaignSummaryResponse:
    return CampaignSummaryResponse.model_validate(campaign)


def campaign_detail_to_response(detail: CampaignDetailDTO) -> CampaignDetailResponse:
    return CampaignDetailResponse(
        slug=detail.slug,
        name=detail.name,
        tagline=detail.tagline,
        discipline=detail.discipline,
        progress=detail.progress,
        earned_xp=detail.earned_xp,
        available_xp=detail.available_xp,
        acts=[act_summary_to_response(act) for act in detail.acts],
    )
