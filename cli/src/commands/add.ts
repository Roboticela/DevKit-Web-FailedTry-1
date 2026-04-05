import ora from "ora";
import chalk from "chalk";
import { readConfig, isComponentInstalled } from "../lib/config.js";
import { installComponent } from "../lib/installer.js";
import { log } from "../lib/logger.js";

interface AddOptions { variant?: string; dryRun?: boolean }

export async function addCommand(names: string[], opts: AddOptions, cwd = process.cwd()) {
  const config = readConfig(cwd);

  for (const nameAtVersion of names) {
    const [name, version = "latest"] = nameAtVersion.split("@");

    if (isComponentInstalled(name, cwd)) {
      log.warn(`${name} is already installed. Run 'devkit update ${name}' to update.`);
      continue;
    }

    if (opts.dryRun) {
      log.info(`[dry-run] Would install: ${chalk.cyan(name)}@${version} (${config.template})`);
      continue;
    }

    const spinner = ora({ text: `Installing ${chalk.cyan(name)}…`, color: "cyan" }).start();
    try {
      await installComponent(name, config.template, version, opts.variant, cwd);
      spinner.succeed(chalk.green(`${name}@${version} installed`));
    } catch (e) {
      spinner.fail(chalk.red(`Failed to install ${name}: ${(e as Error).message}`));
    }
  }
}
