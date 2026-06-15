from fastapi import APIRouter

from rpg_tracker.api.routers import campaigns, dashboard, domains, pomodoro, quests, roadmap, skills

api_routers: list[APIRouter] = [
    campaigns.campaigns_router,
    dashboard.dashboard_router,
    domains.domains_router,
    pomodoro.pomodoro_router,
    quests.quests_router,
    roadmap.roadmap_router,
    skills.skills_router,
]
