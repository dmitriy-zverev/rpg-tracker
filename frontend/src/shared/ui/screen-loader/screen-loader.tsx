import "./screen-loader.css";

interface ScreenLoaderProps {
  label?: string;
}

export function ScreenLoader({ label = "Summoning data..." }: ScreenLoaderProps) {
  return (
    <div className="screen-loader" role="status" aria-live="polite">
      <div className="screen-loader__emblem" aria-hidden>
        <span className="screen-loader__ring" />
        <span className="screen-loader__sigil">⚔</span>
      </div>
      <p className="screen-loader__label stats">{label}</p>
    </div>
  );
}
