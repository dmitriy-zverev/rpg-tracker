from dataclasses import dataclass
from datetime import date

from sqlmodel import Session, select

from rpg_tracker.domain.enums import Priority, QuestStatus, QuestType
from rpg_tracker.infrastructure.models import (
    Domain,
    PlayerProfile,
    Quest,
    RoadmapStage,
    SkillBranch,
)


@dataclass(frozen=True)
class QuestRecord:
    id: int
    stage_index: int
    stage_name: str
    domain: str
    quest_type: QuestType
    title: str
    priority: Priority
    status: QuestStatus
    estimated_hours: float
    notes: str
    evidence: str
    start_date: date | None
    deadline: date | None


class QuestRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_all(
        self,
        stage_index: int | None = None,
        domain: str | None = None,
        status: QuestStatus | None = None,
    ) -> list[QuestRecord]:
        statement = select(Quest).order_by(Quest.id)
        if stage_index is not None:
            statement = statement.where(Quest.stage_index == stage_index)
        if domain is not None:
            statement = statement.where(Quest.domain == domain)
        if status is not None:
            statement = statement.where(Quest.status == status)
        rows = self._session.exec(statement).all()
        return [self._to_record(row) for row in rows]

    def get_by_id(self, quest_id: int) -> QuestRecord | None:
        row = self._session.get(Quest, quest_id)
        if row is None:
            return None
        return self._to_record(row)

    def update(
        self,
        quest_id: int,
        status: QuestStatus | None = None,
        notes: str | None = None,
        evidence: str | None = None,
        start_date: date | None = None,
        deadline: date | None = None,
    ) -> QuestRecord | None:
        row = self._session.get(Quest, quest_id)
        if row is None:
            return None
        if status is not None:
            row.status = status
        if notes is not None:
            row.notes = notes
        if evidence is not None:
            row.evidence = evidence
        if start_date is not None:
            row.start_date = start_date
        if deadline is not None:
            row.deadline = deadline
        self._session.add(row)
        self._session.commit()
        self._session.refresh(row)
        return self._to_record(row)

    @staticmethod
    def _to_record(row: Quest) -> QuestRecord:
        return QuestRecord(
            id=row.id,
            stage_index=row.stage_index,
            stage_name=row.stage_name,
            domain=row.domain,
            quest_type=row.quest_type,
            title=row.title,
            priority=row.priority,
            status=row.status,
            estimated_hours=row.estimated_hours,
            notes=row.notes,
            evidence=row.evidence,
            start_date=row.start_date,
            deadline=row.deadline,
        )


class DomainRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_all(self) -> list[Domain]:
        return list(self._session.exec(select(Domain).order_by(Domain.slug)).all())


class StageRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_all(self) -> list[RoadmapStage]:
        return list(self._session.exec(select(RoadmapStage).order_by(RoadmapStage.index)).all())


class BranchRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def list_all(self) -> list[SkillBranch]:
        return list(self._session.exec(select(SkillBranch).order_by(SkillBranch.id)).all())


class PlayerRepository:
    def __init__(self, session: Session) -> None:
        self._session = session

    def get(self) -> PlayerProfile | None:
        return self._session.get(PlayerProfile, 1)
