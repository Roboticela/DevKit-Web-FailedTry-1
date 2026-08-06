/**
 * Theme Engine — core apply helpers (DOM only, no React).
 * Safe for ThemeScript (inline) and ThemeProvider.
 */

export type BuiltInTheme =
  | "light"
  | "dark"
  | "high-contrast"
  | "high-contrast-dark"
  | "system";

export type ThemeId = BuiltInTheme | (string & {});

export type ColorScheme = "light" | "dark";

export interface ThemeDefinition {
  id: string;
  label?: string;
  /** Maps to color-scheme / .dark for native controls */
  colorScheme?: ColorScheme;
  /** CSS custom properties applied on <html> for runtime / custom themes */
  vars?: Record<string, string>;
  /** Extra data-* attributes (values as strings) */
  attributes?: Record<string, string>;
}

export const BUILT_IN_THEMES: Exclude<BuiltInTheme, "system">[] = [
  "light",
  "dark",
  "high-contrast",
  "high-contrast-dark",
];

export const DEFAULT_STORAGE_KEY = "devkit-theme";

export function getSystemTheme(): ColorScheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function resolveTheme(theme: ThemeId, system: ColorScheme = getSystemTheme()): string {
  if (theme === "system") return system;
  return theme;
}

export function isDarkResolved(resolved: string, registry?: Map<string, ThemeDefinition>): boolean {
  if (resolved === "dark" || resolved === "high-contrast-dark") return true;
  const custom = registry?.get(resolved);
  return custom?.colorScheme === "dark";
}

export function isHighContrastResolved(resolved: string): boolean {
  return resolved === "high-contrast" || resolved === "high-contrast-dark";
}

export interface ApplyThemeOptions {
  resolved: string;
  registry?: Map<string, ThemeDefinition>;
  /** Runtime CSS var overrides (accent, etc.) */
  runtimeVars?: Record<string, string> | null;
  disableTransition?: boolean;
}

/**
 * Apply theme to <html> synchronously. Prefer calling before paint (ThemeScript).
 */
export function applyThemeToDocument({
  resolved,
  registry,
  runtimeVars,
  disableTransition = true,
}: ApplyThemeOptions): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;

  if (disableTransition) {
    root.dataset.themeTransition = "none";
  }

  root.dataset.theme = resolved;

  const dark = isDarkResolved(resolved, registry);
  root.classList.toggle("dark", dark);

  if (isHighContrastResolved(resolved) && resolved === "high-contrast") {
    root.dataset.contrast = "high";
  } else {
    delete root.dataset.contrast;
  }

  // Clear previous custom vars tracked on element
  const prev = root.getAttribute("data-theme-vars");
  if (prev) {
    for (const key of prev.split(" ")) {
      if (key) root.style.removeProperty(key);
    }
    root.removeAttribute("data-theme-vars");
  }

  const custom = registry?.get(resolved);
  const merged: Record<string, string> = {
    ...(custom?.vars ?? {}),
    ...(runtimeVars ?? {}),
  };

  const keys: string[] = [];
  for (const [key, value] of Object.entries(merged)) {
    const prop = key.startsWith("--") ? key : `--${key}`;
    root.style.setProperty(prop, value);
    keys.push(prop);
  }
  if (keys.length) {
    root.setAttribute("data-theme-vars", keys.join(" "));
  }

  if (custom?.attributes) {
    for (const [k, v] of Object.entries(custom.attributes)) {
      if (v == null || v === "") root.removeAttribute(k);
      else root.setAttribute(k, v);
    }
  }

  if (disableTransition) {
    // Force reflow then restore transitions on next frame
    void root.offsetHeight;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        delete root.dataset.themeTransition;
      });
    });
  }
}

/** Inline snippet for <head> — prevents FOUC. Keep in sync with applyThemeToDocument. */
export function getThemeInitScript(storageKey = DEFAULT_STORAGE_KEY): string {
  return `(function(){try{var k=${JSON.stringify(storageKey)};var t=localStorage.getItem(k)||"system";var m=window.matchMedia("(prefers-color-scheme: dark)");var sys=m.matches?"dark":"light";var r=t==="system"?sys:t;var d=document.documentElement;d.setAttribute("data-theme",r);d.classList.toggle("dark",r==="dark"||r==="high-contrast-dark");if(r==="high-contrast")d.setAttribute("data-contrast","high");else d.removeAttribute("data-contrast");}catch(e){}})();`;
}
