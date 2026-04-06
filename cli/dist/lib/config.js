import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
const CONFIG_FILE = "devkit.config.json";
const LOCK_FILE = "devkit.lock.json";
/** Stable URL for editors (works before/without the public registry host). */
export const DEVKIT_CONFIG_SCHEMA_URL = "https://raw.githubusercontent.com/Roboticela/DevKit/main/cli/schemas/devkit-config.json";
export function configExists(cwd = process.cwd()) {
    return existsSync(join(cwd, CONFIG_FILE));
}
export function readConfig(cwd = process.cwd()) {
    const path = join(cwd, CONFIG_FILE);
    if (!existsSync(path))
        throw new Error(`devkit.config.json not found. Run 'devkit init' first.`);
    return JSON.parse(readFileSync(path, "utf-8"));
}
export function writeConfig(config, cwd = process.cwd()) {
    writeFileSync(join(cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + "\n");
}
export function readLock(cwd = process.cwd()) {
    const path = join(cwd, LOCK_FILE);
    if (!existsSync(path))
        return { lockVersion: 1, template: "", components: {} };
    return JSON.parse(readFileSync(path, "utf-8"));
}
export function writeLock(lock, cwd = process.cwd()) {
    writeFileSync(join(cwd, LOCK_FILE), JSON.stringify(lock, null, 2) + "\n");
}
export function getInstalledComponents(cwd = process.cwd()) {
    const lock = readLock(cwd);
    return Object.keys(lock.components);
}
export function isComponentInstalled(name, cwd = process.cwd()) {
    return name in readLock(cwd).components;
}
export function defaultConfig(template, siteName, siteUrl) {
    return {
        $schema: DEVKIT_CONFIG_SCHEMA_URL,
        devkit: "1.0",
        template,
        site: { name: siteName, url: siteUrl },
        theme: {
            preset: "default",
            colors: { primary: "#6366f1", secondary: "#f59e0b" },
            fonts: { sans: "Inter", mono: "JetBrains Mono", display: "Inter" },
            radius: "md",
            darkMode: true,
            darkModeStrategy: "class",
        },
    };
}
