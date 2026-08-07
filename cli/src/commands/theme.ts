import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import chalk from "chalk";
import { readConfig, writeConfig } from "../lib/config.js";
import { generateThemeCSS } from "../lib/theme.js";
import { log } from "../lib/logger.js";

function getCssPath(template: string, cwd: string): string {
  return template === "nextjs-compact"
    ? join(cwd, "app", "globals.css")
    : join(cwd, "src", "index.css");
}

function patchCss(cssPath: string, newBlock: string): void {
  const existing = existsSync(cssPath) ? readFileSync(cssPath, "utf-8") : "";
  const userSection = existing
    .replace(/\/\* ── DevKit Managed Theme Block[\s\S]*?── End DevKit Managed Theme Block ── \*\//, "")
    .trimStart();
  writeFileSync(cssPath, newBlock + userSection);
}

export function themeApplyCommand(cwd = process.cwd()) {
  const config = readConfig(cwd);
  const css = generateThemeCSS(config);
  patchCss(getCssPath(config.template, cwd), css);
  log.success("Theme applied to CSS.");
}

export function themePreviewCommand(cwd = process.cwd()) {
  const config = readConfig(cwd);
  const css = generateThemeCSS(config);
  log.blank();
  console.log(chalk.dim(css.split("\n").map((l) => "  " + l).join("\n")));
}

export function themePresetCommand(preset: string, cwd = process.cwd()) {
  const VALID = ["default", "minimal", "bold", "playful", "corporate"];
  if (!VALID.includes(preset)) {
    log.error(`Unknown preset '${preset}'. Valid: ${VALID.join(", ")}`);
    process.exit(1);
  }
  const config = readConfig(cwd);
  config.theme = { ...config.theme, preset };
  writeConfig(config, cwd);
  themeApplyCommand(cwd);
  log.success(`Switched to preset: ${preset}`);
}

export function themeSetCommand(key: string, value: string, cwd = process.cwd()) {
  const config = readConfig(cwd);
  // Only support: colors.primary, colors.secondary, fonts.sans, fonts.mono, radius, darkMode
  if (key === "colors.primary")   config.theme!.colors = { ...config.theme!.colors, primary: value };
  else if (key === "colors.secondary") config.theme!.colors = { ...config.theme!.colors, secondary: value };
  else if (key === "fonts.sans")  config.theme!.fonts = { ...config.theme!.fonts, sans: value };
  else if (key === "fonts.mono")  config.theme!.fonts = { ...config.theme!.fonts, mono: value };
  else if (key === "radius")      config.theme!.radius = value;
  else if (key === "darkMode")    config.theme!.darkMode = value === "true";
  else { log.error(`Unknown theme key: ${key}`); process.exit(1); }

  writeConfig(config, cwd);
  themeApplyCommand(cwd);
  log.success(`Set ${key} = ${chalk.cyan(value)}`);
}

export function themeListCommand(cwd = process.cwd()) {
  const config = readConfig(cwd);
  const t = config.theme ?? {};
  const primary = t.colors?.primary ?? "#0071e3";
  log.blank();
  console.log(`  ${chalk.bold("Preset")}          ${t.preset ?? "default"}`);
  console.log(`  ${chalk.bold("Primary")}         ${chalk.hex(primary)(t.colors?.primary ?? "#0071e3 (preset)")}`);
  console.log(`  ${chalk.bold("Secondary")}       ${t.colors?.secondary ?? "(preset)"}`);
  console.log(`  ${chalk.bold("Font sans")}       ${t.fonts?.sans ?? "system"}`);
  console.log(`  ${chalk.bold("Font mono")}       ${t.fonts?.mono ?? "system"}`);
  console.log(`  ${chalk.bold("Radius")}          ${t.radius ?? "balanced"}`);
  console.log(`  ${chalk.bold("Dark mode")}       ${t.darkMode !== false ? "enabled" : "disabled"}`);
  log.blank();
}

export function themeAuditCommand(_cwd = process.cwd()) {
  log.warn("Theme audit checks component files for hardcoded colors (not yet implemented in CLI).");
  log.info("This runs automatically in registry CI when submitting a component.");
}
