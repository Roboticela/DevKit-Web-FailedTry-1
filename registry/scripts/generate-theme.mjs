/**
 * Sync Theme Engine (dynamic-theme) + companions to both templates; patch registry.
 * Run: node scripts/generate-theme.mjs
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

const nextRoot = join(COMP, "dynamic-theme/nextjs-compact/v1/files");
const viteRoot = join(COMP, "dynamic-theme/vite-express-tauri/v1/files");

const uiFiles = ["theme.ts", "ThemeProvider.tsx", "ThemeScript.tsx"];

copy(join(nextRoot, "styles/theme-engine.css"), join(viteRoot, "src/styles/theme-engine.css"));
copy(join(nextRoot, "docs/THEME.md"), join(viteRoot, "docs/THEME.md"));
for (const f of uiFiles) {
  copy(join(nextRoot, `components/ui/${f}`), join(viteRoot, `src/components/ui/${f}`));
}

// Sync light / dark / HC activators
for (const name of ["light-theme", "dark-theme", "high-contrast-theme"]) {
  const src = join(COMP, name, "nextjs-compact/v1/files/styles", `${name}.css`);
  if (existsSync(src)) {
    copy(src, join(COMP, name, "vite-express-tauri/v1/files/src/styles", `${name}.css`));
  }
}

const filesNext = [
  { source: "files/styles/theme-engine.css", destination: "styles/theme-engine.css" },
  { source: "files/components/ui/theme.ts", destination: "components/ui/theme.ts" },
  { source: "files/components/ui/ThemeProvider.tsx", destination: "components/ui/ThemeProvider.tsx" },
  { source: "files/components/ui/ThemeScript.tsx", destination: "components/ui/ThemeScript.tsx" },
  { source: "files/docs/THEME.md", destination: "docs/devkit/THEME.md" },
];

const filesVite = [
  { source: "files/src/styles/theme-engine.css", destination: "src/styles/theme-engine.css" },
  { source: "files/src/components/ui/theme.ts", destination: "src/components/ui/theme.ts" },
  { source: "files/src/components/ui/ThemeProvider.tsx", destination: "src/components/ui/ThemeProvider.tsx" },
  { source: "files/src/components/ui/ThemeScript.tsx", destination: "src/components/ui/ThemeScript.tsx" },
  { source: "files/docs/THEME.md", destination: "docs/devkit/THEME.md" },
];

write(
  join(COMP, "dynamic-theme/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: filesNext,
      injections: [],
      dependencies: { frontend: ["color-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "dynamic-theme/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: filesVite,
      injections: [],
      dependencies: { frontend: ["color-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "dynamic-theme/component.json"),
  JSON.stringify(
    {
      id: 34,
      name: "dynamic-theme",
      displayName: "Dynamic Theme",
      description:
        "Theme Engine — light/dark/high-contrast/system/custom themes with persistence, FOUC-safe boot, runtime CSS vars, elevation, motion, and blur profiles.",
      category: "foundation",
      group: "theme-engine",
      groupName: "Theme Engine",
      kind: "component",
      layer: 1,
      icon: "sun",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "theme-engine", "dynamic-theme", "theme-provider"],
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
      optionalConfig: ["ui.theme", "ui.themeStorageKey"],
    },
    null,
    2
  ) + "\n"
);

const companions = [
  {
    name: "elevation-tokens",
    id: 37,
    note: "Use .dk-elev-* and --elevation-* from theme-engine.css.",
  },
  {
    name: "motion-tokens",
    id: 38,
    note: "Use --motion-* tokens from theme-engine.css; honor data-motion / prefers-reduced-motion.",
  },
  {
    name: "blur-tokens",
    id: 39,
    note: "Use .dk-material / .dk-blur-* from theme-engine.css.",
  },
  {
    name: "gradient-tokens",
    id: 40,
    note: "Gradient slots (--gradient-*) default to none; override on custom themes.",
  },
];

for (const c of companions) {
  const cssPath = join(COMP, c.name, `nextjs-compact/v1/files/styles/${c.name}.css`);
  if (existsSync(cssPath)) {
    copy(cssPath, join(COMP, c.name, `vite-express-tauri/v1/files/src/styles/${c.name}.css`));
  }

  write(
    join(COMP, c.name, "component.json"),
    JSON.stringify(
      {
        id: c.id,
        name: c.name,
        displayName: c.name
          .split("-")
          .map((p) => p[0].toUpperCase() + p.slice(1))
          .join(" "),
        description: `${c.note} Companion package for the Theme Engine.`,
        category: "foundation",
        group: "theme-engine",
        groupName: "Theme Engine",
        kind: "component",
        layer: 1,
        icon: "sun",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "theme-engine", c.name],
        templates: ["nextjs-compact", "vite-express-tauri"],
        platforms: ["web", "desktop"],
        hasVariants: false,
        stub: false,
        fileKind: "css",
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
    join(COMP, c.name, "nextjs-compact/v1/manifest.json"),
    JSON.stringify(
      {
        version: "1.0.0",
        template: "nextjs-compact",
        files: [{ source: `files/styles/${c.name}.css`, destination: `styles/${c.name}.css` }],
        injections: [],
        dependencies: { frontend: ["dynamic-theme"] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
  write(
    join(COMP, c.name, "vite-express-tauri/v1/manifest.json"),
    JSON.stringify(
      {
        version: "1.0.0",
        template: "vite-express-tauri",
        files: [{ source: `files/src/styles/${c.name}.css`, destination: `src/styles/${c.name}.css` }],
        injections: [],
        dependencies: { frontend: ["dynamic-theme"] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
}

// theme-provider (id 99) re-exports ThemeProvider from dynamic-theme for utilities slot
const tpNext = `export {
  ThemeProvider,
  useTheme,
  ThemeScript,
  applyThemeToDocument,
  getSystemTheme,
  resolveTheme,
  getThemeInitScript,
  BUILT_IN_THEMES,
  DEFAULT_STORAGE_KEY,
  type BuiltInTheme,
  type ThemeId,
  type ThemeDefinition,
  type ColorScheme,
  type ThemeContextValue,
  type ThemeProviderProps,
  type ThemeScriptProps,
} from "../../../dynamic-theme/nextjs-compact/v1/files/components/ui/ThemeProvider";
`;

// For installed projects paths differ — ship a self-contained re-export that duplicates import path note
const tpImpl = `/**
 * Theme Provider (utilities) — re-exports the Theme Engine from dynamic-theme.
 * Prefer adding \\\`dynamic-theme\\\` and importing ThemeProvider from there in apps.
 */
