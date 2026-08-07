/**
 * Sync Shadow & Elevation System; update shadow-layer companion; patch registry.
 * Run: node scripts/generate-elevation.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
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

const nextRoot = join(COMP, "elevation-tokens/nextjs-compact/v1/files");
const viteRoot = join(COMP, "elevation-tokens/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/elevation-system.css"), join(viteRoot, "src/styles/elevation-system.css"));
copy(join(nextRoot, "docs/ELEVATION.md"), join(viteRoot, "docs/ELEVATION.md"));
copy(join(nextRoot, "components/ui/Elevation.tsx"), join(viteRoot, "src/components/ui/Elevation.tsx"));
copy(join(nextRoot, "components/ui/ShadowLayer.tsx"), join(viteRoot, "src/components/ui/ShadowLayer.tsx"));

// Sync theme-engine elevation bridge
const themeCss = join(COMP, "dynamic-theme/nextjs-compact/v1/files/styles/theme-engine.css");
if (existsSync(themeCss)) {
  copy(themeCss, join(COMP, "dynamic-theme/vite-express-tauri/v1/files/src/styles/theme-engine.css"));
}

write(
  join(COMP, "elevation-tokens/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/elevation-system.css", destination: "styles/elevation-system.css" },
        { source: "files/components/ui/Elevation.tsx", destination: "components/ui/Elevation.tsx" },
        { source: "files/components/ui/ShadowLayer.tsx", destination: "components/ui/ShadowLayer.tsx" },
        { source: "files/docs/ELEVATION.md", destination: "docs/devkit/ELEVATION.md" },
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
  join(COMP, "elevation-tokens/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/elevation-system.css", destination: "src/styles/elevation-system.css" },
        { source: "files/src/components/ui/Elevation.tsx", destination: "src/components/ui/Elevation.tsx" },
        { source: "files/src/components/ui/ShadowLayer.tsx", destination: "src/components/ui/ShadowLayer.tsx" },
        { source: "files/docs/ELEVATION.md", destination: "docs/devkit/ELEVATION.md" },
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
  join(COMP, "elevation-tokens/component.json"),
  JSON.stringify(
    {
      id: 37,
      name: "elevation-tokens",
      displayName: "Elevation Token System",
      description:
        "Elevation Token System — tonal depth (no decorative shadows), semantic roles for cards/FAB/nav/sheets/drawers/modals/popovers/tooltips/overlays/notifications/AI, adaptive Light/Dark, hover/press, blur materials, contain-optimized rendering.",
      category: "foundation",
      group: "theme-engine",
      groupName: "Theme Engine",
      kind: "component",
      layer: 1,
      icon: "layers",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "theme-engine", "elevation-tokens", "depth", "a11y"],
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
      optionalConfig: ["ui.elevation"],
    },
    null,
    2
  ) + "\n"
);

// shadow-layer companion — self-contained copy of Elevation + ShadowLayer
copy(
  join(nextRoot, "components/ui/Elevation.tsx"),
  join(COMP, "shadow-layer/nextjs-compact/v1/files/components/ui/Elevation.tsx")
);
copy(
  join(nextRoot, "components/ui/ShadowLayer.tsx"),
  join(COMP, "shadow-layer/nextjs-compact/v1/files/components/ui/ShadowLayer.tsx")
);
copy(
  join(nextRoot, "components/ui/Elevation.tsx"),
  join(COMP, "shadow-layer/vite-express-tauri/v1/files/src/components/ui/Elevation.tsx")
);
copy(
  join(nextRoot, "components/ui/ShadowLayer.tsx"),
  join(COMP, "shadow-layer/vite-express-tauri/v1/files/src/components/ui/ShadowLayer.tsx")
);

// Remove old Surface-based ShadowLayer from surface package? Keep surface's for API compat
// but update surface ShadowLayer to note elevation-tokens — better update surface copy to re-export pattern
const surfaceShadow = `import * as React from "react";
import { Elevation, type ElevationLevel, type ElevationProps } from "../../elevation-tokens/Elevation";

// NOTE: When installed via CLI, Elevation ships beside this file from elevation-tokens.
// Local registry playground aliases elevation-tokens ShadowLayer directly.
export type { ElevationLevel };
export interface ShadowLayerProps extends Omit<ElevationProps, "level" | "role"> {
  level?: ElevationLevel;
  interactive?: boolean;
}

export function ShadowLayer({
  level = 2,
  interactive = false,
  className = "",
  ...props
}: ShadowLayerProps) {
  return (
    <Elevation
      level={level}
      interactive={interactive}
      className={\`dk-shadow-layer \${className}\`.trim()}
      data-level={level}
      {...props}
    />
  );
}
`;

// Keep surface ShadowLayer self-contained (copy Elevation into surface too for install)
copy(
  join(nextRoot, "components/ui/Elevation.tsx"),
  join(COMP, "surface/nextjs-compact/v1/files/components/ui/Elevation.tsx")
);
copy(
  join(nextRoot, "components/ui/ShadowLayer.tsx"),
  join(COMP, "surface/nextjs-compact/v1/files/components/ui/ShadowLayer.tsx")
);
copy(
  join(nextRoot, "components/ui/Elevation.tsx"),
  join(COMP, "surface/vite-express-tauri/v1/files/src/components/ui/Elevation.tsx")
);
copy(
  join(nextRoot, "components/ui/ShadowLayer.tsx"),
  join(COMP, "surface/vite-express-tauri/v1/files/src/components/ui/ShadowLayer.tsx")
);

const marker = `/**
 * shadow-layer — companion to elevation-tokens
 * Prefer importing elevation-system.css once. Use ShadowLayer / Elevation.
 */
