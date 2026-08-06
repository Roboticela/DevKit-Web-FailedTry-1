/**
 * Sync spacing system packages to both templates and update registry.
 * Run: node scripts/generate-spacing.mjs
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

const nextRoot = join(COMP, "responsive-spacing/nextjs-compact/v1/files");
const viteRoot = join(COMP, "responsive-spacing/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/responsive-spacing.css"), join(viteRoot, "src/styles/responsive-spacing.css"));
copy(
  join(nextRoot, "styles/responsive-spacing.tailwind.css"),
  join(viteRoot, "src/styles/responsive-spacing.tailwind.css")
);
copy(join(nextRoot, "docs/SPACING.md"), join(viteRoot, "docs/SPACING.md"));
copy(
  join(nextRoot, "components/ui/DensityProvider.tsx"),
  join(viteRoot, "src/components/ui/DensityProvider.tsx")
);
copy(join(nextRoot, "components/ui/Space.tsx"), join(viteRoot, "src/components/ui/Space.tsx"));

const filesNext = [
  { source: "files/styles/responsive-spacing.css", destination: "styles/responsive-spacing.css" },
  {
    source: "files/styles/responsive-spacing.tailwind.css",
    destination: "styles/responsive-spacing.tailwind.css",
  },
  { source: "files/components/ui/DensityProvider.tsx", destination: "components/ui/DensityProvider.tsx" },
  { source: "files/components/ui/Space.tsx", destination: "components/ui/Space.tsx" },
  { source: "files/docs/SPACING.md", destination: "docs/devkit/SPACING.md" },
];

const filesVite = [
  { source: "files/src/styles/responsive-spacing.css", destination: "src/styles/responsive-spacing.css" },
  {
    source: "files/src/styles/responsive-spacing.tailwind.css",
    destination: "src/styles/responsive-spacing.tailwind.css",
  },
  {
    source: "files/src/components/ui/DensityProvider.tsx",
    destination: "src/components/ui/DensityProvider.tsx",
  },
  { source: "files/src/components/ui/Space.tsx", destination: "src/components/ui/Space.tsx" },
  { source: "files/docs/SPACING.md", destination: "docs/devkit/SPACING.md" },
];

write(
  join(COMP, "responsive-spacing/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    { version: "1.0.0", template: "nextjs-compact", files: filesNext, injections: [], dependencies: { frontend: [] }, envVars: [] },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "responsive-spacing/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    { version: "1.0.0", template: "vite-express-tauri", files: filesVite, injections: [], dependencies: { frontend: [] }, envVars: [] },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "responsive-spacing/component.json"),
  JSON.stringify(
    {
      id: 24,
      name: "responsive-spacing",
      displayName: "Responsive Spacing",
      description:
        "Universal spacing scale with semantic roles, responsive rhythm, and compact/comfortable/spacious density modes.",
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "spacing-system", "responsive-spacing", "density"],
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
      optionalConfig: ["ui.density"],
    },
    null,
    2
  ) + "\n"
);

const companions = [
  {
    name: "margin-utilities",
    id: 21,
    css: `/* Margin utilities — provided by responsive-spacing.css (.dk-m-*, .dk-mx-*, …) */\n@import "../../responsive-spacing/nextjs-compact/v1/files/styles/responsive-spacing.css";\n`,
    note: "Use .dk-m-* / .dk-mx-* / .dk-my-* from responsive-spacing.",
  },
  {
    name: "padding-utilities",
    id: 22,
    note: "Use .dk-p-* / .dk-px-* / .dk-py-* from responsive-spacing.",
  },
  {
    name: "gap-utilities",
    id: 23,
    note: "Use .dk-gap-* from responsive-spacing.",
  },
  {
    name: "content-width-manager",
    id: 25,
    note: "Use .dk-content-width* from responsive-spacing.",
  },
  {
    name: "auto-layout",
    id: 26,
    note: "Use .dk-space-stack / .dk-space-inline with spacing tokens.",
  },
  {
    name: "alignment-utilities",
    id: 27,
    note: "Use .dk-align-* from responsive-spacing.",
  },
  {
    name: "distribution-utilities",
    id: 28,
    note: "Use .dk-distribute-* from responsive-spacing.",
  },
  {
    name: "position-utilities",
    id: 29,
    note: "Use .dk-pos-* / .dk-inset-* from responsive-spacing.",
  },
  {
    name: "overflow-utilities",
    id: 30,
    note: "Use .dk-overflow-* from responsive-spacing.",
  },
];

for (const c of companions) {
  const css = `/**
 * ${c.name} — companion to responsive-spacing
 * ${c.note}
 * Prefer importing responsive-spacing.css once at the app root.
 */
:root {
  /* alias marker — tokens live in responsive-spacing */
  --dk-spacing-companion-${c.name}: 1;
}
`;
  write(join(COMP, c.name, `nextjs-compact/v1/files/styles/${c.name}.css`), css);
  write(join(COMP, c.name, `vite-express-tauri/v1/files/src/styles/${c.name}.css`), css);

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
        description: `${c.note} Companion package for the Spacing System.`,
        category: "foundation",
        group: "spacing-system",
        groupName: "Spacing System",
        kind: "component",
        layer: 1,
        icon: "move",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "spacing-system", c.name],
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
        dependencies: { frontend: [] },
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
        dependencies: { frontend: [] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
}

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const names = new Set(["responsive-spacing", ...companions.map((c) => c.name)]);

for (const entry of registry.components) {
  if (!names.has(entry.name)) continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  if (entry.name === "responsive-spacing") {
    entry.displayName = "Responsive Spacing";
    entry.description =
      "Universal spacing scale with semantic roles, responsive rhythm, and compact/comfortable/spacious density modes.";
    entry.icon = "move";
    entry.tags = ["foundation", "spacing-system", "responsive-spacing", "density"];
  } else {
    const c = companions.find((x) => x.name === entry.name);
    entry.description = `${c.note} Companion package for the Spacing System.`;
    entry.icon = "move";
  }
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Spacing system generated.");
