/**
 * Generates typography React packages + syncs CSS to both templates.
 * Run: node scripts/generate-typography.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMP = join(ROOT, "components");

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function pascal(kebab) {
  return kebab
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

// Copy typography-tokens CSS stack to vite
const nextTok = join(COMP, "typography-tokens/nextjs-compact/v1/files");
const viteTok = join(COMP, "typography-tokens/vite-express-tauri/v1/files");
mkdirSync(join(viteTok, "src/styles"), { recursive: true });
mkdirSync(join(viteTok, "docs"), { recursive: true });
copyFileSync(join(nextTok, "styles/typography-tokens.css"), join(viteTok, "src/styles/typography-tokens.css"));
copyFileSync(
  join(nextTok, "styles/typography-tokens.tailwind.css"),
  join(viteTok, "src/styles/typography-tokens.tailwind.css")
);
copyFileSync(join(nextTok, "docs/TYPOGRAPHY.md"), join(viteTok, "docs/TYPOGRAPHY.md"));

write(
  join(COMP, "typography-tokens/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/typography-tokens.css", destination: "styles/typography-tokens.css" },
        {
          source: "files/styles/typography-tokens.tailwind.css",
          destination: "styles/typography-tokens.tailwind.css",
        },
        { source: "files/docs/TYPOGRAPHY.md", destination: "docs/devkit/TYPOGRAPHY.md" },
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
  join(COMP, "typography-tokens/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/typography-tokens.css", destination: "src/styles/typography-tokens.css" },
        {
          source: "files/src/styles/typography-tokens.tailwind.css",
          destination: "src/styles/typography-tokens.tailwind.css",
        },
        { source: "files/docs/TYPOGRAPHY.md", destination: "docs/devkit/TYPOGRAPHY.md" },
      ],
      injections: [],
      dependencies: { frontend: [] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

const metaTok = {
  id: 2,
  name: "typography-tokens",
  displayName: "Typography Tokens",
  description:
    "Complete typography token system: families, weights, fluid responsive scales, semantic text roles, truncation, localization, and accessibility.",
  category: "foundation",
  group: "design-tokens",
  groupName: "Design Tokens",
  kind: "component",
  layer: 1,
  icon: "type",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "design-tokens", "typography-tokens", "responsive", "a11y"],
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
};
write(join(COMP, "typography-tokens/component.json"), JSON.stringify(metaTok, null, 2) + "\n");

// Companion CSS token packages
const companions = [
  {
    name: "font-family-tokens",
    id: 3,
    file: "font-family-tokens.css",
    css: `/* Font family tokens — provided by typography-tokens; companion aliases */\n:root {\n  --dk-font-sans: var(--font-sans);\n  --dk-font-display: var(--font-display);\n  --dk-font-mono: var(--font-mono);\n  --dk-font-numeric: var(--font-numeric);\n}\n`,
  },
  {
    name: "font-weight-tokens",
    id: 4,
    file: "font-weight-tokens.css",
    css: `/* Font weight tokens — companion aliases for typography-tokens */\n:root {\n  --dk-weight-regular: var(--font-weight-regular);\n  --dk-weight-medium: var(--font-weight-medium);\n  --dk-weight-semibold: var(--font-weight-semibold);\n  --dk-weight-bold: var(--font-weight-bold);\n  --dk-weight-heavy: var(--font-weight-heavy);\n}\n`,
  },
  {
    name: "font-size-tokens",
    id: 5,
    file: "font-size-tokens.css",
    css: `/* Font size tokens — companion aliases for typography-tokens semantic sizes */\n:root {\n  --dk-size-display: var(--text-display-size);\n  --dk-size-hero: var(--text-hero-size);\n  --dk-size-page-title: var(--text-page-title-size);\n  --dk-size-body: var(--text-body-size);\n  --dk-size-caption: var(--text-caption-size);\n}\n`,
  },
  {
    name: "line-height-tokens",
    id: 6,
    file: "line-height-tokens.css",
    css: `/* Line height tokens — companion aliases */\n:root {\n  --dk-leading-tight: var(--leading-tight);\n  --dk-leading-snug: var(--leading-snug);\n  --dk-leading-normal: var(--leading-normal);\n  --dk-leading-relaxed: var(--leading-relaxed);\n  --dk-leading-loose: var(--leading-loose);\n}\n`,
  },
  {
    name: "letter-spacing-tokens",
    id: 7,
    file: "letter-spacing-tokens.css",
    css: `/* Letter spacing tokens — companion aliases */\n:root {\n  --dk-tracking-tighter: var(--tracking-tighter);\n  --dk-tracking-tight: var(--tracking-tight);\n  --dk-tracking-normal: var(--tracking-normal);\n  --dk-tracking-wide: var(--tracking-wide);\n  --dk-tracking-wider: var(--tracking-wider);\n}\n`,
  },
];

for (const c of companions) {
  const next = join(COMP, c.name, "nextjs-compact/v1/files/styles", c.file);
  const vite = join(COMP, c.name, "vite-express-tauri/v1/files/src/styles", c.file);
  write(next, c.css);
  write(vite, c.css);
  write(
    join(COMP, c.name, "component.json"),
    JSON.stringify(
      {
        id: c.id,
        name: c.name,
        displayName: pascal(c.name).replace(/Tokens$/, " Tokens").replace(/([a-z])([A-Z])/g, "$1 $2"),
        description: `${pascal(c.name)} — companion aliases to typography-tokens.`,
        category: "foundation",
        group: "design-tokens",
        groupName: "Design Tokens",
        kind: "component",
        layer: 1,
        icon: "type",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "design-tokens", c.name],
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
        files: [{ source: `files/styles/${c.file}`, destination: `styles/${c.file}` }],
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
        files: [{ source: `files/src/styles/${c.file}`, destination: `src/styles/${c.file}` }],
        injections: [],
        dependencies: { frontend: [] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
}

// React typography system packages
// display-text (id 41) owned by generate-display.mjs — Display Typography
// heading (id 42) owned by generate-heading.mjs — Heading System
// title (id 43) owned by generate-title.mjs — Page Title
// subtitle (id 44) owned by generate-subtitle.mjs — Subtitle System
// body-text (id 45) owned by generate-body.mjs — BodyText System
const components = [
  {
    name: "caption",
    id: 46,
    exportName: "Caption",
    source: `import * as React from "react";

