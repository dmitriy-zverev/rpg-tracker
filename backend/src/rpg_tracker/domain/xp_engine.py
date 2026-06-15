from rpg_tracker.domain.enums import Priority, QuestStatus, QuestType

STATUS_WEIGHT: dict[QuestStatus, float] = {
    QuestStatus.NOT_STARTED: 0.0,
    QuestStatus.BLOCKED: 0.2,
    QuestStatus.IN_PROGRESS: 0.5,
    QuestStatus.REVIEW: 0.8,
    QuestStatus.DONE: 1.0,
}

PRIORITY_MULTIPLIER: dict[Priority, float] = {
    Priority.A: 1.2,
    Priority.B: 1.0,
    Priority.C: 0.8,
}

TYPE_MULTIPLIER: dict[QuestType, float] = {
    QuestType.MAIN: 1.0,
    QuestType.CRAFTING: 1.4,
    QuestType.DEBUG: 1.1,
    QuestType.TEST: 1.2,
    QuestType.BOSS: 1.6,
}

XP_PER_LEVEL = 350

RANK_TIERS: list[tuple[int, str]] = [
    (1, "Apprentice"),
    (4, "Backend Initiate"),
    (7, "Systems Explorer"),
    (10, "Firmware Adept"),
    (13, "Hardware Ranger"),
    (16, "Embedded Knight"),
    (19, "Systems Architect"),
]


def calculate_xp(hours: float, priority: Priority, quest_type: QuestType) -> int:
    raw = hours * 10 * PRIORITY_MULTIPLIER[priority] * TYPE_MULTIPLIER[quest_type]
    return round(raw)


def calculate_earned_xp(xp: int, status: QuestStatus) -> int:
    return round(xp * STATUS_WEIGHT[status])


def calculate_level(total_earned_xp: int) -> int:
    return int(total_earned_xp / XP_PER_LEVEL) + 1


def calculate_rank(level: int) -> str:
    rank = RANK_TIERS[0][1]
    for min_level, title in RANK_TIERS:
        if level >= min_level:
            rank = title
    return rank


def xp_to_next_level(total_earned_xp: int) -> int:
    level = calculate_level(total_earned_xp)
    next_threshold = level * XP_PER_LEVEL
    return max(0, next_threshold - total_earned_xp)


def calculate_progress(earned: int, available: int) -> float:
    if available <= 0:
        return 0.0
    return round(earned / available, 4)
