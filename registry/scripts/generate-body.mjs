/**
 * Sync BodyText System (body-text) to both templates; patch registry.
 * Run: node registry/scripts/generate-body.mjs
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMP = join(__dirname, "../components");
const NAME = "body-text";

function write(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, "utf8");
}

function copy(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

const nextRoot = join(COMP, NAME, "nextjs-compact/v1/files");
const viteRoot = join(COMP, NAME, "vite-express-tauri/v1/files");

copy(join(nextRoot, "styles/body-system.css"), join(viteRoot, "src/styles/body-system.css"));
copy(join(nextRoot, "docs/BODY.md"), join(viteRoot, "docs/BODY.md"));
copy(join(nextRoot, "components/ui/BodyText.tsx"), join(viteRoot, "src/components/ui/BodyText.tsx"));
copy(join(nextRoot, "components/ui/bodyTokens.ts"), join(viteRoot, "src/components/ui/bodyTokens.ts"));

const meta = {
  id: 45,
  name: NAME,
  displayName: "Body Text System",
  description:
    "BodyText System — long-form readable copy; regular/compact/comfortable/reading/documentation/AI variants; paragraph spacing, markdown, code, expandable content, measure optimization, a11y.",
  category: "foundation",
  group: "typography-system",
  groupName: "Typography System",
  kind: "component",
  layer: 1,
  icon: "type",
  author: "Roboticela",
  license: "MIT",
  tags: ["foundation", "typography-system", "body-text", "a11y", "markdown"],
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
  optionalConfig: ["ui.typeScale"],
};

write(join(COMP, NAME, "component.json"), JSON.stringify(meta, null, 2) + "\n");

write(
  join(COMP, NAME, "nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: [
        { source: "files/styles/body-system.css", destination: "styles/body-system.css" },
        { source: "files/components/ui/BodyText.tsx", destination: "components/ui/BodyText.tsx" },
        { source: "files/components/ui/bodyTokens.ts", destination: "components/ui/bodyTokens.ts" },
        { source: "files/docs/BODY.md", destination: "docs/devkit/BODY.md" },
      ],
      injections: [],
      dependencies: { frontend: ["typography-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, NAME, "vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: [
        { source: "files/src/styles/body-system.css", destination: "src/styles/body-system.css" },
        {
          source: "files/src/components/ui/BodyText.tsx",
          destination: "src/components/ui/BodyText.tsx",
        },
        {
          source: "files/src/components/ui/bodyTokens.ts",
          destination: "src/components/ui/bodyTokens.ts",
        },
        { source: "files/docs/BODY.md", destination: "docs/devkit/BODY.md" },
      ],
      injections: [],
      dependencies: { frontend: ["typography-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

const registryPath = join(COMP, "registry.json");
if (existsSync(registryPath)) {
  const registry = JSON.parse(readFileSync(registryPath, "utf8"));
  for (const entry of registry.components) {
    if (entry.name !== NAME) continue;
    Object.assign(entry, {
      stub: false,
      latestVersion: "1.0.0",
      displayName: meta.displayName,
      description: meta.description,
      icon: meta.icon,
      fileKind: "tsx",
      tags: meta.tags,
      hasVariants: true,
    });
  }
  registry.updatedAt = "2026-08-07T00:00:00Z";
  write(registryPath, JSON.stringify(registry, null, 2) + "\n");
}

console.log("BodyText System generated.");
