import "./level-up-modal.css";

interface LevelUpModalProps {
  visible: boolean;
  level: number;
  rank: string;
  onDismiss: () => void;
}

export function LevelUpModal({ visible, level, rank, onDismiss }: LevelUpModalProps) {
  if (!visible) return null;

  return (
    <div className="level-up-modal" role="dialog" aria-modal="true" aria-label="Level up">
      <div className="level-up-modal__backdrop" onClick={onDismiss} />
      <div className="level-up-modal__card pixel-panel">
        <div className="level-up-modal__burst">✨</div>
        <h2 className="display">Level Up!</h2>
        <p className="level-up-modal__level stats">LV {level}</p>
        <p className="level-up-modal__rank">{rank}</p>
        <button type="button" className="pixel-button" onClick={onDismiss}>
          Continue quest
        </button>
      </div>
    </div>
  );
}
