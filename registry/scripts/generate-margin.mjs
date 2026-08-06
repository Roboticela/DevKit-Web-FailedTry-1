/**
 * Generate Responsive Margin System (margin-utilities id: 21).
 * Run: node scripts/generate-margin.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "margin-utilities";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const SCALES = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
const BPS = [
  { key: "sm", min: 480 },
  { key: "md", min: 768 },
  { key: "lg", min: 1024 },
  { key: "xl", min: 1280 },
  { key: "2xl", min: 1440 },
];

const SIDES = [
  { prefix: "m", props: ["margin"], auto: true },
  { prefix: "mx", props: ["margin-inline"], auto: true },
  { prefix: "my", props: ["margin-block"], auto: false },
  { prefix: "mt", props: ["margin-block-start"], auto: false },
  { prefix: "mb", props: ["margin-block-end"], auto: false },
  { prefix: "ms", props: ["margin-inline-start"], auto: true },
  { prefix: "me", props: ["margin-inline-end"], auto: true },
  { prefix: "ml", props: ["margin-left"], auto: true },
  { prefix: "mr", props: ["margin-right"], auto: true },
];

function emitScaleUtils(bpPrefix = "") {
  const name = (prefix, scale) =>
    bpPrefix ? `.dk-${bpPrefix}\\:${prefix}-${scale}` : `.dk-${prefix}-${scale}`;

  let out = "";
  for (const side of SIDES) {
    for (const scale of SCALES) {
      out += `${name(side.prefix, scale)} {\n`;
      for (const p of side.props) out += `  ${p}: var(--space-${scale});\n`;
      out += `}\n`;
    }
    if (side.auto) {
      out += `${name(side.prefix, "auto")} {\n`;
      for (const p of side.props) out += `  ${p}: auto;\n`;
      out += `}\n`;
    }
  }

  const negSides = [
    ["m", ["margin"]],
    ["mx", ["margin-inline"]],
    ["my", ["margin-block"]],
    ["mt", ["margin-block-start"]],
    ["mb", ["margin-block-end"]],
    ["ms", ["margin-inline-start"]],
    ["me", ["margin-inline-end"]],
  ];
  for (const [prefix, props] of negSides) {
    for (const scale of [1, 2, 3, 4, 5, 6, 8]) {
      out += `${name(`-${prefix}`, scale)} {\n`;
      for (const p of props) out += `  ${p}: calc(var(--space-${scale}) * -1);\n`;
      out += `}\n`;
    }
  }
  return out;
}

const header = `/**
 * DevKit Responsive Margin System — Layer 1 Foundation (id: 21 · margin-utilities)
 *
 * Semantic, density-aware, RTL-safe margins. Consumes --space-* from
 * responsive-spacing.css — never hardcode px in app layouts.
 *
 * Load order: color → typography → responsive-spacing → breakpoint → margin-system
 */

:root,
[data-theme] {
  --margin-transition:
    margin var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    margin-block var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    margin-inline var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease);

  --margin-page-x: var(--space-page-x);
  --margin-page-y: var(--space-page-y);
  --margin-section: var(--space-section-y);
  --margin-section-gap: var(--space-section-gap);
  --margin-container: var(--space-container-gap);
  --margin-card: var(--space-card-gap);
  --margin-form: var(--space-form-gap);
  --margin-form-field: var(--space-form-field-gap);
  --margin-form-section: var(--space-form-section-gap);
  --margin-modal: var(--space-modal-gap);
  --margin-table: var(--space-table-gap);
  --margin-nav: var(--space-nav-gap);
  --margin-nav-section: var(--space-nav-section-gap);
  --margin-stack: var(--space-stack-gap);
  --margin-inline: var(--space-inline-gap);
  --margin-control: var(--space-control-gap);
  --margin-type: var(--space-type-paragraph);
  --margin-type-heading: var(--space-type-heading-after);
}

