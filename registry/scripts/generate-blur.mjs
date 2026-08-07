/**
 * Sync Blur & Material System (blur-tokens) to both templates; patch registry.
 * Run: node registry/scripts/generate-blur.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "blur-tokens";

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

copy(join(nextRoot, "styles/material-system.css"), join(viteRoot, "src/styles/material-system.css"));
copy(join(nextRoot, "styles/blur-tokens.css"), join(viteRoot, "src/styles/blur-tokens.css"));
copy(join(nextRoot, "docs/MATERIAL.md"), join(viteRoot, "docs/MATERIAL.md"));
copy(
  join(nextRoot, "components/ui/Material.tsx"),
  join(viteRoot, "src/components/ui/Material.tsx")
);
copy(
  join(nextRoot, "components/ui/materialTokens.ts"),
  join(viteRoot, "src/components/ui/materialTokens.ts")
);

const meta = {
  id: 39,
  name: NAME,
  displayName: "Blur & Material System",
  description:
    "Blur & Material System — translucent, frosted glass, acrylic; semantic blur tokens; nav/modal/menu/panel/widget/AI/overlay materials; theme-adaptive, a11y solid fallbacks, low-power modes.",
  category: "foundation",
  group: "theme-engine",
  groupName: "Theme Engine",
  kind: "component",
  layer: 1,
  icon: "layers",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "theme-engine", "blur-tokens", "material", "a11y"],
  templates: ["nextjs-compact", "vite-express-tauri"],
  platforms: ["web", "desktop"],
  hasVariants: false,
  stub: false,
  fileKind: "tsx",
  versions: {
    latest: "1.0.0",
    stable: "1.0.0",
    history: [{ version: "1.0.0", releaseDate: "2026-08-07", breaking: false }],
  },
  requiredConfig: [],
  optionalConfig: ["ui.blur", "ui.performance"],
};

write(join(COMP, NAME, "component.json"), JSON.stringify(meta, null, 2) + "\n");

write(
  join(COMP, NAME, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/material-system.css", destination: "styles/material-system.css" },
        { source: "files/styles/blur-tokens.css", destination: "styles/blur-tokens.css" },
        { source: "files/components/ui/Material.tsx", destination: "components/ui/Material.tsx" },
        {
          source: "files/components/ui/materialTokens.ts",
          destination: "components/ui/materialTokens.ts",
        },
        { source: "files/docs/MATERIAL.md", destination: "docs/devkit/MATERIAL.md" },
      ],
      injections: [],
      dependencies: { frontend: ["color-tokens", "dynamic-theme"] },
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
          source: "files/src/styles/material-system.css",
          destination: "src/styles/material-system.css",
        },
        {
          source: "files/src/styles/blur-tokens.css",
          destination: "src/styles/blur-tokens.css",
        },
        {
          source: "files/src/components/ui/Material.tsx",
          destination: "src/components/ui/Material.tsx",
        },
        {
          source: "files/src/components/ui/materialTokens.ts",
          destination: "src/components/ui/materialTokens.ts",
        },
        { source: "files/docs/MATERIAL.md", destination: "docs/devkit/MATERIAL.md" },
      ],
      injections: [],
      dependencies: { frontend: ["color-tokens", "dynamic-theme"] },
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
    });
  }
  registry.updatedAt = "2026-08-07T00:00:00Z";
  write(registryPath, JSON.stringify(registry, null, 2) + "\n");
}

console.log("Blur & Material System generated.");
