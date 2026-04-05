const REGISTRY_URL = process.env.DEVKIT_REGISTRY ?? "https://registry.devkit.roboticela.com";
async function get(path) {
    const res = await fetch(`${REGISTRY_URL}${path}`);
    if (!res.ok)
        throw new Error(`Registry error ${res.status}: ${path}`);
    return res.json();
}
export async function listComponents(template) {
    const qs = template ? `?template=${template}` : "";
    const data = await get(`/api/v1/components${qs}`);
    return data.components;
}
export async function getComponentInfo(name) {
    return get(`/api/v1/components/${name}`);
}
export async function getManifest(name, template, version = "latest", variant) {
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
