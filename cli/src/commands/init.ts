import { intro, outro, text, select } from "@clack/prompts";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { detectTemplate } from "../lib/detector.js";
import { writeConfig, writeLock, defaultConfig, configExists } from "../lib/config.js";
import { generateThemeCSS } from "../lib/theme.js";
import { log } from "../lib/logger.js";

export async function initCommand(cwd = process.cwd()) {
  if (configExists(cwd)) {
    log.warn("DevKit is already initialized in this project.");
    log.info("Run 'devkit doctor' to check configuration.");
    return;
  }

  intro("DevKit Init");

  const detected = detectTemplate(cwd);

  const template = detected !== "unknown"
    ? detected
    : await select({
        message: "Could not auto-detect template. Select manually:",
        options: [
          { value: "nextjs-compact", label: "NextJS Compact" },
          { value: "vite-express-tauri", label: "Wide Express (Vite + Express + Tauri)" },
        ],
      }) as string;

  if (detected !== "unknown") {
    log.success(`Detected template: ${template}`);
  }

  const siteName = await text({ message: "Site name", placeholder: "My App" }) as string;
  const siteUrl  = await text({ message: "Site URL",  placeholder: "https://myapp.com" }) as string;

  const preset = await select({
    message: "Theme preset",
    options: [
      { value: "default",   label: "Default    — System Blue (balanced)" },
      { value: "minimal",   label: "Minimal    — Neutral (sharp)" },
      { value: "bold",      label: "Bold       — Bright Blue (soft)" },
      { value: "playful",   label: "Playful    — Green (soft)" },
      { value: "corporate", label: "Corporate  — Deep Blue (sharp)" },
    ],
  }) as string;

  // Write config
  const config = defaultConfig(template as "nextjs-compact" | "vite-express-tauri", siteName, siteUrl);
  config.theme!.preset = preset;
  writeConfig(config, cwd);
  log.success("Created devkit.config.json");

  // Write lock
  writeLock({ lockVersion: 1, template, components: {} }, cwd);
  log.success("Created devkit.lock.json");

  // Generate theme CSS
  const themeCss = generateThemeCSS(config);
  const cssFile = template === "nextjs-compact" ? "app/globals.css" : "src/index.css";
  const cssPath = join(cwd, cssFile);
  if (existsSync(cssPath)) {
    const old = readFileSync(cssPath, "utf-8");
    const clean = old.replace(/\/\* ── DevKit Managed Theme Block[\s\S]*?── End DevKit Managed Theme Block ── \*\//, "").trimStart();
    writeFileSync(cssPath, themeCss + clean);
  } else {
    mkdirSync(join(cwd, template === "nextjs-compact" ? "app" : "src"), { recursive: true });
    writeFileSync(cssPath, themeCss);
  }
  log.success(`Applied theme to ${cssFile}`);

  // .devkit dir
  mkdirSync(join(cwd, ".devkit"), { recursive: true });

  outro("DevKit initialized! Run 'devkit list' to browse components.");
}