@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) {
    --margin-transition: none;
  }
}

html[data-motion="reduce"] {
  --margin-transition: none;
}

.dk-m-motion,
.dk-margin-motion {
  transition: var(--margin-transition);
}

.dk-m-page {
  margin-inline: var(--margin-page-x);
  margin-block: var(--margin-page-y);
}
.dk-m-page-x { margin-inline: var(--margin-page-x); }
.dk-m-page-y { margin-block: var(--margin-page-y); }
.dk-m-section { margin-block: var(--margin-section); }
.dk-m-section-gap { margin-block-start: var(--margin-section-gap); }
.dk-m-container { margin-block-start: var(--margin-container); }
.dk-m-card { margin-block-start: var(--margin-card); }
.dk-m-form { margin-block-start: var(--margin-form); }
.dk-m-form-field { margin-block-start: var(--margin-form-field); }
.dk-m-form-section { margin-block-start: var(--margin-form-section); }
.dk-m-modal { margin-block-start: var(--margin-modal); }
.dk-m-table { margin-block-start: var(--margin-table); }
.dk-m-nav { margin-inline-end: var(--margin-nav); }
.dk-m-nav-section { margin-block-start: var(--margin-nav-section); }
.dk-m-stack { margin-block-start: var(--margin-stack); }
.dk-m-inline { margin-inline-end: var(--margin-inline); }
.dk-m-control { margin-inline-end: var(--margin-control); }
.dk-m-type { margin-block-end: var(--margin-type); }
.dk-m-type-heading { margin-block-end: var(--margin-type-heading); }

.dk-m-stack-flow > :first-child,
.dk-m-form-flow > :first-child,
.dk-m-card-flow > :first-child {
  margin-block-start: 0;
}
.dk-m-stack-flow > * + * { margin-block-start: var(--margin-stack); margin-block-end: 0; }
.dk-m-form-flow > * + * { margin-block-start: var(--margin-form); margin-block-end: 0; }
.dk-m-card-flow > * + * { margin-block-start: var(--margin-card); margin-block-end: 0; }
.dk-m-section-flow > * + * { margin-block-start: var(--margin-section-gap); margin-block-end: 0; }

.dk-margin-collapse > * + * { margin-block-start: 0; }
.dk-margin-collapse-x > * + * { margin-inline-start: 0; }
.dk-margin-collapse-max > * + * {
  margin-block-start: max(
    var(--dk-m-start, var(--margin-stack)),
    var(--dk-m-prev-end, 0px)
  );
}

.dk-margin-nested,
.dk-container .dk-m-page,
.dk-section .dk-m-page {
  margin-inline: 0;
}
.dk-margin-nested > .dk-m-section:first-child,
.dk-container > .dk-m-section:first-child {
  margin-block-start: 0;
}

.dk-m-safe {
  margin-top: max(var(--space-0), env(safe-area-inset-top, 0px));
  margin-right: max(var(--space-0), env(safe-area-inset-right, 0px));
  margin-bottom: max(var(--space-0), env(safe-area-inset-bottom, 0px));
  margin-left: max(var(--space-0), env(safe-area-inset-left, 0px));
}
.dk-m-safe-t { margin-block-start: max(var(--space-0), env(safe-area-inset-top, 0px)); }
.dk-m-safe-b { margin-block-end: max(var(--space-0), env(safe-area-inset-bottom, 0px)); }
.dk-m-safe-s { margin-inline-start: max(var(--space-0), env(safe-area-inset-left, 0px)); }
.dk-m-safe-e { margin-inline-end: max(var(--space-0), env(safe-area-inset-right, 0px)); }
.dk-m-safe-x {
  margin-inline-start: max(var(--space-0), env(safe-area-inset-left, 0px));
  margin-inline-end: max(var(--space-0), env(safe-area-inset-right, 0px));
}
.dk-m-safe-y {
  margin-block-start: max(var(--space-0), env(safe-area-inset-top, 0px));
  margin-block-end: max(var(--space-0), env(safe-area-inset-bottom, 0px));
}
.dk-m-safe-page-x {
  margin-inline-start: max(var(--margin-page-x), env(safe-area-inset-left, 0px));
  margin-inline-end: max(var(--margin-page-x), env(safe-area-inset-right, 0px));
}
.dk-m-safe-page-y {
  margin-block-start: max(var(--margin-page-y), env(safe-area-inset-top, 0px));
  margin-block-end: max(var(--margin-page-y), env(safe-area-inset-bottom, 0px));
}

