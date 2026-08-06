/**
 * Theme Provider (utilities) — re-exports the Theme Engine from dynamic-theme.
 * Prefer adding `dynamic-theme` and importing ThemeProvider from there in apps.
 */
export {
  ThemeProvider,
  useTheme,
  applyThemeToDocument,
  getSystemTheme,
  resolveTheme,
  getThemeInitScript,
  BUILT_IN_THEMES,
  DEFAULT_STORAGE_KEY,
} from "./ThemeEngine";
export type {
  BuiltInTheme,
  ThemeId,
  ThemeDefinition,
  ColorScheme,
  ThemeContextValue,
  ThemeProviderProps,
} from "./ThemeEngine";
export { ThemeScript } from "./ThemeScript";
export type { ThemeScriptProps } from "./ThemeScript";
