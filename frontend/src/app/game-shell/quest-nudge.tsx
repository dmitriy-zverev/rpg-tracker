import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGameSignals } from "../../shared/hooks/use-game-signals";
import { questLogPath } from "../../shared/quests/paths";
import type { Dashboard } from "../../shared/api/types";
import "./quest-nudge.css";

const NUDGE_DELAY_MS = 28_000;

export function QuestNudge({ data }: { data: Dashboard | undefined }) {
  const signals = useGameSignals(data);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(false);
    setVisible(false);
  }, [signals.nudgeText]);

  useEffect(() => {
    if (!signals.nudgeText || dismissed) return;

    const timer = window.setTimeout(() => setVisible(true), NUDGE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [signals.nudgeText, dismissed]);

  if (!visible || !signals.nudgeText) return null;

  const href =
    signals.attention === "explore"
      ? "/roadmap"
      : signals.attention === "unlock"
        ? "/"
        : questLogPath(data?.current_quest?.id ?? data?.suggested_quest?.id);

  return (
    <aside className={`quest-nudge quest-nudge--${signals.attention}`} role="note">
      <button
        type="button"
        className="quest-nudge__close stats"
        aria-label="Dismiss"
        onClick={() => {
          setDismissed(true);
          setVisible(false);
        }}
      >
        ×
      </button>
      <p className="quest-nudge__text stats">{signals.nudgeText}</p>
      <Link className="quest-nudge__cta pixel-button" to={href} onClick={() => setVisible(false)}>
        {signals.nudgeCta ?? "Go"}
      </Link>
    </aside>
  );
}
