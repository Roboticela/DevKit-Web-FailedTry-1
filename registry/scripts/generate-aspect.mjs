/**
 * Sync Aspect Ratio to both templates; patch registry.
 * Run: node scripts/generate-aspect.mjs
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

const nextRoot = join(COMP, "aspect-ratio/nextjs-compact/v1/files");
const viteRoot = join(COMP, "aspect-ratio/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/aspect-system.css"), join(viteRoot, "src/styles/aspect-system.css"));
copy(join(nextRoot, "docs/ASPECT.md"), join(viteRoot, "docs/ASPECT.md"));
copy(join(nextRoot, "components/ui/AspectRatio.tsx"), join(viteRoot, "src/components/ui/AspectRatio.tsx"));

write(
  join(COMP, "aspect-ratio/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/aspect-system.css", destination: "styles/aspect-system.css" },
        { source: "files/components/ui/AspectRatio.tsx", destination: "components/ui/AspectRatio.tsx" },
        { source: "files/docs/ASPECT.md", destination: "docs/devkit/ASPECT.md" },
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
  join(COMP, "aspect-ratio/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/aspect-system.css", destination: "src/styles/aspect-system.css" },
        { source: "files/src/components/ui/AspectRatio.tsx", destination: "src/components/ui/AspectRatio.tsx" },
        { source: "files/docs/ASPECT.md", destination: "docs/devkit/ASPECT.md" },
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
  join(COMP, "aspect-ratio/component.json"),
  JSON.stringify(
    {
      id: 20,
      name: "aspect-ratio",
      displayName: "Aspect Ratio",
      description:
        "Aspect Ratio — consistent proportions for media and layouts with presets (1:1, 16:9, A4, card, mobile…), fit/crop, skeleton, and lazy loading.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layout",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "aspect-ratio", "media"],
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
  if (entry.name !== "aspect-ratio") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Aspect Ratio";
  entry.description =
    "Aspect Ratio — consistent proportions for media and layouts with presets (1:1, 16:9, A4, card, mobile…), fit/crop, skeleton, and lazy loading.";
  entry.tags = ["foundation", "layout-system", "aspect-ratio", "media"];
  entry.icon = "layout";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Aspect Ratio system generated.");
