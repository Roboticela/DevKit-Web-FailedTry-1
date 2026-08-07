/**
 * Generate empty Interaction Controls stubs (IDs 1–10) for both templates.
 * Skips packages listed in SKIP_IMPLEMENTED so real implementations are not overwritten.
 * Run: node scripts/generate-interaction-controls.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS = join(__dirname, "../components");
const TODAY = "2026-08-07";

/** Packages already implemented — generator must not overwrite their sources. */
const SKIP_IMPLEMENTED = new Set([
  "button",
  "icon-button",
  "button-group",
  "split-button",
  "link-button",
  "floating-action-button",
  "toggle-button",
  "segmented-control",
  "action-menu-trigger",
]);

const GROUP = {
  id: "foundations-interface-primitives",
  name: "Foundations & Interface Primitives",
};
const SUBGROUP = {
  id: "interaction-controls",
  name: "Interaction Controls",
};

const ITEMS = [
  [1, "button", "Button"],
  [2, "icon-button", "Icon Button"],
  [3, "button-group", "Button Group"],
  [4, "split-button", "Split Button"],
  [5, "link-button", "Link Button"],
  [6, "floating-action-button", "Floating Action Button"],
  [7, "toggle-button", "Toggle Button"],
  [8, "segmented-control", "Segmented Control"],
  [9, "command-button", "Command Button"],
  [10, "action-menu-trigger", "Action Menu Trigger"],
];

function toPascal(kebab) {
  return kebab
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function emptyTsx(exportName, displayName, id) {
  return `import * as React from "react";

export interface ${exportName}Props {
  children?: React.ReactNode;
}

/** ${displayName} (ID ${String(id).padStart(3, "0")}) - empty stub. */
export function ${exportName}(_props: ${exportName}Props = {}) {
  return null;
}
`;
}

const catalog = [];
const layerComponents = [];

for (const [id, name, displayName] of ITEMS) {
  const base = join(COMPONENTS, name);
  const metaPath = join(base, "component.json");

  if (SKIP_IMPLEMENTED.has(name) && existsSync(metaPath)) {
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    catalog.push({
      id: meta.id,
      name: meta.name,
      displayName: meta.displayName,
      description: meta.description,
      category: meta.category,
      group: meta.group,
      groupName: meta.groupName,
      subgroup: meta.subgroup,
      subgroupName: meta.subgroupName,
      kind: meta.kind,
      layer: meta.layer,
      icon: meta.icon,
      templates: meta.templates,
      platforms: meta.platforms,
      hasVariants: meta.hasVariants,
      stub: meta.stub === true,
      latestVersion: meta.versions?.latest ?? "1.0.0",
      tags: meta.tags,
    });
    layerComponents.push({
      id: meta.id,
      name: meta.name,
      displayName: meta.displayName,
      fileKind: meta.fileKind ?? "tsx",
      stub: meta.stub === true,
      latestVersion: meta.versions?.latest ?? "1.0.0",
    });
    console.log(`skip implemented: ${name}`);
    continue;
  }

  const exportName = toPascal(name);
  const fileBase = `${exportName}.tsx`;
  const nextSource = `files/components/ui/${fileBase}`;
  const nextDest = `components/ui/${fileBase}`;
  const viteSource = `files/src/components/ui/${fileBase}`;
  const viteDest = `src/components/ui/${fileBase}`;
  const content = emptyTsx(exportName, displayName, id);

  write(join(base, "nextjs-compact", "v1", nextSource), content);
  write(join(base, "vite-express-tauri", "v1", viteSource), content);

  const description = `${displayName} - empty Interaction Controls stub (Foundations & Interface Primitives).`;
  const tags = [
    "foundation",
    GROUP.id,
    SUBGROUP.id,
    name,
    "interaction",
    "stub",
  ];

  const componentJson = {
    id,
    name,
    displayName,
    description,
    category: "foundation",
    group: GROUP.id,
    groupName: GROUP.name,
    subgroup: SUBGROUP.id,
    subgroupName: SUBGROUP.name,
    kind: "component",
    layer: 1,
    icon: "square",
    author: "Roboticela",
    license: "MIT",
    tags,
    templates: ["nextjs-compact", "vite-express-tauri"],
    platforms: ["web", "desktop"],
    hasVariants: false,
    stub: true,
    fileKind: "tsx",
    versions: {
      latest: "0.0.0",
      stable: "0.0.0",
      history: [{ version: "0.0.0", releaseDate: TODAY, breaking: false }],
    },
    requiredConfig: [],
    optionalConfig: [],
  };
  write(join(base, "component.json"), JSON.stringify(componentJson, null, 2) + "\n");

  write(
    join(base, "nextjs-compact", "v1", "manifest.json"),
    JSON.stringify(
      {
        version: "0.0.0",
        template: "nextjs-compact",
        files: [{ source: nextSource, destination: nextDest }],
        injections: [],
        dependencies: { frontend: [] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );

  write(
    join(base, "vite-express-tauri", "v1", "manifest.json"),
    JSON.stringify(
      {
        version: "0.0.0",
        template: "vite-express-tauri",
        files: [{ source: viteSource, destination: viteDest }],
        injections: [],
        dependencies: { frontend: [] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );

  catalog.push({
    id,
    name,
    displayName,
    description,
    category: "foundation",
    group: GROUP.id,
    groupName: GROUP.name,
    subgroup: SUBGROUP.id,
    subgroupName: SUBGROUP.name,
    kind: "component",
    layer: 1,
    icon: "square",
    templates: ["nextjs-compact", "vite-express-tauri"],
    platforms: ["web", "desktop"],
    hasVariants: false,
    stub: true,
    latestVersion: "0.0.0",
    tags,
  });

  layerComponents.push({
    id,
    name,
    displayName,
    fileKind: "tsx",
    stub: true,
  });
}

write(
  join(COMPONENTS, "registry.json"),
  JSON.stringify(
    {
      version: "1",
      updatedAt: `${TODAY}T00:00:00Z`,
      components: catalog,
    },
    null,
    2
  ) + "\n"
);

const layersPath = join(COMPONENTS, "layers.json");
const layers = JSON.parse(readFileSync(layersPath, "utf8"));
layers.updatedAt = `${TODAY}T00:00:00Z`;

const foundation = layers.layers.find((l) => l.layer === 1);
const group = foundation.groups.find((g) => g.id === GROUP.id);
const subgroup = group.subgroups.find((s) => s.id === SUBGROUP.id);
subgroup.components = layerComponents;
subgroup.idRange = { min: 1, max: 10 };

write(layersPath, JSON.stringify(layers, null, 2) + "\n");

console.log(`Interaction Controls catalog synced (${catalog.length} packages).`);
