import chalk from "chalk";
import { listComponents } from "../lib/registry.js";
import { normalizeKind, normalizeLayer, type PackageKind } from "../lib/component-entry.js";
import { readConfig, readLock } from "../lib/config.js";
import { log } from "../lib/logger.js";

interface ListOptions {
  template?: string;
  installed?: boolean;
  category?: string;
  group?: string;
  kind?: string;
  layer?: string;
}

export async function listCommand(opts: ListOptions, cwd = process.cwd()) {
  let template = opts.template;
  if (!template) {
    try { template = readConfig(cwd).template; } catch { /* no config */ }
  }

  let kindFilter: PackageKind | undefined;
  if (opts.kind) {
    const k = opts.kind.toLowerCase();
    if (k === "component" || k === "scaffold") kindFilter = k;
    else {
      log.error(`Invalid --kind (use ${chalk.cyan("component")} or ${chalk.cyan("scaffold")})`);
      return;
    }
  }

  const layerFilter = opts.layer ? normalizeLayer(opts.layer) : undefined;
  if (opts.layer && !layerFilter) {
    log.error(`Invalid --layer (use ${chalk.cyan("1")}–${chalk.cyan("5")})`);
    return;
  }

  try {
    const components = await listComponents({
      template,
      kind: kindFilter,
      layer: layerFilter,
      category: opts.category,
      group: opts.group,
    });
    const lock = (() => { try { return readLock(cwd); } catch { return { lockVersion: 1, template: "", components: {} } satisfies import("../lib/config.js").DevKitLock; } })();

    const filtered = opts.installed
      ? components.filter((c) => c.name in lock.components)
      : components;

    if (filtered.length === 0) {
      log.info("No components found.");
      return;
    }

    log.blank();
    const col = (s: string, w: number) => s.padEnd(w).slice(0, w);

    const kindLabel = (k: string) =>
      k === "component" ? chalk.magenta("component") : chalk.cyan("scaffold");

    console.log(
      chalk.gray(
        "  " +
          col("ID", 6) +
          col("Package", 28) +
          col("Group", 22) +
          col("Layer", 7) +
          col("Stub", 6) +
          "Installed"
      )
    );
    console.log(chalk.gray("  " + "─".repeat(90)));

    for (const comp of filtered) {
      const installed = lock.components[comp.name];
      const installedStr = installed ? chalk.green(`v${installed.version}`) : chalk.gray("-");
      const pk = normalizeKind(comp.kind);
      const idStr = comp.id != null ? String(comp.id) : "-";
      const layerStr = comp.layer != null ? String(comp.layer) : "-";
      const groupStr = comp.group ?? "-";
      const stubStr = comp.stub ? "yes" : "no";

      console.log(
        "  " +
        chalk.dim(col(idStr, 6)) +
        chalk.bold(col(comp.name, 28)) +
        chalk.dim(col(groupStr, 22)) +
        col(layerStr, 7) +
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
