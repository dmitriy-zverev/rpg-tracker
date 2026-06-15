"""Campaign catalog and act progression — pure domain, no I/O."""

from dataclasses import dataclass
from enum import StrEnum
from typing import Protocol, Sequence

from rpg_tracker.domain.enums import QuestStatus, QuestType
from rpg_tracker.domain.xp_engine import calculate_progress


@dataclass(frozen=True)
class ActDefinition:
    number: int
    slug: str
    name: str
    tagline: str
    stage_from: int
    stage_to: int


@dataclass(frozen=True)
class CampaignDefinition:
    slug: str
    name: str
    tagline: str
    discipline: str
    acts: tuple[ActDefinition, ...]


SYSTEMS_ENGINEER_CAMPAIGN = CampaignDefinition(
    slug="systems-engineer",
    name="Systems Engineer Saga",
    tagline="Level up through backend, firmware, and hardware",
    discipline="programming",
    acts=(
        ActDefinition(
            1,
            "act-i",
            "ACT I — Backend Gateway",
            "HTTP, APIs, persistence, and service design",
            0,
            5,
        ),
        ActDefinition(
            2,
            "act-ii",
            "ACT II — Firmware Crucible",
            "C, RTOS, drivers, and embedded logic",
            6,
            11,
        ),
        ActDefinition(
            3,
            "act-iii",
            "ACT III — Hardware Citadel",
            "MCU, PCB, sensors, and IoT systems",
            12,
            17,
        ),
    ),
)

TUTORIAL_CAMPAIGN = CampaignDefinition(
    slug="tutorial",
    name="Tutorial — Learn the Realm",
    tagline="A short walkthrough of campaigns, quests, and bosses",
    discipline="onboarding",
    acts=(
        ActDefinition(
            1,
            "act-i",
            "ACT I — Initiation",
            "Hero screen, quest chains, world map, and talents",
            100,
            101,
        ),
    ),
)

CAMPAIGNS: tuple[CampaignDefinition, ...] = (TUTORIAL_CAMPAIGN, SYSTEMS_ENGINEER_CAMPAIGN)

DEFAULT_CAMPAIGN = TUTORIAL_CAMPAIGN


class ActStatus(StrEnum):
    LOCKED = "locked"
    ACTIVE = "active"
    CLEARED = "cleared"


class QuestProgressLike(Protocol):
    stage_index: int
    quest_type: QuestType
    status: QuestStatus
    xp: int
    earned_xp: int


@dataclass(frozen=True)
class ActProgress:
    available_xp: int
    earned_xp: int
    progress: float
    quest_total: int
    quest_done: int
    boss_total: int
    boss_done: int
    stages_total: int
    stages_cleared: int
    status: ActStatus


def get_campaign(slug: str) -> CampaignDefinition | None:
    return next((campaign for campaign in CAMPAIGNS if campaign.slug == slug), None)


def list_campaigns() -> tuple[CampaignDefinition, ...]:
    return CAMPAIGNS


def stage_indices_for_campaign(campaign: CampaignDefinition) -> frozenset[int]:
    indices: set[int] = set()
    for act in campaign.acts:
        indices.update(range(act.stage_from, act.stage_to + 1))
    return frozenset(indices)


def campaign_for_stage(stage_index: int) -> CampaignDefinition:
    for campaign in CAMPAIGNS:
        if stage_index in stage_indices_for_campaign(campaign):
            return campaign
    raise ValueError(f"Stage {stage_index} is not assigned to any campaign")


def act_for_stage(stage_index: int, campaign: CampaignDefinition | None = None) -> ActDefinition:
    resolved = campaign if campaign is not None else campaign_for_stage(stage_index)
    for act in resolved.acts:
        if act.stage_from <= stage_index <= act.stage_to:
            return act
    raise ValueError(f"Stage {stage_index} is outside campaign {resolved.slug}")


def stage_in_act(stage_index: int, act: ActDefinition) -> bool:
    return act.stage_from <= stage_index <= act.stage_to


def quests_in_act(quests: Sequence[QuestProgressLike], act: ActDefinition) -> list[QuestProgressLike]:
    return [quest for quest in quests if stage_in_act(quest.stage_index, act)]


def compute_act_progress(
    quests: Sequence[QuestProgressLike],
    act: ActDefinition,
    stage_progress: dict[int, float],
) -> ActProgress:
    act_quests = quests_in_act(quests, act)
    available_xp = sum(quest.xp for quest in act_quests)
    earned_xp = sum(quest.earned_xp for quest in act_quests)
    quest_done = sum(1 for quest in act_quests if quest.status == QuestStatus.DONE)
    boss_quests = [quest for quest in act_quests if quest.quest_type == QuestType.BOSS]
    boss_done = sum(1 for quest in boss_quests if quest.status == QuestStatus.DONE)

    stages_total = act.stage_to - act.stage_from + 1
    stages_cleared = sum(
        1
        for stage_index in range(act.stage_from, act.stage_to + 1)
        if stage_progress.get(stage_index, 0.0) >= 1.0
    )

    progress = calculate_progress(earned_xp, available_xp)

    return ActProgress(
        available_xp=available_xp,
        earned_xp=earned_xp,
        progress=progress,
        quest_total=len(act_quests),
        quest_done=quest_done,
        boss_total=len(boss_quests),
        boss_done=boss_done,
        stages_total=stages_total,
        stages_cleared=stages_cleared,
        status=ActStatus.ACTIVE,
    )


def quest_placement(stage_index: int) -> tuple[str, int]:
    campaign = campaign_for_stage(stage_index)
    act = act_for_stage(stage_index, campaign)
    return campaign.slug, act.number


def recommended_campaign_slug(quests: Sequence[QuestProgressLike]) -> str:
    for campaign in CAMPAIGNS:
        indices = stage_indices_for_campaign(campaign)
        campaign_quests = [quest for quest in quests if quest.stage_index in indices]
        if any(quest.status != QuestStatus.DONE for quest in campaign_quests):
            return campaign.slug
    return SYSTEMS_ENGINEER_CAMPAIGN.slug


def resolve_act_statuses(
    campaign: CampaignDefinition,
    quests: Sequence[QuestProgressLike],
    stage_progress: dict[int, float],
) -> list[ActProgress]:
    results: list[ActProgress] = []
    previous_cleared = True

    for act in campaign.acts:
        base = compute_act_progress(quests, act, stage_progress)
        if not previous_cleared:
            status = ActStatus.LOCKED
        elif base.progress >= 1.0:
            status = ActStatus.CLEARED
        else:
            status = ActStatus.ACTIVE

        results.append(
            ActProgress(
                available_xp=base.available_xp,
                earned_xp=base.earned_xp,
                progress=base.progress,
                quest_total=base.quest_total,
                quest_done=base.quest_done,
                boss_total=base.boss_total,
                boss_done=base.boss_done,
                stages_total=base.stages_total,
                stages_cleared=base.stages_cleared,
                status=status,
            )
        )
        previous_cleared = status == ActStatus.CLEARED

    return results
