from dataclasses import dataclass
from datetime import date

from sqlmodel import Session

from rpg_tracker.domain.campaign import get_campaign, quest_placement, recommended_campaign_slug, stage_indices_for_campaign
from rpg_tracker.domain.exceptions import CampaignNotFoundError
from rpg_tracker.domain.enums import Priority, QuestStatus, QuestType
from rpg_tracker.domain.exceptions import (
    ActiveQuestConflictError,
    QuestLockedError,
    QuestNotFoundError,
)
from rpg_tracker.domain.quest_flow import (
    chain_for_stage,
    find_active_quest,
    prerequisites_met,
    quest_focus,
)
from rpg_tracker.domain.xp_engine import (
    calculate_earned_xp,
    calculate_level,
    calculate_progress,
    calculate_rank,
    calculate_xp,
    xp_to_next_level,
)
from rpg_tracker.infrastructure.models import Domain, PlayerProfile, RoadmapStage
from rpg_tracker.infrastructure.repositories import (
    BranchRepository,
    DomainRepository,
    PlayerRepository,
    QuestRecord,
    QuestRepository,
    StageRepository,
)


@dataclass(frozen=True)
class QuestMetrics:
    xp: int
    earned_xp: int
    progress: float


def quest_metrics(record: QuestRecord) -> QuestMetrics:
    xp = calculate_xp(record.estimated_hours, record.priority, record.quest_type)
    earned = calculate_earned_xp(xp, record.status)
    progress = 1.0 if record.status == QuestStatus.DONE else (
        0.2 if record.status == QuestStatus.BLOCKED else (
            0.5 if record.status == QuestStatus.IN_PROGRESS else (
                0.8 if record.status == QuestStatus.REVIEW else 0.0
            )
        )
    )
    return QuestMetrics(xp=xp, earned_xp=earned, progress=progress)


@dataclass(frozen=True)
class QuestDTO:
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


def quest_to_dto(record: QuestRecord) -> QuestDTO:
    metrics = quest_metrics(record)
    campaign_slug, act_number = quest_placement(record.stage_index)
    return QuestDTO(
        id=record.id,
        stage_index=record.stage_index,
        stage_name=record.stage_name,
        domain=record.domain,
        quest_type=record.quest_type,
        title=record.title,
        priority=record.priority,
        status=record.status,
        estimated_hours=record.estimated_hours,
        xp=metrics.xp,
        earned_xp=metrics.earned_xp,
        progress=metrics.progress,
        notes=record.notes,
        evidence=record.evidence,
        start_date=record.start_date,
        deadline=record.deadline,
        campaign_slug=campaign_slug,
        act_number=act_number,
    )


class TrackerService:
    def __init__(self, session: Session) -> None:
        self._quests = QuestRepository(session)
        self._domains = DomainRepository(session)
        self._stages = StageRepository(session)
        self._branches = BranchRepository(session)
        self._player = PlayerRepository(session)

    def _all_quest_dtos(self) -> list[QuestDTO]:
        return [quest_to_dto(r) for r in self._quests.list_all()]

    def list_quests(
        self,
        stage_index: int | None = None,
        domain: str | None = None,
        status: QuestStatus | None = None,
    ) -> list[QuestDTO]:
        records = self._quests.list_all(stage_index=stage_index, domain=domain, status=status)
        return [quest_to_dto(r) for r in records]

    def update_quest(
        self,
        quest_id: int,
        status: QuestStatus | None = None,
        notes: str | None = None,
        evidence: str | None = None,
        start_date: date | None = None,
        deadline: date | None = None,
    ) -> QuestDTO:
        if status == QuestStatus.IN_PROGRESS:
            quests = self._all_quest_dtos()
            active = find_active_quest(quests)
            if active is not None and active.id != quest_id:
                raise ActiveQuestConflictError(active.id)

            target = next((quest for quest in quests if quest.id == quest_id), None)
            if target is None:
                raise QuestNotFoundError(quest_id)

            chain = chain_for_stage(quests, target.stage_index)
            if not prerequisites_met(target, chain):
                raise QuestLockedError(quest_id)

        updated = self._quests.update(
            quest_id,
            status=status,
            notes=notes,
            evidence=evidence,
            start_date=start_date,
            deadline=deadline,
        )
        if updated is None:
            raise QuestNotFoundError(quest_id)
        return quest_to_dto(updated)

    def list_domains(self) -> list[Domain]:
        return self._domains.list_all()

    def list_stages_with_progress(self, campaign_slug: str | None = None) -> list[dict]:
        stages = self._stages.list_all()
        if campaign_slug is not None:
            campaign = get_campaign(campaign_slug)
            if campaign is None:
                raise CampaignNotFoundError(campaign_slug)
            allowed = stage_indices_for_campaign(campaign)
            stages = [stage for stage in stages if stage.index in allowed]
        quests = self._all_quest_dtos()
        result = []
        for stage in stages:
            stage_quests = [q for q in quests if q.stage_index == stage.index]
            available = sum(q.xp for q in stage_quests)
            earned = sum(q.earned_xp for q in stage_quests)
            result.append({
                "stage": stage,
                "available_xp": available,
                "earned_xp": earned,
                "progress": calculate_progress(earned, available),
            })
        return result

    def list_branches_with_progress(self) -> list[dict]:
        branches = self._branches.list_all()
        quests = self._all_quest_dtos()
        result = []
        for branch in branches:
            domain_set = {d.strip() for d in branch.domains_csv.replace(";", ",").split(",") if d.strip()}
            branch_quests = [q for q in quests if q.domain in domain_set]
            available = sum(q.xp for q in branch_quests)
            earned = sum(q.earned_xp for q in branch_quests)
            result.append({
                "branch": branch,
                "available_xp": available,
                "earned_xp": earned,
                "progress": calculate_progress(earned, available),
            })
        return result

    def get_dashboard(self) -> dict:
        player = self._player.get() or PlayerProfile(id=1, name="Adventurer", title="Initiate")
        quests = self._all_quest_dtos()
        total_earned = sum(q.earned_xp for q in quests)
        level = calculate_level(total_earned)
        rank = calculate_rank(level)
        status_counts: dict[str, int] = {s.value: 0 for s in QuestStatus}
        for q in quests:
            status_counts[q.status.value] += 1

        domain_rows = []
        for domain in self._domains.list_all():
            d_quests = [q for q in quests if q.domain == domain.name]
            available = sum(q.xp for q in d_quests)
            earned = sum(q.earned_xp for q in d_quests)
            domain_rows.append({
                "slug": domain.slug,
                "name": domain.name,
                "color": domain.color,
                "icon": domain.icon,
                "available_xp": available,
                "earned_xp": earned,
                "progress": calculate_progress(earned, available),
            })

        recommended_slug = recommended_campaign_slug(quests)
        stage_summaries = []
        for item in self.list_stages_with_progress(campaign_slug=recommended_slug):
            stage: RoadmapStage = item["stage"]
            stage_summaries.append({
                "index": stage.index,
                "name": stage.name,
                "month": stage.month,
                "priority": stage.priority,
                "progress": item["progress"],
            })

        focus = quest_focus(quests)

        return {
            "player": player,
            "level": level,
            "rank": rank,
            "total_xp": total_earned,
            "xp_to_next_level": xp_to_next_level(total_earned),
            "quest_counts": status_counts,
            "domains": domain_rows,
            "stages": stage_summaries,
            "current_quest": focus["current_quest"],
            "suggested_quest": focus["suggested_quest"],
            "up_next_quests": focus["up_next_quests"],
        }
