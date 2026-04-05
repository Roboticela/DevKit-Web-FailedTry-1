import ora from "ora";
import chalk from "chalk";
import { readConfig, readLock, isComponentInstalled } from "../lib/config.js";
import { installComponent } from "../lib/installer.js";
import { log } from "../lib/logger.js";
export async function updateCommand(nameAtVersion, cwd = process.cwd()) {
    const [name, version = "latest"] = nameAtVersion.split("@");
    const config = readConfig(cwd);
    if (!isComponentInstalled(name, cwd)) {
        log.error(`'${name}' is not installed. Use 'devkit add ${name}' to install.`);
        process.exit(1);
    }
    const lock = readLock(cwd);
    const current = lock.components[name];
    log.info(`Updating ${chalk.cyan(name)} from v${current.version} → ${version}`);
    const spinner = ora({ text: `Updating ${name}…`, color: "cyan" }).start();
    try {
        await installComponent(name, config.template, version, current.variant ?? undefined, cwd);
        spinner.succeed(chalk.green(`${name} updated`));
    }
    catch (e) {
        spinner.fail(chalk.red(`Update failed: ${e.message}`));
    }
}
export async function upgradeAllCommand(cwd = process.cwd()) {
    const config = readConfig(cwd);
    const lock = readLock(cwd);
    const names = Object.keys(lock.components);
    if (names.length === 0) {
        log.info("No components installed.");
        return;
    }
    log.info(`Upgrading ${names.length} component(s)…`);
    for (const name of names) {
        const spinner = ora({ text: `Upgrading ${chalk.cyan(name)}…`, color: "cyan" }).start();
        try {
            const variant = lock.components[name].variant ?? undefined;
            await installComponent(name, config.template, "latest", variant, cwd);
            spinner.succeed(chalk.green(`${name} upgraded`));
        }
        catch (e) {
            spinner.fail(chalk.yellow(`${name}: ${e.message}`));
        }
    }
}
