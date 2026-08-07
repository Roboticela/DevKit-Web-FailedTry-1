/**
 * Sync Responsive Ordering System (id: 26) to both templates; patch registry.
 * Run: node scripts/generate-order.mjs
 *
 * Replaces former auto-layout stub (same id).
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "responsive-ordering";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const description =
  "Responsive Ordering System — semantic child order by viewport, roles, and app state; drag/keyboard reorder with persistence, motion, nested layouts, and virtualization-friendly CSS strategy.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/order-system.css"), join(viteRoot, "src/styles/order-system.css"));
copy(join(nextRoot, "docs/ORDER.md"), join(viteRoot, "docs/ORDER.md"));
copy(join(nextRoot, "components/ui/Order.tsx"), join(viteRoot, "src/components/ui/Order.tsx"));

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/order-system.css", destination: "styles/order-system.css" },
        { source: "files/components/ui/Order.tsx", destination: "components/ui/Order.tsx" },
        { source: "files/docs/ORDER.md", destination: "docs/devkit/ORDER.md" },
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
          source: "files/src/styles/order-system.css",
          destination: "src/styles/order-system.css",
        },
        {
          source: "files/src/components/ui/Order.tsx",
          destination: "src/components/ui/Order.tsx",
        },
        { source: "files/docs/ORDER.md", destination: "docs/devkit/ORDER.md" },
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
      id: 26,
      name: PKG,
      displayName: "Responsive Ordering",
      description,
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: [
        "foundation",
        "spacing-system",
        "responsive-ordering",
        "order",
        "dashboard",
        "a11y",
      ],
      templates: ["nextjs-compact", "vite-express-tauri"],
      platforms: ["web", "desktop"],
      hasVariants: true,
      stub: false,
      fileKind: "tsx",
      versions: {
        latest: "1.0.0",
        stable: "1.0.0",
        history: [{ version: "1.0.0", releaseDate: "2026-08-07", breaking: false }],
      },
      requiredConfig: [],
      optionalConfig: [],
    },
    null,
    2
  ) + "\n"
);

/* Deprecated auto-layout stub — points developers at responsive-ordering */
write(
  join(COMP, "auto-layout/nextjs-compact/v1/files/components/ui/AutoLayout.tsx"),
  `import * as React from "react";

/**
 * @deprecated Use \`responsive-ordering\` — \`Order\` / \`OrderItem\` / \`OrderDashboard\`.
 * This stub remains so old catalog references do not crash.
 */
export interface AutoLayoutProps {
  children?: React.ReactNode;
}

export function AutoLayout({ children }: AutoLayoutProps = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[DevKit] auto-layout is deprecated. Use responsive-ordering (Order / OrderDashboard)."
    );
  }
  return <>{children}</>;
}
`
);

write(
  join(COMP, "auto-layout/vite-express-tauri/v1/files/src/components/ui/AutoLayout.tsx"),
  `import * as React from "react";

/**
 * @deprecated Use \`responsive-ordering\` — \`Order\` / \`OrderItem\` / \`OrderDashboard\`.
 */
export interface AutoLayoutProps {
  children?: React.ReactNode;
}

export function AutoLayout({ children }: AutoLayoutProps = {}) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[DevKit] auto-layout is deprecated. Use responsive-ordering (Order / OrderDashboard)."
    );
  }
  return <>{children}</>;
}
`
);

write(
  join(COMP, "auto-layout/component.json"),
  JSON.stringify(
    {
      id: 26001,
      name: "auto-layout",
      displayName: "Auto Layout (deprecated)",
      description:
        "Deprecated — use responsive-ordering (id 26). Stub retained for transitional imports.",
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "deprecated", "auto-layout"],
      templates: ["nextjs-compact", "vite-express-tauri"],
      platforms: ["web", "desktop"],
      hasVariants: false,
      stub: true,
      fileKind: "tsx",
      versions: {
        latest: "1.0.0",
        stable: "1.0.0",
        history: [{ version: "1.0.0", releaseDate: "2026-08-07", breaking: false }],
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
  if (entry.id === 26 || entry.name === "auto-layout" || entry.name === PKG) {
    entry.id = 26;
    entry.name = PKG;
    entry.displayName = "Responsive Ordering";
    entry.description = description;
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.hasVariants = true;
    entry.fileKind = "tsx";
    entry.tags = [
      "foundation",
      "spacing-system",
      "responsive-ordering",
      "order",
      "dashboard",
      "a11y",
    ];
    entry.icon = "move";
  }
}

registry.updatedAt = "2026-08-07T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Responsive Ordering system generated.");
