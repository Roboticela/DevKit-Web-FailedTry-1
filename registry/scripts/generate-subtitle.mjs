/**
 * Sync Subtitle System (subtitle) to both templates; patch registry.
 * Run: node registry/scripts/generate-subtitle.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "subtitle";

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

copy(join(nextRoot, "styles/subtitle-system.css"), join(viteRoot, "src/styles/subtitle-system.css"));
copy(join(nextRoot, "docs/SUBTITLE.md"), join(viteRoot, "docs/SUBTITLE.md"));
copy(join(nextRoot, "components/ui/Subtitle.tsx"), join(viteRoot, "src/components/ui/Subtitle.tsx"));
copy(
  join(nextRoot, "components/ui/subtitleTokens.ts"),
  join(viteRoot, "src/components/ui/subtitleTokens.ts")
);

const meta = {
  id: 44,
  name: NAME,
  displayName: "Subtitle System",
  description:
    "Subtitle System — contextual copy under titles; page/card/section/modal/dashboard/analytics/report/AI/marketing variants; links, badges, icons, metadata, timestamps, AI summaries; balanced measure, a11y, calm Apple language.",
  category: "foundation",
  group: "typography-system",
  groupName: "Typography System",
  kind: "component",
  layer: 1,
  icon: "type",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "typography-system", "subtitle", "a11y"],
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
  optionalConfig: ["ui.typeScale"],
};

write(join(COMP, NAME, "component.json"), JSON.stringify(meta, null, 2) + "\n");

write(
  join(COMP, NAME, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/subtitle-system.css", destination: "styles/subtitle-system.css" },
        { source: "files/components/ui/Subtitle.tsx", destination: "components/ui/Subtitle.tsx" },
        {
          source: "files/components/ui/subtitleTokens.ts",
          destination: "components/ui/subtitleTokens.ts",
        },
        { source: "files/docs/SUBTITLE.md", destination: "docs/devkit/SUBTITLE.md" },
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
          source: "files/src/styles/subtitle-system.css",
          destination: "src/styles/subtitle-system.css",
        },
        {
          source: "files/src/components/ui/Subtitle.tsx",
          destination: "src/components/ui/Subtitle.tsx",
        },
        {
          source: "files/src/components/ui/subtitleTokens.ts",
          destination: "src/components/ui/subtitleTokens.ts",
        },
        { source: "files/docs/SUBTITLE.md", destination: "docs/devkit/SUBTITLE.md" },
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

console.log("Subtitle System generated.");
