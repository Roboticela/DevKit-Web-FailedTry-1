import { intro, outro, multiselect, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { unlinkSync, existsSync } from "fs";
import { join } from "path";
import { readLock, writeLock } from "../lib/config.js";
import { log } from "../lib/logger.js";

export async function ejectCommand(name: string | undefined, cwd = process.cwd()) {
  const lock = readLock(cwd);
  const installed = Object.keys(lock.components);

  if (installed.length === 0) {
    log.info("No installed components to eject.");
    return;
  }

  let toEject: string[];

  if (name) {
    if (!(name in lock.components)) {
      log.warn(`'${name}' is not an installed DevKit component.`);
      return;
    }
    toEject = [name];
  } else {
    console.log();
    intro(chalk.cyan("Eject components"));
    const picked = await multiselect({
      message:
        "Select components to eject (DevKit stops tracking them; files stay on disk — space to toggle, enter to confirm)",
      options: installed.map((n) => ({
        value: n,
        label: n,
        hint: `v${lock.components[n].version}`,
      })),
      required: false,
    });

    if (isCancel(picked)) {
      outro("Cancelled.");
      return;
    }

    const list = picked as string[];
    if (list.length === 0) {
      outro("No components selected.");
      return;
    }
    toEject = list;
  }

  for (const n of toEject) {
    if (!(n in lock.components)) {
      log.warn(`Skipping '${n}' — not in lock file.`);
      continue;
    }
    const manifestPath = join(cwd, ".devkit", `${n}.manifest.json`);
    if (existsSync(manifestPath)) unlinkSync(manifestPath);
    delete lock.components[n];
    log.success(`${n} ejected. Files are yours — DevKit will no longer manage them.`);
  }

  writeLock(lock, cwd);

  if (!name) {
    outro(chalk.green("Done."));
  }
}
