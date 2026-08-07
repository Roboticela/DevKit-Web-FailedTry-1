/** Minimal config shape accepted by CLI `generateThemeCSS`. */
export type ThemeConfig = {
  devkit: string;
  template: "nextjs-compact" | "vite-express-tauri";
  site: { name: string; url: string };
  theme?: {
    preset?: string;
    colors?: { primary?: string; secondary?: string };
    fonts?: { sans?: string; mono?: string; display?: string };
    radius?: string;
    darkMode?: boolean;
    darkModeStrategy?: "class" | "media";
  };
};

export type Appearance = "light" | "dark";

export type AccentId =
  | "blue"
  | "indigo"
  | "violet"
  | "magenta"
  | "rose"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "teal"
  | "cyan"
  | "sky"
  | "slate"
  | "zinc"
  | "stone"
  | "brown"
  | "navy"
  | "coral";

export type AccentDef = {
  id: AccentId;
  label: string;
  primary: string;
  secondary: string;
};

export const ACCENTS: AccentDef[] = [
  { id: "blue", label: "Blue", primary: "#0071e3", secondary: "#86868b" },
  { id: "indigo", label: "Indigo", primary: "#5856d6", secondary: "#86868b" },
  { id: "violet", label: "Violet", primary: "#af52de", secondary: "#86868b" },
  { id: "magenta", label: "Magenta", primary: "#bf5af2", secondary: "#86868b" },
  { id: "rose", label: "Rose", primary: "#ff2d55", secondary: "#86868b" },
  { id: "red", label: "Red", primary: "#ff3b30", secondary: "#86868b" },
  { id: "orange", label: "Orange", primary: "#ff9500", secondary: "#86868b" },
  { id: "amber", label: "Amber", primary: "#ff9f0a", secondary: "#86868b" },
  { id: "yellow", label: "Yellow", primary: "#ffd60a", secondary: "#515154" },
  { id: "lime", label: "Lime", primary: "#a8e10c", secondary: "#515154" },
  { id: "green", label: "Green", primary: "#30d158", secondary: "#86868b" },
  { id: "teal", label: "Teal", primary: "#40c8e0", secondary: "#86868b" },
  { id: "cyan", label: "Cyan", primary: "#64d2ff", secondary: "#515154" },
  { id: "sky", label: "Sky", primary: "#70d7ff", secondary: "#515154" },
  { id: "slate", label: "Slate", primary: "#64748b", secondary: "#94a3b8" },
  { id: "zinc", label: "Zinc", primary: "#71717a", secondary: "#a1a1aa" },
  { id: "stone", label: "Stone", primary: "#78716c", secondary: "#a8a29e" },
  { id: "brown", label: "Brown", primary: "#a2845e", secondary: "#86868b" },
  { id: "navy", label: "Navy", primary: "#1d4ed8", secondary: "#515154" },
  { id: "coral", label: "Coral", primary: "#ff7f50", secondary: "#86868b" },
];

export const STORAGE_KEY = "devkit-playground-theme";

export type ThemePrefs = {
  appearance: Appearance;
  accentId: AccentId;
};

export const DEFAULT_PREFS: ThemePrefs = {
  appearance: "light",
  accentId: "blue",
};

export function loadPrefs(): ThemePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<ThemePrefs>;
    const accentOk = ACCENTS.some((a) => a.id === parsed.accentId);
    return {
      appearance: parsed.appearance === "dark" ? "dark" : "light",
      accentId: accentOk ? (parsed.accentId as AccentId) : DEFAULT_PREFS.accentId,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function savePrefs(prefs: ThemePrefs): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function accentById(id: AccentId): AccentDef {
  return ACCENTS.find((a) => a.id === id) ?? ACCENTS[0]!;
}

export function buildThemeConfig(accent: AccentDef): ThemeConfig {
  return {
    devkit: "1.0",
    template: "vite-express-tauri",
    site: { name: "DevKit Playground", url: "http://localhost:5173" },
    theme: {
      preset: "default",
      colors: { primary: accent.primary, secondary: accent.secondary },
      fonts: { sans: "system", mono: "system", display: "system" },
      radius: "balanced",
      darkMode: true,
      darkModeStrategy: "class",
    },
  };
}
