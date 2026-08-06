/**
 * Sync Spacer to both templates; patch registry.
 * Run: node scripts/generate-spacer.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const nextRoot = join(COMP, "spacer/nextjs-compact/v1/files");
const viteRoot = join(COMP, "spacer/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/spacer-system.css"), join(viteRoot, "src/styles/spacer-system.css"));
copy(join(nextRoot, "docs/SPACER.md"), join(viteRoot, "docs/SPACER.md"));
copy(join(nextRoot, "components/ui/Spacer.tsx"), join(viteRoot, "src/components/ui/Spacer.tsx"));

write(
  join(COMP, "spacer/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/spacer-system.css", destination: "styles/spacer-system.css" },
        { source: "files/components/ui/Spacer.tsx", destination: "components/ui/Spacer.tsx" },
        { source: "files/docs/SPACER.md", destination: "docs/devkit/SPACER.md" },
      ],
      injections: [],
      dependencies: { frontend: ["responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "spacer/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/spacer-system.css", destination: "src/styles/spacer-system.css" },
        { source: "files/src/components/ui/Spacer.tsx", destination: "src/components/ui/Spacer.tsx" },
        { source: "files/docs/SPACER.md", destination: "docs/devkit/SPACER.md" },
      ],
      injections: [],
      dependencies: { frontend: ["responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "spacer/component.json"),
  JSON.stringify(
    {
      id: 15,
      name: "spacer",
      displayName: "Spacer",
      description:
        "Spacer — tokenized whitespace with fixed, responsive, proportional, safe-area, and keyboard modes; presets for section/card/form/modal/nav/hero gaps.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layout",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "spacer", "spacing"],
      templates: ["nextjs-compact", "vite-express-tauri"],
      platforms: ["web", "desktop"],
      hasVariants: true,
      stub: false,
      fileKind: "tsx",
      versions: {
        latest: "1.0.0",
        stable: "1.0.0",
        history: [{ version: "1.0.0", releaseDate: "2026-08-06", breaking: false }],
      },
      requiredConfig: [],
      optionalConfig: ["ui.density"],
    },
    null,
    2
  ) + "\n"
);

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
for (const entry of registry.components) {
  if (entry.name !== "spacer") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Spacer";
  entry.description =
    "Spacer — tokenized whitespace with fixed, responsive, proportional, safe-area, and keyboard modes; presets for section/card/form/modal/nav/hero gaps.";
  entry.tags = ["foundation", "layout-system", "spacer", "spacing"];
  entry.icon = "layout";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Spacer system generated.");
