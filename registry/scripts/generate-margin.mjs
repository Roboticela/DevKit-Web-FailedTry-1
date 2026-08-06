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
  { prefix: "mt", props: ["margin-block-start", "margin-top"], auto: false },
  { prefix: "mb", props: ["margin-block-end", "margin-bottom"], auto: false },
  { prefix: "ms", props: ["margin-inline-start"], auto: true },
  { prefix: "me", props: ["margin-inline-end"], auto: true },
  /* Physical — prefer ms/me for RTL; kept for migration */
  { prefix: "ml", props: ["margin-left"], auto: true },
  { prefix: "mr", props: ["margin-right"], auto: true },
];

function utilBlock(prefix, props, scale, important = false) {
  const bang = important ? " !important" : "";
  const value =
    scale === "auto" ? "auto" : scale === "px" ? "1px" : `var(--space-${scale})`;
  return props.map((p) => `  ${p}: ${value}${bang};`).join("\n");
}

function emitUtils(bpPrefix = "") {
  const cls = (p, s) => (bpPrefix ? `.dk-${bpPrefix}\\:${p}-${s}` : `.dk-${p}-${s}`);
  let out = "";
  for (const side of SIDES) {
    for (const scale of SCALES) {
      out += `${cls(side.prefix, scale)} {\n${utilBlock(side.prefix === "mt" || side.prefix === "mb" ? [side.props[0]] : side.props, side.props, scale)}\n}\n`;
    }
    if (side.auto) {
      out += `${cls(side.prefix, "auto")} {\n${utilBlock(side.prefix, side.props, "auto")}\n}\n`;
    }
  }
  /* Negative margins — layout pull (tokenized) */
  for (const side of [
    { prefix: "m", props: ["margin"] },
    { prefix: "mx", props: ["margin-inline"] },
    { prefix: "my", props: ["margin-block"] },
    { prefix: "mt", props: ["margin-block-start"] },
    { prefix: "mb", props: ["margin-block-end"] },
    { prefix: "ms", props: ["margin-inline-start"] },
    { prefix: "me", props: ["margin-inline-end"] },
  ]) {
    for (const scale of [1, 2, 3, 4, 5, 6, 8]) {
      const value = `calc(var(--space-${scale}) * -1)`;
      out += `${cls(`-${side.prefix}`, scale)} {\n`;
      for (const p of side.props) out += `  ${p}: ${value};\n`;
      out += `}\n`;
    }
  }
  return out;
}

function fixUtilBlock() {
  /* rewrite emitUtils more carefully */
}

