#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { createCommand } from "./commands/create.js";
import { initCommand } from "./commands/init.js";
import { addCommand } from "./commands/add.js";
import { removeCommand } from "./commands/remove.js";
import { listCommand } from "./commands/list.js";
import { infoCommand } from "./commands/info.js";
import { updateCommand, upgradeAllCommand } from "./commands/update.js";
import { doctorCommand } from "./commands/doctor.js";
import { ejectCommand } from "./commands/eject.js";
import { themeApplyCommand, themePreviewCommand, themePresetCommand, themeSetCommand, themeListCommand, themeAuditCommand, } from "./commands/theme.js";
const program = new Command();
program
    .name("devkit")
    .description("Roboticela DevKit — scaffold and extend full-stack projects")
    .version("1.0.0");
// ── devkit create ─────────────────────────────────────────────────────────────
program
    .command("create [name]")
    .description("Create a new project from a DevKit template")
    .option("--template <id>", "Template ID (nextjs-compact | vite-express-tauri)")
    .option("--preset <name>", "Theme preset (default | minimal | bold | playful | corporate)")
    .option("--primary <hex>", "Primary brand color override (e.g. #e11d48)")
    .option("--git", "Initialize git repository")
    .option("--no-git", "Skip git initialization")
    .option("--install", "Run npm install after scaffolding")
    .option("--no-install", "Skip npm install")
    .option("--add <components>", "Comma-separated components to add immediately (e.g. auth,hero-section)")
    .option("-y, --yes", "Accept all defaults, skip prompts")
    .action((name, opts) => createCommand(name, opts));
// ── devkit init ───────────────────────────────────────────────────────────────
program
    .command("init")
    .description("Initialize DevKit in an existing project")
    .action(() => initCommand());
// ── devkit add ────────────────────────────────────────────────────────────────
program
    .command("add [components...]")
    .description("Install components — run with no args for an interactive picker")
    .option("--variant <id>", "Variant for components with variants (non-interactive or as default when prompting)")
    .option("--dry-run", "Preview what would be installed without writing files")
    .action((names, opts) => addCommand(names ?? [], opts));
// ── devkit remove ─────────────────────────────────────────────────────────────
program
    .command("remove <name>")
    .description("Uninstall a component and its managed files")
    .option("--keep-files", "Remove from DevKit tracking but keep the files")
    .action((name, opts) => removeCommand(name, opts));
// ── devkit list ───────────────────────────────────────────────────────────────
program
    .command("list")
    .description("List all available components from the registry")
    .option("--template <id>", "Filter by template")
    .option("--category <cat>", "Filter by category")
    .option("--installed", "Show only installed components")
    .action((opts) => listCommand(opts));
// ── devkit info ───────────────────────────────────────────────────────────────
program
    .command("info <name>")
    .description("Show details about a component")
    .action((name) => infoCommand(name));
// ── devkit update ─────────────────────────────────────────────────────────────
program
    .command("update [component]")
    .description("Update a component (or all components with --all)")
    .option("--all", "Update all installed components")
    .action((comp, opts) => {
    if (opts.all || !comp)
        return upgradeAllCommand();
    return updateCommand(comp);
});
// ── devkit upgrade ────────────────────────────────────────────────────────────
program
    .command("upgrade")
    .description("Upgrade all installed components to their latest versions")
    .action(() => upgradeAllCommand());
// ── devkit doctor ─────────────────────────────────────────────────────────────
program
    .command("doctor")
    .description("Check project configuration and installed components for issues")
    .action(() => doctorCommand());
// ── devkit theme ──────────────────────────────────────────────────────────────
const theme = program.command("theme").description("Manage the global design token system");
theme.command("apply")
    .description("Regenerate globals.css from current devkit.config.json theme settings")
    .action(() => themeApplyCommand());
theme.command("preview")
    .description("Preview the generated CSS without writing it")
    .action(() => themePreviewCommand());
theme.command("preset <name>")
    .description("Switch to a named theme preset (default | minimal | bold | playful | corporate)")
    .action((name) => themePresetCommand(name));
theme.command("set <key> <value>")
    .description("Set a single theme token (e.g. colors.primary #e11d48)")
    .action((key, value) => themeSetCommand(key, value));
theme.command("list")
    .description("Show all current theme settings")
    .action(() => themeListCommand());
theme.command("audit")
    .description("Scan component files for hardcoded colors (anti-pattern detector)")
    .action(() => themeAuditCommand());
// ── devkit install (CI use) ───────────────────────────────────────────────────
program
    .command("install")
    .description("Install all components from devkit.lock.json (for CI/deployment)")
    .action(async () => {
    const { readLock, readConfig } = await import("./lib/config.js");
    const { installComponent } = await import("./lib/installer.js");
    const { log } = await import("./lib/logger.js");
    const lock = readLock();
    const config = readConfig();
    for (const [name, entry] of Object.entries(lock.components)) {
        const s = (await import("ora")).default(`Installing ${name}…`).start();
        try {
            await installComponent(name, config.template, entry.version, entry.variant ?? undefined);
            s.succeed(`${name}@${entry.version}`);
        }
        catch (e) {
            s.fail(`${name}: ${e.message}`);
        }
    }
    log.success("All components installed.");
});
// ── devkit eject ──────────────────────────────────────────────────────────────
program
    .command("eject [name]")
    .description("Stop DevKit from tracking component(s) — run with no args to pick interactively")
    .action((name) => ejectCommand(name));
// ── Help footer ───────────────────────────────────────────────────────────────
program.addHelpText("after", `
${chalk.bold("Examples:")}
  ${chalk.cyan("devkit create my-app")}                       Interactive project creation
  ${chalk.cyan("devkit create my-app --template=nextjs-compact --yes")}   Non-interactive
  ${chalk.cyan("devkit add")}                                 Interactive component picker
  ${chalk.cyan("devkit add auth")}                            Install auth component
  ${chalk.cyan("devkit add hero-section --variant=split-image")}
  ${chalk.cyan("devkit eject")}                               Pick component(s) to eject
  ${chalk.cyan("devkit theme set colors.primary #e11d48")}   Change primary color
  ${chalk.cyan("devkit doctor")}                              Check configuration
  ${chalk.cyan("devkit list")}                                Browse all components

${chalk.dim("Registry:")} ${process.env.DEVKIT_REGISTRY ?? "https://registry.devkit.roboticela.com"}
`);
program.parse();
