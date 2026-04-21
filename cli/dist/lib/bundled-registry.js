import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { normalizeKind } from "./component-entry.js";
/** Directory containing `dist/` (the published CLI package root). */
export function getCliPackageRoot(fromImportMetaUrl = import.meta.url) {
    return join(dirname(fileURLToPath(fromImportMetaUrl)), "..", "..");
}
/**
 * On-disk component payloads: either shipped inside the npm package (`cli/registry/components`)
 * or the monorepo sibling (`DevKit/registry/components`).
 */
export function getBundledComponentsDir(fromImportMetaUrl = import.meta.url) {
    const pkgRoot = getCliPackageRoot(fromImportMetaUrl);
    const nested = join(pkgRoot, "registry", "components");
    const sibling = join(pkgRoot, "..", "registry", "components");
    if (existsSync(join(nested, "registry.json")))
        return nested;
    if (existsSync(join(sibling, "registry.json")))
        return sibling;
    return null;
}
export function listBundledComponents(filters = {}, fromImportMetaUrl = import.meta.url) {
    const { template, kind } = filters;
    const root = getBundledComponentsDir(fromImportMetaUrl);
    if (!root)
        return null;
    const index = JSON.parse(readFileSync(join(root, "registry.json"), "utf-8"));
    const out = [];
    for (const c of index.components) {
        if (template && !c.templates.includes(template))
            continue;
        const metaPath = join(root, c.name, "component.json");
        if (!existsSync(metaPath))
            continue;
        const meta = JSON.parse(readFileSync(metaPath, "utf-8"));
        const entryKind = normalizeKind(meta.kind);
        if (kind && entryKind !== kind)
            continue;
        out.push({
            name: meta.name,
            displayName: meta.displayName,
            description: meta.description,
            category: meta.category,
            kind: entryKind,
            templates: meta.templates,
            platforms: meta.platforms,
            hasVariants: meta.hasVariants,
            variants: meta.variants,
            latestVersion: meta.versions.latest,
            tags: meta.tags,
        });
    }
    return out;
}
export function getBundledComponentMeta(name, fromImportMetaUrl = import.meta.url) {
    const root = getBundledComponentsDir(fromImportMetaUrl);
    if (!root)
        return null;
    const path = join(root, name, "component.json");
    if (!existsSync(path))
        return null;
    return JSON.parse(readFileSync(path, "utf-8"));
}
export function resolveBundledVersion(name, requested, fromImportMetaUrl = import.meta.url) {
    const meta = getBundledComponentMeta(name, fromImportMetaUrl);
    if (!meta)
        return null;
    const versions = meta["versions"];
    if (requested === "latest")
        return versions.latest;
    const found = versions.history.find((h) => h.version === requested);
    return found ? found.version : null;
}
export function getBundledManifest(name, template, version, variant, fromImportMetaUrl = import.meta.url) {
    const root = getBundledComponentsDir(fromImportMetaUrl);
    if (!root)
        return null;
    const resolved = resolveBundledVersion(name, version, fromImportMetaUrl);
    if (!resolved)
        return null;
    const base = join(root, name, template, `v${resolved.split(".")[0]}`);
    const manifestPath = variant ? join(base, "variants", variant, "manifest.json") : join(base, "manifest.json");
    if (!existsSync(manifestPath))
        return null;
    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    return { name, template, version: resolved, variant: variant ?? null, manifest };
}
