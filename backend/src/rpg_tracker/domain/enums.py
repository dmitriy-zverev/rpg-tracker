from enum import StrEnum


class QuestStatus(StrEnum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    REVIEW = "review"
    BLOCKED = "blocked"
    DONE = "done"


class QuestType(StrEnum):
    MAIN = "main"
    CRAFTING = "crafting"
    DEBUG = "debug"
    TEST = "test"
    BOSS = "boss"


class Priority(StrEnum):
    A = "A"
    B = "B"
    C = "C"
