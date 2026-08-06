/**
 * Sync Surface System to both templates; patch companions + registry.
 * Run: node scripts/generate-surface.mjs
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

const nextRoot = join(COMP, "surface/nextjs-compact/v1/files");
const viteRoot = join(COMP, "surface/vite-express-tauri/v1/files");

const uiFiles = [
  "Surface.tsx",
  "Overlay.tsx",
  "GlassSurface.tsx",
  "FrostedSurface.tsx",
  "ShadowLayer.tsx",
];

copy(join(nextRoot, "styles/surface-system.css"), join(viteRoot, "src/styles/surface-system.css"));
copy(join(nextRoot, "docs/SURFACE.md"), join(viteRoot, "docs/SURFACE.md"));
for (const f of uiFiles) {
  copy(join(nextRoot, `components/ui/${f}`), join(viteRoot, `src/components/ui/${f}`));
}

const filesNext = [
  { source: "files/styles/surface-system.css", destination: "styles/surface-system.css" },
  ...uiFiles.map((f) => ({
    source: `files/components/ui/${f}`,
    destination: `components/ui/${f}`,
  })),
  { source: "files/docs/SURFACE.md", destination: "docs/devkit/SURFACE.md" },
];

const filesVite = [
  { source: "files/src/styles/surface-system.css", destination: "src/styles/surface-system.css" },
  ...uiFiles.map((f) => ({
    source: `files/src/components/ui/${f}`,
    destination: `src/components/ui/${f}`,
  })),
  { source: "files/docs/SURFACE.md", destination: "docs/devkit/SURFACE.md" },
];

write(
  join(COMP, "surface/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: filesNext,
      injections: [],
      dependencies: { frontend: ["color-tokens", "dynamic-theme", "responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "surface/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: filesVite,
      injections: [],
      dependencies: { frontend: ["color-tokens", "dynamic-theme", "responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "surface/component.json"),
  JSON.stringify(
    {
      id: 18,
      name: "surface",
      displayName: "Surface",
      description:
        "Surface System — enterprise visual layers (page/card/modal/sheet/tooltip/dropdown/menu/side-panel) with semantic elevation, materials, interactive press, and paint containment.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layers",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "surface", "surface-system"],
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

const companions = [
  {
    name: "glass-surface",
    id: 37, // wait - elevation-tokens is 37. glass is 78
    realId: 78,
    file: "GlassSurface.tsx",
    group: "shape-system",
    groupName: "Shape System",
    note: "GlassSurface — translucent blur material. Part of the Surface System.",
  },
  {
    name: "frosted-surface",
    realId: 79,
    file: "FrostedSurface.tsx",
    group: "shape-system",
    groupName: "Shape System",
    note: "FrostedSurface — thick frosted material. Part of the Surface System.",
  },
  {
    name: "shadow-layer",
    realId: 80,
    file: "ShadowLayer.tsx",
    group: "shape-system",
    groupName: "Shape System",
    note: "ShadowLayer — elevation depth band (no box-shadow). Part of the Surface System.",
  },
  {
    name: "overlay",
    realId: 92,
    file: "Overlay.tsx",
    group: "utility-components",
    groupName: "Utility Components",
    note: "Overlay — scrim + modal/sheet content. Part of the Surface System.",
  },
];

for (const c of companions) {
  // Copy component + thin re-export that also needs Surface.tsx locally
  for (const f of ["Surface.tsx", c.file, ...(c.file === "Overlay.tsx" ? [] : [])]) {
    copy(
      join(nextRoot, `components/ui/${f}`),
      join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${f}`)
    );
    copy(
      join(nextRoot, `components/ui/${f}`),
      join(COMP, c.name, `vite-express-tauri/v1/files/src/components/ui/${f}`)
    );
  }
  if (c.file === "Overlay.tsx") {
    // Overlay already copied with Surface
  }

  // Marker CSS pointing to surface-system
  const css = `/**
 * ${c.name} — companion to surface
 * ${c.note}
 * Prefer importing surface-system.css once at the app root.
 */
:root {
  --dk-surface-companion-${c.name}: 1;
}
`;
  write(join(COMP, c.name, `nextjs-compact/v1/files/styles/${c.name}.css`), css);
  write(join(COMP, c.name, `vite-express-tauri/v1/files/src/styles/${c.name}.css`), css);

  const exportName = c.file.replace(".tsx", "");
  // Entry re-export as same filename as package convention
  write(
    join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${exportName}.tsx`),
    readFileSync(join(nextRoot, `components/ui/${c.file}`), "utf8")
  );

  write(
    join(COMP, c.name, "component.json"),
    JSON.stringify(
      {
        id: c.realId,
        name: c.name,
        displayName: c.name
          .split("-")
          .map((p) => p[0].toUpperCase() + p.slice(1))
          .join(" "),
        description: c.note,
        category: "foundation",
        group: c.group,
        groupName: c.groupName,
        kind: "component",
        layer: 1,
        icon: "layers",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", c.group, c.name, "surface-system"],
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

  const depFiles = [
    { source: `files/components/ui/Surface.tsx`, destination: `components/ui/Surface.tsx` },
    { source: `files/components/ui/${c.file}`, destination: `components/ui/${c.file}` },
    { source: `files/styles/${c.name}.css`, destination: `styles/${c.name}.css` },
  ];
  const depFilesVite = [
    { source: `files/src/components/ui/Surface.tsx`, destination: `src/components/ui/Surface.tsx` },
    { source: `files/src/components/ui/${c.file}`, destination: `src/components/ui/${c.file}` },
    { source: `files/src/styles/${c.name}.css`, destination: `src/styles/${c.name}.css` },
  ];

  write(
    join(COMP, c.name, "nextjs-compact/v1/manifest.json"),
    JSON.stringify(
      {
        version: "1.0.0",
        template: "nextjs-compact",
        files: depFiles,
        injections: [],
        dependencies: { frontend: ["surface"] },
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
        files: depFilesVite,
        injections: [],
        dependencies: { frontend: ["surface"] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
}

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const patch = {
  surface: {
    stub: false,
    latestVersion: "1.0.0",
    hasVariants: true,
    displayName: "Surface",
    description:
      "Surface System — enterprise visual layers (page/card/modal/sheet/tooltip/dropdown/menu/side-panel) with semantic elevation, materials, interactive press, and paint containment.",
    icon: "layers",
    tags: ["foundation", "layout-system", "surface", "surface-system"],
  },
  "glass-surface": {
    stub: false,
    latestVersion: "1.0.0",
    description: "GlassSurface — translucent blur material. Part of the Surface System.",
    icon: "layers",
  },
  "frosted-surface": {
    stub: false,
    latestVersion: "1.0.0",
    description: "FrostedSurface — thick frosted material. Part of the Surface System.",
    icon: "layers",
  },
  "shadow-layer": {
    stub: false,
    latestVersion: "1.0.0",
    description: "ShadowLayer — elevation depth band (no box-shadow). Part of the Surface System.",
    icon: "layers",
  },
  overlay: {
    stub: false,
    latestVersion: "1.0.0",
    description: "Overlay — scrim + modal/sheet content. Part of the Surface System.",
    icon: "layers",
  },
};

for (const entry of registry.components) {
  const p = patch[entry.name];
  if (!p) continue;
  Object.assign(entry, p);
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Surface system generated.");
