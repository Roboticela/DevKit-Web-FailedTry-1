/**
 * Sync Section to both templates; patch registry.
 * Run: node scripts/generate-section.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const nextRoot = join(COMP, "section/nextjs-compact/v1/files");
const viteRoot = join(COMP, "section/vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/section-system.css"), join(viteRoot, "src/styles/section-system.css"));
copy(join(nextRoot, "docs/SECTION.md"), join(viteRoot, "docs/SECTION.md"));
copy(join(nextRoot, "components/ui/Section.tsx"), join(viteRoot, "src/components/ui/Section.tsx"));

write(
  join(COMP, "section/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/section-system.css", destination: "styles/section-system.css" },
        { source: "files/components/ui/Section.tsx", destination: "components/ui/Section.tsx" },
        { source: "files/docs/SECTION.md", destination: "docs/devkit/SECTION.md" },
      ],
      injections: [],
      dependencies: { frontend: ["responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "section/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/section-system.css", destination: "src/styles/section-system.css" },
        { source: "files/src/components/ui/Section.tsx", destination: "src/components/ui/Section.tsx" },
        { source: "files/docs/SECTION.md", destination: "docs/devkit/SECTION.md" },
      ],
      injections: [],
      dependencies: { frontend: ["responsive-spacing"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "section/component.json"),
  JSON.stringify(
    {
      id: 17,
      name: "section",
      displayName: "Section",
      description:
        "Section — logical content groups with header/body/footer, collapse, sticky headers, empty/loading states, width inheritance, and visibility analytics.",
      category: "foundation",
      group: "layout-system",
      groupName: "Layout System",
      kind: "component",
      layer: 1,
      icon: "layout",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "layout-system", "section", "landmark"],
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
  if (entry.name !== "section") continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.hasVariants = true;
  entry.displayName = "Section";
  entry.description =
    "Section — logical content groups with header/body/footer, collapse, sticky headers, empty/loading states, width inheritance, and visibility analytics.";
  entry.tags = ["foundation", "layout-system", "section", "landmark"];
  entry.icon = "layout";
}
registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Section system generated.");
