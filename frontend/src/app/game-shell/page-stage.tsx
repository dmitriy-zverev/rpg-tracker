import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import "./page-stage.css";

export function PageStage({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((prev) => prev + 1);
  }, [location.pathname]);

  return (
    <div key={animKey} className="page-stage-enter">
      {children}
    </div>
  );
}
