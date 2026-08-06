/**
 * Generate Alignment System (alignment-utilities id: 27).
 * Run: node scripts/generate-align.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "alignment-utilities";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const BPS = [
  { key: "sm", min: 480 },
  { key: "md", min: 768 },
  { key: "lg", min: 1024 },
  { key: "xl", min: 1280 },
  { key: "2xl", min: 1440 },
];

const ALIGN_ITEMS = ["start", "center", "end", "stretch", "baseline"];
const JUSTIFY = ["start", "center", "end", "between", "around", "evenly", "stretch"];
const PLACE = ["start", "center", "end", "stretch"];

function emitResponsive(bpPrefix) {
  const p = (cls) => (bpPrefix ? `.dk-${bpPrefix}\\:${cls.slice(4)}` : cls);
  let out = "";

  for (const v of ALIGN_ITEMS) {
    const cssVal = v === "start" || v === "end" ? v : v;
    out += `${p(`.dk-items-${v}`)} { align-items: ${cssVal}; }\n`;
    out += `${p(`.dk-content-${v === "baseline" ? "baseline" : v}`)} { align-content: ${v === "between" ? "space-between" : v}; }\n`;
    out += `${p(`.dk-self-${v}`)} { align-self: ${cssVal}; }\n`;
  }

  for (const v of JUSTIFY) {
    const map = {
      start: "start",
      center: "center",
      end: "end",
      between: "space-between",
      around: "space-around",
      evenly: "space-evenly",
      stretch: "stretch",
    };
    out += `${p(`.dk-justify-${v}`)} { justify-content: ${map[v]}; }\n`;
    out += `${p(`.dk-justify-items-${v === "between" || v === "around" || v === "evenly" ? "center" : v}`)} { justify-items: ${v === "between" || v === "around" || v === "evenly" ? "center" : v}; }\n`;
    if (PLACE.includes(v) || v === "stretch") {
      out += `${p(`.dk-justify-self-${v === "between" ? "center" : v}`)} { justify-self: ${v === "between" || v === "around" || v === "evenly" ? "center" : v}; }\n`;
    }
  }

  for (const v of PLACE) {
    out += `${p(`.dk-place-items-${v}`)} { place-items: ${v}; }\n`;
    out += `${p(`.dk-place-content-${v}`)} { place-content: ${v}; }\n`;
    out += `${p(`.dk-place-self-${v}`)} { place-self: ${v}; }\n`;
  }

  /* Legacy aliases matching responsive-spacing */
  out += `${p(`.dk-align-start`)} { align-items: start; }\n`;
  out += `${p(`.dk-align-center`)} { align-items: center; }\n`;
  out += `${p(`.dk-align-end`)} { align-items: end; }\n`;
  out += `${p(`.dk-align-stretch`)} { align-items: stretch; }\n`;
  out += `${p(`.dk-align-baseline`)} { align-items: baseline; }\n`;
  out += `${p(`.dk-distribute-start`)} { justify-content: start; }\n`;
  out += `${p(`.dk-distribute-center`)} { justify-content: center; }\n`;
  out += `${p(`.dk-distribute-end`)} { justify-content: end; }\n`;
  out += `${p(`.dk-distribute-between`)} { justify-content: space-between; }\n`;
  out += `${p(`.dk-distribute-around`)} { justify-content: space-around; }\n`;
  out += `${p(`.dk-distribute-evenly`)} { justify-content: space-evenly; }\n`;

  return out;
}

/* Fix align-content emission - don't emit baseline for content with wrong map.
   Simplify emitResponsive for content. */
function emitResponsiveClean(bpPrefix = "") {
  const n = (name) => (bpPrefix ? `.dk-${bpPrefix}\\:${name}` : `.dk-${name}`);
  let out = "";

  const items = [
    ["start", "start"],
    ["center", "center"],
    ["end", "end"],
    ["stretch", "stretch"],
    ["baseline", "baseline"],
  ];
  for (const [k, v] of items) {
    out += `${n(`items-${k}`)} { align-items: ${v}; }\n`;
    out += `${n(`self-${k}`)} { align-self: ${v}; }\n`;
    out += `${n(`align-${k}`)} { align-items: ${v}; }\n`;
  }

  const contents = [
    ["start", "start"],
    ["center", "center"],
    ["end", "end"],
    ["stretch", "stretch"],
    ["between", "space-between"],
    ["around", "space-around"],
    ["evenly", "space-evenly"],
    ["baseline", "baseline"],
  ];
  for (const [k, v] of contents) {
    out += `${n(`content-${k}`)} { align-content: ${v}; }\n`;
  }

  const justifies = [
    ["start", "start"],
    ["center", "center"],
    ["end", "end"],
    ["between", "space-between"],
    ["around", "space-around"],
    ["evenly", "space-evenly"],
    ["stretch", "stretch"],
  ];
  for (const [k, v] of justifies) {
    out += `${n(`justify-${k}`)} { justify-content: ${v}; }\n`;
    out += `${n(`distribute-${k}`)} { justify-content: ${v}; }\n`;
  }

  for (const [k, v] of [
    ["start", "start"],
    ["center", "center"],
    ["end", "end"],
    ["stretch", "stretch"],
  ]) {
    out += `${n(`justify-items-${k}`)} { justify-items: ${v}; }\n`;
    out += `${n(`justify-self-${k}`)} { justify-self: ${v}; }\n`;
    out += `${n(`place-items-${k}`)} { place-items: ${v}; }\n`;
    out += `${n(`place-content-${k}`)} { place-content: ${v}; }\n`;
    out += `${n(`place-self-${k}`)} { place-self: ${v}; }\n`;
  }

  /* text / inline alignment — logical */
  out += `${n("text-start")} { text-align: start; }\n`;
  out += `${n("text-center")} { text-align: center; }\n`;
  out += `${n("text-end")} { text-align: end; }\n`;

  return out;
}