export {
  ThemeProvider,
  useTheme,
  applyThemeToDocument,
  getSystemTheme,
  resolveTheme,
  getThemeInitScript,
  BUILT_IN_THEMES,
  DEFAULT_STORAGE_KEY,
} from "./ThemeEngine";
export type {
  BuiltInTheme,
  ThemeId,
  ThemeDefinition,
  ColorScheme,
  ThemeContextValue,
  ThemeProviderProps,
} from "./ThemeEngine";
export { ThemeScript } from "./ThemeScript";
export type { ThemeScriptProps } from "./ThemeScript";
`;

// Copy engine files into theme-provider as ThemeEngine.* so install is self-contained
for (const f of uiFiles) {
  const base = f === "ThemeProvider.tsx" ? "ThemeEngine.tsx" : f;
  copy(join(nextRoot, `components/ui/${f}`), join(COMP, "theme-provider/nextjs-compact/v1/files/components/ui", base === "ThemeProvider.tsx" ? "ThemeEngine.tsx" : f));
  copy(join(nextRoot, `components/ui/${f}`), join(COMP, "theme-provider/vite-express-tauri/v1/files/src/components/ui", base === "ThemeProvider.tsx" ? "ThemeEngine.tsx" : f));
}
// Fix: ThemeProvider.tsx copied as ThemeEngine — ThemeScript and theme.ts same names
copy(
  join(nextRoot, "components/ui/ThemeProvider.tsx"),
  join(COMP, "theme-provider/nextjs-compact/v1/files/components/ui/ThemeEngine.tsx")
);
copy(
  join(nextRoot, "components/ui/ThemeProvider.tsx"),
  join(COMP, "theme-provider/vite-express-tauri/v1/files/src/components/ui/ThemeEngine.tsx")
);

write(join(COMP, "theme-provider/nextjs-compact/v1/files/components/ui/ThemeProvider.tsx"), tpImpl);
write(join(COMP, "theme-provider/vite-express-tauri/v1/files/src/components/ui/ThemeProvider.tsx"), tpImpl);

// Fix ThemeEngine imports of ./theme and ThemeScript stays separate
const teNext = readFileSync(join(COMP, "theme-provider/nextjs-compact/v1/files/components/ui/ThemeEngine.tsx"), "utf8");
// ThemeEngine already imports ./theme — good. ThemeScript imports ./theme — good.

write(
  join(COMP, "theme-provider/component.json"),
  JSON.stringify(
    {
      id: 99,
      name: "theme-provider",
      displayName: "Theme Provider",
      description: "Utilities re-export of the Theme Engine (dynamic-theme). Prefer dynamic-theme as the primary package.",
      category: "foundation",
      group: "utility-components",
      groupName: "Utility Components",
      kind: "component",
      layer: 1,
      icon: "sun",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "utility-helpers", "theme-provider"],
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
      optionalConfig: ["ui.theme"],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "theme-provider/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/components/ui/theme.ts", destination: "components/ui/theme.ts" },
        { source: "files/components/ui/ThemeEngine.tsx", destination: "components/ui/ThemeEngine.tsx" },
        { source: "files/components/ui/ThemeScript.tsx", destination: "components/ui/ThemeScript.tsx" },
        { source: "files/components/ui/ThemeProvider.tsx", destination: "components/ui/ThemeProvider.tsx" },
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
  join(COMP, "theme-provider/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/components/ui/theme.ts", destination: "src/components/ui/theme.ts" },
        { source: "files/src/components/ui/ThemeEngine.tsx", destination: "src/components/ui/ThemeEngine.tsx" },
        { source: "files/src/components/ui/ThemeScript.tsx", destination: "src/components/ui/ThemeScript.tsx" },
        { source: "files/src/components/ui/ThemeProvider.tsx", destination: "src/components/ui/ThemeProvider.tsx" },
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
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const patch = {
  "dynamic-theme": {
    stub: false,
    latestVersion: "1.0.0",
    displayName: "Dynamic Theme",
    description:
      "Theme Engine — light/dark/high-contrast/system/custom themes with persistence, FOUC-safe boot, runtime CSS vars, elevation, motion, and blur profiles.",
    icon: "sun",
    tags: ["foundation", "theme-engine", "dynamic-theme", "theme-provider"],
  },
  "elevation-tokens": {
    stub: false,
    latestVersion: "1.0.0",
    description: "Use .dk-elev-* and --elevation-* from theme-engine.css. Companion package for the Theme Engine.",
    icon: "sun",
  },
  "motion-tokens": {
    stub: false,
    latestVersion: "1.0.0",
    description:
      "Use --motion-* tokens from theme-engine.css; honor data-motion / prefers-reduced-motion. Companion package for the Theme Engine.",
    icon: "sun",
  },
  "blur-tokens": {
    stub: false,
    latestVersion: "1.0.0",
    description: "Use .dk-material / .dk-blur-* from theme-engine.css. Companion package for the Theme Engine.",
    icon: "sun",
  },
  "gradient-tokens": {
    stub: false,
    latestVersion: "1.0.0",
    description: "Gradient slots (--gradient-*) default to none; override on custom themes. Companion package for the Theme Engine.",
    icon: "sun",
  },
  "theme-provider": {
    stub: false,
    latestVersion: "1.0.0",
    description: "Utilities re-export of the Theme Engine (dynamic-theme).",
    icon: "sun",
  },
  "light-theme": {
    stub: false,
    latestVersion: "1.0.0",
    description: "Light theme activator profile for the Theme Engine.",
  },
  "dark-theme": {
    stub: false,
    latestVersion: "1.0.0",
    description: "Dark theme activator profile for the Theme Engine.",
  },
  "high-contrast-theme": {
    stub: false,
    latestVersion: "1.0.0",
    description: "High contrast theme activator profile for the Theme Engine.",
  },
};

for (const entry of registry.components) {
  const p = patch[entry.name];
  if (!p) continue;
  Object.assign(entry, p);
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Theme Engine generated.");
