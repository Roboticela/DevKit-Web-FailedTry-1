/**
 * Generate Gap System (gap-utilities id: 23).
 * Run: node scripts/generate-gap.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "gap-utilities";

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

function emitScaleUtils(bpPrefix = "") {
  const name = (prefix, scale) =>
    bpPrefix ? `.dk-${bpPrefix}\\:${prefix}-${scale}` : `.dk-${prefix}-${scale}`;

  let out = "";
  for (const scale of SCALES) {
    out += `${name("gap", scale)} {\n  gap: var(--space-${scale});\n  --dk-gap: var(--space-${scale});\n}\n`;
    out += `${name("gap-x", scale)} {\n  column-gap: var(--space-${scale});\n  --dk-gap-x: var(--space-${scale});\n}\n`;
    out += `${name("gap-y", scale)} {\n  row-gap: var(--space-${scale});\n  --dk-gap-y: var(--space-${scale});\n}\n`;
  }
  return out;
}

const header = `/**
 * DevKit Gap System — Layer 1 Foundation (id: 23 · gap-utilities)
 *
 * Intelligent spacing between children in Grid, Stack, Flex, Nav, Forms,
 * Tables, Toolbars, Cards, and Lists. Consumes --space-* tokens.
 *
 * Load order: responsive-spacing → breakpoint → margin → padding → gap-system
 */

:root,
[data-theme] {
  --gap-transition:
    gap var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    row-gap var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    column-gap var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease);

  /* Live gap (set by utilities / component) — nested children can inherit */
  --dk-gap: var(--space-stack-gap, var(--space-4));
  --dk-gap-x: var(--dk-gap);
  --dk-gap-y: var(--dk-gap);
  --dk-gap-scale: 1;

  /* Semantic presets */
  --gap-none: 0px;
  --gap-compact: var(--space-2);
  --gap-comfortable: var(--space-4);
  --gap-spacious: var(--space-6);
  --gap-stack: var(--space-stack-gap, var(--space-4));
  --gap-inline: var(--space-inline-gap, var(--space-2));
  --gap-grid: var(--grid-gutter, var(--space-4));
  --gap-grid-tight: var(--grid-gutter-tight, var(--space-3));
  --gap-grid-loose: var(--grid-gutter-loose, var(--space-6));
  --gap-form: var(--space-form-gap, var(--space-4));
  --gap-form-field: var(--space-form-field-gap, var(--space-2));
  --gap-nav: var(--space-nav-gap, var(--space-1));
  --gap-nav-section: var(--space-nav-section-gap, var(--space-4));
  --gap-toolbar: var(--space-2);
  --gap-card: var(--space-card-gap, var(--space-3));
  --gap-list: var(--space-2);
  --gap-table: var(--space-table-gap, var(--space-0));
  --gap-control: var(--space-control-gap, var(--space-2));
  --gap-section: var(--space-section-gap, var(--space-8));

  /* Bridge layout packages to Gap System */
  --stack-gap: var(--dk-gap-y, var(--gap-stack));
  --inline-gap: var(--dk-gap-x, var(--gap-inline));
  --flex-gap: var(--dk-gap, var(--gap-comfortable));
}

@media (min-width: 768px) {
  :root {
    --gap-comfortable: var(--space-5);
    --gap-spacious: var(--space-8);
    --gap-toolbar: var(--space-3);
    --gap-list: var(--space-3);
  }
}

@media (min-width: 1024px) {
  :root {
    --gap-spacious: var(--space-10);
    --gap-section: var(--space-10);
  }
}

[data-density="compact"] {
  --dk-gap-scale: 0.85;
  --gap-compact: var(--space-1-5);
  --gap-comfortable: var(--space-3);
  --gap-spacious: var(--space-4);
  --gap-stack: var(--space-3);
  --gap-inline: var(--space-1-5);
  --gap-grid: var(--space-3);
  --gap-form: var(--space-3);
  --gap-toolbar: var(--space-1-5);
  --gap-card: var(--space-2);
  --gap-list: var(--space-1-5);
  --gap-section: var(--space-6);
}

