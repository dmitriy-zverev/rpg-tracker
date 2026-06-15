from fastapi import APIRouter

from rpg_tracker.api.routers import dashboard, domains, quests, roadmap, skills

api_routers: list[APIRouter] = [
    dashboard.dashboard_router,
    domains.domains_router,
    quests.quests_router,
    roadmap.roadmap_router,
    skills.skills_router,
]
