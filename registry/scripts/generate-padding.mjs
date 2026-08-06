/**
 * Generate Responsive Padding System (padding-utilities id: 22).
 * Run: node scripts/generate-padding.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "padding-utilities";

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
  { prefix: "p", props: ["padding"] },
  { prefix: "px", props: ["padding-inline"] },
  { prefix: "py", props: ["padding-block"] },
  { prefix: "pt", props: ["padding-block-start"] },
  { prefix: "pb", props: ["padding-block-end"] },
  { prefix: "ps", props: ["padding-inline-start"] },
  { prefix: "pe", props: ["padding-inline-end"] },
  { prefix: "pl", props: ["padding-left"] },
  { prefix: "pr", props: ["padding-right"] },
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
  }
  return out;
}

const header = `/**
 * DevKit Responsive Padding System — Layer 1 Foundation (id: 22 · padding-utilities)
 *
 * Semantic internal spacing for every component. Consumes --space-* from
 * responsive-spacing.css — never hardcode px.
 *
 * Load order: responsive-spacing → breakpoint → margin-system → padding-system
 */

:root,
[data-theme] {
  --padding-transition:
    padding var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    padding-block var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    padding-inline var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease);

  /* Density-aware semantic padding roles */
  --padding-none: var(--space-0);
  --padding-compact-x: var(--space-2);
  --padding-compact-y: var(--space-1-5);
  --padding-comfortable-x: var(--space-4);
  --padding-comfortable-y: var(--space-3);
  --padding-spacious-x: var(--space-6);
  --padding-spacious-y: var(--space-5);

  --padding-hero-x: var(--space-page-x);
  --padding-hero-y: var(--space-section-y);
  --padding-modal: var(--space-modal-padding);
  --padding-card: var(--space-card-padding);
  --padding-dashboard-x: var(--space-page-x);
  --padding-dashboard-y: var(--space-6);
  --padding-table-cell-x: var(--space-table-cell-x);
  --padding-table-cell-y: var(--space-table-cell-y);
  --padding-form-field-x: var(--space-control-x);
  --padding-form-field-y: var(--space-control-y);
  --padding-nav-x: var(--space-nav-item-x);
  --padding-nav-y: var(--space-nav-item-y);
  --padding-button-x: var(--space-control-x);
  --padding-button-y: var(--space-control-y);
  --padding-sheet: var(--space-modal-padding);
  --padding-input-x: var(--space-control-x);
  --padding-input-y: var(--space-control-y);
  --padding-container: var(--container-padding, var(--space-page-x));
  --padding-section-y: var(--space-section-y);
}

@media (min-width: 768px) {
  :root {
    --padding-comfortable-x: var(--space-5);
    --padding-comfortable-y: var(--space-4);
    --padding-spacious-x: var(--space-8);
    --padding-spacious-y: var(--space-6);
    --padding-dashboard-y: var(--space-8);
  }
}

@media (min-width: 1024px) {
  :root {
    --padding-spacious-x: var(--space-10);
    --padding-spacious-y: var(--space-8);
    --padding-dashboard-y: var(--space-10);
  }
}

[data-density="compact"] {
  --padding-compact-x: var(--space-1-5);
  --padding-compact-y: var(--space-1);
  --padding-comfortable-x: var(--space-3);
  --padding-comfortable-y: var(--space-2);
  --padding-spacious-x: var(--space-4);
  --padding-spacious-y: var(--space-3);
  --padding-dashboard-y: var(--space-4);
  --padding-card: var(--space-card-padding);
  --padding-modal: var(--space-modal-padding);
}

[data-density="spacious"] {
  --padding-compact-x: var(--space-3);
  --padding-compact-y: var(--space-2);
  --padding-comfortable-x: var(--space-5);
  --padding-comfortable-y: var(--space-4);
  --padding-spacious-x: var(--space-8);
  --padding-spacious-y: var(--space-6);
  --padding-dashboard-y: var(--space-8);
}

@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) {
    --padding-transition: none;
  }
}

html[data-motion="reduce"] {
  --padding-transition: none;
}

