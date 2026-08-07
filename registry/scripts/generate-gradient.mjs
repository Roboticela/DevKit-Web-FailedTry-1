/**
 * Sync Gradient Token System (gradient-tokens) to both templates; patch registry.
 * Run: node registry/scripts/generate-gradient.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "gradient-tokens";

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

copy(join(nextRoot, "styles/gradient-system.css"), join(viteRoot, "src/styles/gradient-system.css"));
copy(join(nextRoot, "styles/gradient-tokens.css"), join(viteRoot, "src/styles/gradient-tokens.css"));
copy(join(nextRoot, "docs/GRADIENT.md"), join(viteRoot, "docs/GRADIENT.md"));
copy(
  join(nextRoot, "components/ui/Gradient.tsx"),
  join(viteRoot, "src/components/ui/Gradient.tsx")
);
copy(
  join(nextRoot, "components/ui/gradientTokens.ts"),
  join(viteRoot, "src/components/ui/gradientTokens.ts")
);

const meta = {
  id: 40,
  name: NAME,
  displayName: "Gradient Token System",
  description:
    "Gradient Token System — sparse premium washes; semantic tokens for hero/AI/analytics/premium/onboarding/auth/chart/badge/avatar/button/marketing; linear/radial/mesh/conic/animated; theme-aware a11y + low-power modes.",
  category: "foundation",
  group: "theme-engine",
  groupName: "Theme Engine",
  kind: "component",
  layer: 1,
  icon: "layers",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "theme-engine", "gradient-tokens", "gradient", "a11y"],
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
  optionalConfig: ["ui.gradient", "ui.performance"],
};

write(join(COMP, NAME, "component.json"), JSON.stringify(meta, null, 2) + "\n");

write(
  join(COMP, NAME, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/gradient-system.css", destination: "styles/gradient-system.css" },
        { source: "files/styles/gradient-tokens.css", destination: "styles/gradient-tokens.css" },
        { source: "files/components/ui/Gradient.tsx", destination: "components/ui/Gradient.tsx" },
        {
          source: "files/components/ui/gradientTokens.ts",
          destination: "components/ui/gradientTokens.ts",
        },
        { source: "files/docs/GRADIENT.md", destination: "docs/devkit/GRADIENT.md" },
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
          source: "files/src/styles/gradient-system.css",
          destination: "src/styles/gradient-system.css",
        },
        {
          source: "files/src/styles/gradient-tokens.css",
          destination: "src/styles/gradient-tokens.css",
        },
        {
          source: "files/src/components/ui/Gradient.tsx",
          destination: "src/components/ui/Gradient.tsx",
        },
        {
          source: "files/src/components/ui/gradientTokens.ts",
          destination: "src/components/ui/gradientTokens.ts",
        },
        { source: "files/docs/GRADIENT.md", destination: "docs/devkit/GRADIENT.md" },
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

console.log("Gradient Token System generated.");
