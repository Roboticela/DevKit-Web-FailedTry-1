import chalk from "chalk";
import { listComponents } from "../lib/registry.js";
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
    try {
        const components = await listComponents(template);
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
        console.log(chalk.gray("  " + col("Component", 20) + col("Category", 16) + col("Templates", 36) + "Installed"));
        console.log(chalk.gray("  " + "─".repeat(80)));
        for (const comp of filtered) {
            const installed = lock.components[comp.name];
            const installedStr = installed ? chalk.green(`v${installed.version}`) : chalk.gray("-");
            const templateStr = comp.templates.join(", ");
            console.log("  " +
                chalk.bold(col(comp.name, 20)) +
                chalk.dim(col(comp.category, 16)) +
                col(templateStr, 36) +
                installedStr);
        }
        log.blank();
        log.info(`${filtered.length} component(s). Run ${chalk.cyan("devkit info <name>")} for details.`);
        log.blank();
    }
    catch (e) {
        log.error(`Could not reach registry: ${e.message}`);
        log.info("Is the registry server running? Start it with: cd registry && npm run dev");
    }
}
