import * as React from "react";
import { DEFAULT_STORAGE_KEY, getThemeInitScript } from "./theme";

export interface ThemeScriptProps {
  storageKey?: string;
  /** Optional nonce for CSP. */
  nonce?: string;
}

/**
 * Inline boot script for `<head>` — applies stored / system theme before paint (no FOUC).
 */
export function ThemeScript({ storageKey = DEFAULT_STORAGE_KEY, nonce }: ThemeScriptProps) {
  const code = getThemeInitScript(storageKey);
  return <script nonce={nonce} dangerouslySetInnerHTML={{ __html: code }} />;
}
