import { useCallback, useState } from "react";

export function usePager(total: number, initial = 0) {
  const safeTotal = Math.max(total, 1);
  const [page, setPage] = useState(Math.min(initial, safeTotal - 1));

  const prev = useCallback(() => {
    setPage((current) => Math.max(0, current - 1));
  }, []);

  const next = useCallback(() => {
    setPage((current) => Math.min(safeTotal - 1, current + 1));
  }, [safeTotal]);

  return {
    page,
    setPage,
    prev,
    next,
    canPrev: page > 0,
    canNext: page < safeTotal - 1,
    total: safeTotal,
  };
}
