/**
 * Sync Breakpoint Manager (device-detector) to both templates; patch registry.
 * Run: node scripts/generate-breakpoints.mjs
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

const nextRoot = join(COMP, "device-detector/nextjs-compact/v1/files");
const viteRoot = join(COMP, "device-detector/vite-express-tauri/v1/files");

copy(
  join(nextRoot, "styles/breakpoint-system.css"),
  join(viteRoot, "src/styles/breakpoint-system.css")
);
copy(join(nextRoot, "docs/BREAKPOINTS.md"), join(viteRoot, "docs/BREAKPOINTS.md"));
copy(
  join(nextRoot, "components/ui/BreakpointManager.tsx"),
  join(viteRoot, "src/components/ui/BreakpointManager.tsx")
);
copy(
  join(nextRoot, "components/ui/DeviceDetector.tsx"),
  join(viteRoot, "src/components/ui/DeviceDetector.tsx")
);

const description =
  "Breakpoint Manager — semantic xs→3xl breakpoints with viewport/container queries, orientation, foldables, pointer/hover/touch, density, and a11y prefs; hooks, events, SSR-safe provider.";

write(
  join(COMP, "device-detector/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        {
          source: "files/styles/breakpoint-system.css",
          destination: "styles/breakpoint-system.css",
        },
        {
          source: "files/components/ui/BreakpointManager.tsx",
          destination: "components/ui/BreakpointManager.tsx",
        },
        {
          source: "files/components/ui/DeviceDetector.tsx",
          destination: "components/ui/DeviceDetector.tsx",
        },
        {
          source: "files/docs/BREAKPOINTS.md",
          destination: "docs/devkit/BREAKPOINTS.md",
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
  join(COMP, "device-detector/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        {
          source: "files/src/styles/breakpoint-system.css",
          destination: "src/styles/breakpoint-system.css",
        },
        {
          source: "files/src/components/ui/BreakpointManager.tsx",
          destination: "src/components/ui/BreakpointManager.tsx",
        },
        {
          source: "files/src/components/ui/DeviceDetector.tsx",
          destination: "src/components/ui/DeviceDetector.tsx",
        },
        {
          source: "files/docs/BREAKPOINTS.md",
          destination: "docs/devkit/BREAKPOINTS.md",
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
  join(COMP, "device-detector/component.json"),
  JSON.stringify(
    {
      id: 98,
      name: "device-detector",
      displayName: "Breakpoint Manager",
      description,
      category: "foundation",
      group: "utility-components",
      groupName: "Utility Components",
      kind: "component",
      layer: 1,
      icon: "monitor",
      author: "Roboticela",
      license: "MIT",
      tags: [
        "foundation",
        "utility-components",
        "breakpoint-manager",
        "device-detector",
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
  if (entry.name !== "device-detector") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Breakpoint Manager";
  entry.description = description;
  entry.tags = [
    "foundation",
    "utility-components",
    "breakpoint-manager",
    "device-detector",
    "responsive",
    "a11y",
  ];
  entry.icon = "monitor";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Breakpoint Manager generated.");
