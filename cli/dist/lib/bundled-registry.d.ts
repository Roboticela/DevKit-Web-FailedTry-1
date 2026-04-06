import type { ComponentEntry } from "./component-entry.js";
/** Directory containing `dist/` (the published CLI package root). */
export declare function getCliPackageRoot(fromImportMetaUrl?: string): string;
/**
 * On-disk component payloads: either shipped inside the npm package (`cli/registry/components`)
 * or the monorepo sibling (`DevKit/registry/components`).
 */
export declare function getBundledComponentsDir(fromImportMetaUrl?: string): string | null;
export declare function listBundledComponents(template: string | undefined, fromImportMetaUrl?: string): ComponentEntry[] | null;
export declare function getBundledComponentMeta(name: string, fromImportMetaUrl?: string): Record<string, unknown> | null;
export declare function resolveBundledVersion(name: string, requested: string, fromImportMetaUrl?: string): string | null;
export declare function getBundledManifest(name: string, template: string, version: string, variant: string | undefined, fromImportMetaUrl?: string): {
    name: string;
    template: string;
    version: string;
    variant: string | null;
    manifest: Record<string, unknown>;
} | null;
