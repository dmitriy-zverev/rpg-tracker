from dataclasses import dataclass
from enum import StrEnum


class PomodoroPhase(StrEnum):
    IDLE = "idle"
    FOCUS = "focus"
    BREAK = "break"


class PomodoroRunState(StrEnum):
    RUNNING = "running"
    PAUSED = "paused"


@dataclass(frozen=True)
class PomodoroDurations:
    focus_seconds: int
    break_seconds: int


@dataclass(frozen=True)
class PomodoroSnapshot:
    phase: PomodoroPhase
    run_state: PomodoroRunState
    remaining_seconds: int
    completed_focus_sessions: int
    focus_seconds: int
    break_seconds: int


def default_durations(focus_minutes: int = 25, break_minutes: int = 5) -> PomodoroDurations:
    return PomodoroDurations(
        focus_seconds=focus_minutes * 60,
        break_seconds=break_minutes * 60,
    )


def initial_snapshot(durations: PomodoroDurations) -> PomodoroSnapshot:
    return PomodoroSnapshot(
        phase=PomodoroPhase.IDLE,
        run_state=PomodoroRunState.PAUSED,
        remaining_seconds=durations.focus_seconds,
        completed_focus_sessions=0,
        focus_seconds=durations.focus_seconds,
        break_seconds=durations.break_seconds,
    )


def format_clock(total_seconds: int) -> str:
    safe = max(0, total_seconds)
    minutes, seconds = divmod(safe, 60)
    return f"{minutes:02d}:{seconds:02d}"


def start_focus(snapshot: PomodoroSnapshot) -> PomodoroSnapshot:
    return PomodoroSnapshot(
        phase=PomodoroPhase.FOCUS,
        run_state=PomodoroRunState.RUNNING,
        remaining_seconds=snapshot.focus_seconds,
        completed_focus_sessions=snapshot.completed_focus_sessions,
        focus_seconds=snapshot.focus_seconds,
        break_seconds=snapshot.break_seconds,
    )


def start_break(snapshot: PomodoroSnapshot) -> PomodoroSnapshot:
    return PomodoroSnapshot(
        phase=PomodoroPhase.BREAK,
        run_state=PomodoroRunState.RUNNING,
        remaining_seconds=snapshot.break_seconds,
        completed_focus_sessions=snapshot.completed_focus_sessions,
        focus_seconds=snapshot.focus_seconds,
        break_seconds=snapshot.break_seconds,
    )


def toggle_pause(snapshot: PomodoroSnapshot) -> PomodoroSnapshot:
    if snapshot.phase == PomodoroPhase.IDLE:
        return start_focus(snapshot)

    next_run = (
        PomodoroRunState.PAUSED
        if snapshot.run_state == PomodoroRunState.RUNNING
        else PomodoroRunState.RUNNING
    )
    return PomodoroSnapshot(
        phase=snapshot.phase,
        run_state=next_run,
        remaining_seconds=snapshot.remaining_seconds,
        completed_focus_sessions=snapshot.completed_focus_sessions,
        focus_seconds=snapshot.focus_seconds,
        break_seconds=snapshot.break_seconds,
    )


def reset(snapshot: PomodoroSnapshot) -> PomodoroSnapshot:
    return initial_snapshot(
        PomodoroDurations(
            focus_seconds=snapshot.focus_seconds,
            break_seconds=snapshot.break_seconds,
        )
    )


def tick(snapshot: PomodoroSnapshot) -> PomodoroSnapshot:
    if snapshot.run_state != PomodoroRunState.RUNNING or snapshot.phase == PomodoroPhase.IDLE:
        return snapshot

    remaining = snapshot.remaining_seconds - 1
    if remaining > 0:
        return PomodoroSnapshot(
            phase=snapshot.phase,
            run_state=snapshot.run_state,
            remaining_seconds=remaining,
            completed_focus_sessions=snapshot.completed_focus_sessions,
            focus_seconds=snapshot.focus_seconds,
            break_seconds=snapshot.break_seconds,
        )

    if snapshot.phase == PomodoroPhase.FOCUS:
        return PomodoroSnapshot(
            phase=PomodoroPhase.BREAK,
            run_state=PomodoroRunState.RUNNING,
            remaining_seconds=snapshot.break_seconds,
            completed_focus_sessions=snapshot.completed_focus_sessions + 1,
            focus_seconds=snapshot.focus_seconds,
            break_seconds=snapshot.break_seconds,
        )

    return PomodoroSnapshot(
        phase=PomodoroPhase.IDLE,
        run_state=PomodoroRunState.PAUSED,
        remaining_seconds=snapshot.focus_seconds,
        completed_focus_sessions=snapshot.completed_focus_sessions,
        focus_seconds=snapshot.focus_seconds,
        break_seconds=snapshot.break_seconds,
    )
