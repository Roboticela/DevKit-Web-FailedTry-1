import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import type { CategoryId, ComponentEntry, ListComponentsFilters } from "./component-entry.js";
import { KIND_CATEGORY, normalizeKind } from "./component-entry.js";

/** Directory containing `dist/` (the published CLI package root). */
export function getCliPackageRoot(fromImportMetaUrl = import.meta.url): string {
  return join(dirname(fileURLToPath(fromImportMetaUrl)), "..", "..");
}

function getRegistryRoot(fromImportMetaUrl = import.meta.url): string | null {
  const pkgRoot = getCliPackageRoot(fromImportMetaUrl);
  const nested = join(pkgRoot, "registry");
  const sibling = join(pkgRoot, "..", "registry");
  if (existsSync(join(nested, "categories.json"))) return nested;
  if (existsSync(join(sibling, "categories.json"))) return sibling;
  return null;
}

/**
 * On-disk component payloads: either shipped inside the npm package (`cli/registry/components`)
 * or the monorepo sibling (`DevKit/registry/components`).
 */
export function getBundledComponentsDir(fromImportMetaUrl = import.meta.url): string | null {
  const root = getRegistryRoot(fromImportMetaUrl);
  if (!root) return null;
  const components = join(root, "components");
  if (existsSync(join(components, "registry.json"))) return components;
  return null;
}

function categoryDirs(fromImportMetaUrl = import.meta.url): { category: CategoryId; dir: string }[] {
  const root = getRegistryRoot(fromImportMetaUrl);
  if (!root) return [];
  return (["components", "pages", "scaffolds"] as CategoryId[])
    .map((category) => ({ category, dir: join(root, category) }))
    .filter(({ dir }) => existsSync(join(dir, "registry.json")));
}

function readCategoryPackages(category: CategoryId, dir: string): ComponentEntry[] {
  const index = JSON.parse(readFileSync(join(dir, "registry.json"), "utf-8")) as {
    components?: { name: string; templates: string[]; category?: string }[];
    pages?: { name: string; templates: string[]; category?: string }[];
    scaffolds?: { name: string; templates: string[]; category?: string }[];
  };
  const entries =
    category === "components"
      ? index.components ?? []
      : category === "pages"
        ? index.pages ?? []
        : index.scaffolds ?? [];

  const out: ComponentEntry[] = [];
  for (const c of entries) {
    const metaPath = join(dir, c.name, "component.json");
    if (!existsSync(metaPath)) continue;
    const meta = JSON.parse(readFileSync(metaPath, "utf-8")) as Record<string, unknown>;
    const entryKind = normalizeKind(meta.kind ?? (category === "pages" ? "page" : category === "scaffolds" ? "scaffold" : "component"));
    out.push({
      id: meta.id as number | undefined,
      name: meta.name as string,
      displayName: meta.displayName as string,
      description: meta.description as string,
      category: (meta.category as string) ?? c.category ?? category,
      group: meta.group as string | undefined,
      groupName: meta.groupName as string | undefined,
      kind: entryKind,
      stub: meta.stub as boolean | undefined,
      templates: meta.templates as string[],
      platforms: meta.platforms as string[],
      hasVariants: meta.hasVariants as boolean,
      variants: meta.variants as ComponentEntry["variants"],
      latestVersion: (meta.versions as { latest: string }).latest,
      tags: meta.tags as string[],
    });
  }
  return out;
}

export function listBundledComponents(filters: ListComponentsFilters = {}, fromImportMetaUrl = import.meta.url): ComponentEntry[] | null {
  const dirs = categoryDirs(fromImportMetaUrl);
  if (dirs.length === 0) return null;

  const { template, kind, category, group } = filters;
  let out: ComponentEntry[] = [];
  for (const entry of dirs) {
    if (category && entry.category !== category) continue;
    if (kind && KIND_CATEGORY[kind] !== entry.category) continue;
    out = out.concat(readCategoryPackages(entry.category, entry.dir));
  }

  if (template) out = out.filter((c) => c.templates.includes(template));
  if (group) out = out.filter((c) => c.group === group);
  if (kind) out = out.filter((c) => c.kind === kind);
  return out;
}

function resolvePackageDir(name: string, fromImportMetaUrl = import.meta.url): string | null {
  for (const { dir } of categoryDirs(fromImportMetaUrl)) {
    const path = join(dir, name);
    if (existsSync(join(path, "component.json"))) return path;
  }
  return null;
}

export function getBundledComponentMeta(name: string, fromImportMetaUrl = import.meta.url): Record<string, unknown> | null {
  const dir = resolvePackageDir(name, fromImportMetaUrl);
  if (!dir) return null;
  return JSON.parse(readFileSync(join(dir, "component.json"), "utf-8")) as Record<string, unknown>;
}

export function resolveBundledVersion(name: string, requested: string, fromImportMetaUrl = import.meta.url): string | null {
  const meta = getBundledComponentMeta(name, fromImportMetaUrl);
  if (!meta) return null;
  const versions = meta["versions"] as { latest: string; history: { version: string }[] };
  if (requested === "latest") return versions.latest;
  const found = versions.history.find((h) => h.version === requested);
  return found ? found.version : null;
}

export function getBundledManifest(
  name: string,
  template: string,
  version: string,
  variant: string | undefined,
  fromImportMetaUrl = import.meta.url
): { name: string; template: string; version: string; variant: string | null; manifest: Record<string, unknown> } | null {
  const dir = resolvePackageDir(name, fromImportMetaUrl);
  if (!dir) return null;
  const resolved = resolveBundledVersion(name, version, fromImportMetaUrl);
  if (!resolved) return null;
  const base = join(dir, template, `v${resolved.split(".")[0]}`);
  const manifestPath = variant ? join(base, "variants", variant, "manifest.json") : join(base, "manifest.json");
  if (!existsSync(manifestPath)) return null;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
  return { name, template, version: resolved, variant: variant ?? null, manifest };
}
