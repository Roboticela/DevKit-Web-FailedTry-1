import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, "../../components");

const require = createRequire(import.meta.url);

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export interface ComponentEntry {
  name: string;
  displayName: string;
  description: string;
  category: string;
  templates: string[];
  platforms: string[];
  hasVariants: boolean;
  variants?: string[];
  latestVersion: string;
  tags: string[];
}

export interface RegistryIndex {
  version: string;
  updatedAt: string;
  components: ComponentEntry[];
}

export function getRegistryIndex(): RegistryIndex {
  return readJson<RegistryIndex>(join(COMPONENTS_DIR, "registry.json"));
}

export function getComponentMeta(name: string) {
  const path = join(COMPONENTS_DIR, name, "component.json");
  if (!existsSync(path)) return null;
  return readJson<Record<string, unknown>>(path);
}

export function getManifest(name: string, template: string, version: string, variant?: string) {
  const base = join(COMPONENTS_DIR, name, template, `v${version.split(".")[0]}`);
  const manifestPath = variant
    ? join(base, "variants", variant, "manifest.json")
    : join(base, "manifest.json");
  if (!existsSync(manifestPath)) return null;
  return readJson<Record<string, unknown>>(manifestPath);
}

export function resolveVersion(name: string, requested: string): string | null {
  const meta = getComponentMeta(name);
  if (!meta) return null;
  const versions = meta["versions"] as { latest: string; history: { version: string }[] };
  if (requested === "latest") return versions.latest;
  const found = versions.history.find((h) => h.version === requested);
  return found ? found.version : null;
}
