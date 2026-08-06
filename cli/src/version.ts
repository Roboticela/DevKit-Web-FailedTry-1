import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const pkgDir = dirname(fileURLToPath(import.meta.url));

/** Published version from `package.json` next to `dist/` (or `src/` when using tsx). */
export const CLI_VERSION: string = JSON.parse(
  readFileSync(join(pkgDir, "../package.json"), "utf-8")
).version;
