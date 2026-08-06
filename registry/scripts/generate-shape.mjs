/**
 * Sync Shape System (rounded-corner) + companions; patch registry.
 * Run: node scripts/generate-shape.mjs
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

const nextRoot = join(COMP, "rounded-corner/nextjs-compact/v1/files");
const viteRoot = join(COMP, "rounded-corner/vite-express-tauri/v1/files");

const uiFiles = [
  "RoundedCorner.tsx",
  "CircleShape.tsx",
  "PillShape.tsx",
  "AvatarShape.tsx",
  "Border.tsx",
  "Divider.tsx",
];

copy(join(nextRoot, "styles/shape-system.css"), join(viteRoot, "src/styles/shape-system.css"));
copy(join(nextRoot, "docs/SHAPE.md"), join(viteRoot, "docs/SHAPE.md"));
for (const f of uiFiles) {
  copy(join(nextRoot, `components/ui/${f}`), join(viteRoot, `src/components/ui/${f}`));
}

const filesNext = [
  { source: "files/styles/shape-system.css", destination: "styles/shape-system.css" },
  ...uiFiles.map((f) => ({ source: `files/components/ui/${f}`, destination: `components/ui/${f}` })),
  { source: "files/docs/SHAPE.md", destination: "docs/devkit/SHAPE.md" },
];
const filesVite = [
  { source: "files/src/styles/shape-system.css", destination: "src/styles/shape-system.css" },
  ...uiFiles.map((f) => ({ source: `files/src/components/ui/${f}`, destination: `src/components/ui/${f}` })),
  { source: "files/docs/SHAPE.md", destination: "docs/devkit/SHAPE.md" },
];

write(
  join(COMP, "rounded-corner/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: filesNext,
      injections: [],
      dependencies: { frontend: ["color-tokens", "responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "rounded-corner/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: filesVite,
      injections: [],
      dependencies: { frontend: ["color-tokens", "responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "rounded-corner/component.json"),
  JSON.stringify(
    {
      id: 74,
      name: "rounded-corner",
      displayName: "Rounded Corner",
      description:
        "Shape System — semantic radius tokens (sharp → full), nested radii, circle/pill/avatar shapes, borders and dividers.",
      category: "foundation",
      group: "shape-system",
      groupName: "Shape System",
      kind: "component",
      layer: 1,
      icon: "circle",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "shape-system", "rounded-corner", "radius"],
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

const companions = [
  {
    name: "circle-shape",
    id: 75,
    file: "CircleShape.tsx",
    deps: ["CircleShape.tsx"],
    note: "CircleShape — perfect circles for icons and thumbs. Part of the Shape System.",
  },
  {
    name: "pill-shape",
    id: 76,
    file: "PillShape.tsx",
    deps: ["PillShape.tsx"],
    note: "PillShape — capsules and chips. Part of the Shape System.",
  },
  {
    name: "avatar-shape",
    id: 77,
    file: "AvatarShape.tsx",
    deps: ["AvatarShape.tsx"],
    note: "AvatarShape — circle/soft/square avatar silhouettes. Part of the Shape System.",
  },
  {
    name: "border",
    id: 73,
    file: "Border.tsx",
    deps: ["Border.tsx"],
    note: "Border — tone and edge borders using Shape System tokens.",
  },
  {
    name: "divider",
    id: 71,
    file: "Divider.tsx",
    deps: ["Divider.tsx"],
    note: "Divider — hairline separators. Part of the Shape System.",
  },
  {
    name: "separator",
    id: 72,
    file: "Divider.tsx",
    exportAs: "Separator.tsx",
    deps: ["Divider.tsx"],
    note: "Separator — alias of Divider. Part of the Shape System.",
  },
];

for (const c of companions) {
  for (const f of c.deps) {
    copy(join(nextRoot, `components/ui/${f}`), join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${f}`));
    copy(join(nextRoot, `components/ui/${f}`), join(COMP, c.name, `vite-express-tauri/v1/files/src/components/ui/${f}`));
  }

  if (c.name === "separator") {
    const sep = `export { Divider as Separator, Divider, type DividerProps } from "./Divider";\n`;
    write(join(COMP, c.name, "nextjs-compact/v1/files/components/ui/Separator.tsx"), sep);
    write(join(COMP, c.name, "vite-express-tauri/v1/files/src/components/ui/Separator.tsx"), sep);
  }

  const css = `/**
 * ${c.name} — companion to rounded-corner (Shape System)
 * ${c.note}
 * Prefer importing shape-system.css once at the app root.
 */
