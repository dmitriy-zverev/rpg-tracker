import type { ReactNode } from "react";
import "./pixel-panel.css";

function Frame({ children }: { children: ReactNode }) {
  return <div className="pixel-panel">{children}</div>;
}

function Header({ children }: { children: ReactNode }) {
  return <div className="pixel-panel__header display">{children}</div>;
}

function Body({ children }: { children: ReactNode }) {
  return <div className="pixel-panel__body">{children}</div>;
}

export const PixelPanel = { Frame, Header, Body };
