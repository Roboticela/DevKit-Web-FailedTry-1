import ora from "ora";
import chalk from "chalk";
import { intro, outro, multiselect, select, isCancel } from "@clack/prompts";
import { readConfig, isComponentInstalled } from "../lib/config.js";
import { installComponent } from "../lib/installer.js";
import { listComponents, type ComponentEntry } from "../lib/registry.js";
import { normalizeKind } from "../lib/component-entry.js";
import { log } from "../lib/logger.js";

interface AddOptions {
  variant?: string;
  dryRun?: boolean;
}

/** `undefined` = no variant; string = chosen id; `"cancel"` = user aborted */
async function pickVariantForComponent(
  meta: ComponentEntry,
  optsVariant: string | undefined
): Promise<string | undefined | "cancel"> {
  if (!meta.hasVariants || !meta.variants?.length) return undefined;
  if (meta.variants.length === 1) return meta.variants[0].id;
  if (optsVariant) {
    const match = meta.variants.find((v) => v.id === optsVariant);
    if (match) return match.id;
  }
  const v = await select({
    message: `Variant for ${meta.name}`,
    options: meta.variants.map((x) => ({
      value: x.id,
      label: x.label,
      hint: x.description,
    })),
  });
  if (isCancel(v)) return "cancel";
  return v as string;
}

async function interactiveAddSelections(
  config: ReturnType<typeof readConfig>,
  opts: AddOptions,
  cwd: string
): Promise<{ name: string; version: string; variant?: string }[] | null> {
  let all: ComponentEntry[];
  try {
    all = await listComponents({ template: config.template });
  } catch (e) {
    log.error(`Could not reach registry: ${(e as Error).message}`);
    log.info("Check DEVKIT_REGISTRY or start the registry locally (see repo README).");
    return null;
  }

  const installable = all.filter((c) => !isComponentInstalled(c.name, cwd));
  if (installable.length === 0) {
    log.info("Every component from the registry for your template is already installed.");
    return [];
  }

  console.log();
  intro(chalk.cyan("Add components"));

  const pickedRaw = await multiselect({
    message: "Select packages to install (space to toggle, enter to confirm)",
    options: installable.map((c) => {
      const role = normalizeKind(c.kind) === "component" ? "UI" : "app";
      const short =
        c.description.length > 52 ? `${c.description.slice(0, 49)}…` : c.description;
      return {
        value: c.name,
        label: `[${role}] ${c.name}`,
        hint: short,
      };
    }),
    required: false,
  });

  if (isCancel(pickedRaw)) {
    outro("Cancelled.");
    return [];
  }

  const picked = pickedRaw as string[];
  if (picked.length === 0) {
    outro("No components selected.");
    return [];
  }

  const results: { name: string; version: string; variant?: string }[] = [];

  for (const compName of picked) {
    const meta = installable.find((x) => x.name === compName)!;
    const variant = await pickVariantForComponent(meta, opts.variant);
    if (variant === "cancel") {
      outro("Cancelled.");
      return [];
    }
    results.push({ name: compName, version: "latest", variant });
  }

  return results;
}

export async function addCommand(names: string[], opts: AddOptions, cwd = process.cwd()) {
  const config = readConfig(cwd);
  const usedInteractive = names.length === 0;

  let todo: { name: string; version: string; variant?: string }[];

  if (usedInteractive) {
    const picked = await interactiveAddSelections(config, opts, cwd);
    if (picked === null) return;
    if (picked.length === 0) return;
    todo = picked;
  } else {
    todo = names.map((nameAtVersion) => {
      const [name, version = "latest"] = nameAtVersion.split("@");
      return { name, version, variant: opts.variant };
    });
  }

  let anyOk = false;

  for (const { name, version, variant } of todo) {
    if (isComponentInstalled(name, cwd)) {
      log.warn(`${name} is already installed. Run 'devkit update ${name}' to update.`);
      continue;
    }

    if (opts.dryRun) {
      log.info(
        `[dry-run] Would install: ${chalk.cyan(name)}@${version} (${config.template})` +
          (variant ? chalk.dim(` variant=${variant}`) : "")
      );
      anyOk = true;
      continue;
    }

    const spinner = ora({ text: `Installing ${chalk.cyan(name)}…`, color: "cyan" }).start();
    try {
      await installComponent(name, config.template, version, variant, cwd);
      spinner.succeed(chalk.green(`${name}@${version} installed`));
      anyOk = true;
    } catch (e) {
      spinner.fail(chalk.red(`Failed to install ${name}: ${(e as Error).message}`));
    }
  }

  if (usedInteractive) {
    if (anyOk) {
      outro(opts.dryRun ? chalk.dim("Dry run complete.") : chalk.green("Done."));
    } else if (!opts.dryRun) {
      outro(chalk.yellow("Nothing was installed."));
    }
  }
}
