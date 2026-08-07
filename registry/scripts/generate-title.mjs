/**
 * Sync Page Title (title) to both templates; patch registry.
 * Run: node registry/scripts/generate-title.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "title";

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

copy(join(nextRoot, "styles/page-title-system.css"), join(viteRoot, "src/styles/page-title-system.css"));
copy(join(nextRoot, "docs/PAGE_TITLE.md"), join(viteRoot, "docs/PAGE_TITLE.md"));
copy(join(nextRoot, "components/ui/Title.tsx"), join(viteRoot, "src/components/ui/Title.tsx"));
copy(join(nextRoot, "components/ui/titleTokens.ts"), join(viteRoot, "src/components/ui/titleTokens.ts"));

const meta = {
  id: 43,
  name: NAME,
  displayName: "Page & Section Title",
  description:
    "Page Title + Section Title — screen identity and in-page organizers; badges, AI, favorite/search (page); icons, counters, filters, collapse, anchors (section); hierarchy contexts; responsive stack; a11y.",
  category: "foundation",
  group: "typography-system",
  groupName: "Typography System",
  kind: "component",
  layer: 1,
  icon: "type",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "typography-system", "title", "page-title", "section-title", "a11y"],
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
        {
          source: "files/styles/page-title-system.css",
          destination: "styles/page-title-system.css",
        },
        { source: "files/components/ui/Title.tsx", destination: "components/ui/Title.tsx" },
        {
          source: "files/components/ui/titleTokens.ts",
          destination: "components/ui/titleTokens.ts",
        },
        { source: "files/docs/PAGE_TITLE.md", destination: "docs/devkit/PAGE_TITLE.md" },
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
          source: "files/src/styles/page-title-system.css",
          destination: "src/styles/page-title-system.css",
        },
        {
          source: "files/src/components/ui/Title.tsx",
          destination: "src/components/ui/Title.tsx",
        },
        {
          source: "files/src/components/ui/titleTokens.ts",
          destination: "src/components/ui/titleTokens.ts",
        },
        { source: "files/docs/PAGE_TITLE.md", destination: "docs/devkit/PAGE_TITLE.md" },
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

console.log("Page Title generated.");
