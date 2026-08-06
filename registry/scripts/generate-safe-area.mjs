/**
 * Sync Safe Area to both templates; patch registry.
 * Run: node scripts/generate-safe-area.mjs
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

const nextRoot = join(COMP, "safe-area/nextjs-compact/v1/files");
const viteRoot = join(COMP, "safe-area/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/safe-area-system.css"), join(viteRoot, "src/styles/safe-area-system.css"));
copy(join(nextRoot, "docs/SAFE_AREA.md"), join(viteRoot, "docs/SAFE_AREA.md"));
copy(join(nextRoot, "components/ui/SafeArea.tsx"), join(viteRoot, "src/components/ui/SafeArea.tsx"));

write(
  join(COMP, "safe-area/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/safe-area-system.css", destination: "styles/safe-area-system.css" },
        { source: "files/components/ui/SafeArea.tsx", destination: "components/ui/SafeArea.tsx" },
        { source: "files/docs/SAFE_AREA.md", destination: "docs/devkit/SAFE_AREA.md" },
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
  join(COMP, "safe-area/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/safe-area-system.css", destination: "src/styles/safe-area-system.css" },
        { source: "files/src/components/ui/SafeArea.tsx", destination: "src/components/ui/SafeArea.tsx" },
        { source: "files/docs/SAFE_AREA.md", destination: "docs/devkit/SAFE_AREA.md" },
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
  join(COMP, "safe-area/component.json"),
  JSON.stringify(
    {
      id: 19,
      name: "safe-area",
      displayName: "Safe Area",
      description:
        "Safe Area — device insets for notches, Dynamic Island, foldables, keyboards, and browser chrome; modes for nav/FAB/fullscreen; useSafeArea hooks.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layout",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "safe-area", "inset"],
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
  if (entry.name !== "safe-area") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Safe Area";
  entry.description =
    "Safe Area — device insets for notches, Dynamic Island, foldables, keyboards, and browser chrome; modes for nav/FAB/fullscreen; useSafeArea hooks.";
  entry.tags = ["foundation", "layout-system", "safe-area", "inset"];
  entry.icon = "layout";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Safe Area system generated.");
