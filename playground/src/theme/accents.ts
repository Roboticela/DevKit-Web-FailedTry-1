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

export type Appearance = "system" | "light" | "dark";

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
  | "coral"
  | "graphite"
  | "sapphire"
  | "emerald"
  | "gold"
  | "crimson"
  | "orchid"
  | "mint"
  | "azure"
  | "copper"
  | "obsidian";

export type AccentDef = {
  id: AccentId;
  label: string;
  primary: string;
  secondary: string;
};

export type ThemePresetId =
  | "default"
  | "minimal"
  | "bold"
  | "playful"
  | "corporate"
  | "midnight"
  | "dawn"
  | "forest"
  | "ocean"
  | "sunset"
  | "mono"
  | "contrast";

/** Full UI surface system owned by theme presets (not ColorPalette). */
export type ModeSurfaces = {
  backgroundPrimary: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  surfaceElevated: string;
  surfaceFloating: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textQuaternary: string;
  borderSubtle: string;
  borderDefault: string;
  borderStrong: string;
};

export type ThemePresetDef = {
  id: ThemePresetId;
  label: string;
  description: string;
  preset: string;
  radius: "sharp" | "balanced" | "soft";
  primary: string;
  secondary: string;
  light: ModeSurfaces;
  dark: ModeSurfaces;
};

/** Who owns --color-accent-primary: theme preset or ColorPalette. */
export type ColorSource = "theme" | "accent";

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
  { id: "graphite", label: "Graphite", primary: "#4b5563", secondary: "#9ca3af" },
  { id: "sapphire", label: "Sapphire", primary: "#2563eb", secondary: "#64748b" },
  { id: "emerald", label: "Emerald", primary: "#059669", secondary: "#6b7280" },
  { id: "gold", label: "Gold", primary: "#ca8a04", secondary: "#78716c" },
  { id: "crimson", label: "Crimson", primary: "#dc2626", secondary: "#737373" },
  { id: "orchid", label: "Orchid", primary: "#c026d3", secondary: "#86868b" },
  { id: "mint", label: "Mint", primary: "#10b981", secondary: "#6b7280" },
  { id: "azure", label: "Azure", primary: "#0284c7", secondary: "#64748b" },
  { id: "copper", label: "Copper", primary: "#c2410c", secondary: "#78716c" },
  { id: "obsidian", label: "Obsidian", primary: "#18181b", secondary: "#71717a" },
];

const APPLE_LIGHT: ModeSurfaces = {
  backgroundPrimary: "#f5f5f7",
  backgroundSecondary: "#fafafa",
  backgroundTertiary: "#ececef",
  surfacePrimary: "#ffffff",
  surfaceSecondary: "#fafafa",
  surfaceTertiary: "#f5f5f7",
  surfaceElevated: "#ffffff",
  surfaceFloating: "#ffffff",
  textPrimary: "#1d1d1f",
  textSecondary: "#6e6e73",
  textTertiary: "#86868b",
  textQuaternary: "#c7c7cc",
  borderSubtle: "#e8e8ed",
  borderDefault: "#d2d2d7",
  borderStrong: "#c7c7cc",
};

const APPLE_DARK: ModeSurfaces = {
  backgroundPrimary: "#1c1c1e",
  backgroundSecondary: "#000000",
  backgroundTertiary: "#2c2c2e",
  surfacePrimary: "#2c2c2e",
  surfaceSecondary: "#3a3a3c",
  surfaceTertiary: "#48484a",
  surfaceElevated: "#3a3a3c",
  surfaceFloating: "#48484a",
  textPrimary: "#f5f5f7",
  textSecondary: "#aeaeb2",
  textTertiary: "#8e8e93",
  textQuaternary: "#636366",
  borderSubtle: "#3a3a3c",
  borderDefault: "#48484a",
  borderStrong: "#636366",
};

