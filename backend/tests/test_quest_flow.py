from dataclasses import dataclass

from rpg_tracker.domain.enums import Priority, QuestStatus, QuestType
from rpg_tracker.domain.quest_flow import (
    find_active_quest,
    find_suggested_start,
    prerequisites_met,
    quest_focus,
    up_next_in_chain,
)


@dataclass
class QuestStub:
    id: int
    stage_index: int
    stage_name: str
    domain: str
    quest_type: QuestType
    title: str
    priority: Priority
    status: QuestStatus
    estimated_hours: float = 1.0
    xp: int = 10
    earned_xp: int = 0
    progress: float = 0.0
    notes: str = ""
    evidence: str = ""
    start_date: None = None
    deadline: None = None


def _quest(
    quest_id: int,
    stage_index: int,
    quest_type: QuestType,
    status: QuestStatus,
) -> QuestStub:
    return QuestStub(
        id=quest_id,
        stage_index=stage_index,
        stage_name=f"Stage {stage_index}",
        domain="Backend",
        quest_type=quest_type,
        title=quest_type.value,
        priority=Priority.A,
        status=status,
    )


def test_only_one_active_quest_allowed() -> None:
    quests = [
        _quest(1, 0, QuestType.MAIN, QuestStatus.IN_PROGRESS),
        _quest(2, 0, QuestType.CRAFTING, QuestStatus.NOT_STARTED),
    ]
    assert find_active_quest(quests) is quests[0]


def test_up_next_returns_following_chain_steps() -> None:
    quests = [
        _quest(1, 0, QuestType.MAIN, QuestStatus.IN_PROGRESS),
        _quest(2, 0, QuestType.CRAFTING, QuestStatus.NOT_STARTED),
        _quest(3, 0, QuestType.DEBUG, QuestStatus.NOT_STARTED),
    ]
    up_next = up_next_in_chain(quests[0], quests)
    assert [quest.id for quest in up_next] == [2, 3]


def test_crafting_locked_until_main_done() -> None:
    quests = [
        _quest(1, 0, QuestType.MAIN, QuestStatus.NOT_STARTED),
        _quest(2, 0, QuestType.CRAFTING, QuestStatus.NOT_STARTED),
    ]
    chain = [quests[0], quests[1]]
    assert prerequisites_met(quests[0], chain) is True
    assert prerequisites_met(quests[1], chain) is False


def test_suggested_start_picks_first_unlockable() -> None:
    quests = [
        _quest(1, 0, QuestType.MAIN, QuestStatus.DONE),
        _quest(2, 0, QuestType.CRAFTING, QuestStatus.NOT_STARTED),
        _quest(3, 1, QuestType.MAIN, QuestStatus.NOT_STARTED),
    ]
    suggested = find_suggested_start(quests)
    assert suggested is not None
    assert suggested.id == 2


def test_quest_focus_with_active_quest() -> None:
    quests = [
        _quest(1, 0, QuestType.MAIN, QuestStatus.IN_PROGRESS),
        _quest(2, 0, QuestType.CRAFTING, QuestStatus.NOT_STARTED),
    ]
    focus = quest_focus(quests)
    assert focus["current_quest"] is quests[0]
    assert focus["suggested_quest"] is None
    assert focus["up_next_quests"] == [quests[1]]
