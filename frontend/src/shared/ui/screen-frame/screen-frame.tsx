import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { useKeyboardPager } from "../../hooks/use-keyboard-pager";
import "./screen-frame.css";

interface ScreenFrameProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

interface PagerProps {
  page: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
}

function Pager({ page, total, onPrev, onNext, canPrev, canNext }: PagerProps) {
  useKeyboardPager(onPrev, onNext, canPrev, canNext);

  if (total <= 1) return null;

  return (
    <div className="screen-frame__pager">
      <button
        type="button"
        className="pixel-button pixel-button--icon"
        onClick={onPrev}
        disabled={!canPrev}
        aria-label="Previous page"
      >
        ◀
      </button>
      <div className="screen-frame__pager-center">
        <span className="screen-frame__page stats">
          {page + 1}/{total}
        </span>
        <div className="screen-frame__dots" aria-hidden>
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={`screen-frame__dot${index === page ? " screen-frame__dot--active" : ""}`}
            />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="pixel-button pixel-button--icon"
        onClick={onNext}
        disabled={!canNext}
        aria-label="Next page"
      >
        ▶
      </button>
    </div>
  );
}

function isPagerElement(child: ReactNode): child is ReactElement<PagerProps> {
  return isValidElement(child) && child.type === Pager;
}

function ScreenFrameRoot({ title, subtitle, children }: ScreenFrameProps) {
  const childArray = Children.toArray(children);
  const pager = childArray.find(isPagerElement);
  const body = childArray.filter((child) => !isPagerElement(child));

  return (
    <section className="screen-frame">
      <header className="screen-frame__head">
        <div className="screen-frame__titles">
          <h2 className="screen-frame__title display">{title}</h2>
          {subtitle && <p className="screen-frame__subtitle">{subtitle}</p>}
        </div>
        {pager}
      </header>
      <div className="screen-frame__body">{body}</div>
    </section>
  );
}

export const ScreenFrame = Object.assign(ScreenFrameRoot, { Pager });
