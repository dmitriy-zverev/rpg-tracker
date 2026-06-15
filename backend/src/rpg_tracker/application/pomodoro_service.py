from rpg_tracker.config import settings
from rpg_tracker.domain.pomodoro import PomodoroDurations, default_durations


class PomodoroService:
    def get_durations(self) -> PomodoroDurations:
        return default_durations(
            focus_minutes=settings.pomodoro_focus_minutes,
            break_minutes=settings.pomodoro_break_minutes,
        )
