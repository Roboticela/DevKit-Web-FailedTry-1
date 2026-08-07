import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REGISTRY_ROOT = join(__dirname, "../..");

export type PackageKind = "component" | "page" | "scaffold";
export type CategoryId = "components" | "pages" | "scaffolds";

const KIND_DIR: Record<PackageKind, CategoryId> = {
  component: "components",
  page: "pages",
  scaffold: "scaffolds",
};

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

export interface CategoryEntry {
  id: CategoryId;
  name: string;
  description: string;
  directory: string;
}

export interface CategoriesCatalog {
  version: string;
  categories: CategoryEntry[];
}

export interface RegistryPackage {
  id?: number;
  name: string;
  displayName: string;
  description: string;
  category: CategoryId;
  kind: PackageKind;
  stub?: boolean;
  templates: string[];
  platforms: string[];
  hasVariants: boolean;
  variants?: string[];
  latestVersion: string;
  tags: string[];
}

/** @deprecated Use RegistryPackage — kept for route compatibility */
export type ComponentEntry = RegistryPackage;

export interface RegistryIndex {
  version: string;
  updatedAt: string;
  components?: RegistryPackage[];
  pages?: RegistryPackage[];
  scaffolds?: RegistryPackage[];
}

export function getCategoriesCatalog(): CategoriesCatalog {
  return readJson<CategoriesCatalog>(join(REGISTRY_ROOT, "categories.json"));
}

function categoryDir(category: CategoryId): string {
  return join(REGISTRY_ROOT, category);
}

function packagesFromIndex(category: CategoryId, index: RegistryIndex): RegistryPackage[] {
  const list =
    category === "components"
      ? index.components ?? []
      : category === "pages"
        ? index.pages ?? []
        : index.scaffolds ?? [];

  return list.map((pkg) => ({
    ...pkg,
    category,
    kind:
      pkg.kind ??
      (category === "components" ? "component" : category === "pages" ? "page" : "scaffold"),
  }));
}

export function getRegistryIndex(category: CategoryId = "components"): RegistryIndex {
  return readJson<RegistryIndex>(join(categoryDir(category), "registry.json"));
}

export function listPackages(filters: {
  category?: CategoryId;
  kind?: PackageKind;
  template?: string;
} = {}): RegistryPackage[] {
  const categories: CategoryId[] = filters.category
    ? [filters.category]
    : ["components", "pages", "scaffolds"];

  let out: RegistryPackage[] = [];
  for (const category of categories) {
    const indexPath = join(categoryDir(category), "registry.json");
    if (!existsSync(indexPath)) continue;
    out = out.concat(packagesFromIndex(category, readJson<RegistryIndex>(indexPath)));
  }

  if (filters.kind) out = out.filter((pkg) => pkg.kind === filters.kind);
  if (filters.template) {
    out = out.filter((pkg) => pkg.templates.includes(filters.template!));
  }
  return out;
}

function resolvePackageDir(name: string): string | null {
  for (const category of ["components", "pages", "scaffolds"] as CategoryId[]) {
    const dir = join(categoryDir(category), name);
    if (existsSync(join(dir, "component.json")) || existsSync(join(dir, "package.json"))) {
      return dir;
    }
  }
  return null;
}

export function getComponentMeta(name: string) {
  const dir = resolvePackageDir(name);
  if (!dir) return null;
  const componentPath = join(dir, "component.json");
  const packagePath = join(dir, "package.json");
  if (existsSync(componentPath)) return readJson<Record<string, unknown>>(componentPath);
  if (existsSync(packagePath)) return readJson<Record<string, unknown>>(packagePath);
  return null;
}

export function getManifest(name: string, template: string, version: string, variant?: string) {
  const dir = resolvePackageDir(name);
  if (!dir) return null;
  const base = join(dir, template, `v${version.split(".")[0]}`);
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

export function kindToCategory(kind: PackageKind): CategoryId {
  return KIND_DIR[kind];
}
