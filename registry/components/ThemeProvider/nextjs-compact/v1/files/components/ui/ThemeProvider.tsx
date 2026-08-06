"use client";

import * as React from "react";

export type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (next: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);

  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey) as ThemeMode | null;
    const initial = saved === "light" || saved === "dark" ? saved : defaultTheme;
    setThemeState(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, [defaultTheme, storageKey]);

  const setTheme = React.useCallback(
    (next: ThemeMode) => {
      setThemeState(next);
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(storageKey, next);
    },
    [storageKey]
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
