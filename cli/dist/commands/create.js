import { intro, outro, text, select, multiselect, confirm, spinner } from "@clack/prompts";
import chalk from "chalk";
import { execSync } from "child_process";
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { downloadTemplate } from "../lib/template.js";
import { writeConfig, writeLock, defaultConfig } from "../lib/config.js";
import { generateThemeCSS } from "../lib/theme.js";
import { installComponent } from "../lib/installer.js";
import { log } from "../lib/logger.js";
import { listComponents } from "../lib/registry.js";
import { CLI_VERSION } from "../version.js";
const TEMPLATES = [
    {
        value: "nextjs-compact",
        label: "NextJS Compact",
        hint: "Next.js 16 · React 19 · TailwindCSS 4 — Web only, SSR/RSC",
    },
    {
        value: "vite-express-tauri",
        label: "Wide Express  (Vite + Express + Tauri)",
        hint: "Vite 7 · React 19 · Express 5 · Tauri 2 — Web + Desktop",
    },
];
const PRESETS = [
    { value: "default", label: "Default    — Indigo + Amber    — Modern SaaS" },
    { value: "minimal", label: "Minimal    — Slate + Sky       — Clean, editorial" },
    { value: "bold", label: "Bold       — Violet + Pink     — Vibrant, expressive" },
    { value: "playful", label: "Playful    — Emerald + Orange  — Friendly, rounded" },
    { value: "corporate", label: "Corporate  — Blue + Gray       — Formal, enterprise" },
];
async function getCreatePickerOptions(template, kind) {
    const entries = await listComponents({ template, kind });
    return entries
        .slice()
        .sort((a, b) => {
        if (a.kind !== b.kind)
            return a.kind === "component" ? -1 : 1;
        return a.name.localeCompare(b.name);
    })
        .map((entry) => ({
        value: entry.name,
        label: `${entry.name} (${entry.kind})`,
        hint: entry.description,
    }));
}
export async function createCommand(projectName, opts) {
    console.log();
    const inner = 53;
    const verCentered = (() => {
        const s = `v${CLI_VERSION}`;
        const pad = inner - s.length;
        const left = Math.floor(pad / 2);
        return " ".repeat(left) + s + " ".repeat(pad - left);
    })();
    console.log(chalk.bold.white("  ┌─────────────────────────────────────────────────────┐"));
    console.log(chalk.bold.white("  │      Roboticela DevKit — Create New Project         │"));
    console.log(chalk.bold.white(`  │${verCentered}│`));
    console.log(chalk.bold.white("  └─────────────────────────────────────────────────────┘"));
    console.log();
    intro(chalk.cyan("Let's scaffold your project"));
    // ── Collect answers ──────────────────────────────────────────────────────
    const name = projectName ?? (opts.yes ? "my-app" : await text({
        message: "Project name",
        placeholder: "my-app",
        validate: (v) => v.length < 1 ? "Name is required" : undefined,
    }));
    if (!name || typeof name !== "string") {
        process.exit(0);
    }
    const template = (opts.template ?? (opts.yes ? "nextjs-compact" : await select({
        message: "Select a template",
        options: TEMPLATES,
    })));
    const siteName = opts.yes ? name : await text({
        message: "Site display name",
        initialValue: name,
    });
    const siteUrl = opts.yes ? `https://${name}.com` : await text({
        message: "Site URL",
        placeholder: "https://myapp.com",
    });
    const preset = opts.preset ?? (opts.yes ? "default" : await select({
        message: "Theme preset",
        options: PRESETS,
    }));
    const primaryColor = opts.primary ?? (opts.yes ? undefined : await text({
        message: "Primary brand color (hex, leave blank to use preset)",
        placeholder: "(leave blank for preset default)",
        validate: (v) => v && !/^#[0-9a-fA-F]{6}$/.test(v) ? "Enter a valid hex like #6366f1 or leave blank" : undefined,
    }));
    const doGit = opts.git ?? (opts.yes ? true : await confirm({ message: "Initialize a git repository?" }));
    const doInstall = opts.install ?? (opts.yes ? true : await confirm({ message: "Install npm dependencies now?" }));
    let selectedComponents = [];
    if (opts.add) {
        selectedComponents = opts.add.split(",").map((s) => s.trim()).filter(Boolean);
    }
    else if (!opts.yes) {
        try {
            const componentOptions = await getCreatePickerOptions(template, "component");
            const scaffoldOptions = await getCreatePickerOptions(template, "scaffold");
            const selectedUiComponents = componentOptions.length > 0
                ? await multiselect({
                    message: "Add components now? (space to select, enter to confirm)",
                    options: componentOptions,
                    required: false,
                })
                : [];
            if (componentOptions.length === 0) {
                log.warn("No components available for this template.");
            }
            const selectedScaffolds = scaffoldOptions.length > 0
                ? await multiselect({
                    message: "Add scaffolds now? (space to select, enter to confirm)",
                    options: scaffoldOptions,
                    required: false,
                })
                : [];
            if (scaffoldOptions.length === 0) {
                log.warn("No scaffolds available for this template.");
            }
            const seen = new Set();
            selectedComponents = [...selectedUiComponents, ...selectedScaffolds].filter((name) => {
                if (seen.has(name))
                    return false;
                seen.add(name);
                return true;
            });
            if (selectedComponents.length === 0) {
                log.info("No packages selected — you can always run 'devkit add' later.");
            }
        }
        catch (e) {
            log.warn(`Could not load registry packages for picker: ${e.message}`);
        }
    }
    // ── Build ────────────────────────────────────────────────────────────────
    console.log();
    log.header("Creating project…");
    const destDir = join(process.cwd(), name);
    if (existsSync(destDir)) {
        log.error(`Directory '${name}' already exists.`);
        process.exit(1);
    }
    mkdirSync(destDir, { recursive: true });
    // 1. Download template
    const s = spinner();
    s.start(`Fetching template: ${chalk.cyan(template)}`);
    try {
        await downloadTemplate(template, destDir);
        s.stop(chalk.green(`✓  Template fetched: ${template}`));
    }
    catch (e) {
        s.stop(chalk.red(`✗  Failed to fetch template`));
        log.error(e.message);
        process.exit(1);
    }
    // 2. Write devkit.config.json
    const config = defaultConfig(template, siteName, siteUrl);
    config.theme.preset = preset;
    if (primaryColor)
        config.theme.colors = { ...config.theme.colors, primary: primaryColor };
    writeConfig(config, destDir);
    log.success("Created devkit.config.json");
    // 3. Write devkit.lock.json
    writeLock({ lockVersion: 1, template, components: {} }, destDir);
    log.success("Created devkit.lock.json");
    // 4. Generate theme CSS
    const themeCss = generateThemeCSS(config);
    const cssPath = template === "nextjs-compact"
        ? join(destDir, "app", "globals.css")
        : join(destDir, "src", "index.css");
    if (existsSync(cssPath)) {
        const existing = readFileSync(cssPath, "utf-8");
        const withoutOldBlock = existing.replace(/\/\* ── DevKit Managed Theme Block[\s\S]*?── End DevKit Managed Theme Block ── \*\//, "").trimStart();
        writeFileSync(cssPath, themeCss + withoutOldBlock);
    }
    else {
        mkdirSync(join(destDir, template === "nextjs-compact" ? "app" : "src"), { recursive: true });
        writeFileSync(cssPath, themeCss);
    }
    log.success(`Applied theme preset: ${preset}`);
    // 5. npm install
    if (doInstall) {
        s.start("Installing npm dependencies…");
        try {
            execSync("npm install", { cwd: destDir, stdio: "pipe" });
            s.stop(chalk.green("✓  npm install complete"));
        }
        catch {
            s.stop(chalk.yellow("⚠  npm install failed — run it manually"));
        }
    }
    // 6. git init
    if (doGit) {
        try {
            execSync("git init", { cwd: destDir, stdio: "pipe" });
            execSync('git add . && git commit -m "chore: init project with DevKit"', { cwd: destDir, stdio: "pipe" });
            log.success("Initialized git repository");
        }
        catch {
            log.warn("git init failed — git may not be installed");
        }
    }
    // 7. Add selected components
    for (const comp of selectedComponents) {
        s.start(`Adding component: ${chalk.cyan(comp)}`);
        try {
            await installComponent(comp, template, "latest", undefined, destDir);
            s.stop(chalk.green(`✓  Added: ${comp}`));
        }
        catch (e) {
            s.stop(chalk.yellow(`⚠  Skipped ${comp}: ${e.message}`));
        }
    }
    // ── Done ─────────────────────────────────────────────────────────────────
    console.log();
    outro(chalk.green("Project ready!"));
    console.log();
    console.log(`  ${chalk.bold("Location")}    ${name}/`);
    console.log(`  ${chalk.bold("Template")}    ${template}`);
    console.log(`  ${chalk.bold("Theme")}       ${preset}`);
    if (selectedComponents.length > 0) {
        console.log(`  ${chalk.bold("Components")}  ${selectedComponents.join(", ")}`);
    }
    console.log();
    console.log(chalk.bold("  Next steps:"));
    console.log(`    ${chalk.cyan("cd")} ${name}`);
    console.log(`    ${chalk.cyan("cp")} .env.example .env    ${chalk.gray("# Fill in your secrets")}`);
    console.log(`    ${chalk.cyan("devkit doctor")}           ${chalk.gray("# Check for missing config")}`);
    console.log(`    ${chalk.cyan("npm run dev")}             ${chalk.gray("# Start the dev server")}`);
    console.log();
}
