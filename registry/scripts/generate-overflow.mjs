/**
 * Sync Overflow Manager to both templates; patch registry.
 * Run: node scripts/generate-overflow.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "overflow-utilities";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const description =
  "Overflow Manager — scroll/clip/auto overflow with fade indicators, custom scrollbars, momentum, nested containment, virtual scroll, sync, lazy load, pull-to-refresh, and keyboard navigation.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/overflow-system.css"), join(viteRoot, "src/styles/overflow-system.css"));
copy(join(nextRoot, "docs/OVERFLOW.md"), join(viteRoot, "docs/OVERFLOW.md"));
copy(join(nextRoot, "components/ui/Overflow.tsx"), join(viteRoot, "src/components/ui/Overflow.tsx"));
copy(
  join(nextRoot, "components/ui/OverflowUtilities.tsx"),
  join(viteRoot, "src/components/ui/OverflowUtilities.tsx")
);

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/overflow-system.css", destination: "styles/overflow-system.css" },
        { source: "files/components/ui/Overflow.tsx", destination: "components/ui/Overflow.tsx" },
        {
          source: "files/components/ui/OverflowUtilities.tsx",
          destination: "components/ui/OverflowUtilities.tsx",
        },
        { source: "files/docs/OVERFLOW.md", destination: "docs/devkit/OVERFLOW.md" },
      ],
      injections: [],
      dependencies: { frontend: [] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, PKG, "vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        {
          source: "files/src/styles/overflow-system.css",
          destination: "src/styles/overflow-system.css",
        },
        {
          source: "files/src/components/ui/Overflow.tsx",
          destination: "src/components/ui/Overflow.tsx",
        },
        {
          source: "files/src/components/ui/OverflowUtilities.tsx",
          destination: "src/components/ui/OverflowUtilities.tsx",
        },
        { source: "files/docs/OVERFLOW.md", destination: "docs/devkit/OVERFLOW.md" },
      ],
      injections: [],
      dependencies: { frontend: [] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, PKG, "component.json"),
  JSON.stringify(
    {
      id: 30,
      name: PKG,
      displayName: "Overflow Manager",
      description,
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "spacing-system", "overflow-utilities", "overflow", "scroll"],
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
      optionalConfig: [],
    },
    null,
    2
  ) + "\n"
);

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
for (const entry of registry.components) {
  if (entry.name !== PKG) continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Overflow Manager";
  entry.description = description;
  entry.tags = ["foundation", "spacing-system", "overflow-utilities", "overflow", "scroll"];
  entry.icon = "move";
  entry.fileKind = "tsx";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Overflow Manager generated.");