.dk-p-motion,
.dk-padding-motion {
  transition: var(--padding-transition);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Semantic presets
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-p-none { padding: var(--padding-none); }

.dk-p-compact {
  padding-inline: var(--padding-compact-x);
  padding-block: var(--padding-compact-y);
}
.dk-p-comfortable {
  padding-inline: var(--padding-comfortable-x);
  padding-block: var(--padding-comfortable-y);
}
.dk-p-spacious {
  padding-inline: var(--padding-spacious-x);
  padding-block: var(--padding-spacious-y);
}

.dk-p-hero {
  padding-inline: var(--padding-hero-x);
  padding-block: var(--padding-hero-y);
}
.dk-p-hero-x { padding-inline: var(--padding-hero-x); }
.dk-p-hero-y { padding-block: var(--padding-hero-y); }

.dk-p-modal { padding: var(--padding-modal); }
.dk-p-card { padding: var(--padding-card); }
.dk-p-sheet { padding: var(--padding-sheet); }

.dk-p-dashboard {
  padding-inline: var(--padding-dashboard-x);
  padding-block: var(--padding-dashboard-y);
}

.dk-p-table-cell {
  padding-inline: var(--padding-table-cell-x);
  padding-block: var(--padding-table-cell-y);
}
.dk-p-table-header {
  padding-inline: var(--padding-table-cell-x);
  padding-block: var(--space-table-header-y, var(--padding-table-cell-y));
}

.dk-p-form-field {
  padding-inline: var(--padding-form-field-x);
  padding-block: var(--padding-form-field-y);
}
.dk-p-input {
  padding-inline: var(--padding-input-x);
  padding-block: var(--padding-input-y);
}
.dk-p-button {
  padding-inline: var(--padding-button-x);
  padding-block: var(--padding-button-y);
}

.dk-p-nav {
  padding-inline: var(--padding-nav-x);
  padding-block: var(--padding-nav-y);
}
.dk-p-nav-x { padding-inline: var(--padding-nav-x); }
.dk-p-nav-y { padding-block: var(--padding-nav-y); }

.dk-p-container { padding-inline: var(--padding-container); }
.dk-p-section { padding-block: var(--padding-section-y); }
.dk-p-page {
  padding-inline: var(--space-page-x);
  padding-block: var(--space-page-y);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Safe-area aware padding
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-p-safe {
  padding-top: max(var(--space-0), env(safe-area-inset-top, 0px));
  padding-right: max(var(--space-0), env(safe-area-inset-right, 0px));
  padding-bottom: max(var(--space-0), env(safe-area-inset-bottom, 0px));
  padding-left: max(var(--space-0), env(safe-area-inset-left, 0px));
}
.dk-p-safe-t { padding-block-start: max(var(--space-0), env(safe-area-inset-top, 0px)); }
.dk-p-safe-b { padding-block-end: max(var(--space-0), env(safe-area-inset-bottom, 0px)); }
.dk-p-safe-s { padding-inline-start: max(var(--space-0), env(safe-area-inset-left, 0px)); }
.dk-p-safe-e { padding-inline-end: max(var(--space-0), env(safe-area-inset-right, 0px)); }
.dk-p-safe-x {
  padding-inline-start: max(var(--space-0), env(safe-area-inset-left, 0px));
  padding-inline-end: max(var(--space-0), env(safe-area-inset-right, 0px));
}
.dk-p-safe-y {
  padding-block-start: max(var(--space-0), env(safe-area-inset-top, 0px));
  padding-block-end: max(var(--space-0), env(safe-area-inset-bottom, 0px));
}
.dk-p-safe-page {
  padding-inline-start: max(var(--space-page-x), env(safe-area-inset-left, 0px));
  padding-inline-end: max(var(--space-page-x), env(safe-area-inset-right, 0px));
  padding-block-start: max(var(--space-page-y), env(safe-area-inset-top, 0px));
  padding-block-end: max(var(--space-page-y), env(safe-area-inset-bottom, 0px));
}
.dk-p-safe-nav {
  padding-inline: var(--padding-nav-x);
  padding-block-start: var(--padding-nav-y);
  padding-block-end: max(var(--padding-nav-y), env(safe-area-inset-bottom, 0px));
}

/* Combine preset + safe insets */
.dk-p-card.dk-p-safe-x,
.dk-p-with-safe-x {
  padding-inline-start: max(var(--padding-card, var(--space-4)), env(safe-area-inset-left, 0px));
  padding-inline-end: max(var(--padding-card, var(--space-4)), env(safe-area-inset-right, 0px));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layout integration
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-surface-p-card,
.dk-card-p { padding: var(--padding-card); }
.dk-surface-p-modal,
.dk-modal-p { padding: var(--padding-modal); }
.dk-container-p { padding-inline: var(--padding-container); }
.dk-dashboard-p {
  padding-inline: var(--padding-dashboard-x);
  padding-block: var(--padding-dashboard-y);
}
.dk-sheet-p { padding: var(--padding-sheet); }
.dk-table-cell-p {
  padding-inline: var(--padding-table-cell-x);
  padding-block: var(--padding-table-cell-y);
}
.dk-input-p {
  padding-inline: var(--padding-input-x);
  padding-block: var(--padding-input-y);
}
.dk-button-p {
  padding-inline: var(--padding-button-x);
  padding-block: var(--padding-button-y);
}

/* Nested — avoid double page/container padding */
.dk-padding-nested,
.dk-container .dk-p-page,
.dk-container .dk-p-dashboard,
.dk-section .dk-p-page {
  padding-inline: 0;
}

.dk-p-flush { padding: 0; }
.dk-p-flush-x { padding-inline: 0; }
.dk-p-flush-y { padding-block: 0; }

/* Stabilize CLS for async content inside padded boxes */
.dk-p-stable {
  content-visibility: auto;
  contain-intrinsic-size: auto 4rem;
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
    --padding-hero-y: var(--space-24, var(--space-section-y));
    --padding-dashboard-y: var(--space-12);
  }
}
`;

const tailwind = `/**
 * Tailwind v4 bridge — Responsive Padding System
 * Import after responsive-spacing.tailwind.css + padding-system.css
 */

@theme inline {
  --spacing-dk-p-none: var(--padding-none);
  --spacing-dk-p-compact-x: var(--padding-compact-x);
  --spacing-dk-p-compact-y: var(--padding-compact-y);
  --spacing-dk-p-comfortable-x: var(--padding-comfortable-x);
  --spacing-dk-p-comfortable-y: var(--padding-comfortable-y);
  --spacing-dk-p-spacious-x: var(--padding-spacious-x);
  --spacing-dk-p-spacious-y: var(--padding-spacious-y);
  --spacing-dk-p-hero-x: var(--padding-hero-x);
  --spacing-dk-p-hero-y: var(--padding-hero-y);
  --spacing-dk-p-modal: var(--padding-modal);
  --spacing-dk-p-card: var(--padding-card);
  --spacing-dk-p-dashboard-x: var(--padding-dashboard-x);
  --spacing-dk-p-dashboard-y: var(--padding-dashboard-y);
  --spacing-dk-p-table-x: var(--padding-table-cell-x);
  --spacing-dk-p-table-y: var(--padding-table-cell-y);
  --spacing-dk-p-form: var(--padding-form-field-x);
  --spacing-dk-p-nav-x: var(--padding-nav-x);
  --spacing-dk-p-nav-y: var(--padding-nav-y);
  --spacing-dk-p-container: var(--padding-container);
}
`;

const docs = `# Responsive Padding System

DevKit Layer 1 foundation (\`padding-utilities\`, id **22**).

Internal spacing for every component — **semantic tokens**, density-aware, RTL-safe. Never hardcode px.

## Install

\`\`\`bash
npx @roboticela/devkit add padding-utilities
\`\`\`

\`\`\`ts
import "@/styles/responsive-spacing.css";
import "@/styles/padding-system.css";
import { Padding, PaddingCard, paddingClassName } from "@/components/ui/Padding";
\`\`\`

## Presets

| Preset | Role |
|--------|------|
| \`none\` | Zero padding |
| \`compact\` / \`comfortable\` / \`spacious\` | Density rhythm |
| \`hero\` | Landing / hero blocks |
| \`modal\` / \`sheet\` | Dialogs & sheets |
| \`card\` | Cards / surfaces |
| \`dashboard\` | Dashboard chrome |
| \`table-cell\` / \`table-header\` | Tables |
| \`form-field\` / \`input\` / \`button\` | Controls |
| \`nav\` | Navigation items |
| \`container\` / \`section\` / \`page\` | Layout shells |

## Quick start

\`\`\`tsx
<Padding preset="card">…</Padding>
<Padding preset="modal" safe="y" motion>…</Padding>
<Padding px={{ base: 4, md: 6, lg: 8 }} py="3" />
<Padding ps="4" pe="2" /> {/* logical / RTL */}

<div className={paddingClassName({ preset: "table-cell" })} />
\`\`\`

## Density & theme

Inherits \`data-density\` and spacing tokens. Compact / comfortable / spacious (and theme \`[data-theme]\`) retarget \`--padding-*\`.

## Breakpoints

\`dk-md:px-6\`, \`dk-lg:py-8\` (\`sm\`–\`2xl\` aligned with Breakpoint Manager).

## Integration

Use \`dk-card-p\`, \`dk-modal-p\`, \`dk-dashboard-p\`, \`dk-table-cell-p\`, \`dk-input-p\`, \`dk-button-p\` on existing surfaces — or wrap with \`<Padding>\`.
`;

const description =
  "Responsive Padding System — semantic internal spacing with density presets (none→spacious, hero, modal, card, dashboard, table, form, nav), logical sides, safe-area, motion, and layout integration.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

write(join(nextRoot, "styles/padding-system.css"), css);
write(join(nextRoot, "styles/padding-system.tailwind.css"), tailwind);
write(join(nextRoot, "docs/PADDING.md"), docs);

copy(join(nextRoot, "styles/padding-system.css"), join(viteRoot, "src/styles/padding-system.css"));
copy(
  join(nextRoot, "styles/padding-system.tailwind.css"),
  join(viteRoot, "src/styles/padding-system.tailwind.css")
);
copy(join(nextRoot, "docs/PADDING.md"), join(viteRoot, "docs/PADDING.md"));
copy(join(nextRoot, "components/ui/Padding.tsx"), join(viteRoot, "src/components/ui/Padding.tsx"));
copy(
  join(nextRoot, "components/ui/PaddingUtilities.tsx"),
  join(viteRoot, "src/components/ui/PaddingUtilities.tsx")
);

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/padding-system.css", destination: "styles/padding-system.css" },
        {
          source: "files/styles/padding-system.tailwind.css",
          destination: "styles/padding-system.tailwind.css",
        },
        { source: "files/components/ui/Padding.tsx", destination: "components/ui/Padding.tsx" },
        {
          source: "files/components/ui/PaddingUtilities.tsx",
          destination: "components/ui/PaddingUtilities.tsx",
        },
        { source: "files/docs/PADDING.md", destination: "docs/devkit/PADDING.md" },
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
          source: "files/src/styles/padding-system.css",
          destination: "src/styles/padding-system.css",
        },
        {
          source: "files/src/styles/padding-system.tailwind.css",
          destination: "src/styles/padding-system.tailwind.css",
        },
        {
          source: "files/src/components/ui/Padding.tsx",
          destination: "src/components/ui/Padding.tsx",
        },
        {
          source: "files/src/components/ui/PaddingUtilities.tsx",
          destination: "src/components/ui/PaddingUtilities.tsx",
        },
        { source: "files/docs/PADDING.md", destination: "docs/devkit/PADDING.md" },
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
      id: 22,
      name: PKG,
      displayName: "Responsive Padding",
      description,
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "spacing-system", "padding-utilities", "padding", "responsive"],
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
  entry.displayName = "Responsive Padding";
  entry.description = description;
  entry.tags = ["foundation", "spacing-system", "padding-utilities", "padding", "responsive"];
  entry.icon = "move";
  entry.fileKind = "tsx";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Responsive Padding System generated.");