:root { --dk-shadow-layer-companion: 1; }
`;
write(join(COMP, "shadow-layer/nextjs-compact/v1/files/styles/shadow-layer.css"), marker);
write(join(COMP, "shadow-layer/vite-express-tauri/v1/files/src/styles/shadow-layer.css"), marker);

write(
  join(COMP, "shadow-layer/component.json"),
  JSON.stringify(
    {
      id: 80,
      name: "shadow-layer",
      displayName: "Shadow Layer",
      description: "ShadowLayer — elevation depth band with subtle layered shadows. Part of the Shadow & Elevation System.",
      category: "foundation",
      group: "shape-system",
      groupName: "Shape System",
      kind: "component",
      layer: 1,
      icon: "layers",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "shape-system", "shadow-layer", "elevation"],
      templates: ["nextjs-compact", "vite-express-tauri"],
      platforms: ["web", "desktop"],
      hasVariants: false,
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

write(
  join(COMP, "shadow-layer/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/components/ui/Elevation.tsx", destination: "components/ui/Elevation.tsx" },
        { source: "files/components/ui/ShadowLayer.tsx", destination: "components/ui/ShadowLayer.tsx" },
        { source: "files/styles/shadow-layer.css", destination: "styles/shadow-layer.css" },
      ],
      injections: [],
      dependencies: { frontend: ["elevation-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "shadow-layer/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/components/ui/Elevation.tsx", destination: "src/components/ui/Elevation.tsx" },
        { source: "files/src/components/ui/ShadowLayer.tsx", destination: "src/components/ui/ShadowLayer.tsx" },
        { source: "files/src/styles/shadow-layer.css", destination: "src/styles/shadow-layer.css" },
      ],
      injections: [],
      dependencies: { frontend: ["elevation-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

// Also write stub elevation-tokens.css marker for backwards compat with old companion path
write(
  join(COMP, "elevation-tokens/nextjs-compact/v1/files/styles/elevation-tokens.css"),
  `/* Prefer elevation-system.css */\n@import "./elevation-system.css";\n`
);
write(
  join(COMP, "elevation-tokens/vite-express-tauri/v1/files/src/styles/elevation-tokens.css"),
  `/* Prefer elevation-system.css */\n@import "./elevation-system.css";\n`
);

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
for (const entry of registry.components) {
  if (entry.name === "elevation-tokens") {
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.displayName = "Elevation Token System";
    entry.description =
      "Elevation Token System — tonal depth, semantic floating roles, adaptive Light/Dark, blur materials, performance containment.";
    entry.icon = "layers";
    entry.tags = ["foundation", "theme-engine", "elevation-tokens", "depth", "a11y"];
  }
  if (entry.name === "shadow-layer") {
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.description =
      "ShadowLayer — elevation depth band (tonal). Companion to the Elevation Token System.";
    entry.icon = "layers";
  }
}
registry.updatedAt = "2026-08-07T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Elevation system generated.");
