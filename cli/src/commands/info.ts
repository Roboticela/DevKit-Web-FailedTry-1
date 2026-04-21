import chalk from "chalk";
import { getComponentInfo } from "../lib/registry.js";
import { normalizeKind } from "../lib/component-entry.js";
import { log } from "../lib/logger.js";

export async function infoCommand(name: string) {
  try {
    const info = await getComponentInfo(name);
    const versions = (info["versions"] as { latest: string; history: { version: string; releaseDate: string; breaking: boolean }[] });
    const variants = info["variants"] as { id: string; label: string; description: string }[] | undefined;

    log.blank();
    console.log(`  ${chalk.bold.white(info["displayName"] as string)}  ${chalk.dim(`(${name})`)}`);
    console.log(`  ${chalk.dim(info["description"] as string)}`);
    log.blank();
    console.log(`  ${chalk.bold("Version")}     ${versions.latest}`);
    const k = normalizeKind(info["kind"]);
    const kindExplain =
      k === "component" ? "UI building block (button, input, …)" : "full feature (routes, APIs, flows)";
    console.log(`  ${chalk.bold("Kind")}        ${k}  ${chalk.dim(`(${kindExplain})`)}`);
    console.log(`  ${chalk.bold("Category")}    ${info["category"]}`);
    console.log(`  ${chalk.bold("Templates")}   ${(info["templates"] as string[]).join(", ")}`);
    console.log(`  ${chalk.bold("Platforms")}   ${(info["platforms"] as string[]).join(", ")}`);

    if (variants?.length) {
      log.blank();
      console.log(`  ${chalk.bold("Variants:")}`);
      for (const v of variants) {
        console.log(`    ${chalk.cyan(v.id.padEnd(18))} ${chalk.dim(v.description)}`);
      }
    }

    const req = info["requiredConfig"] as string[] | undefined;
    const opt = info["optionalConfig"] as string[] | undefined;
    if (req?.length) {
      log.blank();
      console.log(`  ${chalk.bold("Required config:")}`);
      for (const k of req) console.log(`    ${chalk.yellow(k)}`);
    }
    if (opt?.length) {
      console.log(`  ${chalk.bold("Optional config:")}`);
      for (const k of opt) console.log(`    ${chalk.dim(k)}`);
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
  } catch (e) {
    log.error(`Component '${name}' not found: ${(e as Error).message}`);
  }
}
