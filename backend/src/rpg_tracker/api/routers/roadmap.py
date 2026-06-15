from fastapi import APIRouter

from rpg_tracker.api.deps import TrackerServiceDep
from rpg_tracker.api.schemas import RoadmapStageResponse, RoadmapStagesResponse

roadmap_router = APIRouter(prefix="/api/v1/roadmap", tags=["roadmap"])


@roadmap_router.get("/stages", response_model=RoadmapStagesResponse)
def list_stages(service: TrackerServiceDep) -> RoadmapStagesResponse:
    items = service.list_stages_with_progress()
    stages = []
    for item in items:
        stage = item["stage"]
        stages.append(
            RoadmapStageResponse(
                index=stage.index,
                name=stage.name,
                focus=stage.focus,
                priority=stage.priority,
                month=stage.month,
                domain=stage.domain,
                curriculum=stage.curriculum,
                resources=stage.resources,
                stage_project=stage.stage_project,
                transition_criteria=stage.transition_criteria,
                ai_accelerator=stage.ai_accelerator,
                anti_crisis_value=stage.anti_crisis_value,
                available_xp=item["available_xp"],
                earned_xp=item["earned_xp"],
                progress=item["progress"],
            )
        )
    return RoadmapStagesResponse(stages=stages)
