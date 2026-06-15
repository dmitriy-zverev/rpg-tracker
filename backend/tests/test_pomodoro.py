from dataclasses import replace

from rpg_tracker.domain.pomodoro import (
    PomodoroPhase,
    PomodoroRunState,
    default_durations,
    format_clock,
    initial_snapshot,
    reset,
    start_break,
    start_focus,
    tick,
    toggle_pause,
)


def test_format_clock() -> None:
    assert format_clock(125) == "02:05"
    assert format_clock(0) == "00:00"


def test_focus_completes_into_break() -> None:
    durations = default_durations(focus_minutes=1, break_minutes=1)
    snapshot = replace(start_focus(initial_snapshot(durations)), remaining_seconds=1)

    after = tick(snapshot)
    assert after.phase == PomodoroPhase.BREAK
    assert after.run_state == PomodoroRunState.RUNNING
    assert after.completed_focus_sessions == 1


def test_break_completes_into_idle() -> None:
    durations = default_durations(focus_minutes=1, break_minutes=1)
    snapshot = replace(start_break(initial_snapshot(durations)), remaining_seconds=1)

    after = tick(snapshot)
    assert after.phase == PomodoroPhase.IDLE
    assert after.run_state == PomodoroRunState.PAUSED


def test_toggle_pause_from_idle_starts_focus() -> None:
    durations = default_durations()
    snapshot = toggle_pause(initial_snapshot(durations))
    assert snapshot.phase == PomodoroPhase.FOCUS
    assert snapshot.run_state == PomodoroRunState.RUNNING


def test_reset_returns_idle() -> None:
    durations = default_durations()
    running = start_focus(initial_snapshot(durations))
    cleared = reset(running)
    assert cleared.phase == PomodoroPhase.IDLE
    assert cleared.run_state == PomodoroRunState.PAUSED
