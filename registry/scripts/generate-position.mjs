/**
 * Sync Position System to both templates; patch registry.
 * Run: node scripts/generate-position.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "position-utilities";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const description =
  "Position System — semantic static/relative/absolute/fixed/sticky/floating/anchor layers with FAB, sticky chrome, overlays, tooltips, badges, z-index tokens, safe-area, and collision-aware floating.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/position-system.css"), join(viteRoot, "src/styles/position-system.css"));
copy(join(nextRoot, "docs/POSITION.md"), join(viteRoot, "docs/POSITION.md"));
copy(join(nextRoot, "components/ui/Position.tsx"), join(viteRoot, "src/components/ui/Position.tsx"));
copy(
  join(nextRoot, "components/ui/PositionUtilities.tsx"),
  join(viteRoot, "src/components/ui/PositionUtilities.tsx")
);

const tw = `/**
 * Tailwind v4 bridge — Position System
 */
@theme inline {
  --z-index-dk-base: var(--z-base);
  --z-index-dk-raised: var(--z-raised);
  --z-index-dk-sticky: var(--z-sticky);
  --z-index-dk-nav: var(--z-nav);
  --z-index-dk-fab: var(--z-fab);
  --z-index-dk-overlay: var(--z-overlay);
  --z-index-dk-dropdown: var(--z-dropdown);
  --z-index-dk-popover: var(--z-popover);
  --z-index-dk-tooltip: var(--z-tooltip);
  --z-index-dk-modal: var(--z-modal);
  --z-index-dk-toast: var(--z-toast);
}
`;
write(join(nextRoot, "styles/position-system.tailwind.css"), tw);
copy(
  join(nextRoot, "styles/position-system.tailwind.css"),
  join(viteRoot, "src/styles/position-system.tailwind.css")
);

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/position-system.css", destination: "styles/position-system.css" },
        {
          source: "files/styles/position-system.tailwind.css",
          destination: "styles/position-system.tailwind.css",
        },
        { source: "files/components/ui/Position.tsx", destination: "components/ui/Position.tsx" },
        {
          source: "files/components/ui/PositionUtilities.tsx",
          destination: "components/ui/PositionUtilities.tsx",
        },
        { source: "files/docs/POSITION.md", destination: "docs/devkit/POSITION.md" },
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
  join(COMP, PKG, "vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        {
          source: "files/src/styles/position-system.css",
          destination: "src/styles/position-system.css",
        },
        {
          source: "files/src/styles/position-system.tailwind.css",
          destination: "src/styles/position-system.tailwind.css",
        },
        {
          source: "files/src/components/ui/Position.tsx",
          destination: "src/components/ui/Position.tsx",
        },
        {
          source: "files/src/components/ui/PositionUtilities.tsx",
          destination: "src/components/ui/PositionUtilities.tsx",
        },
        { source: "files/docs/POSITION.md", destination: "docs/devkit/POSITION.md" },
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
  join(COMP, PKG, "component.json"),
  JSON.stringify(
    {
      id: 29,
      name: PKG,
      displayName: "Position System",
      description,
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "spacing-system", "position-utilities", "position", "floating"],
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
  if (entry.name !== PKG) continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Position System";
  entry.description = description;
  entry.tags = ["foundation", "spacing-system", "position-utilities", "position", "floating"];
  entry.icon = "move";
  entry.fileKind = "tsx";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Position System generated.");
