"use client";

import * as React from "react";

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  lightLabel?: string;
  darkLabel?: string;
  storageKey?: string;
}

export function ThemeToggle({
  className = "",
  lightLabel = "Light",
  darkLabel = "Dark",
  storageKey = "theme",
  type = "button",
  ...props
}: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    const next = saved === "light" || saved === "dark" ? saved : "dark";
    setTheme(next);
  }, [storageKey]);

  const onToggle = React.useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(storageKey, next);
  }, [storageKey, theme]);

  return (
    <button
      type={type}
      onClick={onToggle}
      aria-label="Toggle theme"
      className={
        `inline-flex h-10 items-center justify-center rounded-[var(--radius-md,0.625rem)] border border-[var(--color-border)] ` +
        `bg-[var(--color-bg)] px-4 text-sm font-medium text-[var(--color-text)] ` +
        `transition-all duration-200 ease-out ${className}`
      }
      {...props}
    >
      {theme === "dark" ? lightLabel : darkLabel}
    </button>
  );
}
