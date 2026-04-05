// Adds the #!/usr/bin/env node shebang and sets executable bit on the compiled CLI entry point
import { readFileSync, writeFileSync, chmodSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const entryPath = join(__dirname, "../dist/index.js");

const content = readFileSync(entryPath, "utf-8");
if (!content.startsWith("#!/usr/bin/env node")) {
  writeFileSync(entryPath, "#!/usr/bin/env node\n" + content);
  console.log("  ✓ Added shebang to dist/index.js");
}

// npm requires the bin file to be executable (755) — without this npm strips the bin entry
chmodSync(entryPath, 0o755);
console.log("  ✓ Set dist/index.js as executable (755)");
