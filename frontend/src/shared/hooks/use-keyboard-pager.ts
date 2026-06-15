import { useEffect } from "react";

export function useKeyboardPager(
  prev: () => void,
  next: () => void,
  canPrev: boolean,
  canNext: boolean,
) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && canPrev) {
        event.preventDefault();
        prev();
      }
      if (event.key === "ArrowRight" && canNext) {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, canPrev, canNext]);
}
