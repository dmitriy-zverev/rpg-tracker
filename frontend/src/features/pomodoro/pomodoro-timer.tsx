import { createPortal } from "react-dom";
import { PomodoroPanelProvider, usePomodoroPanel } from "./pomodoro-panel-context";
import "./pomodoro-timer.css";

interface PomodoroTimerProps {
  questTitle?: string | null;
}

function phaseIcon(phase: string): string {
  if (phase === "idle") return "◷";
  if (phase === "focus") return "◈";
  return "◇";
}

function PomodoroTrigger() {
  const { chipRef, open, toggleOpen, pomodoro } = usePomodoroPanel();

  if (!pomodoro.ready || !pomodoro.snapshot) {
    return null;
  }

  const { snapshot, clock } = pomodoro;

  return (
    <button
      ref={chipRef}
      type="button"
      className={`pomodoro-chip pomodoro-chip--${snapshot.phase}${open ? " pomodoro-chip--open" : ""}`}
      aria-expanded={open}
      aria-controls="pomodoro-modal-panel"
      aria-label="Pomodoro timer"
      onClick={toggleOpen}
    >
      <span className="pomodoro-chip__icon" aria-hidden>
        {phaseIcon(snapshot.phase)}
      </span>
      <span className="pomodoro-chip__clock">{clock}</span>
    </button>
  );
}

function PomodoroModal() {
  const { mounted, active, anchor, close, questTitle, pomodoro } = usePomodoroPanel();

  if (!mounted || !pomodoro.ready || !pomodoro.snapshot) {
    return null;
  }

  const { snapshot, actions, label, progress } = pomodoro;

  return createPortal(
    <div
      className={`pomodoro-modal${active ? " pomodoro-modal--open" : ""}`}
      role="presentation"
    >
      <button
        type="button"
        className="pomodoro-modal__backdrop"
        aria-label="Close pomodoro timer"
        onClick={close}
      />
      <section
        id="pomodoro-modal-panel"
        className={`pomodoro-modal__panel pomodoro-modal__panel--${snapshot.phase}`}
        style={{ top: anchor.top, right: anchor.right }}
        role="dialog"
        aria-modal="true"
        aria-label="Pomodoro controls"
      >
        <header className="pomodoro-modal__head">
          <div className="pomodoro-modal__clock-wrap">
            <span className="pomodoro-modal__clock">{pomodoro.clock}</span>
            <span className="pomodoro-modal__phase">{label}</span>
          </div>
          <button type="button" className="pomodoro-modal__close" aria-label="Close" onClick={close}>
            ×
          </button>
        </header>

        <div className="pomodoro-modal__sessions">
          SESSIONS <b>{snapshot.completedFocusSessions}</b>
        </div>

        <div className="pomodoro-modal__bar" aria-hidden>
          <div className="pomodoro-modal__fill" style={{ width: `${progress * 100}%` }} />
        </div>

        {questTitle && snapshot.phase === "focus" && (
          <p className="pomodoro-modal__quest">{questTitle}</p>
        )}

        <div className="pomodoro-modal__actions">
          {snapshot.phase === "idle" ? (
            <button type="button" className="pixel-button pomodoro__btn" onClick={actions.startFocus}>
              Focus
            </button>
          ) : (
            <button type="button" className="pixel-button pomodoro__btn" onClick={actions.toggle}>
              {snapshot.runState === "running" ? "Pause" : "Resume"}
            </button>
          )}
          {snapshot.phase === "focus" && snapshot.runState === "paused" && (
            <button type="button" className="pixel-button pomodoro__btn" onClick={actions.startBreak}>
              Break
            </button>
          )}
          <button type="button" className="pixel-button pomodoro__btn pomodoro__btn--ghost" onClick={actions.reset}>
            Reset
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function PomodoroTimerContent() {
  const { pomodoro } = usePomodoroPanel();

  if (!pomodoro.ready || !pomodoro.snapshot) {
    return null;
  }

  return (
    <div className="pomodoro-wrap">
      <PomodoroTrigger />
      <PomodoroModal />
    </div>
  );
}

export function PomodoroTimer({ questTitle }: PomodoroTimerProps) {
  return (
    <PomodoroPanelProvider questTitle={questTitle}>
      <PomodoroTimerContent />
    </PomodoroPanelProvider>
  );
}