/* Rebuild emitUtils correctly */
function emitScaleUtils(bpPrefix = "") {
  const name = (prefix, scale) =>
    bpPrefix ? `.dk-${bpPrefix}\\:${prefix}-${scale}` : `.dk-${prefix}-${scale}`;

  let out = "";
  for (const side of SIDES) {
    const props =
      side.prefix === "mt" || side.prefix === "mb"
        ? [side.props[0]] /* logical only for block sides */
        : side.props;

    for (const scale of SCALES) {
      out += `${name(side.prefix, scale)} {\n`;
      for (const p of props) out += `  ${p}: var(--space-${scale});\n`;
      out += `}\n`;
    }
    if (side.auto) {
      out += `${name(side.prefix, "auto")} {\n`;
      for (const p of props) out += `  ${p}: auto;\n`;
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

/* ═══════════════════════════════════════════════════════════════════════════
   Semantic margin roles (inherit responsive + density from spacing tokens)
   ═══════════════════════════════════════════════════════════════════════════ */

:root,
[data-theme] {
  --margin-transition:
    margin var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    margin-block var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease),
    margin-inline var(--motion-duration-normal, 200ms) var(--motion-ease-standard, ease);

  /* Role → token bridges */
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

/* ═══════════════════════════════════════════════════════════════════════════
   Semantic presets
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* First-child reset for semantic stacks */
.dk-m-stack-flow > :first-child,
.dk-m-form-flow > :first-child,
.dk-m-card-flow > :first-child {
  margin-block-start: 0;
}

.dk-m-stack-flow > * + * { margin-block-start: var(--margin-stack); margin-block-end: 0; }
.dk-m-form-flow > * + * { margin-block-start: var(--margin-form); margin-block-end: 0; }
.dk-m-card-flow > * + * { margin-block-start: var(--margin-card); margin-block-end: 0; }
.dk-m-section-flow > * + * { margin-block-start: var(--margin-section-gap); margin-block-end: 0; }

/* ═══════════════════════════════════════════════════════════════════════════
   Adjacent margin collapse (flex/grid — native collapse does not apply)
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-margin-collapse > * + * {
  margin-block-start: 0;
}

.dk-margin-collapse-x > * + * {
  margin-inline-start: 0;
}

/**
 * Keep the larger of adjacent block margins (approximation of CSS margin collapse).
 * Children should set --dk-m-end on themselves when custom; default uses stack gap.
 */
.dk-margin-collapse-max > * + * {
  margin-block-start: max(
    var(--dk-m-start, var(--margin-stack)),
    var(--dk-m-prev-end, 0px)
  );
}

/* Nested layouts — dampen outer page margins inside containers */
.dk-margin-nested,
.dk-container .dk-m-page,
.dk-section .dk-m-page {
  margin-inline: 0;
}

.dk-margin-nested > .dk-m-section:first-child,
.dk-container > .dk-m-section:first-child {
  margin-block-start: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Safe-area aware margins
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* ═══════════════════════════════════════════════════════════════════════════
   Layout integration hooks
   ═══════════════════════════════════════════════════════════════════════════ */

.dk-m-gutter { margin: var(--grid-gutter, var(--space-4)); }
.dk-m-gutter-x { margin-inline: var(--grid-gutter, var(--space-4)); }
.dk-m-gutter-y { margin-block: var(--grid-gutter, var(--space-4)); }

.dk-flex-item-m > * + *,
.dk-stack-m > * + * {
  margin-block-start: var(--margin-stack);
}

.dk-inline-m > * + * {
  margin-inline-start: var(--margin-inline);
}

/* Stabilize CLS — reserve margin box during font/async swaps when flagged */
.dk-m-stable {
  content-visibility: auto;
  contain-intrinsic-size: auto 1lh;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Scale utilities (base)
   ═══════════════════════════════════════════════════════════════════════════ */

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

/* Semantic responsive page/section already via tokens — add ultrawide nudge */
css += `
@media (min-width: 1440px) {
  :root {
    --margin-section: var(--space-24, var(--space-section-y));
  }
}

/* Breakpoint-manager synced helpers (optional; works after Provider) */
html[data-bp="xs"] .dk-bp-only-m-page { margin-inline: var(--space-4); }
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

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

write(join(nextRoot, "styles/margin-system.css"), css);
write(join(nextRoot, "styles/margin-system.tailwind.css"), tailwind);

const marginTsx = `import * as React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════════ */

export type MarginScale =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 8
  | 10
  | 12
  | 16
  | 20
  | 24
  | "auto";

export type MarginPreset =
  | "page"
  | "page-x"
  | "page-y"
  | "section"
  | "section-gap"
  | "container"
  | "card"
  | "form"
  | "form-field"
  | "form-section"
  | "modal"
  | "table"
  | "nav"
  | "nav-section"
  | "stack"
  | "inline"
  | "control"
  | "type"
  | "type-heading"
  | "gutter"
  | "gutter-x"
  | "gutter-y";

export type MarginBreakpoint = "base" | "sm" | "md" | "lg" | "xl" | "2xl";
export type ResponsiveMargin<T> = T | (Partial<Record<Exclude<MarginBreakpoint, "base">, T>> & { base?: T });

export type MarginSafeArea = boolean | "t" | "b" | "s" | "e" | "x" | "y" | "page-x" | "page-y";

export type MarginCollapse = boolean | "x" | "y" | "max";

export interface MarginProps extends React.HTMLAttributes<HTMLElement> {
  /** Semantic role — preferred over raw scale */
  preset?: MarginPreset;
  /** All sides */
  m?: ResponsiveMargin<MarginScale>;
  /** Inline (logical left+right) */
  mx?: ResponsiveMargin<MarginScale>;
  /** Block (top+bottom) */
  my?: ResponsiveMargin<MarginScale>;
  /** Block start */
  mt?: ResponsiveMargin<MarginScale>;
  /** Block end */
  mb?: ResponsiveMargin<MarginScale>;
  /** Inline start (RTL-aware) */
  ms?: ResponsiveMargin<MarginScale>;
  /** Inline end (RTL-aware) */
  me?: ResponsiveMargin<MarginScale>;
  /** @deprecated Prefer ms — physical left */
  ml?: ResponsiveMargin<MarginScale>;
  /** @deprecated Prefer me — physical right */
  mr?: ResponsiveMargin<MarginScale>;
  /** Safe-area aware margins */
  safe?: MarginSafeArea;
  /** Collapse adjacent margins in flex/grid children */
  collapse?: MarginCollapse;
  /** Flow helpers: stack / form / card / section sibling rhythm */
  flow?: "stack" | "form" | "card" | "section";
  /** Animate margin changes (honors reduced motion) */
  motion?: boolean;
  /** Nested context — zeroes page-x inside containers */
  nested?: boolean;
  /** Stabilize intrinsic size to reduce CLS */
  stable?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
  children?: React.ReactNode;
}

type ResponsiveMap<T> = Partial<Record<Exclude<MarginBreakpoint, "base">, T>> & { base?: T };

function isResponsiveObject<T>(value: ResponsiveMargin<T> | undefined): value is ResponsiveMap<T> {
  return value != null && typeof value === "object";
}

function scaleClass(prefix: string, scale: MarginScale, bp?: string): string {
  const key = scale === "auto" ? "auto" : String(scale);
  if (bp && bp !== "base") return \`dk-\${bp}:\${prefix}-\${key}\`;
  return \`dk-\${prefix}-\${key}\`;
}

function responsiveClasses(
  prefix: string,
  value: ResponsiveMargin<MarginScale> | undefined
): string[] {
  if (value == null) return [];
  if (!isResponsiveObject(value)) return [scaleClass(prefix, value)];
  const out: string[] = [];
  if (value.base != null) out.push(scaleClass(prefix, value.base));
  for (const bp of ["sm", "md", "lg", "xl", "2xl"] as const) {
    if (value[bp] != null) out.push(scaleClass(prefix, value[bp]!, bp));
  }
  return out;
}

const PRESET_CLASS: Record<MarginPreset, string> = {
  page: "dk-m-page",
  "page-x": "dk-m-page-x",
  "page-y": "dk-m-page-y",
  section: "dk-m-section",
  "section-gap": "dk-m-section-gap",
  container: "dk-m-container",
  card: "dk-m-card",
  form: "dk-m-form",
  "form-field": "dk-m-form-field",
  "form-section": "dk-m-form-section",
  modal: "dk-m-modal",
  table: "dk-m-table",
  nav: "dk-m-nav",
  "nav-section": "dk-m-nav-section",
  stack: "dk-m-stack",
  inline: "dk-m-inline",
  control: "dk-m-control",
  type: "dk-m-type",
  "type-heading": "dk-m-type-heading",
  gutter: "dk-m-gutter",
  "gutter-x": "dk-m-gutter-x",
  "gutter-y": "dk-m-gutter-y",
};

const SAFE_CLASS: Record<Exclude<MarginSafeArea, boolean>, string> = {
  t: "dk-m-safe-t",
  b: "dk-m-safe-b",
  s: "dk-m-safe-s",
  e: "dk-m-safe-e",
  x: "dk-m-safe-x",
  y: "dk-m-safe-y",
  "page-x": "dk-m-safe-page-x",
  "page-y": "dk-m-safe-page-y",
};

const FLOW_CLASS = {
  stack: "dk-m-stack-flow",
  form: "dk-m-form-flow",
  card: "dk-m-card-flow",
  section: "dk-m-section-flow",
} as const;

/** Tokenized margin box — never pass raw px. */
export function Margin({
  preset,
  m,
  mx,
  my,
  mt,
  mb,
  ms,
  me,
  ml,
  mr,
  safe,
  collapse,
  flow,
  motion = false,
  nested = false,
  stable = false,
  as,
  className,
  style,
  children,
  ...rest
}: MarginProps) {
  const Tag = (as || "div") as React.ElementType;

  const classes = [
    preset ? PRESET_CLASS[preset] : null,
    ...responsiveClasses("m", m),
    ...responsiveClasses("mx", mx),
    ...responsiveClasses("my", my),
    ...responsiveClasses("mt", mt),
    ...responsiveClasses("mb", mb),
    ...responsiveClasses("ms", ms),
    ...responsiveClasses("me", me),
    ...responsiveClasses("ml", ml),
    ...responsiveClasses("mr", mr),
    safe === true ? "dk-m-safe" : safe ? SAFE_CLASS[safe] : null,
    collapse === true || collapse === "y" ? "dk-margin-collapse" : null,
    collapse === "x" ? "dk-margin-collapse-x" : null,
    collapse === "max" ? "dk-margin-collapse-max" : null,
    flow ? FLOW_CLASS[flow] : null,
    motion ? "dk-m-motion" : null,
    nested ? "dk-margin-nested" : null,
    stable ? "dk-m-stable" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag className={classes} style={style} data-dk-margin={preset || "custom"} {...rest}>
      {children}
    </Tag>
  );
}

export const MarginUtilities = Margin;

function presetOf(preset: MarginPreset) {
  return function MarginPresetComponent(props: Omit<MarginProps, "preset">) {
    return <Margin preset={preset} {...props} />;
  };
}

export const MarginPage = presetOf("page");
export const MarginSection = presetOf("section");
export const MarginCard = presetOf("card");
export const MarginForm = presetOf("form");
export const MarginModal = presetOf("modal");
export const MarginStack = presetOf("stack");
export const MarginInline = presetOf("inline");

/** Utility: build className string without a wrapper element */
export function marginClassName(props: Omit<MarginProps, "as" | "children" | "style">): string {
  const {
    preset,
    m,
    mx,
    my,
    mt,
    mb,
    ms,
    me,
    ml,
    mr,
    safe,
    collapse,
    flow,
    motion,
    nested,
    stable,
    className,
  } = props;
  return [
    preset ? PRESET_CLASS[preset] : null,
    ...responsiveClasses("m", m),
    ...responsiveClasses("mx", mx),
    ...responsiveClasses("my", my),
    ...responsiveClasses("mt", mt),
    ...responsiveClasses("mb", mb),
    ...responsiveClasses("ms", ms),
    ...responsiveClasses("me", me),
    ...responsiveClasses("ml", ml),
    ...responsiveClasses("mr", mr),
    safe === true ? "dk-m-safe" : safe ? SAFE_CLASS[safe] : null,
    collapse === true || collapse === "y" ? "dk-margin-collapse" : null,
    collapse === "x" ? "dk-margin-collapse-x" : null,
    collapse === "max" ? "dk-margin-collapse-max" : null,
    flow ? FLOW_CLASS[flow] : null,
    motion ? "dk-m-motion" : null,
    nested ? "dk-margin-nested" : null,
    stable ? "dk-m-stable" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}
`;

/* Fix the template literal escaping - I used \\` incorrectly in the string.
   Write Margin.tsx as a separate proper file instead. */

write(join(nextRoot, "styles/margin-system.css"), css);
write(join(nextRoot, "styles/margin-system.tailwind.css"), tailwind);

const docs = `# Responsive Margin System

DevKit Layer 1 foundation (\`margin-utilities\`, id **21**).

Eliminates hardcoded margins. Every margin is a **semantic token** or **scale step** from \`responsive-spacing\`, adapted by breakpoint and density.

## Install

\`\`\`bash
npx @roboticela/devkit add margin-utilities
\`\`\`

\`\`\`ts
import "@/styles/responsive-spacing.css"; // tokens + density
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

<div className={marginClassName({ preset: "form-field", mt: 2 })} />
\`\`\`

## Density

Inherits \`data-density\` from \`DensityProvider\` (\`compact\` | \`comfortable\` | \`spacious\`) via \`--margin-*\` → \`--space-*\` bridges.

## Breakpoints

Mobile-first classes: \`dk-md:mt-8\`, \`dk-lg:mx-auto\`, … (\`sm\` 480 · \`md\` 768 · \`lg\` 1024 · \`xl\` 1280 · \`2xl\` 1440).

## Tailwind

\`\`\`css
@import "@/styles/margin-system.tailwind.css";
\`\`\`

Use \`m-dk-m-section\`, \`mx-dk-m-page-x\`, etc.

## Integration

Works with Grid, Flex, Stack, Container, Cards, Modals, Forms, Tables via shared \`--space-*\` / \`--margin-*\` tokens and helpers (\`.dk-m-gutter\`, \`.dk-m-stack-flow\`, \`.dk-margin-collapse\`).
`;

write(join(nextRoot, "docs/MARGIN.md"), docs);

console.log("CSS + docs written; writing Margin.tsx via follow-up...");
