/**
 * Sync Responsive Visibility to both templates; patch registry.
 * Run: node scripts/generate-visibility.mjs
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

const nextRoot = join(COMP, "responsive-visibility/nextjs-compact/v1/files");
const viteRoot = join(COMP, "responsive-visibility/vite-express-tauri/v1/files");

copy(
  join(nextRoot, "styles/visibility-system.css"),
  join(viteRoot, "src/styles/visibility-system.css")
);
copy(join(nextRoot, "docs/VISIBILITY.md"), join(viteRoot, "docs/VISIBILITY.md"));
copy(
  join(nextRoot, "components/ui/ResponsiveVisibility.tsx"),
  join(viteRoot, "src/components/ui/ResponsiveVisibility.tsx")
);

const description =
  "Responsive Visibility Engine — conditional render by viewport, device, orientation, roles, flags, app state, and a11y prefs; CSS presets, lazy/intersection, preserve/accessible modes, SSR-safe.";

write(
  join(COMP, "responsive-visibility/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        {
          source: "files/styles/visibility-system.css",
          destination: "styles/visibility-system.css",
        },
        {
          source: "files/components/ui/ResponsiveVisibility.tsx",
          destination: "components/ui/ResponsiveVisibility.tsx",
        },
        {
          source: "files/docs/VISIBILITY.md",
          destination: "docs/devkit/VISIBILITY.md",
        },
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
  join(COMP, "responsive-visibility/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        {
          source: "files/src/styles/visibility-system.css",
          destination: "src/styles/visibility-system.css",
        },
        {
          source: "files/src/components/ui/ResponsiveVisibility.tsx",
          destination: "src/components/ui/ResponsiveVisibility.tsx",
        },
        {
          source: "files/docs/VISIBILITY.md",
          destination: "docs/devkit/VISIBILITY.md",
        },
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
  join(COMP, "responsive-visibility/component.json"),
  JSON.stringify(
    {
      id: 96,
      name: "responsive-visibility",
      displayName: "Responsive Visibility Engine",
      description,
      category: "foundation",
      group: "utility-components",
      groupName: "Utility Components",
      kind: "component",
      layer: 1,
      icon: "eye",
      author: "Roboticela",
      license: "MIT",
      tags: [
        "foundation",
        "utility-components",
        "responsive-visibility",
        "responsive",
        "a11y",
      ],
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
  if (entry.name !== "responsive-visibility") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Responsive Visibility Engine";
  entry.description = description;
  entry.tags = [
    "foundation",
    "utility-components",
    "responsive-visibility",
    "responsive",
    "a11y",
  ];
  entry.icon = "eye";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Responsive Visibility system generated.");