[data-density="spacious"] {
  --dk-gap-scale: 1.15;
  --gap-compact: var(--space-3);
  --gap-comfortable: var(--space-5);
  --gap-spacious: var(--space-8);
  --gap-stack: var(--space-5);
  --gap-inline: var(--space-3);
  --gap-grid: var(--space-5);
  --gap-form: var(--space-5);
  --gap-toolbar: var(--space-3);
  --gap-card: var(--space-4);
  --gap-list: var(--space-3);
  --gap-section: var(--space-10);
}

@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) {
    --gap-transition: none;
  }
}

html[data-motion="reduce"] {
  --gap-transition: none;
}

.dk-gap-motion,
.dk-gap-system {
  transition: var(--gap-transition);
}

/* Auto-scaling — multiply semantic gap by density scale */
.dk-gap-auto {
  gap: calc(var(--dk-gap) * var(--dk-gap-scale, 1));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Semantic presets
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-gap-none { gap: var(--gap-none); --dk-gap: var(--gap-none); --dk-gap-x: 0px; --dk-gap-y: 0px; }
.dk-gap-compact { gap: var(--gap-compact); --dk-gap: var(--gap-compact); --dk-gap-x: var(--gap-compact); --dk-gap-y: var(--gap-compact); }
.dk-gap-comfortable { gap: var(--gap-comfortable); --dk-gap: var(--gap-comfortable); --dk-gap-x: var(--gap-comfortable); --dk-gap-y: var(--gap-comfortable); }
.dk-gap-spacious { gap: var(--gap-spacious); --dk-gap: var(--gap-spacious); --dk-gap-x: var(--gap-spacious); --dk-gap-y: var(--gap-spacious); }

.dk-gap-stack { row-gap: var(--gap-stack); column-gap: 0; --dk-gap-y: var(--gap-stack); --dk-gap: var(--gap-stack); }
.dk-gap-inline { column-gap: var(--gap-inline); row-gap: 0; --dk-gap-x: var(--gap-inline); --dk-gap: var(--gap-inline); }

.dk-gap-grid { gap: var(--gap-grid); --dk-gap: var(--gap-grid); --dk-gap-x: var(--gap-grid); --dk-gap-y: var(--gap-grid); }
.dk-gap-grid-tight { gap: var(--gap-grid-tight); --dk-gap: var(--gap-grid-tight); }
.dk-gap-grid-loose { gap: var(--gap-grid-loose); --dk-gap: var(--gap-grid-loose); }

.dk-gap-form { gap: var(--gap-form); --dk-gap: var(--gap-form); }
.dk-gap-form-field { gap: var(--gap-form-field); --dk-gap: var(--gap-form-field); }
.dk-gap-nav { gap: var(--gap-nav); --dk-gap: var(--gap-nav); }
.dk-gap-nav-section { gap: var(--gap-nav-section); --dk-gap: var(--gap-nav-section); }
.dk-gap-toolbar { gap: var(--gap-toolbar); --dk-gap: var(--gap-toolbar); --dk-gap-x: var(--gap-toolbar); }
.dk-gap-card { gap: var(--gap-card); --dk-gap: var(--gap-card); }
.dk-gap-list { gap: var(--gap-list); --dk-gap: var(--gap-list); --dk-gap-y: var(--gap-list); }
.dk-gap-table { gap: var(--gap-table); --dk-gap: var(--gap-table); }
.dk-gap-control { gap: var(--gap-control); --dk-gap: var(--gap-control); }
.dk-gap-section { gap: var(--gap-section); --dk-gap: var(--gap-section); --dk-gap-y: var(--gap-section); }

/* Display helpers when wrapping non-flex/grid hosts */
.dk-gap-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--dk-gap, var(--gap-inline));
}
.dk-gap-col {
  display: flex;
  flex-direction: column;
  gap: var(--dk-gap, var(--gap-stack));
}
.dk-gap-grid-flow {
  display: grid;
  gap: var(--dk-gap, var(--gap-grid));
}

