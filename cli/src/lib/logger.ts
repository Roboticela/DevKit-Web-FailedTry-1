import chalk from "chalk";

export const log = {
  info:    (msg: string) => console.log(`  ${chalk.cyan("ℹ")}  ${msg}`),
  success: (msg: string) => console.log(`  ${chalk.green("✓")}  ${msg}`),
  warn:    (msg: string) => console.log(`  ${chalk.yellow("⚠")}  ${msg}`),
  error:   (msg: string) => console.log(`  ${chalk.red("✗")}  ${msg}`),
  step:    (msg: string) => console.log(`  ${chalk.gray("→")}  ${chalk.dim(msg)}`),
  blank:   ()            => console.log(),
  header:  (msg: string) => {
    console.log();
    console.log(chalk.bold.white(`  ${msg}`));
    console.log();
  },
  divider: () => console.log(chalk.gray("  " + "─".repeat(56))),
};
