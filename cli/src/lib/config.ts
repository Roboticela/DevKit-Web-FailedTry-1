import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface DevKitConfig {
  $schema?: string;
  devkit: string;
  template: "nextjs-compact" | "vite-express-tauri";
  site: {
    name: string;
    url: string;
    icon?: string;
    description?: string;
    /**
     * Branding and marketing copy live here (paths under /public, taglines, etc.).
     * Registry components should read from config so `devkit update` can refresh code without losing your values.
     */
    branding?: Record<string, string | undefined>;
  };
  theme?: {
    preset?: string;
    colors?: { primary?: string; secondary?: string };
    fonts?: { sans?: string; mono?: string; display?: string };
    radius?: string;
    darkMode?: boolean;
    darkModeStrategy?: "class" | "media";
  };
  auth?: Record<string, unknown>;
  subscriptions?: Record<string, unknown>;
  storage?: Record<string, unknown>;
  database?: { url?: string };
}

export interface DevKitLock {
  lockVersion: number;
  template: string;
  components: Record<string, {
    version: string;
    variant?: string | null;
    resolved: string;
    integrity?: string;
    installedAt: string;
  }>;
}

const CONFIG_FILE = "devkit.config.json";
const LOCK_FILE = "devkit.lock.json";

/** Stable URL for editors (works before/without the public registry host). */
export const DEVKIT_CONFIG_SCHEMA_URL =
  "https://raw.githubusercontent.com/Roboticela/DevKit/main/cli/schemas/devkit-config.json";

export function configExists(cwd = process.cwd()): boolean {
  return existsSync(join(cwd, CONFIG_FILE));
}

export function readConfig(cwd = process.cwd()): DevKitConfig {
  const path = join(cwd, CONFIG_FILE);
  if (!existsSync(path)) throw new Error(`devkit.config.json not found. Run 'devkit init' first.`);
  return JSON.parse(readFileSync(path, "utf-8")) as DevKitConfig;
}

export function writeConfig(config: DevKitConfig, cwd = process.cwd()): void {
  writeFileSync(join(cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + "\n");
}

export function readLock(cwd = process.cwd()): DevKitLock {
  const path = join(cwd, LOCK_FILE);
  if (!existsSync(path)) return { lockVersion: 1, template: "", components: {} };
  return JSON.parse(readFileSync(path, "utf-8")) as DevKitLock;
}

export function writeLock(lock: DevKitLock, cwd = process.cwd()): void {
  writeFileSync(join(cwd, LOCK_FILE), JSON.stringify(lock, null, 2) + "\n");
}

export function getInstalledComponents(cwd = process.cwd()): string[] {
  const lock = readLock(cwd);
  return Object.keys(lock.components);
}

export function isComponentInstalled(name: string, cwd = process.cwd()): boolean {
  return name in readLock(cwd).components;
}

export function defaultConfig(template: DevKitConfig["template"], siteName: string, siteUrl: string): DevKitConfig {
  return {
    $schema: DEVKIT_CONFIG_SCHEMA_URL,
    devkit: "1.0",
    template,
    site: { name: siteName, url: siteUrl },
    theme: {
      preset: "default",
      colors: { primary: "#6366f1", secondary: "#f59e0b" },
      fonts: { sans: "Inter", mono: "JetBrains Mono", display: "Inter" },
      radius: "md",
      darkMode: true,
      darkModeStrategy: "class",
    },
  };
}
