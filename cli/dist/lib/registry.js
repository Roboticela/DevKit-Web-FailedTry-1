import { normalizeKind } from "./component-entry.js";
import { getBundledComponentMeta, getBundledManifest, listBundledComponents, } from "./bundled-registry.js";
const REGISTRY_URL = process.env.DEVKIT_REGISTRY ?? "https://registry.devkit.roboticela.com";
async function get(path) {
    const res = await fetch(`${REGISTRY_URL}${path}`);
    if (!res.ok)
        throw new Error(`Registry error ${res.status}: ${path}`);
    return res.json();
}
function componentsQuery(filters) {
    const params = new URLSearchParams();
    if (filters.template)
        params.set("template", filters.template);
    if (filters.kind)
        params.set("kind", filters.kind);
    const s = params.toString();
    return s ? `?${s}` : "";
}
export async function listComponents(filters = {}) {
    const local = listBundledComponents(filters);
    if (local)
        return local;
    const data = await get(`/api/v1/components${componentsQuery(filters)}`);
    return data.components.map((c) => ({ ...c, kind: normalizeKind(c.kind) }));
}
export async function getComponentInfo(name) {
    const local = getBundledComponentMeta(name);
    if (local)
        return { ...local, kind: normalizeKind(local.kind) };
    const data = await get(`/api/v1/components/${name}`);
    return { ...data, kind: normalizeKind(data.kind) };
}
export async function getManifest(name, template, version = "latest", variant) {
    const local = getBundledManifest(name, template, version, variant);
    if (local)
        return local;
    const qs = new URLSearchParams({ template, version });
    if (variant)
        qs.set("variant", variant);
    return get(`/api/v1/components/${name}/manifest?${qs}`);
}
export async function healthCheck() {
    try {
        await get("/health");
        return true;
    }
    catch {
        return false;
    }
}