:root { --dk-shape-companion-${c.name}: 1; }
`;
  write(join(COMP, c.name, `nextjs-compact/v1/files/styles/${c.name}.css`), css);
  write(join(COMP, c.name, `vite-express-tauri/v1/files/src/styles/${c.name}.css`), css);

  const entryFile = c.exportAs || c.file;
  const nextFiles = [
    ...c.deps.map((f) => ({ source: `files/components/ui/${f}`, destination: `components/ui/${f}` })),
    ...(c.exportAs
      ? [{ source: `files/components/ui/${c.exportAs}`, destination: `components/ui/${c.exportAs}` }]
      : []),
    { source: `files/styles/${c.name}.css`, destination: `styles/${c.name}.css` },
  ];
  const viteFiles = [
    ...c.deps.map((f) => ({ source: `files/src/components/ui/${f}`, destination: `src/components/ui/${f}` })),
    ...(c.exportAs
      ? [{ source: `files/src/components/ui/${c.exportAs}`, destination: `src/components/ui/${c.exportAs}` }]
      : []),
    { source: `files/src/styles/${c.name}.css`, destination: `src/styles/${c.name}.css` },
  ];

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
        description: c.note,
        category: "foundation",
        group: "shape-system",
        groupName: "Shape System",
        kind: "component",
        layer: 1,
        icon: "circle",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "shape-system", c.name],
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
    join(COMP, c.name, "nextjs-compact/v1/manifest.json"),
    JSON.stringify(
      {
        version: "1.0.0",
        template: "nextjs-compact",
        files: nextFiles,
        injections: [],
        dependencies: { frontend: ["rounded-corner"] },
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
        files: viteFiles,
        injections: [],
        dependencies: { frontend: ["rounded-corner"] },
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
  "rounded-corner": {
    stub: false,
    latestVersion: "1.0.0",
    displayName: "Rounded Corner",
    description:
      "Shape System — semantic radius tokens (sharp → full), nested radii, circle/pill/avatar shapes, borders and dividers.",
    icon: "circle",
    tags: ["foundation", "shape-system", "rounded-corner", "radius"],
  },
  "circle-shape": {
    stub: false,
    latestVersion: "1.0.0",
    description: "CircleShape — perfect circles for icons and thumbs. Part of the Shape System.",
    icon: "circle",
  },
  "pill-shape": {
    stub: false,
    latestVersion: "1.0.0",
    description: "PillShape — capsules and chips. Part of the Shape System.",
    icon: "circle",
  },
  "avatar-shape": {
    stub: false,
    latestVersion: "1.0.0",
    description: "AvatarShape — circle/soft/square avatar silhouettes. Part of the Shape System.",
    icon: "circle",
  },
  border: {
    stub: false,
    latestVersion: "1.0.0",
    description: "Border — tone and edge borders using Shape System tokens.",
    icon: "circle",
  },
  divider: {
    stub: false,
    latestVersion: "1.0.0",
    description: "Divider — hairline separators. Part of the Shape System.",
    icon: "circle",
  },
  separator: {
    stub: false,
    latestVersion: "1.0.0",
    description: "Separator — alias of Divider. Part of the Shape System.",
    icon: "circle",
  },
};

for (const entry of registry.components) {
  const p = patch[entry.name];
  if (!p) continue;
  Object.assign(entry, p);
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Shape system generated.");
