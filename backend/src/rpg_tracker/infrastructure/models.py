from datetime import date
from typing import Optional

from sqlmodel import Field, SQLModel

from rpg_tracker.domain.enums import Priority, QuestStatus, QuestType


class Domain(SQLModel, table=True):
    __tablename__ = "domains"

    slug: str = Field(primary_key=True, max_length=64)
    name: str = Field(max_length=128)
    color: str = Field(max_length=16)
    icon: str = Field(max_length=8, default="")


class SkillBranch(SQLModel, table=True):
    __tablename__ = "skill_branches"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(max_length=128)
    meaning: str = Field(default="")
    domains_csv: str = Field(default="")
    next_unlock: str = Field(default="")
    anti_ai_value: str = Field(default="")


class RoadmapStage(SQLModel, table=True):
    __tablename__ = "roadmap_stages"

    index: int = Field(primary_key=True)
    name: str = Field(max_length=256)
    name_ru: str = Field(default="", max_length=256)
    focus: str = Field(default="")
    priority: Priority = Field(default=Priority.B)
    month: int = Field(default=1)
    domain: str = Field(default="", max_length=64)
    curriculum: str = Field(default="")
    resources: str = Field(default="")
    stage_project: str = Field(default="")
    transition_criteria: str = Field(default="")
    ai_accelerator: str = Field(default="")
    anti_crisis_value: str = Field(default="")


class Quest(SQLModel, table=True):
    __tablename__ = "quests"

    id: int = Field(primary_key=True)
    stage_index: int = Field(foreign_key="roadmap_stages.index")
    stage_name: str = Field(max_length=256)
    domain: str = Field(max_length=64)
    quest_type: QuestType
    title: str = Field(max_length=512)
    priority: Priority = Field(default=Priority.B)
    status: QuestStatus = Field(default=QuestStatus.NOT_STARTED)
    estimated_hours: float = Field(default=0.0)
    notes: str = Field(default="")
    evidence: str = Field(default="")
    start_date: Optional[date] = Field(default=None)
    deadline: Optional[date] = Field(default=None)


class PlayerProfile(SQLModel, table=True):
    __tablename__ = "player_profile"

    id: int = Field(default=1, primary_key=True)
    name: str = Field(max_length=128)
    title: str = Field(max_length=256)
