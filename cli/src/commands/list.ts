import chalk from "chalk";
import { listComponents } from "../lib/registry.js";
import { normalizeKind, normalizeCategory, type PackageKind } from "../lib/component-entry.js";
import { readConfig, readLock } from "../lib/config.js";
import { log } from "../lib/logger.js";

interface ListOptions {
  template?: string;
  installed?: boolean;
  category?: string;
  group?: string;
  kind?: string;
}

export async function listCommand(opts: ListOptions, cwd = process.cwd()) {
  let template = opts.template;
  if (!template) {
    try { template = readConfig(cwd).template; } catch { /* no config */ }
  }

  let kindFilter: PackageKind | undefined;
  if (opts.kind) {
    const k = opts.kind.toLowerCase();
    if (k === "component" || k === "page" || k === "scaffold") kindFilter = k;
    else {
      log.error(`Invalid --kind (use ${chalk.cyan("component")}, ${chalk.cyan("page")}, or ${chalk.cyan("scaffold")})`);
      return;
    }
  }

  const categoryFilter = opts.category ? normalizeCategory(opts.category) : undefined;
  if (opts.category && !categoryFilter) {
    log.error(`Invalid --category (use ${chalk.cyan("components")}, ${chalk.cyan("pages")}, or ${chalk.cyan("scaffolds")})`);
    return;
  }

  try {
    const components = await listComponents({
      template,
      kind: kindFilter,
      category: categoryFilter,
      group: opts.group,
    });
    const lock = (() => { try { return readLock(cwd); } catch { return { lockVersion: 1, template: "", components: {} } satisfies import("../lib/config.js").DevKitLock; } })();

    const filtered = opts.installed
      ? components.filter((c) => c.name in lock.components)
      : components;

    if (filtered.length === 0) {
      log.info("No packages found.");
      return;
    }

    log.blank();
    const col = (s: string, w: number) => s.padEnd(w).slice(0, w);

    const kindLabel = (k: string) => {
      if (k === "page") return chalk.yellow("page");
      if (k === "scaffold") return chalk.cyan("scaffold");
      return chalk.magenta("component");
    };

    console.log(
      chalk.gray(
        "  " +
          col("Package", 28) +
          col("Category", 14) +
          col("Stub", 6) +
          "Installed"
      )
    );
    console.log(chalk.gray("  " + "─".repeat(70)));

    for (const comp of filtered) {
      const installed = lock.components[comp.name];
      const installedStr = installed ? chalk.green(`v${installed.version}`) : chalk.gray("-");
      const pk = normalizeKind(comp.kind);
      const stubStr = comp.stub ? "yes" : "no";

      console.log(
        "  " +
        chalk.bold(col(comp.name, 28)) +
        chalk.dim(col(String(comp.category), 14)) +
        col(stubStr === "yes" ? chalk.yellow(stubStr) : stubStr, 6) +
        " " +
        kindLabel(pk) +
        " " +
        installedStr
      );
    }
    log.blank();
    log.info(`${filtered.length} package(s). Run ${chalk.cyan("devkit info <name>")} for details.`);
    log.blank();
  } catch (e) {
    log.error(`Could not reach registry: ${(e as Error).message}`);
    log.info("Is the registry server running? Start it with: cd registry && npm run dev");
  }
}
