import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { usePomodoro } from "./hooks/use-pomodoro";

interface PomodoroAnchor {
  top: number;
  right: number;
}

interface PomodoroPanelContextValue {
  open: boolean;
  active: boolean;
  mounted: boolean;
  chipRef: RefObject<HTMLButtonElement | null>;
  anchor: PomodoroAnchor;
  questTitle?: string | null;
  pomodoro: ReturnType<typeof usePomodoro>;
  toggleOpen: () => void;
  close: () => void;
}

const PomodoroPanelContext = createContext<PomodoroPanelContextValue | null>(null);

export function usePomodoroPanel() {
  const value = useContext(PomodoroPanelContext);
  if (!value) {
    throw new Error("Pomodoro panel components must be used within PomodoroPanelProvider");
  }
  return value;
}

interface PomodoroPanelProviderProps {
  questTitle?: string | null;
  children: ReactNode;
}

export function PomodoroPanelProvider({ questTitle, children }: PomodoroPanelProviderProps) {
  const pomodoro = usePomodoro();
  const chipRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [anchor, setAnchor] = useState<PomodoroAnchor>({ top: 72, right: 16 });

  const refreshAnchor = useCallback(() => {
    const chip = chipRef.current;
    if (!chip) return;
    const rect = chip.getBoundingClientRect();
    setAnchor({
      top: rect.bottom + 8,
      right: Math.max(12, window.innerWidth - rect.right),
    });
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggleOpen = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  useEffect(() => {
    if (!open) {
      setActive(false);
      const timer = window.setTimeout(() => setMounted(false), 220);
      return () => window.clearTimeout(timer);
    }

    setMounted(true);
    refreshAnchor();
    const frame = window.requestAnimationFrame(() => setActive(true));
    return () => window.cancelAnimationFrame(frame);
  }, [open, refreshAnchor]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
    };

    const onResize = () => {
      refreshAnchor();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [close, open, refreshAnchor]);

  useEffect(() => {
    if (pomodoro.snapshot?.phase === "focus" && pomodoro.snapshot.runState === "running") {
      setOpen(true);
    }
  }, [pomodoro.snapshot?.phase, pomodoro.snapshot?.runState]);

  const value: PomodoroPanelContextValue = {
    open,
    active,
    mounted,
    chipRef,
    anchor,
    questTitle,
    pomodoro,
    toggleOpen,
    close,
  };

  return <PomodoroPanelContext.Provider value={value}>{children}</PomodoroPanelContext.Provider>;
}
