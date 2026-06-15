import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../api/client";
import "./level-up-modal.css";

export function LevelUpModal() {
  const { data } = useQuery({ queryKey: ["dashboard"], queryFn: api.getDashboard });
  const prevLevel = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!data) return;
    if (prevLevel.current !== null && data.level > prevLevel.current) {
      setVisible(true);
    }
    prevLevel.current = data.level;
  }, [data]);

  if (!visible || !data) return null;

  return (
    <div className="level-up-modal" role="dialog" aria-modal="true" aria-label="Level up">
      <div className="level-up-modal__backdrop" onClick={() => setVisible(false)} />
      <div className="level-up-modal__card pixel-panel">
        <div className="level-up-modal__burst">✨</div>
        <h2 className="display">Level Up!</h2>
        <p className="level-up-modal__level stats">LV {data.level}</p>
        <p className="level-up-modal__rank">{data.rank}</p>
        <button type="button" className="pixel-button" onClick={() => setVisible(false)}>
          Continue quest
        </button>
      </div>
    </div>
  );
}
