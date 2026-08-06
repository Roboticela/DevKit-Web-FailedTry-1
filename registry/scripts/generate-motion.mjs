/**
 * Sync Motion System + companions 61–70; patch registry.
 * Run: node scripts/generate-motion.mjs
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

const nextRoot = join(COMP, "motion-tokens/nextjs-compact/v1/files");
const viteRoot = join(COMP, "motion-tokens/vite-express-tauri/v1/files");

const uiFiles = ["Motion.tsx", "MotionPresets.tsx", "useReducedMotion.ts"];

copy(join(nextRoot, "styles/motion-system.css"), join(viteRoot, "src/styles/motion-system.css"));
copy(join(nextRoot, "docs/MOTION.md"), join(viteRoot, "docs/MOTION.md"));
for (const f of uiFiles) {
  copy(join(nextRoot, `components/ui/${f}`), join(viteRoot, `src/components/ui/${f}`));
}

write(
  join(nextRoot, "styles/motion-tokens.css"),
  `/* Prefer motion-system.css */\n@import "./motion-system.css";\n`
);
write(
  join(viteRoot, "src/styles/motion-tokens.css"),
  `/* Prefer motion-system.css */\n@import "./motion-system.css";\n`
);

const filesNext = [
  { source: "files/styles/motion-system.css", destination: "styles/motion-system.css" },
  { source: "files/styles/motion-tokens.css", destination: "styles/motion-tokens.css" },
  ...uiFiles.map((f) => ({ source: `files/components/ui/${f}`, destination: `components/ui/${f}` })),
  { source: "files/docs/MOTION.md", destination: "docs/devkit/MOTION.md" },
];
const filesVite = [
  { source: "files/src/styles/motion-system.css", destination: "src/styles/motion-system.css" },
  { source: "files/src/styles/motion-tokens.css", destination: "src/styles/motion-tokens.css" },
  ...uiFiles.map((f) => ({ source: `files/src/components/ui/${f}`, destination: `src/components/ui/${f}` })),
  { source: "files/docs/MOTION.md", destination: "docs/devkit/MOTION.md" },
];

write(
  join(COMP, "motion-tokens/nextjs-compact/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "nextjs-compact",
      files: filesNext,
      injections: [],
      dependencies: { frontend: ["color-tokens", "dynamic-theme"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);
write(
  join(COMP, "motion-tokens/vite-express-tauri/v1/manifest.json"),
  JSON.stringify(
    {
      version: "1.0.0",
      template: "vite-express-tauri",
      files: filesVite,
      injections: [],
      dependencies: { frontend: ["color-tokens", "dynamic-theme"] },
      envVars: [],
    },
    null,
    2
  ) + "\n"
);

write(
  join(COMP, "motion-tokens/component.json"),
  JSON.stringify(
    {
      id: 38,
      name: "motion-tokens",
      displayName: "Motion Tokens",
      description:
        "Motion System — Apple-inspired purposeful animations, reduced-motion support, stagger, hover/press, loading, and success feedback.",
      category: "foundation",
      group: "theme-engine",
      groupName: "Theme Engine",
      kind: "component",
      layer: 1,
      icon: "zap",
      author: "Roboticela",
      license: "MIT",
      tags: ["foundation", "theme-engine", "motion-tokens", "motion-system"],
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
      optionalConfig: ["ui.motion"],
    },
    null,
    2
  ) + "\n"
);

const companions = [
  { name: "fade-animation", id: 61, export: "FadeAnimation", from: "MotionPresets" },
  { name: "scale-animation", id: 62, export: "ScaleAnimation", from: "MotionPresets" },
  { name: "slide-animation", id: 63, export: "SlideAnimation", from: "MotionPresets" },
  { name: "page-transition", id: 64, export: "PageTransition", from: "MotionPresets" },
  { name: "loading-transition", id: 65, export: "LoadingTransition", from: "MotionPresets" },
  { name: "hover-animation", id: 66, export: "HoverAnimation", from: "MotionPresets" },
  { name: "press-animation", id: 67, export: "PressAnimation", from: "MotionPresets" },
  { name: "ripple-alternative", id: 68, export: "RippleAlternative", from: "MotionPresets" },
  { name: "drag-animation", id: 69, export: "DragAnimation", from: "MotionPresets" },
  { name: "skeleton-animation", id: 70, export: "SkeletonAnimation", from: "MotionPresets" },
];

for (const c of companions) {
  // Copy core deps into companion package
  for (const f of ["Motion.tsx", "MotionPresets.tsx"]) {
    copy(join(nextRoot, `components/ui/${f}`), join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${f}`));
    copy(join(nextRoot, `components/ui/${f}`), join(COMP, c.name, `vite-express-tauri/v1/files/src/components/ui/${f}`));
  }

  const entryName = c.export + ".tsx";
  const entry = `export { ${c.export} } from "./MotionPresets";\nexport { Motion, MotionStagger } from "./Motion";\nexport type { MotionProps, MotionPreset } from "./Motion";\n`;
  write(join(COMP, c.name, `nextjs-compact/v1/files/components/ui/${entryName}`), entry);
  write(join(COMP, c.name, `vite-express-tauri/v1/files/src/components/ui/${entryName}`), entry);

  const css = `/**
 * ${c.name} — companion to motion-tokens
 * Prefer importing motion-system.css once.
 */
:root { --dk-motion-companion-${c.name}: 1; }
`;
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
        description: `${c.export} — part of the Motion System (motion-tokens).`,
        category: "foundation",
        group: "motion-system",
        groupName: "Motion System",
        kind: "component",
        layer: 1,
        icon: "zap",
        author: "Roboticela",
        license: "MIT",
        tags: ["foundation", "motion-system", c.name],
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
          { source: "files/components/ui/Motion.tsx", destination: "components/ui/Motion.tsx" },
          { source: "files/components/ui/MotionPresets.tsx", destination: "components/ui/MotionPresets.tsx" },
          { source: `files/components/ui/${entryName}`, destination: `components/ui/${entryName}` },
          { source: `files/styles/${c.name}.css`, destination: `styles/${c.name}.css` },
        ],
        injections: [],
        dependencies: { frontend: ["motion-tokens"] },
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
          { source: "files/src/components/ui/Motion.tsx", destination: "src/components/ui/Motion.tsx" },
          { source: "files/src/components/ui/MotionPresets.tsx", destination: "src/components/ui/MotionPresets.tsx" },
          { source: `files/src/components/ui/${entryName}`, destination: `src/components/ui/${entryName}` },
          { source: `files/src/styles/${c.name}.css`, destination: `src/styles/${c.name}.css` },
        ],
        injections: [],
        dependencies: { frontend: ["motion-tokens"] },
        envVars: [],
      },
      null,
      2
    ) + "\n"
  );
}

const registryPath = join(COMP, "registry.json");
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const names = new Set(["motion-tokens", ...companions.map((c) => c.name)]);

for (const entry of registry.components) {
  if (!names.has(entry.name)) continue;
  entry.stub = false;
  entry.latestVersion = "1.0.0";
  entry.icon = "zap";
  if (entry.name === "motion-tokens") {
    entry.displayName = "Motion Tokens";
    entry.description =
      "Motion System — Apple-inspired purposeful animations, reduced-motion support, stagger, hover/press, loading, and success feedback.";
    entry.tags = ["foundation", "theme-engine", "motion-tokens", "motion-system"];
  } else {
    const c = companions.find((x) => x.name === entry.name);
    entry.description = `${c.export} — part of the Motion System (motion-tokens).`;
    entry.tags = ["foundation", "motion-system", entry.name];
  }
}

registry.updatedAt = "2026-08-06T00:00:00Z";
write(registryPath, JSON.stringify(registry, null, 2) + "\n");

console.log("Motion system generated.");
