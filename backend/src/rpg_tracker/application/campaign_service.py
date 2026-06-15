from dataclasses import dataclass

from rpg_tracker.application.tracker_service import TrackerService
from rpg_tracker.domain.campaign import (
    SYSTEMS_ENGINEER_CAMPAIGN,
    ActDefinition,
    ActProgress,
    CampaignDefinition,
    get_campaign,
    list_campaigns,
    recommended_campaign_slug,
    resolve_act_statuses,
)
from rpg_tracker.domain.exceptions import CampaignNotFoundError


@dataclass(frozen=True)
class ActSummaryDTO:
    number: int
    slug: str
    name: str
    tagline: str
    stage_from: int
    stage_to: int
    available_xp: int
    earned_xp: int
    progress: float
    quest_total: int
    quest_done: int
    boss_total: int
    boss_done: int
    stages_total: int
    stages_cleared: int
    status: str


@dataclass(frozen=True)
class CampaignSummaryDTO:
    slug: str
    name: str
    tagline: str
    discipline: str
    progress: float
    earned_xp: int
    available_xp: int
    act_count: int
    acts_cleared: int


@dataclass(frozen=True)
class CampaignDetailDTO:
    slug: str
    name: str
    tagline: str
    discipline: str
    progress: float
    earned_xp: int
    available_xp: int
    acts: list[ActSummaryDTO]


def _act_to_dto(act: ActDefinition, progress: ActProgress) -> ActSummaryDTO:
    return ActSummaryDTO(
        number=act.number,
        slug=act.slug,
        name=act.name,
        tagline=act.tagline,
        stage_from=act.stage_from,
        stage_to=act.stage_to,
        available_xp=progress.available_xp,
        earned_xp=progress.earned_xp,
        progress=progress.progress,
        quest_total=progress.quest_total,
        quest_done=progress.quest_done,
        boss_total=progress.boss_total,
        boss_done=progress.boss_done,
        stages_total=progress.stages_total,
        stages_cleared=progress.stages_cleared,
        status=progress.status.value,
    )


def _build_campaign_detail(
    campaign: CampaignDefinition,
    tracker: TrackerService,
) -> CampaignDetailDTO:
    quests = tracker.list_quests()
    stage_items = tracker.list_stages_with_progress()
    stage_progress = {item["stage"].index: item["progress"] for item in stage_items}
    act_progresses = resolve_act_statuses(campaign, quests, stage_progress)

    available_xp = sum(act.available_xp for act in act_progresses)
    earned_xp = sum(act.earned_xp for act in act_progresses)
    progress = earned_xp / available_xp if available_xp else 0.0

    acts = [
        _act_to_dto(act_def, act_progress)
        for act_def, act_progress in zip(campaign.acts, act_progresses, strict=True)
    ]

    return CampaignDetailDTO(
        slug=campaign.slug,
        name=campaign.name,
        tagline=campaign.tagline,
        discipline=campaign.discipline,
        progress=progress,
        earned_xp=earned_xp,
        available_xp=available_xp,
        acts=acts,
    )


class CampaignService:
    def __init__(self, tracker: TrackerService) -> None:
        self._tracker = tracker

    def list_summaries(self) -> list[CampaignSummaryDTO]:
        summaries: list[CampaignSummaryDTO] = []
        for campaign in list_campaigns():
            detail = _build_campaign_detail(campaign, self._tracker)
            acts_cleared = sum(1 for act in detail.acts if act.status == "cleared")
            summaries.append(
                CampaignSummaryDTO(
                    slug=detail.slug,
                    name=detail.name,
                    tagline=detail.tagline,
                    discipline=detail.discipline,
                    progress=detail.progress,
                    earned_xp=detail.earned_xp,
                    available_xp=detail.available_xp,
                    act_count=len(detail.acts),
                    acts_cleared=acts_cleared,
                )
            )
        return summaries

    def get_detail(self, slug: str) -> CampaignDetailDTO:
        campaign = get_campaign(slug)
        if campaign is None:
            raise CampaignNotFoundError(slug)
        return _build_campaign_detail(campaign, self._tracker)

    def get_recommended_detail(self) -> CampaignDetailDTO:
        slug = recommended_campaign_slug(self._tracker.list_quests())
        return self.get_detail(slug)

    def get_detail_for_world_map(self) -> CampaignDetailDTO:
        return self.get_detail(SYSTEMS_ENGINEER_CAMPAIGN.slug)
