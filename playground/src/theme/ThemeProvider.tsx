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
  buildSurfaceOverrideCSS,
  buildThemeConfig,
  DEFAULT_PREFS,
  loadPrefs,
  resolveAppearance,
  resolvePrimary,
  savePrefs,
  themeById,
  THEME_PRESETS,
  type AccentId,
  type Appearance,
  type ThemePrefs,
  type ThemePresetId,
} from "./accents";

type ThemeContextValue = {
  appearance: Appearance;
  resolvedAppearance: "light" | "dark";
  accentId: AccentId;
  themeId: ThemePresetId;
  /** Resolved primary used across the UI (theme or ColorPalette). */
  primaryColor: string;
  accents: typeof ACCENTS;
  themes: typeof THEME_PRESETS;
  setAppearance: (appearance: Appearance) => void;
  setAccentId: (accentId: AccentId) => void;
  setThemeId: (themeId: ThemePresetId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STYLE_ID = "devkit-theme";
const SURFACE_STYLE_ID = "devkit-theme-surfaces";

function applyTheme(prefs: ThemePrefs): { resolved: "light" | "dark"; primaryColor: string } {
  const accent = accentById(prefs.accentId);
  const theme = themeById(prefs.themeId);
  const primaryColor = resolvePrimary(accent, theme, prefs.colorSource);
  const css = generateThemeCSS(buildThemeConfig(accent, theme, prefs.colorSource));
  const surfaces = buildSurfaceOverrideCSS(theme);

  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = css;

  let surfaceEl = document.getElementById(SURFACE_STYLE_ID) as HTMLStyleElement | null;
  if (!surfaceEl) {
    surfaceEl = document.createElement("style");
    surfaceEl.id = SURFACE_STYLE_ID;
    document.head.appendChild(surfaceEl);
  }
  surfaceEl.textContent = surfaces;

  const resolved = resolveAppearance(prefs.appearance);
  document.documentElement.classList.toggle("dark", resolved === "dark");
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.appearance = prefs.appearance;
  document.documentElement.dataset.themePreset = prefs.themeId;
  document.documentElement.dataset.colorSource = prefs.colorSource;
  document.documentElement.style.setProperty("--pg-primary-swatch", primaryColor);
  return { resolved, primaryColor };
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ThemePrefs>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS;
    return loadPrefs();
  });
  const [resolvedAppearance, setResolvedAppearance] = useState<"light" | "dark">(() =>
    typeof window === "undefined" ? "light" : resolveAppearance(loadPrefs().appearance)
  );
  const [primaryColor, setPrimaryColor] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS.accentId === "blue" ? "#0071e3" : "#0071e3";
    const p = loadPrefs();
    return resolvePrimary(accentById(p.accentId), themeById(p.themeId), p.colorSource);
  });

  useEffect(() => {
    const next = applyTheme(prefs);
    setResolvedAppearance(next.resolved);
    setPrimaryColor(next.primaryColor);
    savePrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    if (prefs.appearance !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const next = applyTheme(prefs);
      setResolvedAppearance(next.resolved);
      setPrimaryColor(next.primaryColor);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [prefs]);

  const setAppearance = useCallback((appearance: Appearance) => {
    setPrefs((prev) => ({ ...prev, appearance }));
  }, []);

  /** ColorPalette: primary only — keep theme surfaces/secondary/radius. */
  const setAccentId = useCallback((accentId: AccentId) => {
    setPrefs((prev) => ({ ...prev, accentId, colorSource: "accent" }));
  }, []);

  /** Theme presets: full surfaces + theme primary/secondary/radius. */
  const setThemeId = useCallback((themeId: ThemePresetId) => {
    setPrefs((prev) => ({ ...prev, themeId, colorSource: "theme" }));
  }, []);

  const value = useMemo(
    () => ({
      appearance: prefs.appearance,
      resolvedAppearance,
      accentId: prefs.accentId,
      themeId: prefs.themeId,
      primaryColor,
      accents: ACCENTS,
      themes: THEME_PRESETS,
      setAppearance,
      setAccentId,
      setThemeId,
    }),
    [
      prefs.appearance,
      prefs.accentId,
      prefs.themeId,
      primaryColor,
      resolvedAppearance,
      setAppearance,
      setAccentId,
      setThemeId,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
