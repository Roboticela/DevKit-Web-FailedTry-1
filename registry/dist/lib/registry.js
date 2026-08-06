import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS_DIR = join(__dirname, "../../components");
const require = createRequire(import.meta.url);
function readJson(path) {
    return JSON.parse(readFileSync(path, "utf-8"));
}
export function getRegistryIndex() {
    return readJson(join(COMPONENTS_DIR, "registry.json"));
}
export function getComponentMeta(name) {
    const path = join(COMPONENTS_DIR, name, "component.json");
    if (!existsSync(path))
        return null;
    return readJson(path);
}
export function getManifest(name, template, version, variant) {
    const base = join(COMPONENTS_DIR, name, template, `v${version.split(".")[0]}`);
    const manifestPath = variant
        ? join(base, "variants", variant, "manifest.json")
        : join(base, "manifest.json");
    if (!existsSync(manifestPath))
        return null;
    return readJson(manifestPath);
}
export function resolveVersion(name, requested) {
    const meta = getComponentMeta(name);
    if (!meta)
        return null;
    const versions = meta["versions"];
    if (requested === "latest")
        return versions.latest;
    const found = versions.history.find((h) => h.version === requested);
    return found ? found.version : null;
}
