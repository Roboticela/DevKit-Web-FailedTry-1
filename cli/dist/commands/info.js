import chalk from "chalk";
import { getComponentInfo } from "../lib/registry.js";
import { normalizeKind } from "../lib/component-entry.js";
import { log } from "../lib/logger.js";
export async function infoCommand(name) {
    try {
        const info = await getComponentInfo(name);
        const versions = info["versions"];
        const variants = info["variants"];
        log.blank();
        console.log(`  ${chalk.bold.white(info["displayName"])}  ${chalk.dim(`(${name})`)}`);
        console.log(`  ${chalk.dim(info["description"])}`);
        log.blank();
        console.log(`  ${chalk.bold("Version")}     ${versions.latest}`);
        const k = normalizeKind(info["kind"]);
        const kindExplain = k === "component" ? "UI building block (button, input, …)" : "full feature (routes, APIs, flows)";
        console.log(`  ${chalk.bold("Kind")}        ${k}  ${chalk.dim(`(${kindExplain})`)}`);
        console.log(`  ${chalk.bold("Category")}    ${info["category"]}`);
        console.log(`  ${chalk.bold("Templates")}   ${info["templates"].join(", ")}`);
        console.log(`  ${chalk.bold("Platforms")}   ${info["platforms"].join(", ")}`);
        if (variants?.length) {
            log.blank();
            console.log(`  ${chalk.bold("Variants:")}`);
            for (const v of variants) {
                console.log(`    ${chalk.cyan(v.id.padEnd(18))} ${chalk.dim(v.description)}`);
            }
        }
        const req = info["requiredConfig"];
        const opt = info["optionalConfig"];
        if (req?.length) {
            log.blank();
            console.log(`  ${chalk.bold("Required config:")}`);
            for (const k of req)
                console.log(`    ${chalk.yellow(k)}`);
        }
        if (opt?.length) {
            console.log(`  ${chalk.bold("Optional config:")}`);
            for (const k of opt)
                console.log(`    ${chalk.dim(k)}`);
        }
        log.blank();
        console.log(`  ${chalk.bold("Version history:")}`);
        for (const v of versions.history) {
            const tag = v.breaking ? chalk.red(" [breaking]") : "";
            console.log(`    ${chalk.cyan(v.version)}  ${chalk.dim(v.releaseDate)}${tag}`);
        }
        log.blank();
        console.log(`  ${chalk.dim("Install:")}  devkit add ${name}`);
        if (variants?.length) {
            console.log(`  ${chalk.dim("With variant:")}  devkit add ${name} --variant=${variants[0].id}`);
        }
        log.blank();
    }
    catch (e) {
        log.error(`Component '${name}' not found: ${e.message}`);
    }
}