const header = `/**
 * DevKit Alignment System — Layer 1 Foundation (id: 27 · alignment-utilities)
 *
 * Universal alignment for any component in any layout.
 * Logical start/end (RTL-safe). Pairs with Flex, Stack, Grid, Gap.
 *
 * Load after: spacing → gap → alignment-system
 */

:root,
[data-theme] {
  --align-transition:
    align-items var(--motion-duration-fast, 120ms) var(--motion-ease-standard, ease),
    align-self var(--motion-duration-fast, 120ms) var(--motion-ease-standard, ease),
    justify-content var(--motion-duration-fast, 120ms) var(--motion-ease-standard, ease),
    place-items var(--motion-duration-fast, 120ms) var(--motion-ease-standard, ease);
}

@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) {
    --align-transition: none;
  }
}

html[data-motion="reduce"] {
  --align-transition: none;
}

.dk-align-motion,
.dk-align-system {
  transition: var(--align-transition);
}

/* Display hosts so alignment applies without Flex/Grid parent */
.dk-align-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.dk-align-col {
  display: flex;
  flex-direction: column;
}
.dk-align-grid {
  display: grid;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Named presets (cross-axis + main-axis combos)
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-align-preset-start {
  align-items: start;
  justify-content: start;
  align-content: start;
}
.dk-align-preset-center {
  align-items: center;
  justify-content: center;
  align-content: center;
  place-items: center;
}
.dk-align-preset-end {
  align-items: end;
  justify-content: end;
  align-content: end;
}
.dk-align-preset-stretch {
  align-items: stretch;
  justify-content: stretch;
  align-content: stretch;
}
.dk-align-preset-between {
  align-items: center;
  justify-content: space-between;
}
.dk-align-preset-around {
  align-items: center;
  justify-content: space-around;
}
.dk-align-preset-evenly {
  align-items: center;
  justify-content: space-evenly;
}
.dk-align-preset-baseline {
  align-items: baseline;
  justify-content: start;
}

/* Safe alignment — prefer visible area when overflowing (CSS safe keyword) */
.dk-align-preset-safe,
.dk-align-safe-center {
  align-items: safe center;
  justify-content: safe center;
  place-items: safe center;
}
.dk-align-safe-start {
  align-items: safe start;
  justify-content: safe start;
}
.dk-align-safe-end {
  align-items: safe end;
  justify-content: safe end;
}

/* Adaptive — center on small, start/between on larger (Apple-like chrome) */
.dk-align-preset-adaptive {
  align-items: center;
  justify-content: center;
}
@media (min-width: 768px) {
  .dk-align-preset-adaptive {
    align-items: center;
    justify-content: space-between;
  }
}
@media (min-width: 1024px) {
  .dk-align-preset-adaptive {
    align-items: stretch;
    justify-content: space-between;
  }
}

/* Nested — children don't fight parent stretch */
.dk-align-nested > * {
  align-self: auto;
  justify-self: auto;
  min-width: 0;
  min-height: 0;
}

/* Absolute center helper (single child / overlay) */
.dk-align-absolute-center {
  display: grid;
  place-items: center;
}
.dk-align-absolute-center > * {
  grid-area: 1 / 1;
}

/* Screen-reader friendly: visual center without breaking reading order */
.dk-align-sr-safe {
  /* keep DOM order; only visual placement */
  justify-content: safe center;
  align-items: safe center;
}

`;

let css = header + emitResponsiveClean();
for (const bp of BPS) {
  css += `\n@media (min-width: ${bp.min}px) {\n`;
  css += emitResponsiveClean(bp.key)
    .split("\n")
    .map((line) => (line ? `  ${line}` : line))
    .join("\n");
  css += `}\n`;
}

