import type { ComponentEntry } from "./component-entry.js";
import {
  getBundledComponentMeta,
  getBundledManifest,
  listBundledComponents,
} from "./bundled-registry.js";

export type { ComponentEntry };

const REGISTRY_URL = process.env.DEVKIT_REGISTRY ?? "https://registry.devkit.roboticela.com";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${REGISTRY_URL}${path}`);
  if (!res.ok) throw new Error(`Registry error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function listComponents(template?: string): Promise<ComponentEntry[]> {
  const local = listBundledComponents(template);
  if (local) return local;
  const qs = template ? `?template=${template}` : "";
  const data = await get<{ components: ComponentEntry[] }>(`/api/v1/components${qs}`);
  return data.components;
}

export async function getComponentInfo(name: string): Promise<Record<string, unknown>> {
  const local = getBundledComponentMeta(name);
  if (local) return local;
  return get<Record<string, unknown>>(`/api/v1/components/${name}`);
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
