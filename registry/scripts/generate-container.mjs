/**
 * Sync Responsive Container to both templates; patch registry.
 * Run: node scripts/generate-container.mjs
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

const nextRoot = join(COMP, "container/nextjs-compact/v1/files");
const viteRoot = join(COMP, "container/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/container-system.css"), join(viteRoot, "src/styles/container-system.css"));
copy(join(nextRoot, "docs/CONTAINER.md"), join(viteRoot, "docs/CONTAINER.md"));
copy(join(nextRoot, "components/ui/Container.tsx"), join(viteRoot, "src/components/ui/Container.tsx"));

write(
  join(COMP, "container/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/container-system.css", destination: "styles/container-system.css" },
        { source: "files/components/ui/Container.tsx", destination: "components/ui/Container.tsx" },
        { source: "files/docs/CONTAINER.md", destination: "docs/devkit/CONTAINER.md" },
      ],
      injections: [],
      dependencies: { frontend: ["responsive-spacing", "responsive-grid"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "container/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/container-system.css", destination: "src/styles/container-system.css" },
        { source: "files/src/components/ui/Container.tsx", destination: "src/components/ui/Container.tsx" },
        { source: "files/docs/CONTAINER.md", destination: "docs/devkit/CONTAINER.md" },
      ],
      injections: [],
      dependencies: { frontend: ["responsive-spacing", "responsive-grid"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "container/component.json"),
  JSON.stringify(
    {
      id: 16,
      name: "container",
      displayName: "Container",
      description:
        "Responsive Container — mobile-first layout wrapper with width variants, token padding, safe areas, nested rhythm, sticky, and scroll lock.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layout",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "container", "responsive"],
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
  if (entry.name !== "container") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Container";
  entry.description =
    "Responsive Container — mobile-first layout wrapper with width variants, token padding, safe areas, nested rhythm, sticky, and scroll lock.";
  entry.tags = ["foundation", "layout-system", "container", "responsive"];
  entry.icon = "layout";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Container system generated.");
