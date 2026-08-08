import chalk from "chalk";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { readConfig, readLock } from "../lib/config.js";
import { log } from "../lib/logger.js";
import { healthCheck } from "../lib/registry.js";

export async function doctorCommand(cwd = process.cwd()) {
  let ok = true;
  log.blank();
  log.header("DevKit Doctor");

  // Config check
  const configPath = join(cwd, "devkit.config.json");
  if (existsSync(configPath)) {
    log.success("devkit.config.json found");
  } else {
    log.error("devkit.config.json not found — run 'devkit init'");
    ok = false;
  }

  // Template check
  try {
    const config = readConfig(cwd);
    log.success(`Template: ${config.template}`);

    // Site config
    if (!config.site.name) { log.warn("site.name is empty"); ok = false; }
    if (!config.site.url)  { log.warn("site.url is empty"); ok = false; }

    // Installed components env vars
    const lock = readLock(cwd);
    for (const [name, entry] of Object.entries(lock.components)) {
      const manifestPath = join(cwd, ".devkit", `${name}.manifest.json`);
      if (!existsSync(manifestPath)) {
        log.warn(`${name}@${entry.version} — manifest missing (reinstall with 'devkit add ${name}')`);
        continue;
      }
      const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
      const envVars: string[] = manifest.envVars ?? [];
      let compOk = true;
      for (const envVar of envVars) {
        if (!process.env[envVar]) {
          log.warn(`${name} — Missing env var: ${chalk.yellow(envVar)}`);
          compOk = false;
          ok = false;
        }
      }
      if (compOk) {
        log.success(`${name}@${entry.version} — OK`);
      }
    }
  } catch (e) {
    log.error((e as Error).message);
    ok = false;
  }

  // Bundled package registry
  const registryOk = await healthCheck();
  if (registryOk) {
    log.success("Bundled package registry available");
  } else {
    log.error("Bundled package registry missing — reinstall @roboticela/devkit");
    ok = false;
  }

  log.blank();
  if (ok) {
    log.success("Everything looks good!");
  } else {
    log.warn("Some issues found — see above.");
  }
  log.blank();
}
