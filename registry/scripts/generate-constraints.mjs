/**
 * Sync Responsive Constraint Engine (id: 25) to both templates; patch registry.
 * Run: node scripts/generate-constraints.mjs
 *
 * Replaces former content-width-manager stub (same id).
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const PKG = "responsive-constraints";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const description =
  "Responsive Constraint Engine — min/max/preferred/intrinsic sizing, aspect preservation, fluid & container-query constraints, overflow prevention, resize observation, and component presets (card→form) balanced across mobile to ultrawide.";

const nextRoot = join(COMP, PKG, "nextjs-compact/v1/files");
const viteRoot = join(COMP, PKG, "vite-express-tauri/v1/files");

copy(
  join(nextRoot, "styles/constraint-system.css"),
  join(viteRoot, "src/styles/constraint-system.css")
);
copy(join(nextRoot, "docs/CONSTRAINTS.md"), join(viteRoot, "docs/CONSTRAINTS.md"));
copy(
  join(nextRoot, "components/ui/Constraint.tsx"),
  join(viteRoot, "src/components/ui/Constraint.tsx")
);

write(
  join(COMP, PKG, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        {
          source: "files/styles/constraint-system.css",
          destination: "styles/constraint-system.css",
        },
        {
          source: "files/components/ui/Constraint.tsx",
          destination: "components/ui/Constraint.tsx",
        },
        {
          source: "files/docs/CONSTRAINTS.md",
          destination: "docs/devkit/CONSTRAINTS.md",
        },
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
          source: "files/src/styles/constraint-system.css",
          destination: "src/styles/constraint-system.css",
        },
        {
          source: "files/src/components/ui/Constraint.tsx",
          destination: "src/components/ui/Constraint.tsx",
        },
        {
          source: "files/docs/CONSTRAINTS.md",
          destination: "docs/devkit/CONSTRAINTS.md",
        },
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
      id: 25,
      name: PKG,
      displayName: "Responsive Constraints",
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
        "responsive-constraints",
        "sizing",
        "container-queries",
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

/* Deprecated content-width-manager stub */
write(
  join(COMP, "content-width-manager/nextjs-compact/v1/files/components/ui/ContentWidthManager.tsx"),
  `import * as React from "react";

/**
 * @deprecated Use \`responsive-constraints\` — \`Constraint preset="prose|ui|wide"\`.
 */
export interface ContentWidthManagerProps {
  children?: React.ReactNode;
  className?: string;
}

export function ContentWidthManager({ children, className }: ContentWidthManagerProps) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[DevKit] content-width-manager is deprecated. Use responsive-constraints (Constraint)."
    );
  }
  return <div className={["dk-content-width", className].filter(Boolean).join(" ")}>{children}</div>;
}
`
);

write(
  join(COMP, "content-width-manager/vite-express-tauri/v1/files/src/components/ui/ContentWidthManager.tsx"),
  `import * as React from "react";

/** @deprecated Use responsive-constraints */
export interface ContentWidthManagerProps {
  children?: React.ReactNode;
  className?: string;
}

export function ContentWidthManager({ children, className }: ContentWidthManagerProps) {
  return <div className={["dk-content-width", className].filter(Boolean).join(" ")}>{children}</div>;
}
`
);

write(
  join(COMP, "content-width-manager/component.json"),
  JSON.stringify(
    {
      id: 25001,
      name: "content-width-manager",
      displayName: "Content Width Manager (deprecated)",
      description:
        "Deprecated — use responsive-constraints (id 25). Stub retained for transitional imports.",
      category: "foundation",
      group: "spacing-system",
      groupName: "Spacing System",
      kind: "component",
      layer: 1,
      icon: "move",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "deprecated", "content-width-manager"],
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
  if (entry.id === 25 || entry.name === "content-width-manager" || entry.name === PKG) {
    entry.id = 25;
    entry.name = PKG;
    entry.displayName = "Responsive Constraints";
    entry.description = description;
    entry.stub = false;
    entry.latestVersion = "1.0.0";
    entry.hasVariants = true;
    entry.fileKind = "tsx";
    entry.tags = [
      "foundation",
      "spacing-system",
      "responsive-constraints",
      "sizing",
      "container-queries",
      "a11y",
    ];
    entry.icon = "move";
  }
}

registry.updatedAt = "2026-08-07T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Responsive Constraint Engine generated.");
