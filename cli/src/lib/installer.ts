import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync, rmSync } from "fs";
import { join, dirname } from "path";
import { execSync } from "child_process";
import { createHash } from "crypto";
import { getBundledComponentMeta, getBundledPackageDir } from "./bundled-registry.js";
import { getManifest } from "./registry.js";
import { isComponentInstalled, readLock, writeLock } from "./config.js";
import { log } from "./logger.js";

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

function isRegistryPackage(name: string): boolean {
  // Strip optional @version pin used in manifests/CLI (e.g. button@1.0.0)
  const base = name.split("@")[0]!;
  return getBundledComponentMeta(base) !== null;
}

function partitionDeps(names: string[]): { registry: string[]; npm: string[] } {
  const registry: string[] = [];
  const npm: string[] = [];
  for (const raw of names) {
    const base = raw.split("@")[0]!;
    if (isRegistryPackage(base)) registry.push(raw);
    else npm.push(raw);
  }
  return { registry, npm };
}

function npmInstall(packages: string[], cwd: string, dev = false): void {
  if (packages.length === 0) return;
  const flag = dev ? "-D " : "";
  log.step(`npm install ${flag}${packages.join(" ")}`);
  execSync(`npm install ${flag}${packages.join(" ")}`, { cwd, stdio: "inherit" });
}

/** Options for installing or updating a component. */
export interface InstallOptions {
  /**
   * When true, replace managed files even if the user edited them since install.
   * Default: keep local edits (skip copy) and retain their hashes in the manifest.
   */
  force?: boolean;
  /**
   * When true, this install was requested as a transitive registry dependency.
   * Already-installed packages are skipped instead of reinstalled.
   */
  asDependency?: boolean;
}

export async function installComponent(
  name: string,
  template: string,
  version = "latest",
  variant: string | undefined,
  cwd = process.cwd(),
  options: InstallOptions = {},
  installing: Set<string> = new Set()
): Promise<void> {
  const force = options.force === true;
  const asDependency = options.asDependency === true;

  if (installing.has(name)) return;
  if (asDependency && isComponentInstalled(name, cwd) && !force) return;

  installing.add(name);

  try {
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

    // 1. Read manifest from bundled package registry
    const result = await getManifest(name, template, version, variant);
    const manifest = result.manifest as unknown as Manifest;
    const resolvedVersion = result.version;

    // 2. Install registry package dependencies first (compose from registry — never npm)
    const deps = manifest.dependencies ?? {};
    const frontendParts = partitionDeps(deps.frontend ?? []);
    const devFrontendParts = partitionDeps(deps.devFrontend ?? []);
    const backendParts = partitionDeps(deps.backend ?? []);
    const devBackendParts = partitionDeps(deps.devBackend ?? []);

    const registryDeps = [
      ...frontendParts.registry,
      ...devFrontendParts.registry,
      ...backendParts.registry,
      ...devBackendParts.registry,
    ];

    for (const dep of registryDeps) {
      const [depName, depVersion = "latest"] = dep.split("@");
      if (!depName || depName === name) continue;
      log.step(`Adding dependency ${depName}`);
      await installComponent(depName, template, depVersion, undefined, cwd, { ...options, asDependency: true }, installing);
    }

    // 3. Copy component files from bundled registry
    const tmpDir = join(cwd, ".devkit", `.tmp-${name}`);
    const packageDir = getBundledPackageDir(name, template, resolvedVersion, variant);
    if (!packageDir) {
      const hint = variant ? ` (variant=${variant})` : "";
      throw new Error(`Package files for '${name}'@${resolvedVersion}${hint} not found in the bundled registry.`);
    }
    mkdirSync(tmpDir, { recursive: true });
    cpSync(packageDir, tmpDir, { recursive: true });

    // 4. Copy files into project
    const managedFiles: Array<{ path: string; hash: string; userModified: boolean }> = [];

    for (const fileEntry of manifest.files) {
      const src = join(tmpDir, fileEntry.source);
      const dest = join(cwd, fileEntry.destination);

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

    // 5. Apply injections
    for (const injection of manifest.injections ?? []) {
      applyInjection(injection, cwd);
    }

    // 6. Install real npm packages only (names that are not DevKit registry packages)
    npmInstall(frontendParts.npm, cwd, false);
    npmInstall(devFrontendParts.npm, cwd, true);
    if (existsSync(join(cwd, "server"))) {
      npmInstall(backendParts.npm, join(cwd, "server"), false);
      npmInstall(devBackendParts.npm, join(cwd, "server"), true);
    }

    // 7. Write component manifest
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

    // 8. Update lock file
    const lock = readLock(cwd);
    lock.components[name] = {
      version: resolvedVersion,
      variant: variant ?? null,
      resolved: `bundled:${name}@${resolvedVersion}/${template}${variant ? `/variants/${variant}` : ""}`,
      installedAt: new Date().toISOString(),
    };
    writeLock(lock, cwd);

    // 9. Print required env vars
    if ((manifest.envVars?.length ?? 0) > 0) {
      log.blank();
      log.warn(`Required env vars for ${name}:`);
      for (const envVar of manifest.envVars!) {
        log.step(envVar);
      }
    }

    rmSync(tmpDir, { recursive: true, force: true });
  } finally {
    installing.delete(name);
  }
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

function applyInjection(injection: Injection, cwd: string): void {
  const filePath = join(cwd, injection.file);
  if (!existsSync(filePath)) {
    log.warn(`Injection target not found: ${injection.file} — add manually`);
    return;
  }
  let content = readFileSync(filePath, "utf-8");

  if (injection.importLine && !content.includes(injection.importLine)) {
    content = injection.importLine + "\n" + content;
  }

  if (injection.marker && injection.routeLine && content.includes(injection.marker)) {
    content = content.replace(injection.marker, `${injection.marker}\n      ${injection.routeLine}`);
  }
  if (injection.marker && injection.componentLine && content.includes(injection.marker)) {
    content = content.replace(injection.marker, `${injection.marker}\n      ${injection.componentLine}`);
  }

  writeFileSync(filePath, content);
  log.step(`Injected into ${injection.file}`);
}
