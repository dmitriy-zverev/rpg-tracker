export type PomodoroPhase = "idle" | "focus" | "break";
export type PomodoroRunState = "running" | "paused";

export interface PomodoroDurations {
  focusSeconds: number;
  breakSeconds: number;
}

export interface PomodoroSnapshot {
  phase: PomodoroPhase;
  runState: PomodoroRunState;
  remainingSeconds: number;
  completedFocusSessions: number;
  focusSeconds: number;
  breakSeconds: number;
}

export function defaultDurations(focusMinutes = 25, breakMinutes = 5): PomodoroDurations {
  return {
    focusSeconds: focusMinutes * 60,
    breakSeconds: breakMinutes * 60,
  };
}

export function initialSnapshot(durations: PomodoroDurations): PomodoroSnapshot {
  return {
    phase: "idle",
    runState: "paused",
    remainingSeconds: durations.focusSeconds,
    completedFocusSessions: 0,
    focusSeconds: durations.focusSeconds,
    breakSeconds: durations.breakSeconds,
  };
}

export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function startFocus(snapshot: PomodoroSnapshot): PomodoroSnapshot {
  return {
    ...snapshot,
    phase: "focus",
    runState: "running",
    remainingSeconds: snapshot.focusSeconds,
  };
}

export function startBreak(snapshot: PomodoroSnapshot): PomodoroSnapshot {
  return {
    ...snapshot,
    phase: "break",
    runState: "running",
    remainingSeconds: snapshot.breakSeconds,
  };
}

export function togglePause(snapshot: PomodoroSnapshot): PomodoroSnapshot {
  if (snapshot.phase === "idle") {
    return startFocus(snapshot);
  }

  return {
    ...snapshot,
    runState: snapshot.runState === "running" ? "paused" : "running",
  };
}

export function resetSnapshot(snapshot: PomodoroSnapshot): PomodoroSnapshot {
  return initialSnapshot({
    focusSeconds: snapshot.focusSeconds,
    breakSeconds: snapshot.breakSeconds,
  });
}

export function tickSnapshot(snapshot: PomodoroSnapshot): PomodoroSnapshot {
  if (snapshot.runState !== "running" || snapshot.phase === "idle") {
    return snapshot;
  }

  const remaining = snapshot.remainingSeconds - 1;
  if (remaining > 0) {
    return { ...snapshot, remainingSeconds: remaining };
  }

  if (snapshot.phase === "focus") {
    return {
      ...snapshot,
      phase: "break",
      runState: "running",
      remainingSeconds: snapshot.breakSeconds,
      completedFocusSessions: snapshot.completedFocusSessions + 1,
    };
  }

  return {
    ...snapshot,
    phase: "idle",
    runState: "paused",
    remainingSeconds: snapshot.focusSeconds,
  };
}

export function phaseLabel(phase: PomodoroPhase): string {
  if (phase === "focus") return "Focus";
  if (phase === "break") return "Break";
  return "Ready";
}

export function progressRatio(snapshot: PomodoroSnapshot): number {
  if (snapshot.phase === "idle") return 0;
  const total = snapshot.phase === "focus" ? snapshot.focusSeconds : snapshot.breakSeconds;
  if (total <= 0) return 0;
  return 1 - snapshot.remainingSeconds / total;
}
