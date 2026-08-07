/**
 * Sync Heading System (heading) to both templates; patch registry.
 * Run: node registry/scripts/generate-heading.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "heading";

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

copy(join(nextRoot, "styles/heading-system.css"), join(viteRoot, "src/styles/heading-system.css"));
copy(join(nextRoot, "docs/HEADING.md"), join(viteRoot, "docs/HEADING.md"));
copy(join(nextRoot, "components/ui/Heading.tsx"), join(viteRoot, "src/components/ui/Heading.tsx"));
copy(
  join(nextRoot, "components/ui/headingTokens.ts"),
  join(viteRoot, "src/components/ui/headingTokens.ts")
);

const meta = {
  id: 42,
  name: NAME,
  displayName: "Heading System",
  description:
    "Heading System — semantic H1–H6; page/section/card/modal/sidebar/drawer/table/dashboard/report/form variants; icons, badges, counters, breadcrumbs, actions, AI notes, anchors; hierarchy validation; theme-aware whitespace.",
  category: "foundation",
  group: "typography-system",
  groupName: "Typography System",
  kind: "component",
  layer: 1,
  icon: "type",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "typography-system", "heading", "a11y"],
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
        { source: "files/styles/heading-system.css", destination: "styles/heading-system.css" },
        { source: "files/components/ui/Heading.tsx", destination: "components/ui/Heading.tsx" },
        {
          source: "files/components/ui/headingTokens.ts",
          destination: "components/ui/headingTokens.ts",
        },
        { source: "files/docs/HEADING.md", destination: "docs/devkit/HEADING.md" },
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
          source: "files/src/styles/heading-system.css",
          destination: "src/styles/heading-system.css",
        },
        {
          source: "files/src/components/ui/Heading.tsx",
          destination: "src/components/ui/Heading.tsx",
        },
        {
          source: "files/src/components/ui/headingTokens.ts",
          destination: "src/components/ui/headingTokens.ts",
        },
        { source: "files/docs/HEADING.md", destination: "docs/devkit/HEADING.md" },
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

console.log("Heading System generated.");
