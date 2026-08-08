import ora from "ora";
import chalk from "chalk";
import { intro, outro, multiselect, select, isCancel } from "@clack/prompts";
import { readConfig, isComponentInstalled } from "../lib/config.js";
import { installComponent } from "../lib/installer.js";
import { listComponents } from "../lib/registry.js";
import { log } from "../lib/logger.js";
/** `undefined` = no variant; string = chosen id; `"cancel"` = user aborted */
async function pickVariantForComponent(meta, optsVariant) {
    if (!meta.hasVariants || !meta.variants?.length)
        return undefined;
    if (meta.variants.length === 1)
        return meta.variants[0].id;
    if (optsVariant) {
        const match = meta.variants.find((v) => v.id === optsVariant);
        if (match)
            return match.id;
    }
    const v = await select({
        message: `Variant for ${meta.name}`,
        options: meta.variants.map((x) => ({
            value: x.id,
            label: x.label,
            hint: x.description,
        })),
    });
    if (isCancel(v))
        return "cancel";
    return v;
}
async function interactiveAddSelections(config, opts, cwd) {
    let all;
    try {
        all = await listComponents({ template: config.template });
    }
    catch (e) {
        log.error(`Could not load registry: ${e.message}`);
        log.info("The CLI uses the registry bundled in @roboticela/devkit — reinstall the package if this persists.");
        return null;
    }
    const installable = all.filter((c) => !isComponentInstalled(c.name, cwd));
    if (installable.length === 0) {
        log.info("Every component from the registry for your template is already installed.");
        return [];
    }
    console.log();
    intro(chalk.cyan("Add components"));
    const toPickerOptions = (kind) => installable
        .filter((c) => c.kind === kind)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((c) => ({
        value: c.name,
        label: c.name,
        hint: c.description.length > 52 ? `${c.description.slice(0, 49)}…` : c.description,
    }));
    const kinds = [
        { kind: "component", label: "components" },
        { kind: "page", label: "pages" },
        { kind: "scaffold", label: "scaffolds" },
    ];
    const picked = [];
    for (const { kind, label } of kinds) {
        const options = toPickerOptions(kind);
        if (options.length === 0) {
            log.warn(`No ${label} available to install.`);
            continue;
        }
        const selected = await multiselect({
            message: `Select ${label} to install (space to toggle, enter to confirm)`,
            options,
            required: false,
        });
        if (isCancel(selected)) {
            outro("Cancelled.");
            return [];
        }
        picked.push(...selected);
    }
    const seen = new Set();
    const unique = picked.filter((name) => {
        if (seen.has(name))
            return false;
        seen.add(name);
        return true;
    });
    if (unique.length === 0) {
        outro("No packages selected.");
        return [];
    }
    const results = [];
    for (const compName of unique) {
        const meta = installable.find((x) => x.name === compName);
        const variant = await pickVariantForComponent(meta, opts.variant);
        if (variant === "cancel") {
            outro("Cancelled.");
            return [];
        }
        results.push({ name: compName, version: "latest", variant });
    }
    return results;
}
export async function addCommand(names, opts, cwd = process.cwd()) {
    const config = readConfig(cwd);
    const usedInteractive = names.length === 0;
    let todo;
    if (usedInteractive) {
        const picked = await interactiveAddSelections(config, opts, cwd);
        if (picked === null)
            return;
        if (picked.length === 0)
            return;
        todo = picked;
    }
    else {
        todo = names.map((nameAtVersion) => {
            const [name, version = "latest"] = nameAtVersion.split("@");
            return { name, version, variant: opts.variant };
        });
    }
    let anyOk = false;
    for (const { name, version, variant } of todo) {
        if (isComponentInstalled(name, cwd)) {
            log.info(`${name} is already installed — skipping.`);
            continue;
        }
        if (opts.dryRun) {
            log.info(`[dry-run] Would install: ${chalk.cyan(name)}@${version} (${config.template})` +
                (variant ? chalk.dim(` variant=${variant}`) : ""));
            anyOk = true;
            continue;
        }
        const spinner = ora({ text: `Installing ${chalk.cyan(name)}…`, color: "cyan" }).start();
        try {
            await installComponent(name, config.template, version, variant, cwd);
            spinner.succeed(chalk.green(`${name}@${version} installed`));
            anyOk = true;
        }
        catch (e) {
            spinner.fail(chalk.red(`Failed to install ${name}: ${e.message}`));
        }
    }
    if (usedInteractive) {
        if (anyOk) {
            outro(opts.dryRun ? chalk.dim("Dry run complete.") : chalk.green("Done."));
        }
        else if (!opts.dryRun) {
            outro(chalk.yellow("Nothing was installed."));
        }
    }
}
