/**
 * Sync Icon System + companions; patch registry.
 * Run: node scripts/generate-icon.mjs
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

const nextRoot = join(COMP, "icon/nextjs-compact/v1/files");
const viteRoot = join(COMP, "icon/vite-express-tauri/v1/files");

const uiFiles = ["icon-registry.ts", "Icon.tsx", "IconExtras.tsx"];

copy(join(nextRoot, "styles/icon-system.css"), join(viteRoot, "src/styles/icon-system.css"));
copy(join(nextRoot, "docs/ICONS.md"), join(viteRoot, "docs/ICONS.md"));
for (const f of uiFiles) {
  copy(join(nextRoot, `components/ui/${f}`), join(viteRoot, `src/components/ui/${f}`));
}

const filesNext = [
  { source: "files/styles/icon-system.css", destination: "styles/icon-system.css" },
  ...uiFiles.map((f) => ({ source: `files/components/ui/${f}`, destination: `components/ui/${f}` })),
  { source: "files/docs/ICONS.md", destination: "docs/devkit/ICONS.md" },
];
const filesVite = [
  { source: "files/src/styles/icon-system.css", destination: "src/styles/icon-system.css" },
  ...uiFiles.map((f) => ({ source: `files/src/components/ui/${f}`, destination: `src/components/ui/${f}` })),
  { source: "files/docs/ICONS.md", destination: "docs/devkit/ICONS.md" },
];

write(
  join(COMP, "icon/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: filesNext,
      injections: [],
      dependencies: { frontend: ["color-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "icon/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: filesVite,
      injections: [],
      dependencies: { frontend: ["color-tokens"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "icon/component.json"),
  JSON.stringify(
    {
      id: 51,
      name: "icon",
      displayName: "Icon",
      description:
        "Icon System — consistent stroke icons with outlined/filled/duotone/status variants, searchable registry, a11y labels, and text alignment.",
      category: "foundation",
      group: "icon-system",
      groupName: "Icon System",
      kind: "component",
      layer: 1,
      icon: "sparkles",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "icon-system", "icon"],
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

const companions = [
  { name: "icon-button", id: 52, export: "IconButton" },
  { name: "animated-icon", id: 53, export: "AnimatedIcon" },
  { name: "status-icon", id: 54, export: "StatusIcon" },
  { name: "brand-icon", id: 55, export: "BrandIcon" },
  { name: "file-icon", id: 56, export: "FileIcon" },
  { name: "social-icon", id: 57, export: "SocialIcon" },
  { name: "ai-icon", id: 58, export: "AiIcon" },
  { name: "emoji-renderer", id: 59, export: "EmojiRenderer" },
  { name: "icon-badge", id: 60, export: "IconBadge" },
];

for (const c of companions) {
  for (const f of uiFiles) {
    copy(join(nextRoot, `components/ui/${f}`), join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${f}`));
    copy(join(nextRoot, `components/ui/${f}`), join(COMP, c.name, `vite-express-tauri/v1/files/src/components/ui/${f}`));
  }

  const entry = `export { ${c.export} } from "./IconExtras";\nexport { Icon, IconLabel } from "./Icon";\n`;
  write(join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${c.export}.tsx`), entry);
  write(join(COMP, c.name, `vite-express-tauri/v1/files/src/components/ui/${c.export}.tsx`), entry);

  const css = `/** ${c.name} — companion to icon. Prefer icon-system.css */\n:root { --dk-icon-companion-${c.name}: 1; }\n`;
  write(join(COMP, c.name, `nextjs-compact/v1/files/styles/${c.name}.css`), css);
  write(join(COMP, c.name, `vite-express-tauri/v1/files/src/styles/${c.name}.css`), css);

  write(
    join(COMP, c.name, "component.json"),
    JSON.stringify(
      {
        id: c.id,
        name: c.name,
        displayName: c.name
          .split("-")
          .map((p) => p[0].toUpperCase() + p.slice(1))
          .join(" "),
        description: `${c.export} — part of the Icon System.`,
        category: "foundation",
        group: "icon-system",
        groupName: "Icon System",
        kind: "component",
        layer: 1,
        icon: "sparkles",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "icon-system", c.name],
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
        files: [
          ...uiFiles.map((f) => ({ source: `files/components/ui/${f}`, destination: `components/ui/${f}` })),
          { source: `files/components/ui/${c.export}.tsx`, destination: `components/ui/${c.export}.tsx` },
          { source: `files/styles/${c.name}.css`, destination: `styles/${c.name}.css` },
        ],
        injections: [],
        dependencies: { frontend: ["icon"] },
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
        files: [
          ...uiFiles.map((f) => ({
            source: `files/src/components/ui/${f}`,
            destination: `src/components/ui/${f}`,
          })),
          {
            source: `files/src/components/ui/${c.export}.tsx`,
            destination: `src/components/ui/${c.export}.tsx`,
          },
          { source: `files/src/styles/${c.name}.css`, destination: `src/styles/${c.name}.css` },
        ],
        injections: [],
        dependencies: { frontend: ["icon"] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
}

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const names = new Set(["icon", ...companions.map((c) => c.name)]);

for (const entry of registry.components) {
  if (!names.has(entry.name)) continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.icon = "sparkles";
  if (entry.name === "icon") {
    entry.displayName = "Icon";
    entry.description =
      "Icon System — consistent stroke icons with outlined/filled/duotone/status variants, searchable registry, a11y labels, and text alignment.";
    entry.hasVariants = true;
    entry.tags = ["foundation", "icon-system", "icon"];
  } else {
    const c = companions.find((x) => x.name === entry.name);
    entry.description = `${c.export} — part of the Icon System.`;
    entry.tags = ["foundation", "icon-system", entry.name];
  }
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Icon system generated.", ICON_COUNT());

function ICON_COUNT() {
  const src = readFileSync(join(nextRoot, "components/ui/icon-registry.ts"), "utf8");
  return (src.match(/name: "/g) || []).length;
}
