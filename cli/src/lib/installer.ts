import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, createWriteStream } from "fs";
import { join, dirname } from "path";
import { execSync } from "child_process";
import { createHash } from "crypto";
import { x as extractTar } from "tar";
import { pipeline } from "stream/promises";
import { getBundledComponentsDir } from "./bundled-registry.js";
import { getManifest } from "./registry.js";
import { readLock, writeLock } from "./config.js";
import { log } from "./logger.js";

const REGISTRY_URL = process.env.DEVKIT_REGISTRY ?? "https://registry.devkit.roboticela.com";

interface FileEntry {
  source: string;
  destination: string;
}
interface Injection {
  file: string;
  marker?: string;
  importLine?: string;
  routeLine?: string;
  componentLine?: string;
  wrap?: { open: string; close: string };
}
interface Manifest {
  version: string;
  files: FileEntry[];
  injections?: Injection[];
  dependencies?: { frontend?: string[]; devFrontend?: string[]; backend?: string[]; devBackend?: string[] };
  envVars?: string[];
}

function hashFile(path: string): string {
  const content = readFileSync(path);
  return createHash("sha256").update(content).digest("hex");
}

/** Options for installing or updating a component. */
export interface InstallOptions {
  /**
   * When true, replace managed files even if the user edited them since install.
   * Default: keep local edits (skip copy) and retain their hashes in the manifest.
   */
  force?: boolean;
}

export async function installComponent(
  name: string,
  template: string,
  version = "latest",
  variant: string | undefined,
  cwd = process.cwd(),
  options: InstallOptions = {}
): Promise<void> {
  const force = options.force === true;

  const lockAtStart = readLock(cwd);
  const lockedComp = lockAtStart.components[name];

  const existingManifestPath = join(cwd, ".devkit", `${name}.manifest.json`);
  const previousByPath = new Map<string, { path: string; hash: string; userModified?: boolean }>();
  if (existsSync(existingManifestPath)) {
    try {
      const existing = JSON.parse(readFileSync(existingManifestPath, "utf-8"));
      for (const mf of existing.managedFiles ?? []) {
        previousByPath.set(mf.path, mf);
      }
    } catch {
      /* ignore */
    }
  }

  // 1. Fetch manifest from registry
  const result = await getManifest(name, template, version, variant);
  const manifest = result.manifest as unknown as Manifest;
  const resolvedVersion = result.version;

  // 2. Download component files from registry
  const tmpDir = join(cwd, ".devkit", `.tmp-${name}`);
  await downloadComponentFiles(name, template, resolvedVersion, variant, tmpDir);

  // 3. Copy files into project
  const managedFiles: Array<{ path: string; hash: string; userModified: boolean }> = [];

  for (const fileEntry of manifest.files) {
    const src = join(tmpDir, fileEntry.source);
    const dest = join(cwd, fileEntry.destination);

    // User-modified = on disk differs from last DevKit-installed hash (while component is locked)
    let userModified = false;
    if (!force && existsSync(dest) && lockedComp) {
      const tracked = previousByPath.get(fileEntry.destination);
      if (tracked && tracked.hash !== hashFile(dest)) userModified = true;
    }

    if (userModified) {
      log.warn(`Skipped (user-modified): ${fileEntry.destination}`);
      managedFiles.push({
        path: fileEntry.destination,
        hash: hashFile(dest),
        userModified: true,
      });
    } else {
      if (force && existsSync(dest) && lockedComp) {
        const tracked = previousByPath.get(fileEntry.destination);
        if (tracked && tracked.hash !== hashFile(dest)) {
          log.warn(`Overwrote (user-modified, --force): ${fileEntry.destination}`);
        }
      }
      mkdirSync(dirname(dest), { recursive: true });
      if (existsSync(src)) {
        cpSync(src, dest);
        const hash = hashFile(dest);
        managedFiles.push({ path: fileEntry.destination, hash, userModified: false });
        log.step(`Created ${fileEntry.destination}`);
      }
    }
  }

  // 4. Apply injections
  for (const injection of manifest.injections ?? []) {
    applyInjection(injection, cwd);
  }

  // 5. Install npm dependencies
  const deps = manifest.dependencies ?? {};
  if ((deps.frontend?.length ?? 0) > 0) {
    log.step(`npm install ${deps.frontend!.join(" ")}`);
    execSync(`npm install ${deps.frontend!.join(" ")}`, { cwd, stdio: "inherit" });
  }
  if ((deps.devFrontend?.length ?? 0) > 0) {
    execSync(`npm install -D ${deps.devFrontend!.join(" ")}`, { cwd, stdio: "inherit" });
  }
  if ((deps.backend?.length ?? 0) > 0 && existsSync(join(cwd, "server"))) {
    log.step(`npm install (server) ${deps.backend!.join(" ")}`);
    execSync(`npm install ${deps.backend!.join(" ")}`, { cwd: join(cwd, "server"), stdio: "inherit" });
  }

  // 6. Write component manifest
  const compManifest = {
    name,
    version: resolvedVersion,
    template,
    variant: variant ?? null,
    installedAt: new Date().toISOString(),
    managedFiles,
    injections: manifest.injections ?? [],
    dependencies: manifest.dependencies ?? {},
    envVars: manifest.envVars ?? [],
  };
  mkdirSync(join(cwd, ".devkit"), { recursive: true });
  writeFileSync(join(cwd, ".devkit", `${name}.manifest.json`), JSON.stringify(compManifest, null, 2) + "\n");

  // 7. Update lock file
  const lock = readLock(cwd);
  lock.components[name] = {
    version: resolvedVersion,
    variant: variant ?? null,
    resolved: `${REGISTRY_URL}/api/v1/components/${name}/download/${resolvedVersion}/${template}`,
    installedAt: new Date().toISOString(),
  };
  writeLock(lock, cwd);

  // 8. Print required env vars
  if ((manifest.envVars?.length ?? 0) > 0) {
    log.blank();
    log.warn(`Required env vars for ${name}:`);
    for (const envVar of manifest.envVars!) {
      log.step(envVar);
    }
  }

  // Cleanup temp dir
  const { rmSync } = await import("fs");
  rmSync(tmpDir, { recursive: true, force: true });
}