.dk-m-gutter { margin: var(--grid-gutter, var(--space-4)); }
.dk-m-gutter-x { margin-inline: var(--grid-gutter, var(--space-4)); }
.dk-m-gutter-y { margin-block: var(--grid-gutter, var(--space-4)); }
.dk-flex-item-m > * + *,
.dk-stack-m > * + * { margin-block-start: var(--margin-stack); }
.dk-inline-m > * + * { margin-inline-start: var(--margin-inline); }
.dk-m-stable {
  content-visibility: auto;
  contain-intrinsic-size: auto 1lh;
}

`;

let css = header + emitScaleUtils();
for (const bp of BPS) {
  css += `\n@media (min-width: ${bp.min}px) {\n`;
  css += emitScaleUtils(bp.key)
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");
  css += `}\n`;
}

css += `
@media (min-width: 1440px) {
  :root {
    --margin-section: var(--space-24, var(--space-section-y));
  }
}

html[data-bp="md"] .dk-bp-from-m-section,
html[data-bp="lg"] .dk-bp-from-m-section,
html[data-bp="xl"] .dk-bp-from-m-section,
html[data-bp="2xl"] .dk-bp-from-m-section,
html[data-bp="3xl"] .dk-bp-from-m-section {
  margin-block-start: var(--margin-section-gap);
}
`;

const tailwind = `/**
 * Tailwind v4 bridge — Responsive Margin System
 * Import after responsive-spacing.tailwind.css + margin-system.css
 */

@theme inline {
  --spacing-dk-m-page-x: var(--margin-page-x);
  --spacing-dk-m-page-y: var(--margin-page-y);
  --spacing-dk-m-section: var(--margin-section);
  --spacing-dk-m-section-gap: var(--margin-section-gap);
  --spacing-dk-m-card: var(--margin-card);
  --spacing-dk-m-form: var(--margin-form);
  --spacing-dk-m-modal: var(--margin-modal);
  --spacing-dk-m-stack: var(--margin-stack);
  --spacing-dk-m-inline: var(--margin-inline);
  --spacing-dk-m-nav: var(--margin-nav);
  --spacing-dk-m-gutter: var(--grid-gutter);
}
`;

const docs = `# Responsive Margin System

