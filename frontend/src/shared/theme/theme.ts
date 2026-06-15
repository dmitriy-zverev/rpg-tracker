export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "rpg-tracker-theme";

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" ? "light" : "dark";
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "light") {
    root.dataset.theme = "light";
  } else {
    delete root.dataset.theme;
  }
  root.style.colorScheme = theme;
}

export function toggleThemeValue(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}