export interface CaptionProps extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "figcaption";
  truncate?: boolean;
}

/** Caption / metadata text. */
export function Caption({
  as = "p",
  truncate = false,
  className = "",
  children,
  ...props
}: CaptionProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={\`dk-type-caption \${truncate ? "dk-truncate" : ""} \${className}\`.trim()} {...props}>
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "label",
    id: 47,
    exportName: "Label",
    source: `import * as React from "react";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  truncate?: boolean;
}

/** Form and UI label text. */
export function Label({ truncate = false, className = "", children, ...props }: LabelProps) {
  return (
    <label className={\`dk-type-label \${truncate ? "dk-truncate" : ""} \${className}\`.trim()} {...props}>
      {children}
    </label>
  );
}
`,
  },
  {
    name: "helper-text",
    id: 48,
    exportName: "HelperText",
    source: `import * as React from "react";

export interface HelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "span";
  error?: boolean;
}

/** Field helper / hint text. */
export function HelperText({
  as = "p",
  error = false,
  className = "",
  children,
  ...props
}: HelperTextProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={\`dk-type-helper \${className}\`.trim()}
      style={error ? { color: "var(--color-danger)" } : undefined}
      {...props}
    >
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "code-text",
    id: 49,
    exportName: "CodeText",
    source: `import * as React from "react";

export interface CodeTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: "code" | "pre" | "span";
}

/** Inline or block code text. */
export function CodeText({ as = "code", className = "", children, ...props }: CodeTextProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={\`dk-type-code \${className}\`.trim()} {...props}>
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "numeric-display",
    id: 50,
    exportName: "NumericDisplay",
    source: `import * as React from "react";

export type NumericDisplayVariant = "numeric" | "stat";

export interface NumericDisplayProps extends React.HTMLAttributes<HTMLElement> {
  variant?: NumericDisplayVariant;
  as?: "span" | "p" | "div";
}

/** Tabular numbers and KPI statistics. */
export function NumericDisplay({
  variant = "numeric",
  as = "span",
  className = "",
  children,
  ...props
}: NumericDisplayProps) {
  const Tag = as as React.ElementType;
  const base = variant === "stat" ? "dk-type-stat" : "dk-type-numeric";
  return (
    <Tag className={\`\${base} \${className}\`.trim()} {...props}>
      {children}
    </Tag>
  );
}
`,
  },
];

for (const c of components) {
  const file = `${c.exportName}.tsx`;
  const nextPath = join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${file}`);
  const vitePath = join(COMP, c.name, `vite-express-tauri/v1/files/src/components/ui/${file}`);
  write(nextPath, c.source);
  write(vitePath, c.source);

  write(
    join(COMP, c.name, "component.json"),
    JSON.stringify(
      {
        id: c.id,
        name: c.name,
        displayName: c.exportName.replace(/([a-z])([A-Z])/g, "$1 $2"),
        description: `${c.exportName} — Typography System component (responsive semantic type).`,
        category: "foundation",
        group: "typography-system",
        groupName: "Typography System",
        kind: "component",
        layer: 1,
        icon: "type",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "typography-system", c.name],
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
        files: [{ source: `files/components/ui/${file}`, destination: `components/ui/${file}` }],
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
        files: [{ source: `files/src/components/ui/${file}`, destination: `src/components/ui/${file}` }],
        injections: [],
        dependencies: { frontend: [] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
}

// Patch registry.json
const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const ready = new Map(
  [
    metaTok,
    ...companions.map((c) => ({
      id: c.id,
      name: c.name,
      displayName: c.name,
      description: `${c.name} companion`,
    })),
    ...components.map((c) => ({
      id: c.id,
      name: c.name,
      displayName: c.exportName,
      description: c.exportName,
    })),
  ].map((x) => [x.name, x])
);

for (const entry of registry.components) {
  if (!ready.has(entry.name) && entry.name !== "typography-tokens" && !companions.find((c) => c.name === entry.name) && !components.find((c) => c.name === entry.name)) {
    continue;
  }
  if (entry.name === "typography-tokens") {
    Object.assign(entry, {
      displayName: metaTok.displayName,
      description: metaTok.description,
      stub: false,
      latestVersion: "1.0.0",
      icon: "type",
      tags: metaTok.tags,
    });
  } else if (companions.find((c) => c.name === entry.name)) {
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.description = `${entry.displayName} — companion to typography-tokens.`;
  } else if (components.find((c) => c.name === entry.name)) {
    const c = components.find((x) => x.name === entry.name);
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.displayName = c.exportName.replace(/([a-z])([A-Z])/g, "$1 $2");
    entry.description = `${c.exportName} — Typography System component (responsive semantic type).`;
    entry.icon = "type";
  }
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Typography system generated.");
