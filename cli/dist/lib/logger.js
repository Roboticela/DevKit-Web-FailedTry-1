import chalk from "chalk";
export const log = {
    info: (msg) => console.log(`  ${chalk.cyan("ℹ")}  ${msg}`),
    success: (msg) => console.log(`  ${chalk.green("✓")}  ${msg}`),
    warn: (msg) => console.log(`  ${chalk.yellow("⚠")}  ${msg}`),
    error: (msg) => console.log(`  ${chalk.red("✗")}  ${msg}`),
    step: (msg) => console.log(`  ${chalk.gray("→")}  ${chalk.dim(msg)}`),
    blank: () => console.log(),
    header: (msg) => {
        console.log();
        console.log(chalk.bold.white(`  ${msg}`));
        console.log();
    },
    divider: () => console.log(chalk.gray("  " + "─".repeat(56))),
};
