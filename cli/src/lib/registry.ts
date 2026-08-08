import type {
  ComponentEntry,
  PackageKind,
  ListComponentsFilters,
} from "./component-entry.js";
import { normalizeKind } from "./component-entry.js";
import {
  getBundledComponentMeta,
  getBundledManifest,
  getRegistryRoot,
  listBundledComponents,
} from "./bundled-registry.js";

export type { ComponentEntry, PackageKind, ListComponentsFilters };

function requireBundledRegistry(): void {
  if (!getRegistryRoot()) {
    throw new Error(
      "Bundled registry not found in the @roboticela/devkit package. Reinstall with: npm i -g @roboticela/devkit"
    );
  }
}

export async function listComponents(filters: ListComponentsFilters = {}): Promise<ComponentEntry[]> {
  requireBundledRegistry();
  const local = listBundledComponents(filters);
  if (!local) {
    throw new Error("Bundled registry is empty or incomplete. Reinstall @roboticela/devkit.");
  }
  return local;
}

export async function getComponentInfo(name: string): Promise<Record<string, unknown>> {
  requireBundledRegistry();
  const local = getBundledComponentMeta(name);
  if (!local) throw new Error(`Package '${name}' not found in the bundled registry.`);
  return { ...local, kind: normalizeKind(local.kind) };
}

export async function getManifest(
  name: string,
  template: string,
  version = "latest",
  variant?: string
): Promise<{ name: string; template: string; version: string; variant: string | null; manifest: Record<string, unknown> }> {
  requireBundledRegistry();
  const local = getBundledManifest(name, template, version, variant);
  if (!local) {
    const hint = variant ? ` (variant=${variant})` : "";
    throw new Error(`No manifest for '${name}'@${version} template=${template}${hint} in the bundled registry.`);
  }
  return local;
}

/** True when the CLI package ships a usable on-disk registry (no network). */
export async function healthCheck(): Promise<boolean> {
  return getRegistryRoot() !== null && (listBundledComponents() ?? []).length > 0;
}
