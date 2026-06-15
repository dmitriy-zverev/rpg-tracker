from datetime import date

from pydantic import BaseModel, ConfigDict, Field

from rpg_tracker.domain.enums import Priority, QuestStatus, QuestType


class HealthResponse(BaseModel):
    status: str


class DomainResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    name: str
    color: str
    icon: str


class DomainListResponse(BaseModel):
    domains: list[DomainResponse]


class QuestResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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
    campaign_slug: str
    act_number: int


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


class ActSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    number: int
    slug: str
    name: str
    tagline: str
    stage_from: int
    stage_to: int
    available_xp: int
    earned_xp: int
    progress: float
    quest_total: int
    quest_done: int
    boss_total: int
    boss_done: int
    stages_total: int
    stages_cleared: int
    status: str


class CampaignSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str
    name: str
    tagline: str
    discipline: str
    progress: float
    earned_xp: int
    available_xp: int
    act_count: int
    acts_cleared: int


class CampaignListResponse(BaseModel):
    campaigns: list[CampaignSummaryResponse]


class CampaignDetailResponse(BaseModel):
    slug: str
    name: str
    tagline: str
    discipline: str
    progress: float
    earned_xp: int
    available_xp: int
    acts: list[ActSummaryResponse]


class DashboardResponse(BaseModel):
    player: PlayerResponse
    level: int
    rank: str
    total_xp: int
    xp_to_next_level: int
    quest_counts: dict[str, int]
    domains: list[DomainSummaryResponse]
    stages: list[StageSummaryResponse]
    campaign: CampaignDetailResponse
    campaigns: list[CampaignSummaryResponse]
    current_quest: QuestResponse | None = None
    suggested_quest: QuestResponse | None = None
    up_next_quests: list[QuestResponse] = Field(default_factory=list)


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


class PomodoroConfigResponse(BaseModel):
    focus_seconds: int
    break_seconds: int
