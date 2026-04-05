import { confirm } from "@clack/prompts";
import { isComponentInstalled } from "../lib/config.js";
import { removeComponent } from "../lib/installer.js";
import { log } from "../lib/logger.js";

export async function removeCommand(name: string, opts: { keepFiles?: boolean }, cwd = process.cwd()) {
  if (!isComponentInstalled(name, cwd)) {
    log.error(`'${name}' is not installed.`);
    process.exit(1);
  }

  const ok = await confirm({ message: `Remove ${name} and all its managed files?` });
  if (!ok) { log.info("Aborted."); return; }

  try {
    removeComponent(name, cwd);
    log.success(`${name} removed.`);
  } catch (e) {
    log.error((e as Error).message);
  }
}
