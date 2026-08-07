/**
 * Generate empty Form Controls stubs (IDs 11–20) for both templates.
 * Merges into registry.json / layers.json without wiping Interaction Controls.
 * Skips packages listed in SKIP_IMPLEMENTED so real implementations are not overwritten.
 * Run: node scripts/generate-form-controls.mjs
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMPONENTS = join(__dirname, "../components");
const PLAYGROUND_CATALOG = join(
  __dirname,
  "../../playground/src/foundation-catalog.json"
);
const TODAY = "2026-08-07";

/** Packages already implemented — generator must not overwrite their sources. */
const SKIP_IMPLEMENTED = new Set([
  "text-input",
  "textarea",
  "search-field",
  "number-input",
  "password-input",
  "otp-input",
  "date-input",
  "time-input",
  "date-time-input",
  "input-group",
]);

const GROUP = {
  id: "foundations-interface-primitives",
  name: "Foundations & Interface Primitives",
};
const SUBGROUP = {
  id: "form-controls",
  name: "Form Controls",
};

const ITEMS = [
  [11, "text-input", "Text Input"],
  [12, "textarea", "Textarea"],
  [13, "search-field", "Search Field"],
  [14, "number-input", "Number Input"],
  [15, "password-input", "Password Input"],
  [16, "otp-input", "OTP / Verification Input"],
  [17, "date-input", "Date Input"],
  [18, "time-input", "Time Input"],
  [19, "date-time-input", "Date & Time Input"],
  [20, "input-group", "Input Group"],
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

const catalogEntries = [];
const layerComponents = [];

for (const [id, name, displayName] of ITEMS) {
  const base = join(COMPONENTS, name);
  const metaPath = join(base, "component.json");

  if (SKIP_IMPLEMENTED.has(name) && existsSync(metaPath)) {
    const meta = JSON.parse(readFileSync(metaPath, "utf8"));
    catalogEntries.push({
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

  const description = `${displayName} - empty Form Controls stub (Foundations & Interface Primitives).`;
  const tags = [
    "foundation",
    GROUP.id,
    SUBGROUP.id,
    name,
    "form",
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

  catalogEntries.push({
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
    latestVersion: "0.0.0",
  });

  console.log(`stub: ${String(id).padStart(3, "0")} ${name}`);
}

const registryPath = join(COMPONENTS, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const formNames = new Set(ITEMS.map(([, name]) => name));
registry.components = [
  ...registry.components.filter((c) => !formNames.has(c.name)),
  ...catalogEntries,
].sort((a, b) => a.id - b.id);
registry.updatedAt = `${TODAY}T17:00:00Z`;
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

const layersPath = join(COMPONENTS, "layers.json");
const layers = JSON.parse(readFileSync(layersPath, "utf8"));
layers.updatedAt = registry.updatedAt;

const foundation = layers.layers.find((l) => l.layer === 1);
const group = foundation.groups.find((g) => g.id === GROUP.id);
const subgroup = group.subgroups.find((s) => s.id === SUBGROUP.id);
subgroup.description =
  "Text, search, numeric, password, OTP, and temporal field primitives plus input grouping.";
subgroup.components = layerComponents;
subgroup.idRange = { min: 11, max: 20 };
write(layersPath, JSON.stringify(layers, null, 2) + "\n");

if (existsSync(PLAYGROUND_CATALOG)) {
  const catalog = JSON.parse(readFileSync(PLAYGROUND_CATALOG, "utf8"));
  catalog.updatedAt = registry.updatedAt;
  const cGroup = catalog.groups?.[0];
  const cSub = cGroup?.subgroups?.find((s) => s.id === SUBGROUP.id);
  if (cSub) {
    cSub.components = layerComponents.map((c) => ({
      id: c.id,
      name: c.name,
      displayName: c.displayName,
      stub: c.stub === true,
      latestVersion: c.latestVersion ?? "0.0.0",
    }));
  }
  write(PLAYGROUND_CATALOG, JSON.stringify(catalog, null, 2) + "\n");
}

console.log(
  `Form Controls catalog synced (${catalogEntries.length} stubs; registry total ${registry.components.length}).`
);
