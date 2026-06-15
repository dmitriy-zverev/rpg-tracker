import type { PomodoroSnapshot } from "../domain/pomodoro-engine";

const STORAGE_KEY = "rpg-tracker:pomodoro";

export function loadPomodoroSnapshot(): PomodoroSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PomodoroSnapshot;
  } catch {
    return null;
  }
}

export function savePomodoroSnapshot(snapshot: PomodoroSnapshot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export function clearPomodoroSnapshot(): void {
  localStorage.removeItem(STORAGE_KEY);
}
