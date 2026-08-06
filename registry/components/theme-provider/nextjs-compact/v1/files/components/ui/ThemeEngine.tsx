import * as React from "react";
import {
  applyThemeToDocument,
  BUILT_IN_THEMES,
  DEFAULT_STORAGE_KEY,
  getSystemTheme,
  resolveTheme,
  type ThemeDefinition,
  type ThemeId,
  type ColorScheme,
} from "./theme";

export type {
  BuiltInTheme,
  ThemeId,
  ThemeDefinition,
  ColorScheme,
} from "./theme";
export {
  applyThemeToDocument,
  getSystemTheme,
  resolveTheme,
  getThemeInitScript,
  BUILT_IN_THEMES,
  DEFAULT_STORAGE_KEY,
} from "./theme";

export interface ThemeContextValue {
  /** User preference (may be `"system"`). */
  theme: ThemeId;
  /** Concrete theme currently on `<html>`. */
  resolvedTheme: string;
  systemTheme: ColorScheme;
  setTheme: (theme: ThemeId) => void;
  themes: string[];
  registerTheme: (definition: ThemeDefinition) => void;
  /** Runtime CSS variable overrides on `<html>` (instant, no remount). */
  setVars: (vars: Record<string, string>) => void;
  clearVars: () => void;
  vars: Record<string, string>;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children?: React.ReactNode;
  /** Initial preference when nothing is stored. Default: `"system"`. */
  defaultTheme?: ThemeId;
  storageKey?: string;
  /** Extra / custom theme definitions. */
  themes?: ThemeDefinition[];
  enableSystem?: boolean;
  /** Skip color transitions while swapping themes (default true — no flash). */
  disableTransitionOnChange?: boolean;
  /** Forced preference (controlled). */
  theme?: ThemeId;
  onThemeChange?: (theme: ThemeId) => void;
}

function readStored(key: string, fallback: ThemeId): ThemeId {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return (v as ThemeId) || fallback;
  } catch {
    return fallback;
  }
}

/**
 * Theme Engine provider — persistence, system preference, custom themes, runtime vars.
 * Wrap the app once. Pair with ThemeScript in `<head>` to avoid FOUC.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = DEFAULT_STORAGE_KEY,
  themes: customThemes = [],
  enableSystem = true,
  disableTransitionOnChange = true,
  theme: controlledTheme,
  onThemeChange,
}: ThemeProviderProps) {
  const registry = React.useRef(new Map<string, ThemeDefinition>());
  const [registryVersion, setRegistryVersion] = React.useState(0);

  React.useLayoutEffect(() => {
    for (const def of customThemes) {
      registry.current.set(def.id, def);
    }
  }, [customThemes]);

  const [themeState, setThemeState] = React.useState<ThemeId>(() =>
    readStored(storageKey, defaultTheme)
  );
  const theme = controlledTheme ?? themeState;

  const [systemTheme, setSystemTheme] = React.useState<ColorScheme>(() => getSystemTheme());
  const [vars, setVarsState] = React.useState<Record<string, string>>({});

  const resolvedTheme = resolveTheme(
    theme === "system" && !enableSystem ? defaultTheme === "system" ? "light" : defaultTheme : theme,
    systemTheme
  );

  const apply = React.useCallback(
    (resolved: string, runtimeVars: Record<string, string>) => {
      applyThemeToDocument({
        resolved,
        registry: registry.current,
        runtimeVars: Object.keys(runtimeVars).length ? runtimeVars : null,
        disableTransition: disableTransitionOnChange,
      });
    },
    [disableTransitionOnChange]
  );

  React.useEffect(() => {
    apply(resolvedTheme, vars);
  }, [apply, resolvedTheme, vars, registryVersion]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemTheme(mq.matches ? "dark" : "light");
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setTheme = React.useCallback(
    (next: ThemeId) => {
      if (next === "system" && !enableSystem) return;
      onThemeChange?.(next);
      if (controlledTheme == null) {
        setThemeState(next);
      }
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* private mode */
      }
    },
    [controlledTheme, enableSystem, onThemeChange, storageKey]
  );

  const registerTheme = React.useCallback((definition: ThemeDefinition) => {
    registry.current.set(definition.id, definition);
    setRegistryVersion((v) => v + 1);
  }, []);

  const setVars = React.useCallback((next: Record<string, string>) => {
    setVarsState((prev) => ({ ...prev, ...next }));
  }, []);

  const clearVars = React.useCallback(() => {
    setVarsState({});
  }, []);

  const themeList = React.useMemo(() => {
    const ids = [
      ...(enableSystem ? (["system"] as const) : []),
      ...BUILT_IN_THEMES,
      ...customThemes.map((t) => t.id),
      ...Array.from(registry.current.keys()).filter(
        (id) => !(BUILT_IN_THEMES as string[]).includes(id)
      ),
    ];
    return Array.from(new Set(ids));
  }, [enableSystem, registryVersion, customThemes]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      setTheme,
      themes: themeList,
      registerTheme,
      setVars,
      clearVars,
      vars,
    }),
    [
      theme,
      resolvedTheme,
      systemTheme,
      setTheme,
      themeList,
      registerTheme,
      setVars,
      clearVars,
      vars,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
