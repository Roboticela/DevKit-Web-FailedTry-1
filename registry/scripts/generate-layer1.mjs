/**
 * Generates Layer 1 foundation catalog: 10 groups × 10 empty packages (IDs 1–100).
 * Run: node scripts/generate-layer1.mjs
 */
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const COMPONENTS = join(ROOT, "components");

const GROUPS = [
  {
    id: "design-tokens",
    name: "Design Tokens",
    startId: 1,
    items: [
      ["color-tokens", "Color Tokens", "css"],
      ["typography-tokens", "Typography Tokens", "css"],
      ["font-family-tokens", "Font Family Tokens", "css"],
      ["font-weight-tokens", "Font Weight Tokens", "css"],
      ["font-size-tokens", "Font Size Tokens", "css"],
      ["line-height-tokens", "Line Height Tokens", "css"],
      ["letter-spacing-tokens", "Letter Spacing Tokens", "css"],
      ["radius-tokens", "Radius Tokens", "css"],
      ["shadow-tokens", "Shadow Tokens", "css"],
      ["opacity-tokens", "Opacity Tokens", "css"],
    ],
  },
  {
    id: "layout-system",
    name: "Layout System",
    startId: 11,
    items: [
      ["responsive-grid", "Responsive Grid", "tsx"],
      ["flex-layout", "Flex Layout", "tsx"],
      ["stack-layout", "Stack Layout", "tsx"],
      ["inline-layout", "Inline Layout", "tsx"],
      ["spacer", "Spacer Component", "tsx"],
      ["container", "Container", "tsx"],
      ["section", "Section", "tsx"],
      ["surface", "Surface", "tsx"],
      ["safe-area", "Safe Area", "tsx"],
      ["aspect-ratio", "Aspect Ratio", "tsx"],
    ],
  },
  {
    id: "spacing-system",
    name: "Spacing System",
    startId: 21,
    items: [
      ["margin-utilities", "Margin Utilities", "tsx"],
      ["padding-utilities", "Padding Utilities", "tsx"],
      ["gap-utilities", "Gap Utilities", "tsx"],
      ["responsive-spacing", "Responsive Spacing", "tsx"],
      ["content-width-manager", "Content Width Manager", "tsx"],
      ["auto-layout", "Auto Layout", "tsx"],
      ["alignment-utilities", "Alignment Utilities", "tsx"],
      ["distribution-utilities", "Distribution Utilities", "tsx"],
      ["position-utilities", "Position Utilities", "tsx"],
      ["overflow-utilities", "Overflow Utilities", "tsx"],
    ],
  },
  {
    id: "theme-engine",
    name: "Theme Engine",
    startId: 31,
    items: [
      ["light-theme", "Light Theme", "css"],
      ["dark-theme", "Dark Theme", "css"],
      ["high-contrast-theme", "High Contrast Theme", "css"],
      ["dynamic-theme", "Dynamic Theme", "tsx"],
      ["accent-color-system", "Accent Color System", "css"],
      ["semantic-colors", "Semantic Colors", "css"],
      ["elevation-tokens", "Elevation Tokens", "css"],
      ["motion-tokens", "Motion Tokens", "css"],
      ["blur-tokens", "Blur Tokens", "css"],
      ["gradient-tokens", "Gradient Tokens", "css"],
    ],
  },
  {
    id: "typography-system",
    name: "Typography System",
    startId: 41,
    items: [
      ["display-text", "Display Text", "tsx"],
      ["heading", "Heading", "tsx"],
      ["title", "Title", "tsx"],
      ["subtitle", "Subtitle", "tsx"],
      ["body-text", "Body Text", "tsx"],
      ["caption", "Caption", "tsx"],
      ["label", "Label", "tsx"],
      ["helper-text", "Helper Text", "tsx"],
      ["code-text", "Code Text", "tsx"],
      ["numeric-display", "Numeric Display", "tsx"],
    ],
  },
  {
    id: "icon-system",
    name: "Icon System",
    startId: 51,
    items: [
      ["icon", "Icon", "tsx"],
      ["icon-button", "Icon Button", "tsx"],
      ["animated-icon", "Animated Icon", "tsx"],
      ["status-icon", "Status Icon", "tsx"],
      ["brand-icon", "Brand Icon", "tsx"],
      ["file-icon", "File Icon", "tsx"],
      ["social-icon", "Social Icon", "tsx"],
      ["ai-icon", "AI Icon", "tsx"],
      ["emoji-renderer", "Emoji Renderer", "tsx"],
      ["icon-badge", "Icon Badge", "tsx"],
    ],
  },
  {
    id: "motion-system",
    name: "Motion System",
    startId: 61,
    items: [
      ["fade-animation", "Fade Animation", "tsx"],
      ["scale-animation", "Scale Animation", "tsx"],
      ["slide-animation", "Slide Animation", "tsx"],
      ["page-transition", "Page Transition", "tsx"],
      ["loading-transition", "Loading Transition", "tsx"],
      ["hover-animation", "Hover Animation", "tsx"],
      ["press-animation", "Press Animation", "tsx"],
      ["ripple-alternative", "Ripple Alternative", "tsx"],
      ["drag-animation", "Drag Animation", "tsx"],
      ["skeleton-animation", "Skeleton Animation", "tsx"],
    ],
  },
  {
    id: "shape-system",
    name: "Shape System",
    startId: 71,
    items: [
      ["divider", "Divider", "tsx"],
      ["separator", "Separator", "tsx"],
      ["border", "Border", "tsx"],
      ["rounded-corner", "Rounded Corner", "tsx"],
      ["circle-shape", "Circle Shape", "tsx"],
      ["pill-shape", "Pill Shape", "tsx"],
      ["avatar-shape", "Avatar Shape", "tsx"],
      ["glass-surface", "Glass Surface", "tsx"],
      ["frosted-surface", "Frosted Surface", "tsx"],
      ["shadow-layer", "Shadow Layer", "tsx"],
    ],
  },
  {
    id: "accessibility-system",
    name: "Accessibility System",
    startId: 81,
    items: [
      ["focus-ring", "Focus Ring", "tsx"],
      ["keyboard-navigation-helper", "Keyboard Navigation Helper", "tsx"],
      ["screen-reader-wrapper", "Screen Reader Wrapper", "tsx"],
      ["aria-helper", "ARIA Helper", "tsx"],
      ["touch-target-wrapper", "Touch Target Wrapper", "tsx"],
      ["high-contrast-wrapper", "High Contrast Wrapper", "tsx"],
      ["reduced-motion-wrapper", "Reduced Motion Wrapper", "tsx"],
      ["text-scaling-wrapper", "Text Scaling Wrapper", "tsx"],
      ["accessible-tooltip", "Accessible Tooltip", "tsx"],
      ["skip-navigation", "Skip Navigation", "tsx"],
    ],
  },
  {
    id: "utility-components",
    name: "Utility Components",
    startId: 91,
    items: [
      ["portal", "Portal", "tsx"],
      ["overlay", "Overlay", "tsx"],
      ["click-outside-detector", "Click Outside Detector", "tsx"],
      ["scroll-manager", "Scroll Manager", "tsx"],
      ["resize-observer", "Resize Observer", "tsx"],
      ["responsive-visibility", "Responsive Visibility", "tsx"],
      ["responsive-switch", "Responsive Switch", "tsx"],
      ["device-detector", "Device Detector", "tsx"],
      ["theme-provider", "Theme Provider", "tsx"],
      ["design-provider", "Design Provider", "tsx"],
    ],
  },
];

