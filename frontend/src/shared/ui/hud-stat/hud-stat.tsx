import type { ReactNode } from "react";
import "./hud-stat.css";

function Tile({ children }: { children: ReactNode }) {
  return <div className="hud-stat">{children}</div>;
}

function Label({ children }: { children: ReactNode }) {
  return <div className="hud-stat__label display">{children}</div>;
}

function Value({ children }: { children: ReactNode }) {
  return <div className="hud-stat__value stats">{children}</div>;
}

export const HudStat = { Tile, Label, Value };
