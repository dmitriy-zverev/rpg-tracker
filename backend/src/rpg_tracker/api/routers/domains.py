from fastapi import APIRouter

from rpg_tracker.api.deps import TrackerServiceDep
from rpg_tracker.api.schemas import DomainListResponse, DomainResponse

domains_router = APIRouter(prefix="/api/v1/domains", tags=["domains"])


@domains_router.get("/", response_model=DomainListResponse)
def list_domains(service: TrackerServiceDep) -> DomainListResponse:
    domains = service.list_domains()
    return DomainListResponse(
        domains=[DomainResponse(slug=d.slug, name=d.name, color=d.color, icon=d.icon) for d in domains]
    )
