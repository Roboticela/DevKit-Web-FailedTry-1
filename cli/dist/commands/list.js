import chalk from "chalk";
import { listComponents } from "../lib/registry.js";
import { normalizeKind } from "../lib/component-entry.js";
import { readConfig, readLock } from "../lib/config.js";
import { log } from "../lib/logger.js";
export async function listCommand(opts, cwd = process.cwd()) {
    let template = opts.template;
    if (!template) {
        try {
            template = readConfig(cwd).template;
        }
        catch { /* no config */ }
    }
    let kindFilter;
    if (opts.kind) {
        const k = opts.kind.toLowerCase();
        if (k === "component" || k === "scaffold")
            kindFilter = k;
        else {
            log.error(`Invalid --kind (use ${chalk.cyan("component")} or ${chalk.cyan("scaffold")})`);
            return;
        }
    }
    try {
        const components = await listComponents({ template, kind: kindFilter });
        const lock = (() => { try {
            return readLock(cwd);
        }
        catch {
            return { lockVersion: 1, template: "", components: {} };
        } })();
        const filtered = opts.installed
            ? components.filter((c) => c.name in lock.components)
            : opts.category
                ? components.filter((c) => c.category === opts.category)
                : components;
        if (filtered.length === 0) {
            log.info("No components found.");
            return;
        }
        log.blank();
        const col = (s, w) => s.padEnd(w).slice(0, w);
        const kindLabel = (k) => k === "component" ? chalk.magenta("component") : chalk.cyan("scaffold");
        console.log(chalk.gray("  " +
            col("Package", 18) +
            col("Kind", 12) +
            col("Category", 14) +
            col("Templates", 28) +
            "Installed"));
        console.log(chalk.gray("  " + "─".repeat(92)));
        for (const comp of filtered) {
            const installed = lock.components[comp.name];
            const installedStr = installed ? chalk.green(`v${installed.version}`) : chalk.gray("-");
            const templateStr = comp.templates.join(", ");
            const pk = normalizeKind(comp.kind);
            console.log("  " +
                chalk.bold(col(comp.name, 18)) +
                col(kindLabel(pk), 12) +
                chalk.dim(col(comp.category, 14)) +
                col(templateStr, 28) +
                installedStr);
        }
        log.blank();
        log.info(`${filtered.length} package(s). Run ${chalk.cyan("devkit info <name>")} for details.`);
        log.blank();
    }
    catch (e) {
        log.error(`Could not reach registry: ${e.message}`);
        log.info("Is the registry server running? Start it with: cd registry && npm run dev");
    }
}
