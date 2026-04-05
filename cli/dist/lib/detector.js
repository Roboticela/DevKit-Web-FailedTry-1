import { existsSync, readFileSync } from "fs";
import { join } from "path";
export function detectTemplate(cwd = process.cwd()) {
    const pkgPath = join(cwd, "package.json");
    if (!existsSync(pkgPath))
        return "unknown";
    const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
    const deps = { ...(pkg["dependencies"] ?? {}), ...(pkg["devDependencies"] ?? {}) };
    // Next.js check
    if ("next" in deps)
        return "nextjs-compact";
    // Vite + Tauri check
    if ("vite" in deps && existsSync(join(cwd, "src-tauri")))
        return "vite-express-tauri";
    if ("vite" in deps && existsSync(join(cwd, "server")))
        return "vite-express-tauri";
    return "unknown";
}
