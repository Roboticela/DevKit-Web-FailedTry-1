/**
 * Sync Display Typography (display-text) to both templates; patch registry.
 * Run: node registry/scripts/generate-display.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "display-text";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const nextRoot = join(COMP, NAME, "nextjs-compact/v1/files");
const viteRoot = join(COMP, NAME, "vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/display-system.css"), join(viteRoot, "src/styles/display-system.css"));
copy(join(nextRoot, "docs/DISPLAY.md"), join(viteRoot, "docs/DISPLAY.md"));
copy(
  join(nextRoot, "components/ui/DisplayText.tsx"),
  join(viteRoot, "src/components/ui/DisplayText.tsx")
);
copy(
  join(nextRoot, "components/ui/displayTokens.ts"),
  join(viteRoot, "src/components/ui/displayTokens.ts")
);

const meta = {
  id: 41,
  name: NAME,
  displayName: "Display Typography",
  description:
    "Premium Display Typography — highest type hierarchy; hero/large/medium/compact/marketing/dashboard/AI; fluid responsive scale, balance/truncate, count + entrance animations, optional gradient text; Theme Engine + Typography Token System.",
  category: "foundation",
  group: "typography-system",
  groupName: "Typography System",
  kind: "component",
  layer: 1,
  icon: "type",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "typography-system", "display-text", "display", "a11y"],
  templates: ["nextjs-compact", "vite-express-tauri"],
  platforms: ["web", "desktop"],
  hasVariants: true,
  stub: false,
  fileKind: "tsx",
  versions: {
    latest: "1.0.0",
    stable: "1.0.0",
    history: [{ version: "1.0.0", releaseDate: "2026-08-07", breaking: false }],
  },
  requiredConfig: [],
  optionalConfig: ["ui.typeScale", "ui.motion"],
};

write(join(COMP, NAME, "component.json"), JSON.stringify(meta, null, 2) + "\n");

write(
  join(COMP, NAME, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/display-system.css", destination: "styles/display-system.css" },
        { source: "files/components/ui/DisplayText.tsx", destination: "components/ui/DisplayText.tsx" },
        {
          source: "files/components/ui/displayTokens.ts",
          destination: "components/ui/displayTokens.ts",
        },
        { source: "files/docs/DISPLAY.md", destination: "docs/devkit/DISPLAY.md" },
      ],
      injections: [],
      dependencies: { frontend: ["typography-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, NAME, "vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        {
          source: "files/src/styles/display-system.css",
          destination: "src/styles/display-system.css",
        },
        {
          source: "files/src/components/ui/DisplayText.tsx",
          destination: "src/components/ui/DisplayText.tsx",
        },
        {
          source: "files/src/components/ui/displayTokens.ts",
          destination: "src/components/ui/displayTokens.ts",
        },
        { source: "files/docs/DISPLAY.md", destination: "docs/devkit/DISPLAY.md" },
      ],
      injections: [],
      dependencies: { frontend: ["typography-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

const registryPath = join(COMP, "registry.json");
if (existsSync(registryPath)) {
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  for (const entry of registry.components) {
    if (entry.name !== NAME) continue;
    Object.assign(entry, {
      stub: false,
      latestVersion: "1.0.0",
      displayName: meta.displayName,
      description: meta.description,
      icon: meta.icon,
      fileKind: "tsx",
      tags: meta.tags,
      hasVariants: true,
    });
  }
  registry.updatedAt = "2026-08-07T00:00:00Z";
  write(registryPath, JSON.stringify(registry, null, 2) + "\n");
}

console.log("Display Typography generated.");
