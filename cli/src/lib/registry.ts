const REGISTRY_URL = process.env.DEVKIT_REGISTRY ?? "https://registry.devkit.roboticela.com";

export interface ComponentEntry {
  name: string;
  displayName: string;
  description: string;
  category: string;
  templates: string[];
  platforms: string[];
  hasVariants: boolean;
  variants?: { id: string; label: string; description: string }[];
  latestVersion: string;
  tags: string[];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${REGISTRY_URL}${path}`);
  if (!res.ok) throw new Error(`Registry error ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export async function listComponents(template?: string): Promise<ComponentEntry[]> {
  const qs = template ? `?template=${template}` : "";
  const data = await get<{ components: ComponentEntry[] }>(`/api/v1/components${qs}`);
  return data.components;
}

export async function getComponentInfo(name: string): Promise<Record<string, unknown>> {
  return get<Record<string, unknown>>(`/api/v1/components/${name}`);
}

export async function getManifest(
  name: string,
  template: string,
  version = "latest",
  variant?: string
): Promise<{ name: string; template: string; version: string; variant: string | null; manifest: Record<string, unknown> }> {
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
