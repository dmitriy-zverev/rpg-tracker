from rpg_tracker.domain.campaign import (
    SYSTEMS_ENGINEER_CAMPAIGN,
    TUTORIAL_CAMPAIGN,
    ActStatus,
    act_for_stage,
    campaign_for_stage,
    compute_act_progress,
    get_campaign,
    quest_placement,
    recommended_campaign_slug,
    resolve_act_statuses,
)
from rpg_tracker.domain.enums import QuestStatus, QuestType


class _Quest:
    def __init__(
        self,
        stage_index: int,
        quest_type: QuestType,
        status: QuestStatus,
        xp: int,
        earned_xp: int,
    ) -> None:
        self.stage_index = stage_index
        self.quest_type = quest_type
        self.status = status
        self.xp = xp
        self.earned_xp = earned_xp


def test_act_for_stage_maps_systems_engineer_acts() -> None:
    assert act_for_stage(0, SYSTEMS_ENGINEER_CAMPAIGN).number == 1
    assert act_for_stage(5, SYSTEMS_ENGINEER_CAMPAIGN).number == 1
    assert act_for_stage(6, SYSTEMS_ENGINEER_CAMPAIGN).number == 2
    assert act_for_stage(12, SYSTEMS_ENGINEER_CAMPAIGN).number == 3


def test_tutorial_campaign_placement() -> None:
    assert campaign_for_stage(100).slug == TUTORIAL_CAMPAIGN.slug
    assert quest_placement(101) == (TUTORIAL_CAMPAIGN.slug, 1)


def test_get_campaign_by_slug() -> None:
    tutorial = get_campaign("tutorial")
    assert tutorial is not None
    assert tutorial.slug == TUTORIAL_CAMPAIGN.slug


def test_recommended_campaign_prefers_tutorial() -> None:
    quests = [
        _Quest(0, QuestType.MAIN, QuestStatus.DONE, 100, 100),
        _Quest(100, QuestType.MAIN, QuestStatus.NOT_STARTED, 50, 0),
    ]
    assert recommended_campaign_slug(quests) == TUTORIAL_CAMPAIGN.slug


def test_compute_act_progress_counts_bosses() -> None:
    quests = [
        _Quest(0, QuestType.MAIN, QuestStatus.DONE, 100, 100),
        _Quest(0, QuestType.BOSS, QuestStatus.NOT_STARTED, 200, 0),
    ]
    progress = compute_act_progress(quests, SYSTEMS_ENGINEER_CAMPAIGN.acts[0], {0: 0.5})
    assert progress.quest_total == 2
    assert progress.quest_done == 1
    assert progress.boss_total == 1
    assert progress.boss_done == 0


def test_resolve_act_statuses_locks_future_acts() -> None:
    quests = [
        _Quest(0, QuestType.MAIN, QuestStatus.DONE, 100, 100),
        _Quest(0, QuestType.BOSS, QuestStatus.NOT_STARTED, 200, 0),
    ]
    statuses = resolve_act_statuses(SYSTEMS_ENGINEER_CAMPAIGN, quests, {0: 0.5})
    assert statuses[0].status == ActStatus.ACTIVE
    assert statuses[1].status == ActStatus.LOCKED
    assert statuses[2].status == ActStatus.LOCKED