export function removeComponent(name: string, cwd = process.cwd()): void {
  const manifestPath = join(cwd, ".devkit", `${name}.manifest.json`);
  if (!existsSync(manifestPath)) throw new Error(`Component '${name}' is not installed.`);

  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  for (const file of manifest.managedFiles ?? []) {
    if (!file.userModified && existsSync(join(cwd, file.path))) {
      unlinkSync(join(cwd, file.path));
      log.step(`Removed ${file.path}`);
    } else if (file.userModified) {
      log.warn(`Kept (user-modified): ${file.path}`);
    }
  }

  unlinkSync(manifestPath);

  const lock = readLock(cwd);
  delete lock.components[name];
  writeLock(lock, cwd);
}

async function downloadComponentFiles(
  name: string,
  template: string,
  version: string,
  variant: string | undefined,
  tmpDir: string
): Promise<void> {
  mkdirSync(tmpDir, { recursive: true });

  // Prefer on-disk payloads (bundled in the npm package or monorepo sibling) before HTTP tarball.
  const registryDir = getBundledComponentsDir();
  const major = `v${version.split(".")[0]}`;
  const compDir = registryDir
    ? variant
      ? join(registryDir, name, template, major, "variants", variant)
      : join(registryDir, name, template, major)
    : "";

  if (compDir && existsSync(compDir)) {
    cpSync(compDir, tmpDir, { recursive: true });
  } else {
    // Fallback: try to fetch a tarball from registry
    const qs = new URLSearchParams({ template, version });
    if (variant) qs.set("variant", variant);
    const url = `${REGISTRY_URL}/api/v1/components/${name}/download?${qs}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download component ${name}: HTTP ${res.status}`);
    const tmpTar = join(tmpDir, ".component.tar.gz");
    const writer = createWriteStream(tmpTar);
    // @ts-expect-error — Node stream
    await pipeline(res.body, writer);
    await extractTar({ file: tmpTar, cwd: tmpDir, strip: 0 });
    const { unlinkSync } = await import("fs");
    unlinkSync(tmpTar);
  }
}

function applyInjection(injection: Injection, cwd: string): void {
  const filePath = join(cwd, injection.file);
  if (!existsSync(filePath)) {
    log.warn(`Injection target not found: ${injection.file} — add manually`);
    return;
  }
  let content = readFileSync(filePath, "utf-8");

  // Add import if not present
  if (injection.importLine && !content.includes(injection.importLine)) {
    content = injection.importLine + "\n" + content;
  }

  // Add route or component line at marker
  if (injection.marker && injection.routeLine && content.includes(injection.marker)) {
    content = content.replace(injection.marker, `${injection.marker}\n      ${injection.routeLine}`);
  }
  if (injection.marker && injection.componentLine && content.includes(injection.marker)) {
    content = content.replace(injection.marker, `${injection.marker}\n      ${injection.componentLine}`);
  }

  writeFileSync(filePath, content);
  log.step(`Injected into ${injection.file}`);
}
