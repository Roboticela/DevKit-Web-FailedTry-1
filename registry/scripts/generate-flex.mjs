/**
 * Sync Flex Layout to both templates; patch registry.
 * Run: node scripts/generate-flex.mjs
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

const nextRoot = join(COMP, "flex-layout/nextjs-compact/v1/files");
const viteRoot = join(COMP, "flex-layout/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/flex-system.css"), join(viteRoot, "src/styles/flex-system.css"));
copy(join(nextRoot, "docs/FLEX.md"), join(viteRoot, "docs/FLEX.md"));
copy(join(nextRoot, "components/ui/FlexLayout.tsx"), join(viteRoot, "src/components/ui/FlexLayout.tsx"));

write(
  join(COMP, "flex-layout/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/flex-system.css", destination: "styles/flex-system.css" },
        { source: "files/components/ui/FlexLayout.tsx", destination: "components/ui/FlexLayout.tsx" },
        { source: "files/docs/FLEX.md", destination: "docs/devkit/FLEX.md" },
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
  join(COMP, "flex-layout/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/flex-system.css", destination: "src/styles/flex-system.css" },
        { source: "files/src/components/ui/FlexLayout.tsx", destination: "src/components/ui/FlexLayout.tsx" },
        { source: "files/docs/FLEX.md", destination: "docs/devkit/FLEX.md" },
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
  join(COMP, "flex-layout/component.json"),
  JSON.stringify(
    {
      id: 12,
      name: "flex-layout",
      displayName: "Flex Layout",
      description:
        "Flex Layout — advanced responsive flexbox with grow/shrink/basis, presets (navbar, toolbar, form-row, …), token gaps, and motion-aware resizing.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layout",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "flex-layout", "flex", "responsive"],
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
  if (entry.name !== "flex-layout") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Flex Layout";
  entry.description =
    "Flex Layout — advanced responsive flexbox with grow/shrink/basis, presets (navbar, toolbar, form-row, …), token gaps, and motion-aware resizing.";
  entry.tags = ["foundation", "layout-system", "flex-layout", "flex", "responsive"];
  entry.icon = "layout";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Flex Layout system generated.");
