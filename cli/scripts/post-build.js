// Adds the #!/usr/bin/env node shebang and sets executable bit on the compiled CLI entry point
import { readFileSync, writeFileSync, chmodSync, cpSync, existsSync, rmSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliRoot = join(__dirname, "..");
const entryPath = join(cliRoot, "dist/index.js");

// Ship the full registry with the npm package (components, pages, scaffolds + index files).
const repoRegistry = join(cliRoot, "..", "registry");
const bundleRegistry = join(cliRoot, "registry");
const registryParts = ["categories.json", "components", "pages", "scaffolds"];

if (existsSync(join(repoRegistry, "categories.json")) || existsSync(join(repoRegistry, "components", "registry.json"))) {
  rmSync(bundleRegistry, { recursive: true, force: true });
  mkdirSync(bundleRegistry, { recursive: true });
  for (const part of registryParts) {
    const src = join(repoRegistry, part);
    if (!existsSync(src)) continue;
    cpSync(src, join(bundleRegistry, part), { recursive: true });
  }
  console.log("  ✓ Bundled registry (components, pages, scaffolds) into cli/registry/");
} else {
  console.log("  ℹ Skipped registry bundle (no ../registry — use monorepo or publish from repo root)");
}

const content = readFileSync(entryPath, "utf-8");
if (!content.startsWith("#!/usr/bin/env node")) {
  writeFileSync(entryPath, "#!/usr/bin/env node\n" + content);
  console.log("  ✓ Added shebang to dist/index.js");
}

// npm requires the bin file to be executable (755) — without this npm strips the bin entry
chmodSync(entryPath, 0o755);
console.log("  ✓ Set dist/index.js as executable (755)");