export const THEME_PRESETS: ThemePresetDef[] = [
  {
    id: "default",
    label: "Default",
    description: "Balanced blue",
    preset: "default",
    radius: "balanced",
    primary: "#0071e3",
    secondary: "#86868b",
    light: APPLE_LIGHT,
    dark: APPLE_DARK,
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Quiet mono",
    preset: "minimal",
    radius: "sharp",
    primary: "#424245",
    secondary: "#0071e3",
    light: {
      backgroundPrimary: "#ffffff",
      backgroundSecondary: "#f7f7f7",
      backgroundTertiary: "#efefef",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#f4f4f4",
      surfaceTertiary: "#ebebeb",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#ffffff",
      textPrimary: "#111111",
      textSecondary: "#555555",
      textTertiary: "#777777",
      textQuaternary: "#aaaaaa",
      borderSubtle: "#ececec",
      borderDefault: "#d8d8d8",
      borderStrong: "#bdbdbd",
    },
    dark: {
      backgroundPrimary: "#0a0a0a",
      backgroundSecondary: "#000000",
      backgroundTertiary: "#141414",
      surfacePrimary: "#141414",
      surfaceSecondary: "#1f1f1f",
      surfaceTertiary: "#2a2a2a",
      surfaceElevated: "#1f1f1f",
      surfaceFloating: "#2a2a2a",
      textPrimary: "#f5f5f5",
      textSecondary: "#a3a3a3",
      textTertiary: "#737373",
      textQuaternary: "#525252",
      borderSubtle: "#1f1f1f",
      borderDefault: "#2a2a2a",
      borderStrong: "#404040",
    },
  },
  {
    id: "bold",
    label: "Bold",
    description: "Strong accent",
    preset: "bold",
    radius: "soft",
    primary: "#0a84ff",
    secondary: "#ff375f",
    light: {
      backgroundPrimary: "#eef4ff",
      backgroundSecondary: "#f7faff",
      backgroundTertiary: "#e0eaff",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#eef4ff",
      surfaceTertiary: "#e0eaff",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#f7faff",
      textPrimary: "#0b1f3a",
      textSecondary: "#3d5a80",
      textTertiary: "#5c7a9e",
      textQuaternary: "#9bb0c9",
      borderSubtle: "#d5e4ff",
      borderDefault: "#b7cefa",
      borderStrong: "#8aadeb",
    },
    dark: {
      backgroundPrimary: "#07111f",
      backgroundSecondary: "#04090f",
      backgroundTertiary: "#0e1a2e",
      surfacePrimary: "#0e1a2e",
      surfaceSecondary: "#15243c",
      surfaceTertiary: "#1d2f4c",
      surfaceElevated: "#15243c",
      surfaceFloating: "#1d2f4c",
      textPrimary: "#eaf2ff",
      textSecondary: "#9db4d4",
      textTertiary: "#7a95b8",
      textQuaternary: "#4f688a",
      borderSubtle: "#15243c",
      borderDefault: "#1d2f4c",
      borderStrong: "#2e466c",
    },
  },
  {
    id: "playful",
    label: "Playful",
    description: "Soft & lively",
    preset: "playful",
    radius: "soft",
    primary: "#30d158",
    secondary: "#ff9f0a",
    light: {
      backgroundPrimary: "#f3fbf5",
      backgroundSecondary: "#f9fef9",
      backgroundTertiary: "#e6f6ea",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#eef9f1",
      surfaceTertiary: "#e0f3e6",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#f9fef9",
      textPrimary: "#12301c",
      textSecondary: "#3f6b4d",
      textTertiary: "#5f8a6b",
      textQuaternary: "#9cbca6",
      borderSubtle: "#d5edd9",
      borderDefault: "#b9dfc1",
      borderStrong: "#8fc89b",
    },
    dark: {
      backgroundPrimary: "#0b1710",
      backgroundSecondary: "#06100a",
      backgroundTertiary: "#122218",
      surfacePrimary: "#122218",
      surfaceSecondary: "#1a3022",
      surfaceTertiary: "#243e2d",
      surfaceElevated: "#1a3022",
      surfaceFloating: "#243e2d",
      textPrimary: "#e8f8ec",
      textSecondary: "#9ec9ab",
      textTertiary: "#7aaa88",
      textQuaternary: "#4f735b",
      borderSubtle: "#1a3022",
      borderDefault: "#243e2d",
      borderStrong: "#355742",
    },
  },
  {
    id: "corporate",
    label: "Corporate",
    description: "Sharp & formal",
    preset: "corporate",
    radius: "sharp",
    primary: "#1d4ed8",
    secondary: "#515154",
    light: {
      backgroundPrimary: "#f1f5f9",
      backgroundSecondary: "#f8fafc",
      backgroundTertiary: "#e2e8f0",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#f1f5f9",
      surfaceTertiary: "#e2e8f0",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#f8fafc",
      textPrimary: "#0f172a",
      textSecondary: "#475569",
      textTertiary: "#64748b",
      textQuaternary: "#94a3b8",
      borderSubtle: "#e2e8f0",
      borderDefault: "#cbd5e1",
      borderStrong: "#94a3b8",
    },
    dark: {
      backgroundPrimary: "#0f172a",
      backgroundSecondary: "#020617",
      backgroundTertiary: "#1e293b",
      surfacePrimary: "#1e293b",
      surfaceSecondary: "#334155",
      surfaceTertiary: "#475569",
      surfaceElevated: "#334155",
      surfaceFloating: "#475569",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1",
      textTertiary: "#94a3b8",
      textQuaternary: "#64748b",
      borderSubtle: "#1e293b",
      borderDefault: "#334155",
      borderStrong: "#475569",
    },
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Deep indigo",
    preset: "default",
    radius: "balanced",
    primary: "#6366f1",
    secondary: "#94a3b8",
    light: {
      backgroundPrimary: "#eef0ff",
      backgroundSecondary: "#f7f7ff",
      backgroundTertiary: "#e0e4ff",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#eef0ff",
      surfaceTertiary: "#e0e4ff",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#f7f7ff",
      textPrimary: "#1e1b4b",
      textSecondary: "#4338ca",
      textTertiary: "#6366f1",
      textQuaternary: "#a5b4fc",
      borderSubtle: "#ddd6fe",
      borderDefault: "#c4b5fd",
      borderStrong: "#a78bfa",
    },
    dark: {
      backgroundPrimary: "#0f1029",
      backgroundSecondary: "#070714",
      backgroundTertiary: "#17183a",
      surfacePrimary: "#17183a",
      surfaceSecondary: "#22245a",
      surfaceTertiary: "#2e316f",
      surfaceElevated: "#22245a",
      surfaceFloating: "#2e316f",
      textPrimary: "#eef0ff",
      textSecondary: "#c7c9f5",
      textTertiary: "#a5a8e8",
      textQuaternary: "#6b70b8",
      borderSubtle: "#22245a",
      borderDefault: "#2e316f",
      borderStrong: "#4247a0",
    },
  },
  {
    id: "dawn",
    label: "Dawn",
    description: "Warm morning",
    preset: "default",
    radius: "soft",
    primary: "#f59e0b",
    secondary: "#78716c",
    light: {
      backgroundPrimary: "#fff7ed",
      backgroundSecondary: "#fffbf5",
      backgroundTertiary: "#ffedd5",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#fff7ed",
      surfaceTertiary: "#ffedd5",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#fffbf5",
      textPrimary: "#431407",
      textSecondary: "#9a3412",
      textTertiary: "#c2410c",
      textQuaternary: "#fdba74",
      borderSubtle: "#fed7aa",
      borderDefault: "#fdba74",
      borderStrong: "#fb923c",
    },
    dark: {
      backgroundPrimary: "#1c1208",
      backgroundSecondary: "#100a04",
      backgroundTertiary: "#2a1a0c",
      surfacePrimary: "#2a1a0c",
      surfaceSecondary: "#3b2512",
      surfaceTertiary: "#4c3018",
      surfaceElevated: "#3b2512",
      surfaceFloating: "#4c3018",
      textPrimary: "#fff7ed",
      textSecondary: "#fdba74",
      textTertiary: "#fb923c",
      textQuaternary: "#9a3412",
      borderSubtle: "#3b2512",
      borderDefault: "#4c3018",
      borderStrong: "#6b3f1c",
    },
  },
  {
    id: "forest",
    label: "Forest",
    description: "Calm green",
    preset: "default",
    radius: "balanced",
    primary: "#15803d",
    secondary: "#6b7280",
    light: {
      backgroundPrimary: "#f0fdf4",
      backgroundSecondary: "#f7fef9",
      backgroundTertiary: "#dcfce7",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#ecfdf3",
      surfaceTertiary: "#dcfce7",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#f7fef9",
      textPrimary: "#14532d",
      textSecondary: "#166534",
      textTertiary: "#15803d",
      textQuaternary: "#86efac",
      borderSubtle: "#bbf7d0",
      borderDefault: "#86efac",
      borderStrong: "#4ade80",
    },
    dark: {
      backgroundPrimary: "#0a1a10",
      backgroundSecondary: "#051008",
      backgroundTertiary: "#12261a",
      surfacePrimary: "#12261a",
      surfaceSecondary: "#1a3324",
      surfaceTertiary: "#234030",
      surfaceElevated: "#1a3324",
      surfaceFloating: "#234030",
      textPrimary: "#ecfdf3",
      textSecondary: "#86efac",
      textTertiary: "#4ade80",
      textQuaternary: "#166534",
      borderSubtle: "#1a3324",
      borderDefault: "#234030",
      borderStrong: "#2f5740",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Cool teal",
    preset: "default",
    radius: "balanced",
    primary: "#0e7490",
    secondary: "#64748b",
    light: {
      backgroundPrimary: "#ecfeff",
      backgroundSecondary: "#f5feff",
      backgroundTertiary: "#cffafe",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#e6fafc",
      surfaceTertiary: "#cffafe",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#f5feff",
      textPrimary: "#164e63",
      textSecondary: "#0e7490",
      textTertiary: "#0891b2",
      textQuaternary: "#67e8f9",
      borderSubtle: "#a5f3fc",
      borderDefault: "#67e8f9",
      borderStrong: "#22d3ee",
    },
    dark: {
      backgroundPrimary: "#071a1f",
      backgroundSecondary: "#041014",
      backgroundTertiary: "#0d2830",
      surfacePrimary: "#0d2830",
      surfaceSecondary: "#143640",
      surfaceTertiary: "#1c4552",
      surfaceElevated: "#143640",
      surfaceFloating: "#1c4552",
      textPrimary: "#ecfeff",
      textSecondary: "#a5f3fc",
      textTertiary: "#67e8f9",
      textQuaternary: "#0e7490",
      borderSubtle: "#143640",
      borderDefault: "#1c4552",
      borderStrong: "#275f70",
    },
  },
  {
    id: "sunset",
    label: "Sunset",
    description: "Warm coral",
    preset: "default",
    radius: "soft",
    primary: "#ea580c",
    secondary: "#78716c",
    light: {
      backgroundPrimary: "#fff5f2",
      backgroundSecondary: "#fffaf8",
      backgroundTertiary: "#ffe4dc",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#fff1ec",
      surfaceTertiary: "#ffe4dc",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#fffaf8",
      textPrimary: "#7c2d12",
      textSecondary: "#9a3412",
      textTertiary: "#c2410c",
      textQuaternary: "#fdba74",
      borderSubtle: "#fed7aa",
      borderDefault: "#fdba74",
      borderStrong: "#fb923c",
    },
    dark: {
      backgroundPrimary: "#1f0f0a",
      backgroundSecondary: "#140805",
      backgroundTertiary: "#2e1710",
      surfacePrimary: "#2e1710",
      surfaceSecondary: "#3f2118",
      surfaceTertiary: "#512c20",
      surfaceElevated: "#3f2118",
      surfaceFloating: "#512c20",
      textPrimary: "#fff5f2",
      textSecondary: "#fdba74",
      textTertiary: "#fb923c",
      textQuaternary: "#9a3412",
      borderSubtle: "#3f2118",
      borderDefault: "#512c20",
      borderStrong: "#6b3a2a",
    },
  },
  {
    id: "mono",
    label: "Mono",
    description: "Neutral gray",
    preset: "minimal",
    radius: "sharp",
    primary: "#525252",
    secondary: "#a3a3a3",
    light: {
      backgroundPrimary: "#f5f5f5",
      backgroundSecondary: "#fafafa",
      backgroundTertiary: "#e5e5e5",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#f5f5f5",
      surfaceTertiary: "#e5e5e5",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#fafafa",
      textPrimary: "#171717",
      textSecondary: "#525252",
      textTertiary: "#737373",
      textQuaternary: "#a3a3a3",
      borderSubtle: "#e5e5e5",
      borderDefault: "#d4d4d4",
      borderStrong: "#a3a3a3",
    },
    dark: {
      backgroundPrimary: "#171717",
      backgroundSecondary: "#0a0a0a",
      backgroundTertiary: "#262626",
      surfacePrimary: "#262626",
      surfaceSecondary: "#404040",
      surfaceTertiary: "#525252",
      surfaceElevated: "#404040",
      surfaceFloating: "#525252",
      textPrimary: "#fafafa",
      textSecondary: "#d4d4d4",
      textTertiary: "#a3a3a3",
      textQuaternary: "#737373",
      borderSubtle: "#262626",
      borderDefault: "#404040",
      borderStrong: "#525252",
    },
  },
  {
    id: "contrast",
    label: "Contrast",
    description: "High contrast",
    preset: "corporate",
    radius: "sharp",
    primary: "#111111",
    secondary: "#525252",
    light: {
      backgroundPrimary: "#ffffff",
      backgroundSecondary: "#f0f0f0",
      backgroundTertiary: "#e0e0e0",
      surfacePrimary: "#ffffff",
      surfaceSecondary: "#f0f0f0",
      surfaceTertiary: "#e0e0e0",
      surfaceElevated: "#ffffff",
      surfaceFloating: "#ffffff",
      textPrimary: "#000000",
      textSecondary: "#222222",
      textTertiary: "#444444",
      textQuaternary: "#777777",
      borderSubtle: "#d0d0d0",
      borderDefault: "#000000",
      borderStrong: "#000000",
    },
    dark: {
      backgroundPrimary: "#000000",
      backgroundSecondary: "#000000",
      backgroundTertiary: "#111111",
      surfacePrimary: "#111111",
      surfaceSecondary: "#1a1a1a",
      surfaceTertiary: "#262626",
      surfaceElevated: "#1a1a1a",
      surfaceFloating: "#262626",
      textPrimary: "#ffffff",
      textSecondary: "#f0f0f0",
      textTertiary: "#d0d0d0",
      textQuaternary: "#a0a0a0",
      borderSubtle: "#333333",
      borderDefault: "#ffffff",
      borderStrong: "#ffffff",
    },
  },
];

export const STORAGE_KEY = "devkit-playground-theme";

export type ThemePrefs = {
  appearance: Appearance;
  accentId: AccentId;
  themeId: ThemePresetId;
  colorSource: ColorSource;
};

export const DEFAULT_PREFS: ThemePrefs = {
  appearance: "system",
  accentId: "blue",
  themeId: "default",
  colorSource: "theme",
};

export function loadPrefs(): ThemePrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw) as Partial<ThemePrefs>;
    const accentOk = ACCENTS.some((a) => a.id === parsed.accentId);
    const themeOk = THEME_PRESETS.some((t) => t.id === parsed.themeId);
    const appearance: Appearance =
      parsed.appearance === "dark" || parsed.appearance === "light" || parsed.appearance === "system"
        ? parsed.appearance
        : DEFAULT_PREFS.appearance;
    const colorSource: ColorSource =
      parsed.colorSource === "accent" || parsed.colorSource === "theme"
        ? parsed.colorSource
        : DEFAULT_PREFS.colorSource;
    return {
      appearance,
      accentId: accentOk ? (parsed.accentId as AccentId) : DEFAULT_PREFS.accentId,
      themeId: themeOk ? (parsed.themeId as ThemePresetId) : DEFAULT_PREFS.themeId,
      colorSource,
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

export function themeById(id: ThemePresetId): ThemePresetDef {
  return THEME_PRESETS.find((t) => t.id === id) ?? THEME_PRESETS[0]!;
}

export function resolveAppearance(appearance: Appearance): "light" | "dark" {
  if (appearance === "light" || appearance === "dark") return appearance;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

/** Effective primary: ColorPalette overrides only this token. */
export function resolvePrimary(accent: AccentDef, theme: ThemePresetDef, colorSource: ColorSource): string {
  return colorSource === "accent" ? accent.primary : theme.primary;
}

export function buildThemeConfig(
  accent: AccentDef,
  theme: ThemePresetDef,
  colorSource: ColorSource = "theme"
): ThemeConfig {
  return {
    devkit: "1.0",
    template: "vite-express-tauri",
    site: { name: "DevKit Playground", url: "http://localhost:5173" },
    theme: {
      preset: theme.preset,
      colors: {
        primary: resolvePrimary(accent, theme, colorSource),
        secondary: theme.secondary,
      },
      fonts: { sans: "system", mono: "system", display: "system" },
      radius: theme.radius,
      darkMode: true,
      darkModeStrategy: "class",
    },
  };
}

function surfaceBlock(selector: string, s: ModeSurfaces): string {
  return `${selector} {
  --color-background-primary: ${s.backgroundPrimary};
  --color-background-secondary: ${s.backgroundSecondary};
  --color-background-tertiary: ${s.backgroundTertiary};
  --color-surface-primary: ${s.surfacePrimary};
  --color-surface-secondary: ${s.surfaceSecondary};
  --color-surface-tertiary: ${s.surfaceTertiary};
  --color-surface-elevated: ${s.surfaceElevated};
  --color-surface-floating: ${s.surfaceFloating};
  --color-text-primary: ${s.textPrimary};
  --color-text-secondary: ${s.textSecondary};
  --color-text-tertiary: ${s.textTertiary};
  --color-text-quaternary: ${s.textQuaternary};
  --color-text-disabled: ${s.textQuaternary};
  --color-border-subtle: ${s.borderSubtle};
  --color-border-default: ${s.borderDefault};
  --color-border-strong: ${s.borderStrong};
  --elevation-0-bg: ${s.backgroundPrimary};
  --elevation-1-bg: ${s.surfacePrimary};
  --elevation-1-border: ${s.borderSubtle};
  --elevation-2-bg: ${s.surfaceElevated};
  --elevation-2-border: ${s.borderDefault};
  --elevation-3-bg: ${s.surfaceFloating};
  --elevation-3-border: ${s.borderDefault};
  --scrollbar-thumb: ${s.borderStrong};
  --scrollbar-thumb-hover: ${s.textTertiary};
  --scrollbar-thumb-active: ${s.textSecondary};
  --scrollbar-track-subtle: ${s.surfaceSecondary};
}`;
}

/** Theme-owned surfaces/bg/cards/hover — applied after base CLI CSS. */
export function buildSurfaceOverrideCSS(theme: ThemePresetDef): string {
  return `/* Theme surface system: ${theme.id} */
${surfaceBlock(":root", theme.light)}
${surfaceBlock('[data-theme="dark"], .dark', theme.dark)}
`;
}
