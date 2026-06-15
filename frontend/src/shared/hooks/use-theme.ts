import { useCallback, useEffect, useState } from "react";
import {
  applyTheme,
  getStoredTheme,
  THEME_STORAGE_KEY,
  toggleThemeValue,
  type Theme,
} from "../theme/theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme());

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => toggleThemeValue(current));
  }, []);

  return {
    theme,
    isLight: theme === "light",
    toggleTheme,
  };
}
