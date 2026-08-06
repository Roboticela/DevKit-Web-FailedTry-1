import chalk from "chalk";
import { listComponents } from "../lib/registry.js";
import { normalizeKind, normalizeLayer, type PackageKind } from "../lib/component-entry.js";
import { readConfig, readLock } from "../lib/config.js";
import { log } from "../lib/logger.js";

interface ListOptions {
  template?: string;
  installed?: boolean;
  category?: string;
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
          col("Package", 16) +
          col("Layer", 8) +
          col("Kind", 12) +
          col("Category", 14) +
          col("Templates", 26) +
          "Installed"
      )
    );
    console.log(chalk.gray("  " + "─".repeat(100)));

    for (const comp of filtered) {
      const installed = lock.components[comp.name];
      const installedStr = installed ? chalk.green(`v${installed.version}`) : chalk.gray("-");
      const templateStr = comp.templates.join(", ");
      const pk = normalizeKind(comp.kind);
      const idStr = comp.id != null ? String(comp.id) : "-";
      const layerStr = comp.layer != null ? String(comp.layer) : "-";

      console.log(
        "  " +
        chalk.dim(col(idStr, 6)) +
        chalk.bold(col(comp.name, 16)) +
        col(layerStr, 8) +
        col(kindLabel(pk), 12) +
        chalk.dim(col(comp.category, 14)) +
        col(templateStr, 26) +
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