const tailwind = `/**
 * Tailwind v4 bridge — Alignment System
 */

@theme inline {
  --align-dk-start: start;
  --align-dk-center: center;
  --align-dk-end: end;
  --align-dk-stretch: stretch;
  --align-dk-baseline: baseline;
}
`;

const docs = `# Alignment System

DevKit Layer 1 foundation (\`alignment-utilities\`, id **27**).

Align any component in any layout — logical **start/end** (RTL-safe), distribution, self/content/place, responsive overrides.

## Install

\`\`\`bash
npx @roboticela/devkit add alignment-utilities
\`\`\`

\`\`\`ts
import "@/styles/alignment-system.css";
import { Align, AlignCenter, alignClassName } from "@/components/ui/Align";
\`\`\`

## Presets

\`start\` · \`center\` · \`end\` · \`stretch\` · \`between\` · \`around\` · \`evenly\` · \`baseline\` · \`safe\` · \`adaptive\`

## Quick start

\`\`\`tsx
<Align preset="center">…</Align>
<Align preset="between" display="row">Nav · Actions</Align>
<Align items="baseline" justify="start" />
<Align self="center" /> {/* self-alignment on child */}
<Align items={{ base: "center", md: "stretch" }} justify={{ base: "center", md: "between" }} />
<Align preset="safe" motion />
\`\`\`

## Axes

| Prop | CSS |
|------|-----|
| \`items\` | align-items (cross-axis) |
| \`justify\` / \`distribute\` | justify-content (main-axis) |
| \`content\` | align-content (multi-line) |
| \`self\` | align-self |
| \`place\` | place-items |
| \`text\` | text-align (logical) |

## Nested · a11y · RTL

- \`nested\` resets child self-alignment + \`min-size: 0\`
- Prefer \`safe\` / \`safe center\` so overflow stays visible
- Use \`start\`/\`end\` — never physical left/right

## Integration

Works on Flex, Stack, Grid hosts, or wrap with \`display="row|col|grid"\`. Use \`alignClassName({ preset: "between", display: false })\` on existing layout components.
`;

const description =
  "Alignment System — universal horizontal/vertical/baseline/self/content alignment with distribution (between/around/evenly), safe & adaptive presets, RTL-safe logical sides, responsive maps, and motion.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

write(join(nextRoot, "styles/alignment-system.css"), css);
write(join(nextRoot, "styles/alignment-system.tailwind.css"), tailwind);
write(join(nextRoot, "docs/ALIGNMENT.md"), docs);

copy(join(nextRoot, "styles/alignment-system.css"), join(viteRoot, "src/styles/alignment-system.css"));
copy(
  join(nextRoot, "styles/alignment-system.tailwind.css"),
  join(viteRoot, "src/styles/alignment-system.tailwind.css")
);
copy(join(nextRoot, "docs/ALIGNMENT.md"), join(viteRoot, "docs/ALIGNMENT.md"));
copy(join(nextRoot, "components/ui/Align.tsx"), join(viteRoot, "src/components/ui/Align.tsx"));
copy(
  join(nextRoot, "components/ui/AlignmentUtilities.tsx"),
  join(viteRoot, "src/components/ui/AlignmentUtilities.tsx")
);

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/alignment-system.css", destination: "styles/alignment-system.css" },
        {
          source: "files/styles/alignment-system.tailwind.css",
          destination: "styles/alignment-system.tailwind.css",
        },
        { source: "files/components/ui/Align.tsx", destination: "components/ui/Align.tsx" },
        {
          source: "files/components/ui/AlignmentUtilities.tsx",
          destination: "components/ui/AlignmentUtilities.tsx",
        },
        { source: "files/docs/ALIGNMENT.md", destination: "docs/devkit/ALIGNMENT.md" },
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
          source: "files/src/styles/alignment-system.css",
          destination: "src/styles/alignment-system.css",
        },
        {
          source: "files/src/styles/alignment-system.tailwind.css",
          destination: "src/styles/alignment-system.tailwind.css",
        },
        { source: "files/src/components/ui/Align.tsx", destination: "src/components/ui/Align.tsx" },
        {
          source: "files/src/components/ui/AlignmentUtilities.tsx",
          destination: "src/components/ui/AlignmentUtilities.tsx",
        },
        { source: "files/docs/ALIGNMENT.md", destination: "docs/devkit/ALIGNMENT.md" },
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
      id: 27,
      name: PKG,
      displayName: "Alignment System",
      description,
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "spacing-system", "alignment-utilities", "alignment", "responsive"],
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

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
for (const entry of registry.components) {
  if (entry.name !== PKG) continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Alignment System";
  entry.description = description;
  entry.tags = ["foundation", "spacing-system", "alignment-utilities", "alignment", "responsive"];
  entry.icon = "move";
  entry.fileKind = "tsx";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Alignment System generated.");
