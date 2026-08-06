# Roboticela DevKit — Monorepo

> Clean slate for **Phase 1: Components**. Registry is empty; CLI + registry server scaffolding remains.

---

## Folder Structure

```
DevKit/
├── .cursor/rule/design-rule.md   ← Apple-level design language
├── devkit-plan.md                ← Full system plan
├── registry/                     ← Hono registry server + component packages
│   └── components/
│       └── registry.json         ← Empty index (start adding components here)
└── cli/                          ← @roboticela/devkit CLI
```

---

## Phase 1 — Components

Add each component under `registry/components/<name>/` and register it in `registry/components/registry.json`.

No components are published yet.

---

## Registry Server

```bash
cd registry
npm install
npm run dev
# → http://localhost:4000
# → GET /health
# → GET /api/v1/components  (empty list)
```

---

## CLI

```bash
cd cli
npm install
npx tsx src/index.ts list
```

Local registry override: `DEVKIT_REGISTRY=http://localhost:4000`

---

## Roadmap

<<<<<<< HEAD
See `devkit-plan.md` Section 18 for milestones. Design language: `.cursor/rule/design-rule.md`.
=======
```bash
cd test-vite-express

# Local registry
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts init
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts add auth
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts add hero-section --variant=split-image

# Start frontend
npm install && npm run dev

# Start server (separate terminal)
cd server && npm install && npm run dev
```

---

## Create a Brand New Project

```bash
# Fully interactive — uses production registry by default
npx @roboticela/devkit create

# Or with local registry
DEVKIT_REGISTRY=http://localhost:4000 npx tsx cli/src/index.ts create

# Non-interactive
npx tsx cli/src/index.ts create my-app \
  --template=nextjs-compact \
  --preset=bold \
  --add=auth,hero-section \
  --variant=hero-section:centered \
  --git --install
```

---

## Registry API

With the registry server running at `http://localhost:4000`:

```bash
# Health check
curl http://localhost:4000/health

# List all components
curl http://localhost:4000/api/v1/components

# List for a specific template
curl "http://localhost:4000/api/v1/components?template=nextjs-compact"

# Component metadata
curl http://localhost:4000/api/v1/components/auth
curl http://localhost:4000/api/v1/components/hero-section

# Component manifest (what files get created)
curl "http://localhost:4000/api/v1/components/auth/manifest?template=nextjs-compact&version=latest"
curl "http://localhost:4000/api/v1/components/hero-section/manifest?template=nextjs-compact&version=latest&variant=centered"
```

---

## CLI Commands Reference

```bash
devkit create [name]              # Scaffold new project interactively
devkit init                       # Initialize DevKit in existing project
devkit list                       # List packages (kinds: component vs scaffold)
devkit list --kind=component      # UI primitives only
devkit list --kind=scaffold       # Full features only
devkit list --installed           # Show only installed
devkit info <name>                # Component details + variants
devkit add                        # Interactive picker (registry + variants)
devkit add <name>                 # Install component(s)
devkit add <name> --variant=<id>  # Install with specific variant
devkit remove <name>              # Uninstall component
devkit update <name>              # Update to latest version
devkit update <name> --force      # Update; overwrite your edits to managed files
devkit upgrade                    # Upgrade all components
devkit upgrade --force             # Upgrade; overwrite your edits to managed files
devkit doctor                     # Check config + env vars
devkit theme apply                # Regenerate CSS from config
devkit theme preset <name>        # Switch theme preset
devkit theme set <key> <value>    # Set single token
devkit theme list                 # Show current theme
devkit install                    # CI: restore from lock file
devkit install --force            # Restore; overwrite local edits to managed files
devkit eject                      # Interactive: pick installed component(s)
devkit eject <name>               # Stop tracking, keep files
```

---

## Theme Presets

```bash
devkit theme preset default       # Indigo + Amber
devkit theme preset minimal       # Slate + Sky
devkit theme preset bold          # Violet + Pink
devkit theme preset playful       # Emerald + Orange
devkit theme preset corporate     # Blue + Gray
```

---

## Publishing the CLI to npm

```bash
cd cli

# Login to npm (once)
npm login

echo "//registry.npmjs.org/:_authToken=<YOUR_TOKEN>" >> ~/.npmrc

# Publish patch release (1.0.0 → 1.0.1)
./scripts/publish.sh patch

# Publish minor release (1.0.0 → 1.1.0)
./scripts/publish.sh minor

# Publish major release (1.0.0 → 2.0.0)
./scripts/publish.sh major
```

After publishing, anyone can use:

```bash
npx @roboticela/devkit create my-app
npm install -g @roboticela/devkit
devkit create my-app
```

---

## Available Components

| Component | Templates | Variants |
|-----------|-----------|----------|
| `auth` | Both | None — config-based |
| `hero-section` | Both | centered, split-image, gradient-mesh, minimal |

More components in the roadmap — see `devkit-plan.md` Section 10.
>>>>>>> 7591010560bffb2a1c177bd24e01dffd3e3bbb02
