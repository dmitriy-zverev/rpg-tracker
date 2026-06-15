from rpg_tracker.domain.enums import Priority, QuestType
from rpg_tracker.domain.xp_engine import (
    calculate_earned_xp,
    calculate_level,
    calculate_rank,
    calculate_xp,
    xp_to_next_level,
)
from rpg_tracker.domain.enums import QuestStatus


def test_calculate_xp_main_quest():
    xp = calculate_xp(6, Priority.A, QuestType.MAIN)
    assert xp == 72


def test_calculate_earned_xp_in_progress():
    xp = calculate_xp(10, Priority.A, QuestType.CRAFTING)
    earned = calculate_earned_xp(xp, QuestStatus.IN_PROGRESS)
    assert earned == round(xp * 0.5)


def test_level_and_rank():
    assert calculate_level(0) == 1
    assert calculate_level(349) == 1
    assert calculate_level(350) == 2
    assert calculate_rank(1) == "Apprentice"
    assert calculate_rank(10) == "Firmware Adept"
    assert xp_to_next_level(100) == 250