/* ═══════════════════════════════════════════════════════════════════════════
   Nested gap inheritance
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-gap-inherit {
  gap: inherit;
  --dk-gap: inherit;
  --dk-gap-x: inherit;
  --dk-gap-y: inherit;
}

.dk-gap-nested {
  --dk-gap: max(0px, calc(var(--dk-gap, var(--gap-comfortable)) * 0.75));
  --dk-gap-x: var(--dk-gap);
  --dk-gap-y: var(--dk-gap);
  gap: var(--dk-gap);
}

.dk-gap-nested-x {
  --dk-gap-x: max(0px, calc(var(--dk-gap-x, var(--gap-inline)) * 0.75));
  column-gap: var(--dk-gap-x);
}

.dk-gap-nested-y {
  --dk-gap-y: max(0px, calc(var(--dk-gap-y, var(--gap-stack)) * 0.75));
  row-gap: var(--dk-gap-y);
}

/* ═══════════════════════════════════════════════════════════════════════════
   Dividers between children
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-gap-divider,
.dk-gap-divider-y {
  --dk-gap-divider-color: var(--color-border-subtle, currentColor);
  --dk-gap-divider-size: 1px;
}

.dk-gap-divider-y > * + * {
  border-block-start: var(--dk-gap-divider-size) solid var(--dk-gap-divider-color);
  padding-block-start: var(--dk-gap-y, var(--dk-gap, var(--gap-stack)));
  margin-block-start: 0;
}

.dk-gap-divider-x > * + * {
  border-inline-start: var(--dk-gap-divider-size) solid var(--dk-gap-divider-color);
  padding-inline-start: var(--dk-gap-x, var(--dk-gap, var(--gap-inline)));
  margin-inline-start: 0;
}

.dk-gap-divider-strong {
  --dk-gap-divider-color: var(--color-border-strong, var(--color-border, currentColor));
}

/* When using CSS gap + divider, prefer gap:0 on axis and padding as spacing */
.dk-gap-divider-y.dk-gap-divider-gapless {
  row-gap: 0;
}
.dk-gap-divider-x.dk-gap-divider-gapless {
  column-gap: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Layout integration hooks
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-stack-gap { gap: var(--gap-stack); --dk-gap: var(--gap-stack); }
.dk-flex-gap-token { gap: var(--flex-gap, var(--dk-gap)); }
.dk-grid-gap-token { gap: var(--gap-grid); --dk-gap: var(--gap-grid); }
.dk-nav-gap { gap: var(--gap-nav); }
.dk-toolbar-gap { gap: var(--gap-toolbar); }
.dk-form-gap { gap: var(--gap-form); }
.dk-card-gap { gap: var(--gap-card); }
.dk-list-gap { gap: var(--gap-list); }

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
/* Responsive semantic auto — scales with viewport */
.dk-gap-responsive {
  gap: var(--gap-compact);
  --dk-gap: var(--gap-compact);
}
@media (min-width: 768px) {
  .dk-gap-responsive {
    gap: var(--gap-comfortable);
    --dk-gap: var(--gap-comfortable);
  }
}
@media (min-width: 1024px) {
  .dk-gap-responsive {
    gap: var(--gap-spacious);
    --dk-gap: var(--gap-spacious);
  }
}
`;

const tailwind = `/**
 * Tailwind v4 bridge — Gap System
 * Import after responsive-spacing.tailwind.css + gap-system.css
 */

@theme inline {
  --spacing-dk-gap-none: var(--gap-none);
  --spacing-dk-gap-compact: var(--gap-compact);
  --spacing-dk-gap-comfortable: var(--gap-comfortable);
  --spacing-dk-gap-spacious: var(--gap-spacious);
  --spacing-dk-gap-stack: var(--gap-stack);
  --spacing-dk-gap-inline: var(--gap-inline);
  --spacing-dk-gap-grid: var(--gap-grid);
  --spacing-dk-gap-form: var(--gap-form);
  --spacing-dk-gap-nav: var(--gap-nav);
  --spacing-dk-gap-toolbar: var(--gap-toolbar);
  --spacing-dk-gap-card: var(--gap-card);
  --spacing-dk-gap-list: var(--gap-list);
  --spacing-dk-gap-section: var(--gap-section);
}
`;

const docs = `# Gap System

DevKit Layer 1 foundation (\`gap-utilities\`, id **23**).

Spacing **between** children — Grid, Stack, Flex, Nav, Forms, Tables, Toolbars, Cards, Lists. Semantic tokens only; no manual margins between siblings.

## Install

\`\`\`bash
npx @roboticela/devkit add gap-utilities
\`\`\`

\`\`\`ts
import "@/styles/responsive-spacing.css";
import "@/styles/gap-system.css";
import { Gap, GapStack, gapClassName } from "@/components/ui/Gap";
\`\`\`

## Presets

\`none\` · \`compact\` · \`comfortable\` · \`spacious\` · \`stack\` · \`inline\` · \`grid\` / \`grid-tight\` / \`grid-loose\` · \`form\` · \`nav\` · \`toolbar\` · \`card\` · \`list\` · \`table\` · \`section\` · \`responsive\`

## Quick start

\`\`\`tsx
<Gap preset="stack">
  <Item /><Item />
</Gap>

<Gap preset="toolbar" divider="x">
  <Btn /><Btn />
</Gap>

<Gap gap={{ base: 2, md: 4, lg: 6 }} gapX="3" gapY="4" motion />
<Gap nested inherit={false}>…</Gap>
\`\`\`

## Nested inheritance

Parent sets \`--dk-gap\`. Children with \`nested\` dampen by 75%; \`inherit\` copies parent gap vars.

## Dividers

\`divider="y"\` | \`"x"\` inserts border + padding between siblings (optional \`strong\`).

## Density

\`data-density\` retargets \`--gap-*\` and \`--dk-gap-scale\` for compact / spacious.

## Integration

Classes: \`.dk-stack-gap\`, \`.dk-grid-gap-token\`, \`.dk-toolbar-gap\`, \`.dk-form-gap\`, \`.dk-card-gap\`, \`.dk-list-gap\`. Bridges \`--stack-gap\`, \`--inline-gap\`, \`--flex-gap\`.
`;

const description =
  "Gap System — intelligent child spacing for Grid/Stack/Flex/Nav/Forms/Tables/Toolbars/Cards/Lists with semantic presets, responsive maps, density, nested inheritance, dividers, and motion.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

write(join(nextRoot, "styles/gap-system.css"), css);
write(join(nextRoot, "styles/gap-system.tailwind.css"), tailwind);
write(join(nextRoot, "docs/GAP.md"), docs);

copy(join(nextRoot, "styles/gap-system.css"), join(viteRoot, "src/styles/gap-system.css"));
copy(join(nextRoot, "styles/gap-system.tailwind.css"), join(viteRoot, "src/styles/gap-system.tailwind.css"));
copy(join(nextRoot, "docs/GAP.md"), join(viteRoot, "docs/GAP.md"));
copy(join(nextRoot, "components/ui/Gap.tsx"), join(viteRoot, "src/components/ui/Gap.tsx"));
copy(join(nextRoot, "components/ui/GapUtilities.tsx"), join(viteRoot, "src/components/ui/GapUtilities.tsx"));

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/gap-system.css", destination: "styles/gap-system.css" },
        { source: "files/styles/gap-system.tailwind.css", destination: "styles/gap-system.tailwind.css" },
        { source: "files/components/ui/Gap.tsx", destination: "components/ui/Gap.tsx" },
        { source: "files/components/ui/GapUtilities.tsx", destination: "components/ui/GapUtilities.tsx" },
        { source: "files/docs/GAP.md", destination: "docs/devkit/GAP.md" },
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
        { source: "files/src/styles/gap-system.css", destination: "src/styles/gap-system.css" },
        { source: "files/src/styles/gap-system.tailwind.css", destination: "src/styles/gap-system.tailwind.css" },
        { source: "files/src/components/ui/Gap.tsx", destination: "src/components/ui/Gap.tsx" },
        { source: "files/src/components/ui/GapUtilities.tsx", destination: "src/components/ui/GapUtilities.tsx" },
        { source: "files/docs/GAP.md", destination: "docs/devkit/GAP.md" },
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
      id: 23,
      name: PKG,
      displayName: "Gap System",
      description,
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "spacing-system", "gap-utilities", "gap", "responsive"],
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
  entry.displayName = "Gap System";
  entry.description = description;
  entry.tags = ["foundation", "spacing-system", "gap-utilities", "gap", "responsive"];
  entry.icon = "move";
  entry.fileKind = "tsx";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Gap System generated.");
