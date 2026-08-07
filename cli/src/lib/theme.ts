import type { DevKitConfig } from "./config.js";

// ── Colour math ───────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amount, g + (255 - g) * amount, b + (255 - b) * amount);
}

function darken(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function accessibleTextColor(bg: string): string {
  return contrastRatio(bg, "#ffffff") >= 4.5 ? "#ffffff" : "#1d1d1f";
}

function accentScale(primary: string) {
  return {
    50: lighten(primary, 0.92),
    100: lighten(primary, 0.84),
    200: lighten(primary, 0.68),
    300: lighten(primary, 0.48),
    400: lighten(primary, 0.24),
    500: primary,
    600: darken(primary, 0.12),
    700: darken(primary, 0.24),
    800: darken(primary, 0.36),
    900: darken(primary, 0.48),
  };
}

// ── Presets (constitution §82 branding — accent + radius personality) ─────────

const SYSTEM_SANS =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const SYSTEM_MONO =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

/** Radius personality → base step used for --radius-* scale (§18, §85). */
const RADIUS_PERSONALITY: Record<string, "sharp" | "balanced" | "soft"> = {
  none: "sharp",
  sm: "sharp",
  md: "balanced",
  lg: "soft",
  xl: "soft",
  full: "soft",
  sharp: "sharp",
  balanced: "balanced",
  soft: "soft",
};

const PRESETS: Record<
  string,
  { primary: string; secondary: string; radius: "sharp" | "balanced" | "soft" }
> = {
  default: { primary: "#0071e3", secondary: "#86868b", radius: "balanced" },
  minimal: { primary: "#424245", secondary: "#0071e3", radius: "sharp" },
  bold: { primary: "#0a84ff", secondary: "#ff375f", radius: "soft" },
  playful: { primary: "#30d158", secondary: "#ff9f0a", radius: "soft" },
  corporate: { primary: "#1d4ed8", secondary: "#515154", radius: "sharp" },
};

/** Constitution §18 radius scale, shifted by personality. */
function radiusTokens(personality: "sharp" | "balanced" | "soft"): Record<string, string> {
  const balanced = {
    0: "0px",
    1: "4px",
    2: "6px",
    3: "8px",
    4: "10px",
    5: "12px",
    6: "14px",
    7: "16px",
    8: "20px",
    9: "24px",
    10: "28px",
    full: "9999px",
  };
  if (personality === "balanced") return balanced;
  if (personality === "sharp") {
    return {
      0: "0px",
      1: "2px",
      2: "4px",
      3: "6px",
      4: "8px",
      5: "10px",
      6: "12px",
      7: "14px",
      8: "16px",
      9: "20px",
      10: "24px",
      full: "9999px",
    };
  }
  return {
    0: "0px",
    1: "6px",
    2: "8px",
    3: "10px",
    4: "12px",
    5: "14px",
    6: "16px",
    7: "20px",
    8: "24px",
    9: "28px",
    10: "32px",
    full: "9999px",
  };
}

// ── Token generator (Design Constitution §§01–38) ──────────────────────────────

export function generateThemeCSS(config: DevKitConfig): string {
  const theme = config.theme ?? {};
  const preset = PRESETS[theme.preset ?? "default"] ?? PRESETS.default;

  const primary = theme.colors?.primary ?? preset.primary;
  const secondary = theme.colors?.secondary ?? preset.secondary;
  const radiusKey = theme.radius ?? preset.radius;
  const personality =
    RADIUS_PERSONALITY[radiusKey] ??
    (preset.radius as "sharp" | "balanced" | "soft");
  const radii = radiusTokens(personality);
  const accent = accentScale(primary);
  const accentOn = accessibleTextColor(primary);

  const fontSans = theme.fonts?.sans;
  const fontMono = theme.fonts?.mono;
  const fontDisplay = theme.fonts?.display;

  const useSystemSans = !fontSans || fontSans === "system" || fontSans === "system-ui";
  const useSystemMono = !fontMono || fontMono === "system" || fontMono === "system-ui";
  const useSystemDisplay =
    !fontDisplay || fontDisplay === "system" || fontDisplay === "system-ui" || fontDisplay === fontSans;

  const googleFonts: string[] = [];
  if (!useSystemSans && fontSans) googleFonts.push(fontSans);
  if (!useSystemMono && fontMono && fontMono !== fontSans) googleFonts.push(fontMono);
  if (!useSystemDisplay && fontDisplay && fontDisplay !== fontSans) googleFonts.push(fontDisplay);

  const imports = [...new Set(googleFonts)]
    .map(
      (f) =>
        `@import url('https://fonts.googleapis.com/css2?family=${f.replace(/ /g, "+")}:wght@400;500;600;700;800&display=swap');`
    )
    .join("\n");

  const fontFamilySans = useSystemSans
    ? SYSTEM_SANS
    : `'${fontSans}', ${SYSTEM_SANS}`;
  const fontFamilyMono = useSystemMono
    ? SYSTEM_MONO
    : `'${fontMono}', ${SYSTEM_MONO}`;
  const fontFamilyDisplay = useSystemDisplay
    ? fontFamilySans
    : `'${fontDisplay}', ${SYSTEM_SANS}`;

  const date = new Date().toISOString().split("T")[0];

  return `/* ── DevKit Managed Theme Block — do not edit below this line ── */
/* ── Generated by @roboticela/devkit on ${date} ── */
/* ── Tokens follow DevKit Design Constitution (.cursor/rules/design-main-rule.mdc) ── */

${imports ? imports + "\n" : ""}
:root {
  /* ── Spacing (§01) — 4px base / 8px rhythm ── */
  --space-0: 0px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-14: 56px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;
  --space-40: 160px;
  --space-48: 192px;
  --space-64: 256px;

  /* ── Section spacing roles (§05) ── */
  --section-tight: var(--space-6);
  --section-normal: var(--space-8);
  --section-large: var(--space-12);
  --section-major: var(--space-16);
  --section-hero: var(--space-20);
  --section-hero-large: var(--space-24);

  /* ── Breakpoints (§02) — use in @media / JS ── */
  --bp-mobile: 480px;
  --bp-tablet: 768px;
  --bp-desktop: 1024px;
  --bp-large: 1280px;
  --bp-xl: 1536px;
  --bp-ultra: 1920px;

  /* ── Containers (§03) ── */
  --container-xs: 480px;
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 960px;
  --container-xl: 1200px;
  --container-2xl: 1440px;
  --container-3xl: 1600px;
  --container-full: 100%;
  --container-app: var(--container-2xl);
  --container-reading: 720px;
  --container-form: 640px;
  --container-dialog: 720px;

  /* ── Page padding roles (§04) — override per media query in app CSS ── */
  --page-padding: var(--space-4);

  /* ── Neutral primitives (§11) — light ── */
  --neutral-0: #ffffff;
  --neutral-50: #fafafa;
  --neutral-100: #f5f5f7;
  --neutral-150: #ececef;
  --neutral-200: #e8e8ed;
  --neutral-300: #d2d2d7;
  --neutral-400: #c7c7cc;
  --neutral-500: #86868b;
  --neutral-600: #6e6e73;
  --neutral-700: #515154;
  --neutral-800: #424245;
  --neutral-850: #3a3a3c;
  --neutral-900: #1d1d1f;
  --neutral-950: #141416;
  --neutral-1000: #000000;

  /* ── Accent scale (§14) ── */
  --accent-50: ${accent[50]};
  --accent-100: ${accent[100]};
  --accent-200: ${accent[200]};
  --accent-300: ${accent[300]};
  --accent-400: ${accent[400]};
  --accent-500: ${accent[500]};
  --accent-600: ${accent[600]};
  --accent-700: ${accent[700]};
  --accent-800: ${accent[800]};
  --accent-900: ${accent[900]};

  /* ── Semantic surfaces / text / border (§12) ── */
  --color-background-primary: var(--neutral-100);
  --color-background-secondary: var(--neutral-50);
  --color-background-tertiary: var(--neutral-150);

  --color-surface-primary: var(--neutral-0);
  --color-surface-secondary: var(--neutral-50);
  --color-surface-tertiary: var(--neutral-100);
  --color-surface-elevated: var(--neutral-0);
  --color-surface-floating: var(--neutral-0);

  --color-text-primary: var(--neutral-900);
  --color-text-secondary: var(--neutral-600);
  --color-text-tertiary: var(--neutral-500);
  --color-text-quaternary: var(--neutral-400);
  --color-text-disabled: var(--neutral-400);
  --color-text-inverse: var(--neutral-0);

  --color-border-subtle: var(--neutral-200);
  --color-border-default: var(--neutral-300);
  --color-border-strong: var(--neutral-400);

  --color-accent-primary: var(--accent-500);
  --color-accent-secondary: ${secondary};
  --color-accent-hover: var(--accent-400);
  --color-accent-pressed: var(--accent-600);
  --color-accent-subtle: var(--accent-100);
  --color-accent-on: ${accentOn};

  --color-success: #248a3d;
  --color-success-bg: #e8f8ed;
  --color-success-border: #34c759;
  --color-success-fg: #1b5e2a;

  --color-warning: #b25000;
  --color-warning-bg: #fff4e5;
  --color-warning-border: #ff9f0a;
  --color-warning-fg: #6b3200;

  --color-error: #d70015;
  --color-error-bg: #ffebee;
  --color-error-border: #ff3b30;
  --color-error-fg: #8b000e;

  --color-info: #0071e3;
  --color-info-bg: #e8f2fc;
  --color-info-border: #64d2ff;
  --color-info-fg: #003d7a;

  --color-focus: var(--accent-500);
  --color-selection: ${lighten(primary, 0.75)};
  --color-scrim: rgba(0, 0, 0, 0.45);

  /* ── Typography (§06–09) ── */
  --font-sans: ${fontFamilySans};
  --font-display: ${fontFamilyDisplay};
  --font-mono: ${fontFamilyMono};
  --font-text: var(--font-sans);
  --font-numeric: var(--font-sans);
  --font-code: var(--font-mono);

  --font-size-display-1: 64px;
  --font-size-display-2: 56px;
  --font-size-display-3: 48px;
  --font-size-title-1: 40px;
  --font-size-title-2: 32px;
  --font-size-title-3: 28px;
  --font-size-heading-1: 24px;
  --font-size-heading-2: 20px;
  --font-size-heading-3: 18px;
  --font-size-body-lg: 17px;
  --font-size-body: 16px;
  --font-size-body-sm: 14px;
  --font-size-label: 14px;
  --font-size-caption: 12px;
  --font-size-micro: 11px;
  --font-size-metric-xl: 48px;
  --font-size-metric-lg: 36px;
  --font-size-metric-md: 28px;
  --font-size-metric-sm: 20px;

  --line-height-display-1: 68px;
  --line-height-display-2: 60px;
  --line-height-display-3: 52px;
  --line-height-title-1: 48px;
  --line-height-title-2: 40px;
  --line-height-title-3: 36px;
  --line-height-heading-1: 32px;
  --line-height-heading-2: 28px;
  --line-height-heading-3: 24px;
  --line-height-body-lg: 26px;
  --line-height-body: 24px;
  --line-height-body-sm: 20px;
  --line-height-label: 20px;
  --line-height-caption: 16px;
  --line-height-micro: 14px;

  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-extrabold: 800;

  --tracking-display: -0.03em;
  --tracking-large-title: -0.025em;
  --tracking-title: -0.02em;
  --tracking-heading: -0.015em;
  --tracking-body: 0;
  --tracking-label: 0;
  --tracking-caption: 0.01em;
  --tracking-micro: 0.015em;
  --tracking-caps: 0.05em;

  /* ── Radius (§18) — personality: ${personality} ── */
  --radius-0: ${radii[0]};
  --radius-1: ${radii[1]};
  --radius-2: ${radii[2]};
  --radius-3: ${radii[3]};
  --radius-4: ${radii[4]};
  --radius-5: ${radii[5]};
  --radius-6: ${radii[6]};
  --radius-7: ${radii[7]};
  --radius-8: ${radii[8]};
  --radius-9: ${radii[9]};
  --radius-10: ${radii[10]};
  --radius-full: ${radii.full};
  --radius-control: var(--radius-4);
  --radius-button: var(--radius-5);
  --radius-card: var(--radius-7);
  --radius-panel: var(--radius-8);
  --radius-dialog: var(--radius-8);
  --radius-sheet: var(--radius-9);

  /* ── Control heights (§20) ── */
  --control-height-xs: 28px;
  --control-height-sm: 32px;
  --control-height-md: 40px;
  --control-height-lg: 48px;
  --control-height-xl: 56px;
  --touch-target-min: 44px;
  --touch-target: 48px;

  /* ── Icon sizes (§22) ── */
  --icon-12: 12px;
  --icon-14: 14px;
  --icon-16: 16px;
  --icon-18: 18px;
  --icon-20: 20px;
  --icon-24: 24px;
  --icon-28: 28px;
  --icon-32: 32px;
  --icon-40: 40px;
  --icon-48: 48px;

  /* ── Border (§29) ── */
  --border-width-subtle: 1px;
  --border-width-default: 1px;
  --border-width-strong: 1px;
  --border-width-emphasis: 2px;
  --focus-ring-width: 2px;
  --focus-ring-offset: 2px;

  /* ── Elevation (§28) — tonal only (no drop shadows) ── */
  --elevation-0-bg: var(--color-background-primary);
  --elevation-1-bg: var(--color-surface-primary);
  --elevation-1-border: var(--color-border-subtle);
  --elevation-2-bg: var(--color-surface-elevated);
  --elevation-2-border: var(--color-border-default);
  --elevation-3-bg: var(--color-surface-floating);
  --elevation-3-border: var(--color-border-default);
  --elevation-4-bg: var(--color-surface-floating);
  --elevation-4-border: var(--color-border-strong);
  --elevation-5-scrim: var(--color-scrim);

  /* ── Motion (§31–32) ── */
  --duration-instant: 0ms;
  --duration-micro: 80ms;
  --duration-fast: 120ms;
  --duration-quick: 160ms;
  --duration-standard: 200ms;
  --duration-smooth: 240ms;
  --duration-medium: 300ms;
  --duration-large: 400ms;
  --duration-dramatic: 500ms;

  --ease-standard: cubic-bezier(0.25, 0.1, 0.25, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0, 0, 0.2, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-spring: cubic-bezier(0.34, 1.2, 0.64, 1);
  --ease-linear: linear;

  /* ── Blur (§35) — opt-in materials only ── */
  --blur-sm: 8px;
  --blur-md: 16px;
  --blur-lg: 24px;
  --blur-xl: 32px;
  --blur-2xl: 48px;

  /* ── Opacity (§36) ── */
  --opacity-0: 0;
  --opacity-5: 0.05;
  --opacity-8: 0.08;
  --opacity-10: 0.1;
  --opacity-12: 0.12;
  --opacity-16: 0.16;
  --opacity-24: 0.24;
  --opacity-32: 0.32;
  --opacity-50: 0.5;
  --opacity-64: 0.64;
  --opacity-80: 0.8;
  --opacity-90: 0.9;
  --opacity-100: 1;
  --opacity-disabled: 0.5;

  /* ── Z-index (§38) ── */
  --z-base: 0;
  --z-raised: 10;
  --z-sticky: 100;
  --z-navigation: 200;
  --z-floating: 300;
  --z-dropdown: 400;
  --z-popover: 500;
  --z-tooltip: 600;
  --z-drawer: 700;
  --z-modal: 800;
  --z-critical: 900;
  --z-system: 1000;

  /* ── Density (§83) — comfortable default ── */
  --density-scale: 1;
  --radius-personality: ${personality};

  /* ── Scrollbars (foundation chrome) ── */
  --scrollbar-size: var(--space-2);
  --scrollbar-size-thin: 6px;
  --scrollbar-thumb: var(--color-border-strong);
  --scrollbar-thumb-hover: var(--color-text-tertiary);
  --scrollbar-thumb-active: var(--color-text-secondary);
  --scrollbar-track: transparent;
  --scrollbar-track-subtle: var(--color-surface-secondary);
  --scrollbar-radius: var(--radius-full);
}
${
  theme.darkMode !== false
    ? `
[data-theme="dark"],
.dark {
  --neutral-0: #1c1c1e;
  --neutral-50: #2c2c2e;
  --neutral-100: #3a3a3c;
  --neutral-150: #48484a;
  --neutral-200: #545456;
  --neutral-300: #636366;
  --neutral-400: #8e8e93;
  --neutral-500: #98989d;
  --neutral-600: #aeaeb2;
  --neutral-700: #c7c7cc;
  --neutral-800: #d1d1d6;
  --neutral-850: #e5e5ea;
  --neutral-900: #f5f5f7;
  --neutral-950: #fafafa;
  --neutral-1000: #ffffff;

  --color-background-primary: #1c1c1e;
  --color-background-secondary: #000000;
  --color-background-tertiary: #2c2c2e;

  --color-surface-primary: #2c2c2e;
  --color-surface-secondary: #3a3a3c;
  --color-surface-tertiary: #48484a;
  --color-surface-elevated: #3a3a3c;
  --color-surface-floating: #48484a;

  --color-text-primary: #f5f5f7;
  --color-text-secondary: #aeaeb2;
  --color-text-tertiary: #8e8e93;
  --color-text-quaternary: #636366;
  --color-text-disabled: #636366;
  --color-text-inverse: #1c1c1e;

  --color-border-subtle: #3a3a3c;
  --color-border-default: #48484a;
  --color-border-strong: #636366;

  --color-accent-primary: ${lighten(primary, 0.18)};
  --color-accent-hover: ${lighten(primary, 0.28)};
  --color-accent-pressed: ${primary};
  --color-accent-subtle: ${darken(primary, 0.55)};
  --color-accent-on: #ffffff;

  --color-success: #30d158;
  --color-success-bg: #0d2818;
  --color-success-border: #30d158;
  --color-success-fg: #d8ffe4;

  --color-warning: #ff9f0a;
  --color-warning-bg: #2a1a00;
  --color-warning-border: #ff9f0a;
  --color-warning-fg: #ffe6bf;

  --color-error: #ff453a;
  --color-error-bg: #2a0606;
  --color-error-border: #ff453a;
  --color-error-fg: #ffd4d1;

  --color-info: #64d2ff;
  --color-info-bg: #00263d;
  --color-info-border: #64d2ff;
  --color-info-fg: #d6f3ff;

  --color-scrim: rgba(0, 0, 0, 0.55);
  --color-selection: ${darken(primary, 0.45)};
}
`
    : ""
}
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-micro: 0ms;
    --duration-fast: 0ms;
    --duration-quick: 80ms;
    --duration-standard: 100ms;
    --duration-smooth: 120ms;
    --duration-medium: 120ms;
    --duration-large: 120ms;
    --duration-dramatic: 120ms;
  }
}

/* ── Scrollbars — calm, thin, token-driven (no shadows / no gradients) ── */
*,
*::before,
*::after {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
}

*::-webkit-scrollbar {
  width: var(--scrollbar-size);
  height: var(--scrollbar-size);
}

*::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
  border-radius: var(--scrollbar-radius);
}

*::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb);
  border-radius: var(--scrollbar-radius);
  border: 2px solid transparent;
  background-clip: padding-box;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: var(--scrollbar-thumb-hover);
}

*::-webkit-scrollbar-thumb:active {
  background-color: var(--scrollbar-thumb-active);
}

*::-webkit-scrollbar-corner {
  background: transparent;
}

.dk-scroll {
  scrollbar-gutter: stable;
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track-subtle);
}

.dk-scroll::-webkit-scrollbar-track {
  background: var(--scrollbar-track-subtle);
}

.dk-scroll--thin {
  scrollbar-width: thin;
}

.dk-scroll--thin::-webkit-scrollbar {
  width: var(--scrollbar-size-thin);
  height: var(--scrollbar-size-thin);
}

.dk-scroll--thin::-webkit-scrollbar-thumb {
  border-width: 1px;
}

.dk-scroll--hidden {
  scrollbar-width: none;
}

.dk-scroll--hidden::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

@media (prefers-contrast: more) {
  :root {
    --scrollbar-thumb: var(--color-border-strong);
    --scrollbar-thumb-hover: var(--color-text-secondary);
    --scrollbar-thumb-active: var(--color-text-primary);
    --scrollbar-track: var(--color-surface-secondary);
  }

  *::-webkit-scrollbar-thumb {
    border-width: 0;
  }
}

/* ── End DevKit Managed Theme Block ── */

/* Your custom styles go here — DevKit will never modify below this line */
`;
}
