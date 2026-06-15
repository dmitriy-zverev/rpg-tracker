from fastapi import APIRouter

from rpg_tracker.api.deps import TrackerServiceDep
from rpg_tracker.api.schemas import SkillBranchResponse, SkillBranchesResponse

skills_router = APIRouter(prefix="/api/v1/skills", tags=["skills"])


@skills_router.get("/branches", response_model=SkillBranchesResponse)
def list_branches(service: TrackerServiceDep) -> SkillBranchesResponse:
    items = service.list_branches_with_progress()
    branches = []
    for item in items:
        branch = item["branch"]
        domains = [d.strip() for d in branch.domains_csv.replace(";", ",").split(",") if d.strip()]
        branches.append(
            SkillBranchResponse(
                id=branch.id or 0,
                name=branch.name,
                meaning=branch.meaning,
                domains=domains,
                next_unlock=branch.next_unlock,
                anti_ai_value=branch.anti_ai_value,
                available_xp=item["available_xp"],
                earned_xp=item["earned_xp"],
                progress=item["progress"],
            )
        )
    return SkillBranchesResponse(branches=branches)
