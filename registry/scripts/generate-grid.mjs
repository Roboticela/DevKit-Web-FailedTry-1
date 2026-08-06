/**
 * Sync grid CSS/React packages to both templates and update registry metadata.
 * Run: node scripts/generate-grid.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copyDirFile(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

// Sync responsive-grid assets to vite + manifests
const nextRoot = join(COMP, "responsive-grid/nextjs-compact/v1/files");
const viteRoot = join(COMP, "responsive-grid/vite-express-tauri/v1/files");

copyDirFile(join(nextRoot, "styles/responsive-grid.css"), join(viteRoot, "src/styles/responsive-grid.css"));
copyDirFile(
  join(nextRoot, "styles/responsive-grid.tailwind.css"),
  join(viteRoot, "src/styles/responsive-grid.tailwind.css")
);
copyDirFile(join(nextRoot, "docs/GRID.md"), join(viteRoot, "docs/GRID.md"));
copyDirFile(
  join(nextRoot, "components/ui/ResponsiveGrid.tsx"),
  join(viteRoot, "src/components/ui/ResponsiveGrid.tsx")
);

write(
  join(COMP, "responsive-grid/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/responsive-grid.css", destination: "styles/responsive-grid.css" },
        {
          source: "files/styles/responsive-grid.tailwind.css",
          destination: "styles/responsive-grid.tailwind.css",
        },
        { source: "files/components/ui/ResponsiveGrid.tsx", destination: "components/ui/ResponsiveGrid.tsx" },
        { source: "files/docs/GRID.md", destination: "docs/devkit/GRID.md" },
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
  join(COMP, "responsive-grid/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/responsive-grid.css", destination: "src/styles/responsive-grid.css" },
        {
          source: "files/src/styles/responsive-grid.tailwind.css",
          destination: "src/styles/responsive-grid.tailwind.css",
        },
        {
          source: "files/src/components/ui/ResponsiveGrid.tsx",
          destination: "src/components/ui/ResponsiveGrid.tsx",
        },
        { source: "files/docs/GRID.md", destination: "docs/devkit/GRID.md" },
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
  join(COMP, "responsive-grid/component.json"),
  JSON.stringify(
    {
      id: 11,
      name: "responsive-grid",
      displayName: "Responsive Grid",
      description:
        "Mobile-first grid system with adaptive breakpoints, gutters, containers, nested grids, autofit, masonry, alignment, and safe-area aware layout.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layout-grid",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "responsive-grid", "grid", "container"],
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

const layoutPackages = [
  {
    name: "container",
    id: 16,
    exportName: "Container",
    source: `import * as React from "react";

export type ContainerWidth = "default" | "fluid" | "narrow" | "wide";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  as?: keyof React.JSX.IntrinsicElements;
}

const WIDTH: Record<ContainerWidth, string> = {
  default: "dk-container",
  fluid: "dk-container-fluid",
  narrow: "dk-container dk-container-narrow",
  wide: "dk-container dk-container-wide",
};

/** Responsive content container with safe horizontal padding. */
export function Container({
  width = "default",
  as = "div",
  className = "",
  children,
  ...props
}: ContainerProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={\`\${WIDTH[width]} \${className}\`.trim()} {...props}>
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "safe-area",
    id: 19,
    exportName: "SafeArea",
    source: `import * as React from "react";

export type SafeAreaEdges = "all" | "x" | "y" | "top" | "bottom";

export interface SafeAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  edges?: SafeAreaEdges;
  as?: keyof React.JSX.IntrinsicElements;
}

const EDGE: Record<SafeAreaEdges, string> = {
  all: "dk-safe-area",
  x: "dk-safe-x",
  y: "dk-safe-y",
  top: "dk-safe-top",
  bottom: "dk-safe-bottom",
};

/** Applies env(safe-area-inset-*) padding for notches and home indicators. */
export function SafeArea({
  edges = "all",
  as = "div",
  className = "",
  children,
  ...props
}: SafeAreaProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={\`\${EDGE[edges]} \${className}\`.trim()} {...props}>
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "spacer",
    id: 15,
    exportName: "Spacer",
    source: `import * as React from "react";

export interface SpacerProps extends React.HTMLAttributes<HTMLSpanElement> {
  axis?: "auto" | "x" | "y";
  size?: string;
}

/** Flex spacer or fixed gap using grid gutter tokens. */
export function Spacer({ axis = "auto", size, className = "", style, ...props }: SpacerProps) {
  const cls =
    axis === "x" ? "dk-spacer-x" : axis === "y" ? "dk-spacer-y" : "dk-spacer";
  return (
    <span
      aria-hidden
      className={\`\${cls} \${className}\`.trim()}
      style={{ ...(size ? { ["--spacer-size" as string]: size } : null), ...style }}
      {...props}
    />
  );
}
`,
  },
  {
    name: "stack-layout",
    id: 13,
    exportName: "StackLayout",
    source: `import * as React from "react";

export interface StackLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/** Vertical stack with tokenized gap. */
export function StackLayout({
  gap,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: StackLayoutProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={\`dk-stack \${className}\`.trim()}
      style={{ ...(gap ? { ["--stack-gap" as string]: gap } : null), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "flex-layout",
    id: 12,
    exportName: "FlexLayout",
    source: `import * as React from "react";

export interface FlexLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  wrap?: boolean;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around";
  gap?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const ALIGN = {
  start: "dk-items-start",
  center: "dk-items-center",
  end: "dk-items-end",
  stretch: "dk-items-stretch",
  baseline: "dk-items-baseline",
} as const;

const JUSTIFY = {
  start: "dk-content-start",
  center: "dk-content-center",
  end: "dk-content-end",
  between: "dk-content-between",
  around: "dk-content-around",
} as const;

/** Flex layout primitive with alignment utilities. */
export function FlexLayout({
  direction = "row",
  wrap = false,
  align = "stretch",
  justify = "start",
  gap,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: FlexLayoutProps) {
  const Tag = as as React.ElementType;
  const classes = [
    "dk-flex",
    direction === "column" ? "dk-flex-col" : "dk-flex-row",
    wrap ? "dk-flex-wrap" : "dk-flex-nowrap",
    ALIGN[align],
    JUSTIFY[justify],
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <Tag
      className={classes}
      style={{ ...(gap ? { gap } : null), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "inline-layout",
    id: 14,
    exportName: "InlineLayout",
    source: `import * as React from "react";

export interface InlineLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

/** Horizontal wrapping inline cluster. */
export function InlineLayout({
  gap,
  as = "div",
  className = "",
  style,
  children,
  ...props
}: InlineLayoutProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={\`dk-inline \${className}\`.trim()}
      style={{ ...(gap ? { ["--inline-gap" as string]: gap } : null), ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "section",
    id: 17,
    exportName: "Section",
    source: `import * as React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  compact?: boolean;
  as?: "section" | "div" | "main" | "aside";
}

/** Vertical page section with responsive rhythm. */
export function Section({
  compact = false,
  as = "section",
  className = "",
  children,
  ...props
}: SectionProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={\`dk-section \${compact ? "dk-section-compact" : ""} \${className}\`.trim()} {...props}>
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "surface",
    id: 18,
    exportName: "Surface",
    source: `import * as React from "react";

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof React.JSX.IntrinsicElements;
}

/** Soft elevated surface for cards inside the grid. */
export function Surface({ as = "div", className = "", children, ...props }: SurfaceProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag className={\`dk-surface \${className}\`.trim()} {...props}>
      {children}
    </Tag>
  );
}
`,
  },
  {
    name: "aspect-ratio",
    id: 20,
    exportName: "AspectRatio",
    source: `import * as React from "react";

export type AspectPreset = "video" | "square" | "photo" | "portrait" | "custom";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  preset?: AspectPreset;
  ratio?: string;
}

/** Aspect-ratio box for media inside grid cells. */
export function AspectRatio({
  preset = "video",
  ratio,
  className = "",
  style,
  children,
  ...props
}: AspectRatioProps) {
  const presetClass =
    preset === "square"
      ? "dk-aspect-square"
      : preset === "photo"
        ? "dk-aspect-photo"
        : preset === "portrait"
          ? "dk-aspect-portrait"
          : preset === "video"
            ? "dk-aspect-video"
            : "";
  return (
    <div
      className={\`dk-aspect \${presetClass} \${className}\`.trim()}
      style={{ ...(ratio ? { ["--aspect-ratio" as string]: ratio } : null), ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
`,
  },
];

for (const pkg of layoutPackages) {
  const file = `${pkg.exportName}.tsx`;
  const nextPath = join(COMP, pkg.name, `nextjs-compact/v1/files/components/ui/${file}`);
  const vitePath = join(COMP, pkg.name, `vite-express-tauri/v1/files/src/components/ui/${file}`);
  write(nextPath, pkg.source);
  write(vitePath, pkg.source);

  write(
    join(COMP, pkg.name, "component.json"),
    JSON.stringify(
      {
        id: pkg.id,
        name: pkg.name,
        displayName: pkg.exportName.replace(/([a-z])([A-Z])/g, "$1 $2"),
        description: `${pkg.exportName} — layout companion for the responsive grid system.`,
        category: "foundation",
        group: "layout-system",
        groupName: "Layout System",
        kind: "component",
        layer: 1,
        icon: "layout",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "layout-system", pkg.name],
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
    join(COMP, pkg.name, "nextjs-compact/v1/manifest.json"),
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
    join(COMP, pkg.name, "vite-express-tauri/v1/manifest.json"),
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

// Patch registry
const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const names = new Set(["responsive-grid", ...layoutPackages.map((p) => p.name)]);

for (const entry of registry.components) {
  if (!names.has(entry.name)) continue;
  if (entry.name === "responsive-grid") {
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.icon = "layout-grid";
    entry.displayName = "Responsive Grid";
    entry.description =
      "Mobile-first grid system with adaptive breakpoints, gutters, containers, nested grids, autofit, masonry, alignment, and safe-area aware layout.";
    entry.tags = ["foundation", "layout-system", "responsive-grid", "grid", "container"];
  } else {
    const pkg = layoutPackages.find((p) => p.name === entry.name);
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.displayName = pkg.exportName.replace(/([a-z])([A-Z])/g, "$1 $2");
    entry.description = `${pkg.exportName} — layout companion for the responsive grid system.`;
    entry.icon = "layout";
  }
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Grid system generated.", existsSync(join(viteRoot, "src/styles/responsive-grid.css")));
