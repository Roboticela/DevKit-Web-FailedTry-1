# @roboticela/devkit

> Scaffold, extend, and theme full-stack projects with one command.

**DevKit** is the official CLI for [Roboticela](https://roboticela.com) templates. It lets you spin up a production-ready project, install full-stack feature components (auth, dashboard, billing, and more), and manage your design token system — all from the terminal.

```bash
npx @roboticela/devkit create my-app
```

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Templates](#templates)
- [Commands](#commands)
  - [create](#devkit-create)
  - [init](#devkit-init)
  - [add](#devkit-add)
  - [remove](#devkit-remove)
  - [list](#devkit-list)
  - [info](#devkit-info)
  - [update](#devkit-update)
  - [upgrade](#devkit-upgrade)
  - [doctor](#devkit-doctor)
  - [theme](#devkit-theme)
  - [install](#devkit-install)
  - [eject](#devkit-eject)
- [Customization that survives updates](#customization-that-survives-updates)
- [Configuration Files](#configuration-files)
- [Design Token System](#design-token-system)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Publishing a Release](#publishing-a-release)

---

## Installation

**Use without installing (recommended for project creation):**

```bash
npx @roboticela/devkit create my-app
```

**Install globally for repeated use:**

```bash
npm install -g @roboticela/devkit
devkit --version
```

**Requirements:** Node.js `>=20`

---

## Quick Start

```bash
# 1. Create a new project — fully interactive
npx @roboticela/devkit create

# 2. Move into it and fill in your secrets
cd my-app
cp .env.example .env

# 3. Check everything is wired up correctly
devkit doctor

# 4. Start developing
npm run dev
```

That's it. DevKit scaffolds the template, applies your theme, installs your chosen components, and prints exactly which environment variables you still need to fill in.

---

## Templates

DevKit targets two official templates. Every component declares which template(s) it supports — incompatible combinations are blocked before any files are written.

| ID | Stack | Platform |
|----|-------|----------|
| `nextjs-compact` | Next.js 16 · React 19 · TailwindCSS 4 · TypeScript | Web |
| `vite-express-tauri` | Vite 7 · React 19 · Express 5 · Tauri 2 · Prisma · TypeScript | Web + Desktop |

**Template compatibility matrix (selected components):**

```
Component            nextjs-compact   vite-express-tauri
──────────────────────────────────────────────────────
auth                       ✓                 ✓
profile                    ✓                 ✓
landing-page               ✓                 ✓
hero-section               ✓                 ✓
pricing                    ✓                 ✓
dashboard                  ✓                 ✓
blog                       ✓                 ✓
subscriptions              ✓                 ✓
file-upload                ✓                 ✓
docs-site                  ✓                 ✗  (Next.js MDX only)
desktop-updater            ✗                 ✓  (Tauri only)
desktop-tray               ✗                 ✓  (Tauri only)
offline-storage            ✗                 ✓  (Tauri only)
```

---

## Commands

### `devkit create`

Scaffold a brand-new project. This is the recommended starting point — it fetches the template, applies your theme, installs npm dependencies, adds your chosen components, and makes the first git commit in one go.

```bash
# Fully interactive
devkit create

# Pre-fill the project name
devkit create my-app

# Non-interactive: provide every flag
devkit create my-app \
  --template=vite-express-tauri \
  --preset=bold \
  --add=auth,hero-section,dashboard \
  --variant=hero-section:gradient-mesh \
  --git --install
```

**Flags:**

| Flag | Values | Description |
|------|--------|-------------|
| `--template` | `nextjs-compact` \| `vite-express-tauri` | Skip the template selection prompt |
| `--preset` | `default` \| `minimal` \| `bold` \| `playful` \| `corporate` | Theme preset |
| `--primary` | hex string | Override the primary brand color, e.g. `#e11d48` |
| `--git` | — | Initialize a git repository |
| `--no-git` | — | Skip git initialization |
| `--install` | — | Run `npm install` after scaffolding |
| `--no-install` | — | Skip `npm install` |
| `--add` | comma-separated | Components to add immediately, e.g. `--add=auth,pricing` |
| `--variant` | `component:variant` | Variant for a component, e.g. `--variant=hero-section:particles` |
| `-y, --yes` | — | Accept all defaults, skip all prompts |

**How it fetches the template:**

DevKit uses the GitHub Tarball API to download only the latest snapshot — no `git` binary required, and no commit history in your new project:

```
GET https://api.github.com/repos/Roboticela/NextJS-Template-DevKit/tarball/main
```

If the API is unreachable (rate limit or network issue), it falls back to `git clone --depth=1` automatically.

---

### `devkit init`

Initialize DevKit inside a project you have already cloned or set up manually. Auto-detects the template type by inspecting `package.json` and the directory structure.

> Prefer `devkit create` when starting fresh. Use `devkit init` only when adopting DevKit in an existing project.

```bash
devkit init
```

**What it creates:**

- `devkit.config.json` — pre-filled with your site info
- `devkit.lock.json` — empty, ready to track installed components
- `.devkit/` — directory for component manifests
- `.gitignore` entry for `.devkit/` cache files

---

### `devkit add`

Install one or more components into the current project.

```bash
# Interactive — browse the registry for your template, multi-select, then pick variants when needed
devkit add

# Same as above but only print what would be installed
devkit add --dry-run

# Single component
devkit add auth

# Component with a specific variant
devkit add hero-section --variant=split-image

# Multiple components at once
devkit add auth profile pricing

# Specific version
devkit add auth@2.0.0

# Preview what would be installed without touching any files
devkit add auth --dry-run
```

**Interactive mode** (no component names): DevKit loads components from the registry filtered by your template in `devkit.config.json`, excludes anything already in `devkit.lock.json`, and opens a terminal multiselect (space to toggle, enter to confirm). For each selected package that has variants, you get a follow-up prompt unless you passed `--variant=<id>` and that id exists for that component.

**What happens under the hood:**

1. Resolves the component version (latest unless pinned)
2. Checks template compatibility — exits with a clear error if incompatible
3. Reads `devkit.config.json` — prompts for any missing required fields
4. Downloads component files for the detected template
5. Copies files into the project (skips user-modified files, warns you)
6. Installs required npm packages (`npm install <packages>`)
7. Runs database migrations if the component needs them
8. Injects route registrations into your router file
9. Updates `devkit.lock.json`
10. Prints post-install instructions: which env vars to fill in and what to do next

---

### `devkit remove`

Uninstall a component and delete all files it owns.

```bash
devkit remove auth

# Remove from DevKit tracking but keep the files
devkit remove auth --keep-files
```

DevKit only deletes files it created. Files you have modified are flagged with a warning, and you decide whether to delete them.

---

### `devkit list`

Browse everything in the registry. Each row is a **package** with a **kind**:

- **`component`** — small UI building blocks (buttons, inputs, …) with no routes or backends.
- **`scaffold`** — full features (auth flows, hero sections, billing, …) that may add routes, APIs, and config.

```bash
devkit list
devkit list --template=nextjs-compact
devkit list --template=vite-express-tauri
devkit list --installed
devkit list --kind=component
devkit list --kind=scaffold
devkit list --category=authentication
devkit list --category=ui
```

**Example output:**

```
  Package            Kind         Category       Templates                  Installed
  ────────────────────────────────────────────────────────────────────────────────────────
  auth               scaffold     authentication nextjs-compact, vite-expr… v2.1.0
  hero-section       scaffold     marketing      nextjs-compact, vite-expr… -
  ui-button          component    ui             nextjs-compact, vite-expr… -
  ui-input           component    ui             nextjs-compact, vite-expr… -
```

---

### `devkit info`

Show full details for a component: description, version, variants, required config, files created, and changelog.

```bash
devkit info auth
devkit info hero-section
```

---

### `devkit update`

Update a specific component to its latest version (or a target version).

```bash
devkit update auth
devkit update auth@2.2.0
devkit update --all
```

**Updates vs. your edits**

For every file listed in the component manifest, DevKit stores a SHA-256 hash in `.devkit/<name>.manifest.json` after it writes the file. On a later `update` / `upgrade` / `install`, if the file on disk no longer matches that hash, DevKit treats it as **user-modified**: it **does not overwrite** that file, logs `Skipped (user-modified): <path>`, and **keeps** the file’s entry in the manifest with `userModified: true` and the current hash so the next run still respects your edit.

Registry **component authors** steer customization toward `devkit.config.json`, theme tokens, env vars, and user-owned assets—so managed code can update without clobbering your brand. See **[Customization that survives updates](#customization-that-survives-updates)** for backgrounds, logos, text, and other values that should stay stable across updates.

**Overwrite your own changes (`--force`)**

To replace managed files with the version from the registry **even when you edited them** (discarding those local edits for those paths):

```bash
devkit update auth --force
devkit update --all --force
```

Alias: `-f`.

---

### `devkit upgrade`

Upgrade all installed components to their latest versions in one step.

```bash
devkit upgrade

# Overwrite locally edited managed files with registry versions
devkit upgrade --force
```

---

### `devkit doctor`

Check the project for configuration issues, missing environment variables, and available updates. Run this whenever something doesn't work — it tells you exactly what is wrong.

```bash
devkit doctor
```

**Example output:**

```
✓ Template detected: vite-express-tauri
✓ DevKit initialized
✓ auth@2.1.0 — OK
⚠ profile@1.0.0 — Update available: 1.2.0
✗ auth — Missing: GOOGLE_CLIENT_SECRET (Google OAuth will not work)
✗ auth — Missing: SMTP_HOST (email sending disabled)
```

---

### `devkit theme`

Manage the global design token system. All DevKit components use CSS variables — change one token and every component updates instantly.

```bash
# Regenerate globals.css from your current devkit.config.json
devkit theme apply

# Preview generated CSS without writing any files
devkit theme preview

# Switch to a named preset
devkit theme preset bold

# Set a single token
devkit theme set colors.primary "#e11d48"

# List all current theme settings
devkit theme list

# Scan component files for hardcoded colors (anti-pattern detector)
devkit theme audit
```

**Built-in presets** (Design Constitution — system fonts, tonal elevation, no shadow/gradient tokens, DevKit scrollbars):

| Preset | Primary | Secondary | Radius personality | Style |
|--------|---------|-----------|--------------------|-------|
| `default` | System Blue `#0071e3` | Neutral `#86868b` | `balanced` | Calm, premium |
| `minimal` | Neutral `#424245` | Blue `#0071e3` | `sharp` | Restrained |
| `bold` | Bright Blue `#0a84ff` | Rose `#ff375f` | `soft` | Expressive |
| `playful` | Green `#30d158` | Amber `#ff9f0a` | `soft` | Friendly |
| `corporate` | Deep Blue `#1d4ed8` | Gray `#515154` | `sharp` | Formal |

Generated CSS includes constitution scales: `--space-*`, `--radius-0…10`, `--color-background-*` / `--color-surface-*` / `--color-text-*`, typography, motion durations, and semantic z-index. See `.cursor/rules/design-main-rule.mdc`.

---

### `devkit install`

Restore all components from `devkit.lock.json`. Designed for CI/CD pipelines and fresh checkouts — the equivalent of `npm ci` but for DevKit components.

```bash
devkit install

# Same, but overwrite any locally modified managed files (CI clean tree)
devkit install --force
```

---

### `devkit eject`

Stop DevKit from tracking a component without deleting its files. After ejecting, the files become entirely yours — no more updates via `devkit update`.

```bash
# Interactive — multiselect from installed components (from devkit.lock.json)
devkit eject

# Eject one component by name
devkit eject auth
```

---

## Customization that survives updates

You can change **backgrounds, logos, typography, marketing text, and almost everything visible** and still run `devkit update` to get **new component code** (bugfixes, features, security patches) without losing those customizations.

**How that works**

DevKit does not magic-merge hand-edited source files. The supported pattern is: **keep your product-specific values in data**, and **let generated pages/components read that data**. Then when an update ships new `.tsx` / `.ts` files, your strings and asset paths are still in `devkit.config.json`, theme tokens, and `public/` — so nothing important is overwritten.

| What you customize | Where it lives | On `devkit update` |
|--------------------|----------------|-------------------|
| **Brand colors, surfaces, radii, type scale** | `theme` in `devkit.config.json` + `devkit theme apply` → CSS variables | Component **code** can update; visuals stay controlled by tokens |
| **Site name, tagline, descriptions, logo/icon paths** | `site` and `site.branding` in `devkit.config.json` | Same — components should read `site`, not hardcode copy |
| **Image / logo files** | Files under `public/` (paths referenced from `site.branding.logo`, etc.) | Replace assets anytime; managed code only **references** paths |
| **Secrets, API keys** | `.env` + `${VAR}` placeholders in config | Unchanged by DevKit file copies |
| **Component-specific options** | Namespaced keys, e.g. `auth`, future `hero`, etc. (see each component’s docs / `devkit info`) | Same pattern |

**Registry expectation:** Roboticela components are authored to pull **labels, URLs, and asset paths** from `devkit.config.json` (and theme tokens for styling) instead of baking in “Acme Inc.” or `/default-logo.svg`. If you bypass that and edit managed files directly, `devkit update` will **skip** those files when it detects edits; use `--force` only when you accept losing local edits to those paths.

**Example — branding and copy in config**

```json
{
  "site": {
    "name": "Acme Analytics",
    "url": "https://acme.com",
    "icon": "/favicon.svg",
    "description": "Real-time dashboards for your team",
    "branding": {
      "logo": "/brand/logo.svg",
      "logoDark": "/brand/logo-dark.svg",
      "loginHeadline": "Welcome back",
      "loginSubtext": "Sign in to your workspace",
      "heroTagline": "Ship faster with confidence",
      "heroBackground": "/brand/hero-mesh.webp"
    }
  },
  "theme": {
    "preset": "bold",
    "colors": { "primary": "#0a84ff", "secondary": "#ff375f" },
    "fonts": { "sans": "system", "mono": "system" },
    "radius": "soft"
  }
}
```

Add keys your templates actually read — the schema allows extra `branding` keys. Extend `theme` with additional color or surface tokens as your template supports (`theme` accepts extra properties for generated CSS variables).

---

## Configuration Files

### `devkit.config.json`

The single source of truth for all component configuration. Committed to git. Sensitive values (API keys, secrets) are **referenced by env var name**, not stored directly.

```json
{
  "$schema": "https://registry.devkit.roboticela.com/schemas/devkit-config.json",
  "devkit": "1.0",
  "template": "vite-express-tauri",
  "site": {
    "name": "My App",
    "url": "https://myapp.com",
    "description": "My awesome application",
    "branding": {
      "logo": "/brand/logo.svg",
      "loginHeadline": "Welcome back"
    }
  },
  "theme": {
    "preset": "default",
    "colors": {
      "primary": "#0071e3",
      "secondary": "#86868b"
    },
    "fonts": {
      "sans": "system",
      "mono": "system"
    },
    "radius": "balanced",
    "darkMode": true,
    "darkModeStrategy": "class"
  },
  "auth": {
    "enabled": true,
    "providers": ["email", "google"],
    "google": {
      "clientId": "${GOOGLE_CLIENT_ID}",
      "clientSecret": "${GOOGLE_CLIENT_SECRET}"
    },
    "smtp": {
      "host": "${SMTP_HOST}",
      "port": 587,
      "user": "${SMTP_USER}",
      "password": "${SMTP_PASSWORD}",
      "from": "noreply@myapp.com"
    },
    "jwt": {
      "accessSecret": "${JWT_ACCESS_SECRET}",
      "refreshSecret": "${JWT_REFRESH_SECRET}",
      "accessExpiresIn": "15m",
      "refreshExpiresIn": "30d"
    }
  }
}
```

### `devkit.lock.json`

Version lock file — committed to git to ensure deterministic installs across machines and CI environments.

```json
{
  "lockVersion": 1,
  "template": "vite-express-tauri",
  "components": {
    "auth": {
      "version": "2.1.0",
      "variant": null,
      "resolved": "https://registry.devkit.roboticela.com/components/auth/2.1.0/vite-express-tauri.tar.gz",
      "integrity": "sha512:...",
      "installedAt": "2026-04-05T10:30:00Z"
    },
    "hero-section": {
      "version": "1.3.0",
      "variant": "split-image",
      "resolved": "https://registry.devkit.roboticela.com/components/hero-section/1.3.0/variants/split-image/vite-express-tauri.tar.gz",
      "integrity": "sha512:...",
      "installedAt": "2026-04-05T11:00:00Z"
    }
  }
}
```

---

## Design Token System

Every DevKit component uses **CSS custom properties** (variables) — no hardcoded colors, font sizes, or spacing values. This means changing your brand color in one place updates every button, form, card, and section across the entire app.

```
devkit.config.json  →  devkit theme apply  →  globals.css  →  all components
```

**Token categories:**

- **Brand colors** — primary, secondary with auto-derived hover, active, subtle, and text variants (WCAG AA contrast guaranteed)
- **Neutral / surface** — background, border, and card colors with dark mode variants
- **Semantic** — success, warning, error, info
- **Typography** — font families, sizes (`--text-xs` → `--text-6xl`), weights, line heights
- **Spacing** — `--space-1` through `--space-24`
- **Border radius** — `--radius-sm` through `--radius-full`
- **Shadows** and **transitions**

When you run `devkit theme set colors.primary "#e11d48"`, DevKit automatically computes and writes:

```
--color-primary        #e11d48   (your value)
--color-primary-hover  #c01140   (10% darker)
--color-primary-active #9e0d35   (20% darker)
--color-primary-subtle #fde8ed   (90% lighter tint)
--color-primary-text   #ffffff   (WCAG-compliant contrast)
```

---

## Environment Variables

All secrets live in `.env` and are never committed. DevKit generates a `.env.example` listing everything your installed components need:

```bash
# auth component
JWT_ACCESS_SECRET=        # generate: openssl rand -hex 32
JWT_REFRESH_SECRET=       # generate: openssl rand -hex 32
GOOGLE_CLIENT_ID=         # optional — enables Google OAuth
GOOGLE_CLIENT_SECRET=     # optional — enables Google OAuth
SMTP_HOST=                # optional — enables email sending
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=

# subscriptions component (if installed)
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
PADDLE_PRICE_BASIC=
PADDLE_PRICE_PRO=
PADDLE_PRICE_LIFETIME=

# storage component (if installed)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# database (vite-express-tauri)
DATABASE_URL=
```

Run `devkit doctor` at any time to see which variables are missing and what breaks without them.

**CLI registry override:**

```bash
# Point the CLI at a local registry during development
DEVKIT_REGISTRY=http://localhost:4000 devkit list
DEVKIT_REGISTRY=http://localhost:4000 devkit add auth
```

---

## Local Development

To work on the CLI itself:

```bash
# Install dependencies
cd cli
npm install

# Run directly with tsx (no build step needed)
npx tsx src/index.ts --help
npx tsx src/index.ts list
npx tsx src/index.ts create my-app

# Run against a local registry
DEVKIT_REGISTRY=http://localhost:4000 npx tsx src/index.ts list

# Lint
npm run lint

# Build to dist/
npm run build

# Run the compiled output
node dist/index.js --help
```

**Project structure:**

```
cli/
├── src/
│   ├── index.ts          ← Entry point — registers all commands
│   ├── commands/
│   │   ├── create.ts     ← devkit create
│   │   ├── init.ts       ← devkit init
│   │   ├── add.ts        ← devkit add
│   │   ├── remove.ts     ← devkit remove
│   │   ├── list.ts       ← devkit list
│   │   ├── info.ts       ← devkit info
│   │   ├── update.ts     ← devkit update / upgrade
│   │   ├── doctor.ts     ← devkit doctor
│   │   └── theme.ts      ← devkit theme *
│   └── lib/
│       ├── config.ts     ← Read/write devkit.config.json & devkit.lock.json
│       ├── installer.ts  ← Download + extract component tarballs
│       └── logger.ts     ← Consistent terminal output helpers
├── dist/                 ← Compiled output (generated by npm run build)
├── scripts/
│   └── post-build.js     ← Makes dist/index.js executable after tsc
├── package.json
└── tsconfig.json
```

---

## Publishing a Release

The CLI is published as `@roboticela/devkit` on npm.

```bash
cd cli

# Login once
npm login

# Publish a patch release  (2.0.0 → 2.0.1)
npm run release:patch

# Publish a minor release  (2.0.0 → 2.1.0)
npm run release:minor

# Publish a major release  (2.0.0 → 3.0.0)
npm run release:major
```

Each release script bumps the version in `package.json`, runs `npm run build` via `prepublishOnly`, and publishes with `--access public`.

After publishing:

```bash
npx @roboticela/devkit create my-app   # always runs the latest published version
npm install -g @roboticela/devkit       # or install globally
```

---

## License

MIT — [Roboticela](https://roboticela.com)
