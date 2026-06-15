import { useGameSignals, useRotatingLine } from "../../shared/hooks/use-game-signals";
import type { Dashboard } from "../../shared/api/types";
import "./game-ticker.css";

export function GameTicker({ data }: { data: Dashboard | undefined }) {
  const signals = useGameSignals(data);
  const line = useRotatingLine(signals.tickerLines);

  return (
    <div className={`game-ticker game-ticker--${signals.attention}`} role="status" aria-live="polite">
      <span className="game-ticker__beacon" aria-hidden />
      <span className="game-ticker__label display">Signal</span>
      <p key={line} className="game-ticker__line stats">
        {line}
      </p>
    </div>
  );
}
