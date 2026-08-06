import type {
  ComponentEntry,
  PackageKind,
  ListComponentsFilters,
  ComponentLayer,
} from "./component-entry.js";
import { normalizeKind, normalizeLayer } from "./component-entry.js";
import {
  getBundledComponentMeta,
  getBundledManifest,
  listBundledComponents,
} from "./bundled-registry.js";

export type { ComponentEntry, PackageKind, ListComponentsFilters, ComponentLayer };

const REGISTRY_URL = process.env.DEVKIT_REGISTRY ?? "https://registry.devkit.roboticela.com";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${REGISTRY_URL}${path}`);
  if (!res.ok) throw new Error(`Registry error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

function componentsQuery(filters: ListComponentsFilters): string {
  const params = new URLSearchParams();
  if (filters.template) params.set("template", filters.template);
  if (filters.kind) params.set("kind", filters.kind);
  if (filters.layer) params.set("layer", String(filters.layer));
  if (filters.category) params.set("category", filters.category);
  const s = params.toString();
  return s ? `?${s}` : "";
}

export async function listComponents(filters: ListComponentsFilters = {}): Promise<ComponentEntry[]> {
  const local = listBundledComponents(filters);
  if (local) return local;
  const data = await get<{ components: ComponentEntry[] }>(`/api/v1/components${componentsQuery(filters)}`);
  return data.components.map((c) => ({
    ...c,
    kind: normalizeKind(c.kind),
    layer: normalizeLayer(c.layer),
  }));
}

export async function getComponentInfo(name: string): Promise<Record<string, unknown>> {
  const local = getBundledComponentMeta(name);
  if (local) return { ...local, kind: normalizeKind(local.kind), layer: normalizeLayer(local.layer) };
  const data = await get<Record<string, unknown>>(`/api/v1/components/${name}`);
  return { ...data, kind: normalizeKind(data.kind), layer: normalizeLayer(data.layer) };
}

export async function getManifest(
  name: string,
  template: string,
  version = "latest",
  variant?: string
): Promise<{ name: string; template: string; version: string; variant: string | null; manifest: Record<string, unknown> }> {
  const local = getBundledManifest(name, template, version, variant);
  if (local) return local;
  const qs = new URLSearchParams({ template, version });
  if (variant) qs.set("variant", variant);
  return get(`/api/v1/components/${name}/manifest?${qs}`);
}

export async function healthCheck(): Promise<boolean> {
  try {
    await get("/health");
    return true;
  } catch {
    return false;
  }
}
