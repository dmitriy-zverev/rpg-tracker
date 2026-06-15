import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../../shared/api/client";
import {
  formatClock,
  initialSnapshot,
  phaseLabel,
  progressRatio,
  resetSnapshot,
  startBreak,
  startFocus,
  tickSnapshot,
  togglePause,
  type PomodoroSnapshot,
} from "../domain/pomodoro-engine";
import { loadPomodoroSnapshot, savePomodoroSnapshot } from "../infrastructure/pomodoro-storage";

function playPhaseChime(): void {
  if (typeof window === "undefined") return;
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "square";
  oscillator.frequency.value = 880;
  gain.gain.value = 0.04;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.12);
  window.setTimeout(() => void context.close(), 200);
}

export function usePomodoro() {
  const { data: config } = useQuery({
    queryKey: ["pomodoro", "config"],
    queryFn: api.getPomodoroConfig,
    staleTime: Infinity,
  });

  const [snapshot, setSnapshot] = useState<PomodoroSnapshot | null>(null);
  const prevPhaseRef = useRef<PomodoroSnapshot["phase"]>("idle");

  useEffect(() => {
    if (!config) return;

    const stored = loadPomodoroSnapshot();
    if (stored && stored.focusSeconds === config.focus_seconds && stored.breakSeconds === config.break_seconds) {
      setSnapshot(stored);
      prevPhaseRef.current = stored.phase;
      return;
    }

    const fresh = initialSnapshot({
      focusSeconds: config.focus_seconds,
      breakSeconds: config.break_seconds,
    });
    setSnapshot(fresh);
    prevPhaseRef.current = fresh.phase;
  }, [config]);

  useEffect(() => {
    if (!snapshot) return;
    savePomodoroSnapshot(snapshot);
  }, [snapshot]);

  useEffect(() => {
    if (!snapshot || snapshot.runState !== "running" || snapshot.phase === "idle") return;

    const timer = window.setInterval(() => {
      setSnapshot((current) => (current ? tickSnapshot(current) : current));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [snapshot?.phase, snapshot?.runState]);

  useEffect(() => {
    if (!snapshot) return;
    if (prevPhaseRef.current !== snapshot.phase && snapshot.phase !== "idle") {
      playPhaseChime();
    }
    prevPhaseRef.current = snapshot.phase;
  }, [snapshot]);

  const startFocusSession = useCallback(() => {
    setSnapshot((current) => (current ? startFocus(current) : current));
  }, []);

  const startBreakSession = useCallback(() => {
    setSnapshot((current) => (current ? startBreak(current) : current));
  }, []);

  const toggle = useCallback(() => {
    setSnapshot((current) => (current ? togglePause(current) : current));
  }, []);

  const reset = useCallback(() => {
    setSnapshot((current) => (current ? resetSnapshot(current) : current));
  }, []);

  return {
    ready: Boolean(snapshot),
    snapshot,
    clock: snapshot ? formatClock(snapshot.remainingSeconds) : "--:--",
    label: snapshot ? phaseLabel(snapshot.phase) : "Ready",
    progress: snapshot ? progressRatio(snapshot) : 0,
    isRunning: snapshot?.runState === "running",
    actions: {
      startFocus: startFocusSession,
      startBreak: startBreakSession,
      toggle,
      reset,
    },
  };
}
