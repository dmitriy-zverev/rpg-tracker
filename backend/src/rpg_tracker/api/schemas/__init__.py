from datetime import date

from pydantic import BaseModel, Field

from rpg_tracker.domain.enums import Priority, QuestStatus, QuestType


class DomainResponse(BaseModel):
    slug: str
    name: str
    color: str
    icon: str


class DomainListResponse(BaseModel):
    domains: list[DomainResponse]


class QuestResponse(BaseModel):
    id: int
    stage_index: int
    stage_name: str
    domain: str
    quest_type: QuestType
    title: str
    priority: Priority
    status: QuestStatus
    estimated_hours: float
    xp: int
    earned_xp: int
    progress: float
    notes: str
    evidence: str
    start_date: date | None
    deadline: date | None


class QuestListResponse(BaseModel):
    quests: list[QuestResponse]


class QuestUpdateRequest(BaseModel):
    status: QuestStatus | None = None
    notes: str | None = None
    evidence: str | None = None
    start_date: date | None = None
    deadline: date | None = None


class PlayerResponse(BaseModel):
    name: str
    title: str


class DomainSummaryResponse(BaseModel):
    slug: str
    name: str
    color: str
    icon: str
    available_xp: int
    earned_xp: int
    progress: float


class StageSummaryResponse(BaseModel):
    index: int
    name: str
    month: int
    priority: Priority
    progress: float


class DashboardResponse(BaseModel):
    player: PlayerResponse
    level: int
    rank: str
    total_xp: int
    xp_to_next_level: int
    quest_counts: dict[str, int]
    domains: list[DomainSummaryResponse]
    stages: list[StageSummaryResponse]


class RoadmapStageResponse(BaseModel):
    index: int
    name: str
    focus: str
    priority: Priority
    month: int
    domain: str
    curriculum: str
    resources: str
    stage_project: str
    transition_criteria: str
    ai_accelerator: str
    anti_crisis_value: str
    available_xp: int
    earned_xp: int
    progress: float


class RoadmapStagesResponse(BaseModel):
    stages: list[RoadmapStageResponse]


class SkillBranchResponse(BaseModel):
    id: int
    name: str
    meaning: str
    domains: list[str]
    next_unlock: str
    anti_ai_value: str
    available_xp: int
    earned_xp: int
    progress: float


class SkillBranchesResponse(BaseModel):
    branches: list[SkillBranchResponse]
