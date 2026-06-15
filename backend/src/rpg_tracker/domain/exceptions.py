class QuestNotFoundError(Exception):
    def __init__(self, quest_id: int) -> None:
        self.quest_id = quest_id
        super().__init__(f"Quest {quest_id} not found")