DevKit Layer 1 foundation (\`margin-utilities\`, id **21**).

Eliminates hardcoded margins. Every margin is a **semantic token** or **scale step** from \`responsive-spacing\`, adapted by breakpoint and density.

## Install

\`\`\`bash
npx @roboticela/devkit add margin-utilities
\`\`\`

\`\`\`ts
import "@/styles/responsive-spacing.css";
import "@/styles/margin-system.css";
import { Margin, MarginSection, marginClassName } from "@/components/ui/Margin";
\`\`\`

## Principles

1. Prefer **presets** (\`section\`, \`card\`, \`form\`, …) over raw scales
2. Use **logical** props: \`ms\` / \`me\` / \`mt\` / \`mb\` (RTL-safe)
3. Never pass pixel strings — use scale \`0–24\` or \`"auto"\`
4. Nest inside Container/Section with \`nested\` to avoid double page margins
5. In flex/grid, use \`collapse\` or \`flow\` so adjacent margins do not double

## Quick start

\`\`\`tsx
<Margin preset="page" safe="page-x">
  <Margin flow="section">
    <Margin preset="section-gap">Hero</Margin>
    <Margin preset="card">Card block</Margin>
  </Margin>
</Margin>

<Margin mt={{ base: 4, md: 8, lg: 12 }} ms="auto" motion>
  Responsive + RTL-aware
</Margin>
\`\`\`

## Density

Inherits \`data-density\` from \`DensityProvider\` via \`--margin-*\` → \`--space-*\` bridges.

## Breakpoints

Mobile-first: \`dk-md:mt-8\`, \`dk-lg:mx-auto\` (\`sm\` 480 · \`md\` 768 · \`lg\` 1024 · \`xl\` 1280 · \`2xl\` 1440).

## Integration

Grid, Flex, Stack, Container, Cards, Modals, Forms, Tables share \`--space-*\` / \`--margin-*\` tokens (\`.dk-m-gutter\`, \`.dk-m-stack-flow\`, \`.dk-margin-collapse\`).
`;

const description =
  "Responsive Margin System — semantic, density-aware, RTL-safe margins with responsive breakpoints, safe-area, collapse, motion, and layout integration. No hardcoded px.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

write(join(nextRoot, "styles/margin-system.css"), css);
write(join(nextRoot, "styles/margin-system.tailwind.css"), tailwind);
write(join(nextRoot, "docs/MARGIN.md"), docs);

copy(join(nextRoot, "styles/margin-system.css"), join(viteRoot, "src/styles/margin-system.css"));
copy(
  join(nextRoot, "styles/margin-system.tailwind.css"),
  join(viteRoot, "src/styles/margin-system.tailwind.css")
);
copy(join(nextRoot, "docs/MARGIN.md"), join(viteRoot, "docs/MARGIN.md"));
copy(join(nextRoot, "components/ui/Margin.tsx"), join(viteRoot, "src/components/ui/Margin.tsx"));
copy(
  join(nextRoot, "components/ui/MarginUtilities.tsx"),
  join(viteRoot, "src/components/ui/MarginUtilities.tsx")
);

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/margin-system.css", destination: "styles/margin-system.css" },
        {
          source: "files/styles/margin-system.tailwind.css",
          destination: "styles/margin-system.tailwind.css",
        },
        { source: "files/components/ui/Margin.tsx", destination: "components/ui/Margin.tsx" },
        {
          source: "files/components/ui/MarginUtilities.tsx",
          destination: "components/ui/MarginUtilities.tsx",
        },
        { source: "files/docs/MARGIN.md", destination: "docs/devkit/MARGIN.md" },
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
  join(COMP, PKG, "vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        {
          source: "files/src/styles/margin-system.css",
          destination: "src/styles/margin-system.css",
        },
        {
          source: "files/src/styles/margin-system.tailwind.css",
          destination: "src/styles/margin-system.tailwind.css",
        },
        {
          source: "files/src/components/ui/Margin.tsx",
          destination: "src/components/ui/Margin.tsx",
        },
        {
          source: "files/src/components/ui/MarginUtilities.tsx",
          destination: "src/components/ui/MarginUtilities.tsx",
        },
        { source: "files/docs/MARGIN.md", destination: "docs/devkit/MARGIN.md" },
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
  join(COMP, PKG, "component.json"),
  JSON.stringify(
    {
      id: 21,
      name: PKG,
      displayName: "Responsive Margin",
      description,
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "spacing-system", "margin-utilities", "margin", "responsive"],
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
      optionalConfig: ["ui.density"],
    },
    null,
    2
  ) + "\n"
);

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
for (const entry of registry.components) {
  if (entry.name !== PKG) continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Responsive Margin";
  entry.description = description;
  entry.tags = ["foundation", "spacing-system", "margin-utilities", "margin", "responsive"];
  entry.icon = "move";
  entry.fileKind = "tsx";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Responsive Margin System generated.");
