class QuestNotFoundError(Exception):
    def __init__(self, quest_id: int) -> None:
        self.quest_id = quest_id
        super().__init__(f"Quest {quest_id} not found")


class ActiveQuestConflictError(Exception):
    def __init__(self, active_quest_id: int) -> None:
        self.active_quest_id = active_quest_id
        super().__init__(f"Quest {active_quest_id} is already in progress")


class QuestLockedError(Exception):
    def __init__(self, quest_id: int) -> None:
        self.quest_id = quest_id
        super().__init__(f"Quest {quest_id} is locked until earlier chain steps are done")


class CampaignNotFoundError(Exception):
    def __init__(self, slug: str) -> None:
        self.slug = slug
        super().__init__(f"Campaign '{slug}' not found")
