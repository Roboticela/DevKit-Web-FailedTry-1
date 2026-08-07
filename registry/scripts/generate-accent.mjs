/**
 * Sync Accent Color Engine + wire ThemeProvider accent expansion.
 * Run: node registry/scripts/generate-accent.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "accent-color-system";

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

copy(
  join(nextRoot, "styles/accent-color-system.css"),
  join(viteRoot, "src/styles/accent-color-system.css")
);
copy(join(nextRoot, "docs/ACCENT.md"), join(viteRoot, "docs/ACCENT.md"));
copy(
  join(nextRoot, "components/ui/accent.ts"),
  join(viteRoot, "src/components/ui/accent.ts")
);
copy(
  join(nextRoot, "components/ui/AccentEngine.tsx"),
  join(viteRoot, "src/components/ui/AccentEngine.tsx")
);

// Theme Engine uses accentScale for setAccent expansion
const themeNext = join(COMP, "dynamic-theme/nextjs-compact/v1/files/components/ui");
const themeVite = join(COMP, "dynamic-theme/vite-express-tauri/v1/files/src/components/ui");
copy(join(nextRoot, "components/ui/accent.ts"), join(themeNext, "accentScale.ts"));
copy(join(nextRoot, "components/ui/accent.ts"), join(themeVite, "accentScale.ts"));

write(
  join(COMP, NAME, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        {
          source: "files/styles/accent-color-system.css",
          destination: "styles/accent-color-system.css",
        },
        {
          source: "files/components/ui/accent.ts",
          destination: "components/ui/accent.ts",
        },
        {
          source: "files/components/ui/AccentEngine.tsx",
          destination: "components/ui/AccentEngine.tsx",
        },
        {
          source: "files/docs/ACCENT.md",
          destination: "docs/devkit/ACCENT.md",
        },
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
          source: "files/src/styles/accent-color-system.css",
          destination: "src/styles/accent-color-system.css",
        },
        {
          source: "files/src/components/ui/accent.ts",
          destination: "src/components/ui/accent.ts",
        },
        {
          source: "files/src/components/ui/AccentEngine.tsx",
          destination: "src/components/ui/AccentEngine.tsx",
        },
        {
          source: "files/docs/ACCENT.md",
          destination: "docs/devkit/ACCENT.md",
        },
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
  join(COMP, NAME, "component.json"),
  JSON.stringify(
    {
      id: 35,
      name: "accent-color-system",
      displayName: "Accent Color Engine",
      description:
        "Accent Color Engine — generate hover/active/disabled/focus/border/icon/translucent variants from one accent; WCAG contrast validation; org/workspace scopes; brand palette synthesis; preset import/export; live preview.",
      category: "foundation",
      group: "theme-engine",
      groupName: "Theme Engine",
      kind: "component",
      layer: 1,
      icon: "palette",
      author: "Roboticela",
      license: "MIT",
      tags: [
        "foundation",
        "theme-engine",
        "accent-color-system",
        "a11y",
        "branding",
      ],
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
      optionalConfig: ["ui.accent", "ui.accentStorageKey"],
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
      displayName: "Accent Color Engine",
      description:
        "Accent Color Engine — generate full accent scales with contrast validation, org/workspace branding, brand palettes, import/export, live preview.",
      icon: "palette",
      fileKind: "tsx",
      tags: [
        "foundation",
        "theme-engine",
        "accent-color-system",
        "a11y",
        "branding",
      ],
    });
  }
  // Patch dynamic-theme manifests to include accentScale.ts
  for (const entry of registry.components) {
    if (entry.name === "dynamic-theme") {
      entry.latestVersion = entry.latestVersion || "1.0.0";
    }
  }
  registry.updatedAt = "2026-08-07T00:00:00Z";
  write(registryPath, JSON.stringify(registry, null, 2) + "\n");
}

// Ensure dynamic-theme manifests list accentScale.ts
for (const [tpl, filesKey, destPrefix] of [
  [
    "nextjs-compact",
    "filesNext",
    "components/ui/accentScale.ts",
  ],
  [
    "vite-express-tauri",
    "filesVite",
    "src/components/ui/accentScale.ts",
  ],
]) {
  const manifestPath = join(COMP, "dynamic-theme", tpl, "v1/manifest.json");
  if (!existsSync(manifestPath)) continue;
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const src =
    tpl === "nextjs-compact"
      ? "files/components/ui/accentScale.ts"
      : "files/src/components/ui/accentScale.ts";
  const dest =
    tpl === "nextjs-compact"
      ? "components/ui/accentScale.ts"
      : "src/components/ui/accentScale.ts";
  if (!manifest.files.some((f) => f.destination?.includes("accentScale"))) {
    manifest.files.push({ source: src, destination: dest });
    write(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  }
}

console.log("Accent Color Engine generated.");
