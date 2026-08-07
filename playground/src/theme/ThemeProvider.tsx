import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { generateThemeCSS } from "@devkit-theme";
import {
  ACCENTS,
  accentById,
  buildThemeConfig,
  DEFAULT_PREFS,
  loadPrefs,
  savePrefs,
  type AccentId,
  type Appearance,
  type ThemePrefs,
} from "./accents";

type ThemeContextValue = {
  appearance: Appearance;
  accentId: AccentId;
  accents: typeof ACCENTS;
  setAppearance: (appearance: Appearance) => void;
  setAccentId: (accentId: AccentId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STYLE_ID = "devkit-theme";

function applyTheme(prefs: ThemePrefs): void {
  const accent = accentById(prefs.accentId);
  const css = generateThemeCSS(buildThemeConfig(accent));
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;
  document.documentElement.classList.toggle("dark", prefs.appearance === "dark");
  document.documentElement.dataset.theme = prefs.appearance;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ThemePrefs>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS;
    return loadPrefs();
  });

  useEffect(() => {
    applyTheme(prefs);
    savePrefs(prefs);
  }, [prefs]);

  const setAppearance = useCallback((appearance: Appearance) => {
    setPrefs((prev) => ({ ...prev, appearance }));
  }, []);

  const setAccentId = useCallback((accentId: AccentId) => {
    setPrefs((prev) => ({ ...prev, accentId }));
  }, []);

  const value = useMemo(
    () => ({
      appearance: prefs.appearance,
      accentId: prefs.accentId,
      accents: ACCENTS,
      setAppearance,
      setAccentId,
    }),
    [prefs.appearance, prefs.accentId, setAppearance, setAccentId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
