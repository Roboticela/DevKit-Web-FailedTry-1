# Roboticela DevKit — Monorepo

> Full implementation of the DevKit plan. One registry server, one CLI, two test projects.

---

## Folder Structure

```
DevKit-Planning/
├── devkit-plan.md              ← Full system plan
├── registry/                   ← Hono registry server + all component files
├── cli/                        ← @roboticela/devkit CLI (published to npm)
├── test-nextjs/                ← Test project: nextjs-compact template
├── test-vite-express/          ← Test project: vite-express-tauri template
├── NextJS-Template-DevKit/     ← Official Next.js template (cloned by devkit create)
└── Vite-ExpressJS-Tauri-Template-DevKit/  ← Official Vite template
```

---

## Quick Start (Live Demo)

Open **3 terminals** and run these in order:

### Terminal 1 — Registry Server

```bash
cd registry
npm install
npm run dev
# → Registry running at http://localhost:4000
# → GET /health
# → GET /api/v1/components
```

### Terminal 2 — CLI (local dev mode)

> **Default registry:** `https://api.devkit.roboticela.com`
> **Local override:** set `DEVKIT_REGISTRY=http://localhost:4000` to point at your local registry.

```bash
cd cli
npm install

# Against production registry (default — no env var needed)
npx tsx src/index.ts list
npx tsx src/index.ts info auth

# Against local registry
DEVKIT_REGISTRY=http://localhost:4000 npx tsx src/index.ts list
DEVKIT_REGISTRY=http://localhost:4000 npx tsx src/index.ts info hero-section
```

### Terminal 3 — Test Project (NextJS)

```bash
cd test-nextjs

# ── Using local registry (dev mode) ──────────────────────────────

# Initialize DevKit
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts init
# → Detects: nextjs-compact
# → Creates devkit.config.json, devkit.lock.json, generates globals.css

# List available components
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts list

# Add auth component
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts add auth

# Add hero-section with a variant
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts add hero-section --variant=centered

# Change theme to bold preset
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts theme preset bold

# Change primary color directly
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts theme set colors.primary "#e11d48"

# Check for issues
DEVKIT_REGISTRY=http://localhost:4000 npx tsx ../cli/src/index.ts doctor

# ── Using production registry (default — no env var needed) ──────

npx tsx ../cli/src/index.ts list
npx tsx ../cli/src/index.ts add auth

# Run the Next.js app
npm install && npm run dev
```

---

## Test Project — Vite + Express

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
devkit list                       # List available components
devkit list --installed           # Show only installed
devkit info <name>                # Component details + variants
devkit add <name>                 # Install component
devkit add <name> --variant=<id>  # Install with specific variant
devkit remove <name>              # Uninstall component
devkit update <name>              # Update to latest version
devkit upgrade                    # Upgrade all components
devkit doctor                     # Check config + env vars
devkit theme apply                # Regenerate CSS from config
devkit theme preset <name>        # Switch theme preset
devkit theme set <key> <value>    # Set single token
devkit theme list                 # Show current theme
devkit install                    # CI: restore from lock file
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
