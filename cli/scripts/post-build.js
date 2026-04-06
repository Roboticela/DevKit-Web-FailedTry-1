// Adds the #!/usr/bin/env node shebang and sets executable bit on the compiled CLI entry point
import { readFileSync, writeFileSync, chmodSync, cpSync, existsSync, rmSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliRoot = join(__dirname, "..");
const entryPath = join(cliRoot, "dist/index.js");

// Ship component payloads with the npm package (monorepo: copy from ../registry/components).
const repoComponents = join(cliRoot, "..", "registry", "components");
const bundleComponents = join(cliRoot, "registry", "components");
if (existsSync(repoComponents)) {
  rmSync(join(cliRoot, "registry"), { recursive: true, force: true });
  mkdirSync(bundleComponents, { recursive: true });
  cpSync(repoComponents, bundleComponents, { recursive: true });
  console.log("  ✓ Bundled registry/components into cli/registry/");
} else {
  console.log("  ℹ Skipped registry bundle (no ../registry/components — use monorepo or publish from repo root)");
}

const content = readFileSync(entryPath, "utf-8");
if (!content.startsWith("#!/usr/bin/env node")) {
  writeFileSync(entryPath, "#!/usr/bin/env node\n" + content);
  console.log("  ✓ Added shebang to dist/index.js");
}

// npm requires the bin file to be executable (755) — without this npm strips the bin entry
chmodSync(entryPath, 0o755);
console.log("  ✓ Set dist/index.js as executable (755)");
