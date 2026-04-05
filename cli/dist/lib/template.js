import { createWriteStream, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { pipeline } from "stream/promises";
import { x as extractTar } from "tar";
import { execSync } from "child_process";
const TEMPLATE_REPOS = {
    "nextjs-compact": "Roboticela/NextJS-Template-DevKit",
    "vite-express-tauri": "Roboticela/Vite-ExpressJS-Tauri-Template-DevKit",
};
export async function downloadTemplate(templateId, destDir) {
    const repo = TEMPLATE_REPOS[templateId];
    if (!repo)
        throw new Error(`Unknown template: ${templateId}`);
    const tarballUrl = `https://api.github.com/repos/${repo}/tarball/main`;
    // Try GitHub tarball API first
    try {
        await downloadViaTarball(tarballUrl, destDir);
        return;
    }
    catch (e) {
        console.warn(`  Tarball download failed, falling back to git clone... (${e.message})`);
    }
    // Fallback: git clone --depth=1
    try {
        await cloneViaGit(`https://github.com/${repo}.git`, destDir);
    }
    catch {
        throw new Error(`Failed to download template '${templateId}'. Check your internet connection.`);
    }
}
async function downloadViaTarball(url, destDir) {
    const response = await fetch(url, {
        redirect: "follow",
        headers: { "User-Agent": "@roboticela/devkit" },
    });
    if (!response.ok)
        throw new Error(`HTTP ${response.status}`);
    if (!response.body)
        throw new Error("Empty response body");
    if (!existsSync(destDir))
        mkdirSync(destDir, { recursive: true });
    const tmpTar = join(destDir, ".devkit-template.tar.gz");
    const writer = createWriteStream(tmpTar);
    await pipeline(response.body, writer);
    // Extract, stripping the top-level GitHub-generated folder prefix
    await extractTar({ file: tmpTar, cwd: destDir, strip: 1 });
    // Clean up
    const { unlinkSync } = await import("fs");
    unlinkSync(tmpTar);
}
async function cloneViaGit(repoUrl, destDir) {
    execSync(`git clone --depth=1 ${repoUrl} "${destDir}"`, { stdio: "inherit" });
    // Remove .git history so the user starts fresh
    const { rmSync } = await import("fs");
    rmSync(join(destDir, ".git"), { recursive: true, force: true });
}
