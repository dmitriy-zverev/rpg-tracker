import { useEffect, useRef, useState } from "react";

export function useLevelUpCelebration(level: number | undefined) {
  const previousLevel = useRef<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (level === undefined) return;
    if (previousLevel.current !== null && level > previousLevel.current) {
      setVisible(true);
    }
    previousLevel.current = level;
  }, [level]);

  return {
    visible,
    dismiss: () => setVisible(false),
  };
}
