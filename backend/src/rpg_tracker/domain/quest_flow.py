from typing import Protocol

from rpg_tracker.domain.campaign import CAMPAIGNS, stage_indices_for_campaign
from rpg_tracker.domain.enums import QuestStatus, QuestType

QUEST_TYPE_ORDER: dict[QuestType, int] = {
    QuestType.MAIN: 0,
    QuestType.CRAFTING: 1,
    QuestType.DEBUG: 2,
    QuestType.TEST: 3,
    QuestType.BOSS: 4,
}


class QuestLike(Protocol):
    id: int
    stage_index: int
    quest_type: QuestType
    status: QuestStatus


def sort_chain[T: QuestLike](quests: list[T]) -> list[T]:
    return sorted(quests, key=lambda quest: QUEST_TYPE_ORDER[quest.quest_type])


def chain_for_stage[T: QuestLike](quests: list[T], stage_index: int) -> list[T]:
    return sort_chain([quest for quest in quests if quest.stage_index == stage_index])


def prerequisites_met[T: QuestLike](quest: T, chain: list[T]) -> bool:
    order = QUEST_TYPE_ORDER[quest.quest_type]
    for item in chain:
        if QUEST_TYPE_ORDER[item.quest_type] < order and item.status != QuestStatus.DONE:
            return False
    return True


def find_active_quest[T: QuestLike](quests: list[T]) -> T | None:
    for quest in quests:
        if quest.status == QuestStatus.IN_PROGRESS:
            return quest
    return None


def up_next_in_chain[T: QuestLike](quest: T, quests: list[T]) -> list[T]:
    chain = chain_for_stage(quests, quest.stage_index)
    order = QUEST_TYPE_ORDER[quest.quest_type]
    return [
        item
        for item in chain
        if QUEST_TYPE_ORDER[item.quest_type] > order and item.status == QuestStatus.NOT_STARTED
    ]


def find_suggested_start[T: QuestLike](quests: list[T]) -> T | None:
    for campaign in CAMPAIGNS:
        stage_indices = sorted(stage_indices_for_campaign(campaign))
        for stage_index in stage_indices:
            chain = chain_for_stage(quests, stage_index)
            for quest in chain:
                if quest.status == QuestStatus.NOT_STARTED and prerequisites_met(quest, chain):
                    return quest
    return None


def quest_focus[T: QuestLike](quests: list[T]) -> dict[str, T | list[T] | None]:
    current = find_active_quest(quests)
    if current is not None:
        return {
            "current_quest": current,
            "suggested_quest": None,
            "up_next_quests": up_next_in_chain(current, quests),
        }

    suggested = find_suggested_start(quests)
    up_next = up_next_in_chain(suggested, quests) if suggested is not None else []
    return {
        "current_quest": None,
        "suggested_quest": suggested,
        "up_next_quests": up_next,
    }
