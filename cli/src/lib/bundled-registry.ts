import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import type { ComponentEntry, ListComponentsFilters } from "./component-entry.js";
import { normalizeKind } from "./component-entry.js";

/** Directory containing `dist/` (the published CLI package root). */
export function getCliPackageRoot(fromImportMetaUrl = import.meta.url): string {
  return join(dirname(fileURLToPath(fromImportMetaUrl)), "..", "..");
}

/**
 * On-disk component payloads: either shipped inside the npm package (`cli/registry/components`)
 * or the monorepo sibling (`DevKit/registry/components`).
 */
export function getBundledComponentsDir(fromImportMetaUrl = import.meta.url): string | null {
  const pkgRoot = getCliPackageRoot(fromImportMetaUrl);
  const nested = join(pkgRoot, "registry", "components");
  const sibling = join(pkgRoot, "..", "registry", "components");
  if (existsSync(join(nested, "registry.json"))) return nested;
  if (existsSync(join(sibling, "registry.json"))) return sibling;
  return null;
}

export function listBundledComponents(filters: ListComponentsFilters = {}, fromImportMetaUrl = import.meta.url): ComponentEntry[] | null {
  const { template, kind } = filters;
  const root = getBundledComponentsDir(fromImportMetaUrl);
  if (!root) return null;
  const index = JSON.parse(readFileSync(join(root, "registry.json"), "utf-8")) as {
    components: { name: string; templates: string[] }[];
  };
  const out: ComponentEntry[] = [];
  for (const c of index.components) {
    if (template && !c.templates.includes(template)) continue;
    const metaPath = join(root, c.name, "component.json");
    if (!existsSync(metaPath)) continue;
    const meta = JSON.parse(readFileSync(metaPath, "utf-8")) as Record<string, unknown>;
    const entryKind = normalizeKind(meta.kind);
    if (kind && entryKind !== kind) continue;
    out.push({
      name: meta.name as string,
      displayName: meta.displayName as string,
      description: meta.description as string,
      category: meta.category as string,
      kind: entryKind,
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

export function getBundledComponentMeta(name: string, fromImportMetaUrl = import.meta.url): Record<string, unknown> | null {
  const root = getBundledComponentsDir(fromImportMetaUrl);
  if (!root) return null;
  const path = join(root, name, "component.json");
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8")) as Record<string, unknown>;
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
  const root = getBundledComponentsDir(fromImportMetaUrl);
  if (!root) return null;
  const resolved = resolveBundledVersion(name, version, fromImportMetaUrl);
  if (!resolved) return null;
  const base = join(root, name, template, `v${resolved.split(".")[0]}`);
  const manifestPath = variant ? join(base, "variants", variant, "manifest.json") : join(base, "manifest.json");
  if (!existsSync(manifestPath)) return null;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as Record<string, unknown>;
  return { name, template, version: resolved, variant: variant ?? null, manifest };
}