function toPascal(kebab) {
  return kebab
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function emptyCss(displayName) {
  return `/* ${displayName} — empty stub (Layer 1 Foundation)\n * TODO: implement design tokens\n */\n\n:root {\n  /* reserved */\n}\n`;
}

function emptyTsx(exportName, displayName) {
  return `import * as React from "react";\n\nexport interface ${exportName}Props {\n  children?: React.ReactNode;\n}\n\n/** ${displayName} — empty stub (Layer 1 Foundation). */\nexport function ${exportName}(_props: ${exportName}Props = {}) {\n  return null;\n}\n`;
}

function writeUtf8(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

// Clear previous component packages (keep registry.json / layers.json for rewrite)
for (const entry of readdirSync(COMPONENTS, { withFileTypes: true })) {
  if (entry.isDirectory()) {
    rmSync(join(COMPONENTS, entry.name), { recursive: true, force: true });
  }
}

const catalog = [];
const groupsMeta = [];

for (const group of GROUPS) {
  const groupItems = [];
  group.items.forEach(([name, displayName, kind], index) => {
    const id = group.startId + index;
    const exportName = toPascal(name);
    const fileBase = kind === "css" ? `${name}.css` : `${exportName}.tsx`;

    const nextSource =
      kind === "css"
        ? `files/styles/${fileBase}`
        : `files/components/ui/${fileBase}`;
    const nextDest = kind === "css" ? `styles/${fileBase}` : `components/ui/${fileBase}`;
    const viteSource =
      kind === "css"
        ? `files/src/styles/${fileBase}`
        : `files/src/components/ui/${fileBase}`;
    const viteDest = kind === "css" ? `src/styles/${fileBase}` : `src/components/ui/${fileBase}`;

    const base = join(COMPONENTS, name);
    const content = kind === "css" ? emptyCss(displayName) : emptyTsx(exportName, displayName);

    writeUtf8(join(base, "nextjs-compact", "v1", nextSource), content);
    writeUtf8(join(base, "vite-express-tauri", "v1", viteSource), content);

    const componentJson = {
      id,
      name,
      displayName,
      description: `${displayName} — empty Layer 1 foundation stub.`,
      category: "foundation",
      group: group.id,
      groupName: group.name,
      kind: "component",
      layer: 1,
      icon: "square",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", group.id, name],
      templates: ["nextjs-compact", "vite-express-tauri"],
      platforms: ["web", "desktop"],
      hasVariants: false,
      stub: true,
      fileKind: kind,
      versions: {
        latest: "0.0.0",
        stable: "0.0.0",
        history: [{ version: "0.0.0", releaseDate: "2026-08-06", breaking: false }],
      },
      requiredConfig: [],
      optionalConfig: [],
    };
    writeUtf8(join(base, "component.json"), JSON.stringify(componentJson, null, 2) + "\n");

    const nextManifest = {
      version: "0.0.0",
      template: "nextjs-compact",
      files: [{ source: nextSource, destination: nextDest }],
      injections: [],
      dependencies: { frontend: [] },
      envVars: [],
    };
    writeUtf8(
      join(base, "nextjs-compact", "v1", "manifest.json"),
      JSON.stringify(nextManifest, null, 2) + "\n"
    );

    const viteManifest = {
      version: "0.0.0",
      template: "vite-express-tauri",
      files: [{ source: viteSource, destination: viteDest }],
      injections: [],
      dependencies: { frontend: [] },
      envVars: [],
    };
    writeUtf8(
      join(base, "vite-express-tauri", "v1", "manifest.json"),
      JSON.stringify(viteManifest, null, 2) + "\n"
    );

    const entry = {
      id,
      name,
      displayName,
      description: componentJson.description,
      category: "foundation",
      group: group.id,
      groupName: group.name,
      kind: "component",
      layer: 1,
      icon: "square",
      templates: ["nextjs-compact", "vite-express-tauri"],
      platforms: ["web", "desktop"],
      hasVariants: false,
      stub: true,
      latestVersion: "0.0.0",
      tags: componentJson.tags,
    };
    catalog.push(entry);
    groupItems.push({ id, name, displayName, fileKind: kind });
  });

  groupsMeta.push({
    id: group.id,
    name: group.name,
    idRange: { min: group.startId, max: group.startId + 9 },
    components: groupItems,
  });
}

const registry = {
  version: "1",
  updatedAt: new Date().toISOString().slice(0, 10) + "T00:00:00Z",
  components: catalog,
};
writeUtf8(join(COMPONENTS, "registry.json"), JSON.stringify(registry, null, 2) + "\n");

const layers = {
  version: "1",
  updatedAt: registry.updatedAt,
  description:
    "Five-layer reusable UI component catalog. Scaffolds (kind=scaffold) remain supported but empty for now.",
  kinds: {
    component: "Reusable UI packages selectable by layer. Available for both templates.",
    scaffold: "Full-feature packages (routes, APIs, flows). Reserved; catalog empty for now.",
  },
  templates: ["nextjs-compact", "vite-express-tauri"],
  layers: [
    {
      layer: 1,
      id: "foundation",
      name: "Foundation",
      idRange: { min: 1, max: 100 },
      description: "Design tokens, layout, spacing, theme, typography, icons, motion, shape, a11y, utilities.",
      groups: groupsMeta,
    },
    {
      layer: 2,
      id: "basic",
      name: "Basic Components",
      idRange: { min: 101, max: 500 },
      description: "Buttons, inputs, chips, avatars, badges, toggles, sliders, cards, tooltips, and other primitives.",
    },
    {
      layer: 3,
      id: "composite",
      name: "Composite Components",
      idRange: { min: 501, max: 1500 },
      description: "Tables, forms, navigation, charts, calendars, editors, pickers, uploaders, dialogs.",
    },
    {
      layer: 4,
      id: "advanced",
      name: "Advanced Components",
      idRange: { min: 1501, max: 2500 },
      description: "Kanban, Gantt, workflow builders, AI chat, dashboards, email composer, report builders.",
    },
    {
      layer: 5,
      id: "templates",
      name: "Templates & Layouts",
      idRange: { min: 2501, max: 3000 },
      description:
        "Page templates, auth UI flows, admin dashboards, CRM layouts, analytics pages, mobile screens, enterprise workflows.",
    },
  ],
};
writeUtf8(join(COMPONENTS, "layers.json"), JSON.stringify(layers, null, 2) + "\n");

// Playground catalog JSON for easy browsing
writeUtf8(
  join(ROOT, "..", "playground", "src", "foundation-catalog.json"),
  JSON.stringify({ groups: groupsMeta }, null, 2) + "\n"
);

console.log(`Generated ${catalog.length} Layer 1 stubs across ${GROUPS.length} groups.`);
