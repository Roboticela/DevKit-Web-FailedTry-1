# Roboticela DevKit — Complete System Plan

> **Version:** 1.0 — April 2026
> **Author:** Roboticela
> **Purpose:** Full architecture and roadmap for the Roboticela DevKit modular component registry, CLI, and plugin system.

---

## Table of Contents

1. [Vision & Goals](#1-vision--goals)
2. [Template Ecosystem](#2-template-ecosystem)
3. [System Architecture Overview](#3-system-architecture-overview)
4. [DevKit CLI](#4-devkit-cli)
5. [Component Anatomy](#5-component-anatomy)
6. [Configuration System](#6-configuration-system)
7. [Global Design Token & Theming System](#7-global-design-token--theming-system)
8. [Registry Architecture](#8-registry-architecture)
9. [Versioning & Compatibility Strategy](#9-versioning--compatibility-strategy)
10. [Essential Components Catalog](#10-essential-components-catalog)
11. [Variant System](#11-variant-system)
12. [Cross-Platform Support](#12-cross-platform-support)
13. [Hosting & Deployment of the Registry](#13-hosting--deployment-of-the-registry)
14. [Developer Workflow (End-to-End)](#14-developer-workflow-end-to-end)
15. [Registry Folder Structure](#15-registry-folder-structure)
16. [Project Folder Structure After Install](#16-project-folder-structure-after-install)
17. [Component Development Guide](#17-component-development-guide)
18. [Roadmap & Milestones](#18-roadmap--milestones)

---

## 1. Vision & Goals

### The Core Idea

DevKit is a **modular full-stack plugin system** for Roboticela's two official templates. Instead of writing boilerplate code repeatedly for every new project, a developer installs components that deliver:

- **Full backend routes** (API endpoints, middleware, database models)
- **Full frontend pages** (React pages, context providers, layouts)
- **Complete UI** (forms, dialogs, navigation, buttons — all styled)
- **Required dependencies** (auto-installed via npm)
- **Required environment variables** (auto-detected and prompted)

All from a single command like:

```bash
devkit add auth
devkit add hero-section --variant=split-image
devkit add profile
```

### Goals

| Goal | Description |
|------|-------------|
| **Zero rewriting** | Once installed, a component never needs manual re-wiring |
| **Configuration, not code** | The user provides credentials/keys via config; DevKit does the rest |
| **Template-aware** | Components know which template they target; incompatible components are hidden or blocked |
| **Variant selection** | Only the chosen variant's code is downloaded — no bloat |
| **Non-breaking updates** | Updating a component does not change user-modified files; only managed files are updated |
| **Reversible** | Any component can be fully removed by one command |
| **Version-locked** | Projects lock to a specific component version; upgrades are explicit and opt-in |
| **Offline-friendly** | Components can be cached locally after first install |
| **Cross-platform** | Components declare support for web-only, desktop-only, or both |

---

## 2. Template Ecosystem

DevKit supports exactly two official templates. Every component must declare which template(s) it targets.

### Template A — `nextjs-compact`

**Full name:** NextJS Compact DevKit Template
**Internal ID:** `nextjs-compact`
**GitHub Repository:** `https://github.com/Roboticela/NextJS-Template-DevKit`
**Tarball (latest):** `https://api.github.com/repos/Roboticela/NextJS-Template-DevKit/tarball/main`

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Next.js 16 (App Router) |
| UI Library | React 19 |
| Styling | TailwindCSS 4 |
| Language | TypeScript 5 |
| Rendering | SSR / RSC (Server Components) |
| Platform | Web only |

**When to use:** Projects that need server-side rendering, SEO, React Server Components, or Next.js API routes built in. No separate backend server needed.

**Local reference:** `NextJS-Template-DevKit/`

---

### Template B — `vite-express-tauri`

**Full name:** Wide Express (Vite + Express + Tauri) DevKit Template
**Internal ID:** `vite-express-tauri`
**GitHub Repository:** `https://github.com/Roboticela/Vite-ExpressJS-Tauri-Template-DevKit`
**Tarball (latest):** `https://api.github.com/repos/Roboticela/Vite-ExpressJS-Tauri-Template-DevKit/tarball/main`

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Vite 7 + React 19 + React Router 7 |
| Styling | TailwindCSS 4 |
| Language | TypeScript 5 |
| Backend | Node.js + Express 5 |
| Database ORM | Prisma (PostgreSQL by default) |
| Desktop Runtime | Tauri 2 (Rust) |
| Platform | Web + Desktop (Linux, Windows, macOS) |

**When to use:** Projects that need a separate Express API backend, cross-platform desktop app distribution, or more control over the server layer.

**Local reference:** `Vite-ExpressJS-Tauri-Template-DevKit/`

---

### Template Compatibility Matrix

The table below indicates which components apply to which template. This is enforced by the CLI.

```
Component                    nextjs-compact   vite-express-tauri
─────────────────────────────────────────────────────────────────
auth                              ✓                   ✓
profile                           ✓                   ✓
landing-page                      ✓                   ✓
hero-section (variants)           ✓                   ✓
pricing                           ✓                   ✓
blog                              ✓                   ✓
dashboard                         ✓                   ✓
admin-panel                       ✓                   ✓
notifications                     ✓                   ✓
subscriptions/paddle              ✓                   ✓
file-upload                       ✓                   ✓
contact-form                      ✓                   ✓
waitlist                          ✓                   ✓
changelog                         ✓                   ✓
docs-site                         ✓                   ✗ (Next.js MDX only)
desktop-updater                   ✗                   ✓ (Tauri only)
desktop-tray                      ✗                   ✓ (Tauri only)
deep-link-auth                    ✗                   ✓ (Tauri OAuth callback)
offline-storage                   ✗                   ✓ (IndexedDB + Tauri)
system-notifications              ✗                   ✓ (Tauri only)
```

---

## 3. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEVELOPER'S PROJECT                         │
│                                                                 │
│  devkit.config.json  ←── User-provided secrets & site info     │
│  devkit.lock.json    ←── Version-locked installed components    │
│  .devkit/            ←── Component metadata & managed files     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  DEVKIT CLI (npm package)                │  │
│  │                                                          │  │
│  │   devkit create  devkit init   devkit add    devkit remove│  │
│  │   devkit list    devkit update devkit upgrade devkit theme│  │
│  │   devkit info    devkit config devkit eject  devkit doctor│  │
│  └────────────────────┬──────────────────┬────────────────────┘  │
└───────────────────────┼──────────────────┼────────────────────────┘
          │ HTTPS (devkit create)           │ HTTPS (devkit add/update)
          ▼                                 ▼
┌──────────────────────────────┐  ┌────────────────────────────────────┐
│   TEMPLATE REPOS (GitHub)    │  │      DEVKIT REGISTRY (Hosted)      │
│                              │  │                                    │
│  NextJS-Template-DevKit      │  │  registry.devkit.roboticela.com/api/v1/   │
│  → /tarball/main (primary)   │  │  ├── components/                   │
│  → git clone --depth=1       │  │  ├── components/:name              │
│    (fallback)                │  │  ├── components/:name/variants     │
│                              │  │  └── components/:name/download     │
│  Vite-ExpressJS-Tauri-       │  │                                    │
│  Template-DevKit             │  │  GitHub: Roboticela/devkit-registry│
│  → /tarball/main (primary)   │  │  CDN: cdn.roboticela.com/devkit/   │
│  → git clone --depth=1       │  └────────────────────────────────────┘
│    (fallback)                │
└──────────────────────────────┘
```

---

## 4. DevKit CLI

### Installation

The DevKit CLI is published as an npm package:

```bash
npm install -g @roboticela/devkit
# or use without global install:
npx @roboticela/devkit <command>
```

### Commands

#### `devkit create`

Scaffold a brand-new project from scratch — selecting a template, setting up git, installing dependencies, running `devkit init`, and applying a theme — all in one interactive flow. This is the **recommended starting point** for any new project.

```bash
# Interactive (recommended)
devkit create

# With project name pre-filled
devkit create my-app

# Non-interactive (all flags provided)
devkit create my-app --template=vite-express-tauri --preset=bold --git --install
```

**Full interactive terminal flow:**

```
┌─────────────────────────────────────────────────────────────┐
│         Roboticela DevKit — Create New Project              │
│                       v1.0.0                                │
└─────────────────────────────────────────────────────────────┘

? Project name › my-saas-app

? Select a template ›
  ● NextJS Compact
      Next.js 16 · React 19 · TailwindCSS 4 · TypeScript
      Best for: web apps, SEO, server-side rendering
      Platform: Web only

  ○ Wide Express  (Vite + Express + Tauri)
      Vite 7 · React 19 · Express 5 · Tauri 2 · Prisma · TailwindCSS 4
      Best for: web + desktop apps, custom backend API, cross-platform
      Platform: Web + Desktop (Linux, Windows, macOS)

? Site display name › My SaaS App
? Site URL (used in emails and OAuth redirects) › https://mysaasapp.com
? Short description › The best SaaS in the world

? Select a theme preset ›
  ● Default    — Indigo + Amber    — Modern SaaS
  ○ Minimal    — Slate + Sky       — Clean, editorial
  ○ Bold       — Violet + Pink     — Vibrant, expressive
  ○ Playful    — Emerald + Orange  — Friendly, rounded
  ○ Corporate  — Blue + Gray       — Formal, enterprise

? Primary brand color (hex, leave blank to use preset) › #6366f1
? Initialize a git repository? › Yes
? Install npm dependencies now? › Yes

? Add components now? (you can always run devkit add later)
  [space to select, enter to confirm]
  ◉ auth            — Full authentication system
  ◉ hero-section    — Landing page hero banner
  ○ profile         — User profile pages
  ○ pricing         — Pricing table
  ○ dashboard       — App dashboard layout
  ○ contact-form    — Contact / support form

? Hero section variant ›
  ○ centered          — Classic centered heading + CTA
  ● split-image       — Text left, screenshot right
  ○ video-background  — Full-screen video background
  ○ gradient-mesh     — Animated gradient mesh
  ○ particles         — Interactive particle canvas
  ○ minimal           — Typography only, no decoration


Creating project...

  ✓ Fetching template: nextjs-compact
      → GET api.github.com/repos/Roboticela/NextJS-Template-DevKit/tarball/main
      → Downloaded 4.2 MB · Extracted to my-saas-app/
  ✓ Initialized git repository
  ✓ Applied theme preset: default (primary: #6366f1)
  ✓ Generated globals.css with full token set
  ✓ Created devkit.config.json
  ✓ Created devkit.lock.json
  ✓ Installing npm dependencies...
  ✓ npm install complete
  ✓ Adding component: auth@2.1.0
      → Created app/auth/login/page.tsx
      → Created app/auth/register/page.tsx
      → Created app/auth/forgot-password/page.tsx
      → Created app/auth/reset-password/page.tsx
      → Created app/auth/verify-email/page.tsx
      → Created app/api/auth/[...route]/route.ts
      → Created components/auth/LoginForm.tsx
      → Created components/auth/RegisterForm.tsx
      → Injected AuthProvider into app/layout.tsx
      → npm install: jsonwebtoken bcryptjs nodemailer
  ✓ Adding component: hero-section@1.3.0 (variant: split-image)
      → Created components/hero/HeroSection.tsx
      → Created components/hero/HeroImage.tsx
      → Injected HeroSection into app/page.tsx


Project ready! 🎉

  Location    my-saas-app/
  Template    nextjs-compact
  Theme       default (primary: #6366f1)
  Components  auth, hero-section (split-image)

Next steps:
  cd my-saas-app
  cp .env.example .env          # Fill in your secrets
  devkit doctor                 # Check for missing config
  npm run dev                   # Start development server

Required environment variables (auth component):
  GOOGLE_CLIENT_ID              (optional — Google OAuth)
  GOOGLE_CLIENT_SECRET          (optional — Google OAuth)
  SMTP_HOST                     (optional — email sending)
  SMTP_USER                     (optional — email sending)
  SMTP_PASSWORD                 (optional — email sending)
  JWT_ACCESS_SECRET             ← generate with: openssl rand -hex 32
  JWT_REFRESH_SECRET            ← generate with: openssl rand -hex 32

Run devkit add <component> anytime to add more components.
```

**Template Source Repositories**

The CLI fetches templates directly from the official Roboticela GitHub repositories. These are the single source of truth — whatever is on the `main` branch of each repo is what gets scaffolded:

| Template ID | GitHub Repository | Default Branch |
|-------------|------------------|----------------|
| `nextjs-compact` | `https://github.com/Roboticela/NextJS-Template-DevKit` | `main` |
| `vite-express-tauri` | `https://github.com/Roboticela/Vite-ExpressJS-Tauri-Template-DevKit` | `main` |

These URLs are baked into the CLI source. When Roboticela updates a template repo (e.g. upgrades Next.js, bumps Tauri), every new project created with `devkit create` automatically gets the latest version — no CLI update required.

---

**How the CLI fetches the template — GitHub Tarball API**

The CLI does **not** require `git` to be installed on the user's machine and does **not** do a full `git clone` (which would download the entire commit history unnecessarily). Instead it uses the **GitHub Tarball API** to download only the latest snapshot as a compressed archive, then extracts it:

```
Primary method — GitHub Tarball API (recommended, no git required):

  https://api.github.com/repos/Roboticela/NextJS-Template-DevKit/tarball/main
  https://api.github.com/repos/Roboticela/Vite-ExpressJS-Tauri-Template-DevKit/tarball/main

  Steps internally:
  1. HTTP GET to the tarball URL (GitHub redirects to a CDN download)
  2. Stream-decompress the .tar.gz into a temp directory
  3. Move contents into the target project folder
  4. Delete the temp directory

Fallback method — git clone (if GitHub API is unreachable or rate-limited):

  git clone --depth=1 https://github.com/Roboticela/NextJS-Template-DevKit.git <project-name>
  git clone --depth=1 https://github.com/Roboticela/Vite-ExpressJS-Tauri-Template-DevKit.git <project-name>

  --depth=1 fetches only the latest commit, not the full history.
  The .git folder is then deleted before devkit init runs.
```

The tarball approach is the same strategy used by `create-next-app`, `create-vite`, and `degit`. It is fast (~2–5 seconds for the download), requires no git binary on the machine, and produces a clean directory with no git history attached.

---

**What `devkit create` does step by step:**
1. Collect project name, template choice, site info, theme preset, initial components via interactive prompts
2. Fetch the template from GitHub using the **Tarball API** (fallback to `git clone --depth=1` if API fails)
3. Extract template files into the new project folder — no `.git` directory included
4. Run `git init` to start a clean, fresh repository for the user's project
5. Generate `globals.css` / `src/index.css` with the full CSS token set based on theme selection
6. Write `devkit.config.json` pre-filled with all answers from the prompts
7. Write an empty `devkit.lock.json`
8. Run `npm install` to install all base template dependencies
9. For each component selected during creation, run the equivalent of `devkit add <component>` inline
10. Make the initial git commit: `chore: init project with DevKit`
11. Print the summary and next-step instructions

**Flags:**

| Flag | Type | Description |
|------|------|-------------|
| `--template` | `nextjs-compact` \| `vite-express-tauri` | Skip template selection prompt |
| `--preset` | `default` \| `minimal` \| `bold` \| `playful` \| `corporate` | Skip theme preset prompt |
| `--primary` | hex string | Override primary color directly |
| `--git` | boolean | Auto-initialize git without prompting |
| `--no-git` | boolean | Skip git initialization |
| `--install` | boolean | Auto-run npm install without prompting |
| `--no-install` | boolean | Skip npm install |
| `--add` | comma-separated | Components to add immediately, e.g. `--add=auth,hero-section` |
| `--variant` | `component:variant` | Variant for a component, e.g. `--variant=hero-section:particles` |
| `--yes` | boolean | Accept all defaults, skip all prompts |

**Quick start examples:**

```bash
# Fully interactive
devkit create

# Named project, fully interactive for everything else
devkit create my-blog

# Skip all prompts, use defaults
devkit create my-app --yes

# Specific template + theme + components, non-interactive
devkit create my-app \
  --template=vite-express-tauri \
  --preset=bold \
  --add=auth,hero-section,dashboard \
  --variant=hero-section:gradient-mesh \
  --variant=dashboard:sidebar \
  --git --install

# Also available as npx (no global install required)
npx @roboticela/devkit create my-app
```

---

#### `devkit init`

Initialize DevKit inside an **already existing** project (one that was manually cloned or already set up). Auto-detects which template is being used.

> **Note:** When starting fresh, prefer `devkit create` — it does everything `devkit init` does and more. Use `devkit init` only when adopting DevKit into a pre-existing project.

```bash
devkit init
```

**What it does:**
1. Detects template type (`nextjs-compact` or `vite-express-tauri`) by inspecting `package.json` and directory structure
2. Creates `devkit.config.json` with required fields
3. Creates `devkit.lock.json` (empty)
4. Creates `.devkit/` directory
5. Adds `.devkit/` entries to `.gitignore` where appropriate
6. Prompts user for basic site info: site name, site URL, icon path

---

#### `devkit list`

List all available components in the registry.

```bash
devkit list
devkit list --template=nextjs-compact
devkit list --template=vite-express-tauri
devkit list --installed
devkit list --category=auth
devkit list --category=ui
```

**Sample output:**
```
┌────────────────────┬──────────────────────────────┬──────────────────────────────┬──────────────┐
│ Component          │ Description                  │ Template Support              │ Installed    │
├────────────────────┼──────────────────────────────┼──────────────────────────────┼──────────────┤
│ auth               │ Full auth system             │ nextjs-compact, vite-express  │ v2.1.0  ✓   │
│ profile            │ User profile pages           │ nextjs-compact, vite-express  │ -            │
│ hero-section       │ Landing hero (6 variants)    │ nextjs-compact, vite-express  │ -            │
│ pricing            │ Pricing table (3 variants)   │ nextjs-compact, vite-express  │ -            │
│ desktop-tray       │ System tray icon & menu      │ vite-express-tauri only       │ -            │
│ docs-site          │ MDX documentation site       │ nextjs-compact only           │ -            │
└────────────────────┴──────────────────────────────┴──────────────────────────────┴──────────────┘
```

---

#### `devkit info <component>`

Show detailed information about a component.

```bash
devkit info auth
devkit info hero-section
```

**Sample output:**
```
Component: auth
Description: Full authentication system — login, register, forgot password,
             reset password, email verification, Google OAuth.

Version:    2.1.0
Category:   Authentication
Templates:  nextjs-compact, vite-express-tauri
Platform:   web, desktop

Variants:   (none — auth has no UI variants, only config-based options)

Required Config:
  - site.name          (site name, used in email templates)
  - site.url           (used for redirect URLs)
  - secrets.jwtSecret  (auto-generated if missing)

Optional Config:
  - auth.google.clientId
  - auth.google.clientSecret
  - auth.smtp.host
  - auth.smtp.port
  - auth.smtp.user
  - auth.smtp.password
  - auth.smtp.from

Creates (nextjs-compact):
  app/auth/login/page.tsx
  app/auth/register/page.tsx
  app/auth/forgot-password/page.tsx
  app/auth/reset-password/page.tsx
  app/auth/verify-email/page.tsx
  app/api/auth/[...route]/route.ts
  components/auth/LoginForm.tsx
  components/auth/RegisterForm.tsx
  lib/auth/authService.ts
  lib/auth/jwtService.ts

Creates (vite-express-tauri):
  src/pages/auth/LoginPage.tsx
  src/pages/auth/RegisterPage.tsx
  src/pages/auth/ForgotPasswordPage.tsx
  src/pages/auth/ResetPasswordPage.tsx
  src/pages/auth/VerifyEmailPage.tsx
  src/components/auth/LoginForm.tsx
  src/components/auth/RegisterForm.tsx
  src/lib/authService.ts
  server/routes/auth.ts
  server/middleware/requireAuth.ts
  server/services/jwtService.ts
  server/services/emailService.ts
  server/prisma/migrations/[timestamp]_add_auth/

Changelog:
  v2.1.0 — Add rate limiting, improve email templates
  v2.0.0 — Rewrite for Express 5, breaking change from v1.x
  v1.3.2 — Fix Google OAuth callback URL handling
```

---

#### `devkit add <component>`

Install a component into the current project.

```bash
# Basic install
devkit add auth

# Install with specific variant
devkit add hero-section --variant=split-image

# Install multiple at once
devkit add auth profile landing-page

# Install a specific version
devkit add auth@2.0.0

# Dry run — show what would be created without writing files
devkit add auth --dry-run
```

**Installation process:**
1. Resolve component version (latest unless specified)
2. Check template compatibility — exit with error if incompatible
3. Read `devkit.config.json` — prompt for any missing required fields
4. Download component files for the detected template
5. Copy files into the project (skip user-modified files, warn)
6. Install required npm dependencies (`npm install <packages>`)
7. Run any component migration scripts (e.g., Prisma migrations)
8. Inject route registrations into router file
9. Update `devkit.lock.json`
10. Print post-install instructions (env vars to set, next steps)

---

#### `devkit remove <component>`

Uninstall a component and all files it owns.

```bash
devkit remove auth
devkit remove hero-section
devkit remove auth --keep-files   # Remove from devkit tracking but keep files
```

**What it does:**
1. Reads `.devkit/<component>.manifest.json` for the list of managed files
2. Deletes all managed files that have not been modified by the user (warns before deleting modified files)
3. Removes injected route registrations
4. Removes npm dependencies that are no longer needed
5. Removes entry from `devkit.lock.json`

---

#### `devkit update <component>`

Update a specific component to the latest version (or a target version).

```bash
devkit update auth
devkit update auth@2.2.0
devkit update --all
```

**Update strategy:**
- Compares installed version with target version
- If files have been modified by the user (detected via hash comparison), warns and skips those files
- Only updates **managed files** (files that have not been user-modified)
- Runs new migrations if applicable
- Updates `devkit.lock.json`

---

#### `devkit upgrade`

Upgrade all installed components to their latest versions in one step.

```bash
devkit upgrade
devkit upgrade --dry-run   # Preview changes without applying
```

---

#### `devkit config`

View and set configuration values.

```bash
devkit config list
devkit config set auth.google.clientId "YOUR_CLIENT_ID"
devkit config set auth.smtp.host "smtp.gmail.com"
devkit config get auth.google.clientId
devkit config reset auth.google.clientId
```

---

#### `devkit eject <component>`

Remove DevKit tracking from a component without deleting its files. The files become entirely the user's responsibility — no further updates via DevKit.

```bash
devkit eject auth
```

---

#### `devkit doctor`

Check the project for configuration issues, missing env vars, and outdated components.

```bash
devkit doctor
```

**Sample output:**
```
✓ Template detected: vite-express-tauri
✓ DevKit initialized
✓ auth@2.1.0 — OK
⚠ profile@1.0.0 — Update available: 1.2.0
✗ auth — Missing: auth.google.clientSecret (Google OAuth will not work)
✗ auth — Missing: auth.smtp.host (email sending disabled)
```

---

## 5. Component Anatomy

### What a Component Is

A component in DevKit is **not** just a UI component. It is a self-contained feature unit that may include:

| Layer | Example for `auth` component |
|-------|------------------------------|
| **Frontend Pages** | Login, Register, Forgot Password, Reset Password, Verify Email |
| **Frontend Components** | LoginForm, RegisterForm, OAuthButton, PasswordInput |
| **Frontend Context** | AuthContext, useAuth hook |
| **Backend Routes** | POST /api/auth/login, POST /api/auth/register, GET /api/auth/google |
| **Backend Services** | jwtService, emailService, googleOAuthService |
| **Backend Middleware** | requireAuth, requireAdmin |
| **Database Schema** | User model, Session model, VerificationToken model |
| **Email Templates** | Welcome, Email Verification, Password Reset |
| **Environment Variables** | JWT_SECRET, GOOGLE_CLIENT_ID, SMTP_HOST |
| **npm Dependencies** | jsonwebtoken, nodemailer, @google-auth-library |
| **Route Injections** | Auto-adds routes to the router index file |

### Component Manifest

Every installed component has a manifest at `.devkit/<component>.manifest.json`:

```json
{
  "name": "auth",
  "version": "2.1.0",
  "template": "vite-express-tauri",
  "installedAt": "2026-04-05T10:30:00Z",
  "variant": null,
  "managedFiles": [
    {
      "path": "src/pages/auth/LoginPage.tsx",
      "hash": "sha256:abc123...",
      "userModified": false
    },
    {
      "path": "src/pages/auth/RegisterPage.tsx",
      "hash": "sha256:def456...",
      "userModified": false
    },
    {
      "path": "server/routes/auth.ts",
      "hash": "sha256:ghi789...",
      "userModified": true
    }
  ],
  "injections": [
    {
      "file": "src/main.tsx",
      "type": "route",
      "marker": "/* devkit:auth:routes */",
      "content": "<Route path=\"/auth/*\" element={<AuthRouter />} />"
    },
    {
      "file": "server/src/index.ts",
      "type": "route",
      "marker": "/* devkit:auth:api */",
      "content": "app.use('/api/auth', authRouter);"
    }
  ],
  "dependencies": {
    "frontend": ["@google-auth-library/oauth2"],
    "backend": ["jsonwebtoken", "nodemailer", "bcryptjs"]
  }
}
```

---

## 6. Configuration System

### `devkit.config.json`

This is the single source of truth for all component configuration. It lives at the project root and is committed to git. Sensitive values (secrets, keys) are **referenced by env var name**, not stored directly.

```json
{
  "$schema": "https://registry.devkit.roboticela.com/schemas/devkit-config.json",
  "devkit": "1.0",
  "template": "vite-express-tauri",
  "site": {
    "name": "My App",
    "url": "https://myapp.com",
    "icon": "public/favicon.svg",
    "description": "My awesome application"
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
  },
  "subscriptions": {
    "provider": "paddle",
    "paddle": {
      "apiKey": "${PADDLE_API_KEY}",
      "webhookSecret": "${PADDLE_WEBHOOK_SECRET}",
      "plans": {
        "basic": "${PADDLE_PRICE_BASIC}",
        "pro": "${PADDLE_PRICE_PRO}",
        "lifetime": "${PADDLE_PRICE_LIFETIME}"
      }
    }
  },
  "storage": {
    "provider": "r2",
    "r2": {
      "accountId": "${R2_ACCOUNT_ID}",
      "accessKeyId": "${R2_ACCESS_KEY_ID}",
      "secretAccessKey": "${R2_SECRET_ACCESS_KEY}",
      "bucketName": "${R2_BUCKET_NAME}",
      "publicUrl": "${R2_PUBLIC_URL}"
    }
  },
  "database": {
    "url": "${DATABASE_URL}"
  }
}
```

### `devkit.lock.json`

Version lock file — committed to git to ensure deterministic installs.

```json
{
  "lockVersion": 1,
  "template": "vite-express-tauri",
  "components": {
    "auth": {
      "version": "2.1.0",
      "variant": null,
      "resolved": "https://cdn.roboticela.com/devkit/components/auth/2.1.0/vite-express-tauri.tar.gz",
      "integrity": "sha512:...",
      "installedAt": "2026-04-05T10:30:00Z"
    },
    "hero-section": {
      "version": "1.3.0",
      "variant": "split-image",
      "resolved": "https://cdn.roboticela.com/devkit/components/hero-section/1.3.0/variants/split-image/nextjs-compact.tar.gz",
      "integrity": "sha512:...",
      "installedAt": "2026-04-05T11:00:00Z"
    }
  }
}
```

### Environment Variables

All secrets stay in `.env` (never committed). DevKit generates a `.env.example` and `.env.devkit` that lists all variables required by installed components:

```bash
# Generated by DevKit — devkit doctor will warn if these are missing
# auth component
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

# subscriptions component
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
PADDLE_PRICE_BASIC=
PADDLE_PRICE_PRO=
PADDLE_PRICE_LIFETIME=

# storage component
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# database
DATABASE_URL=
```

---

## 7. Global Design Token & Theming System

### The Core Idea

Every DevKit component — across all templates — uses **zero hardcoded colors, font sizes, border radii, or spacing values**. Instead, every visual property references a **CSS custom property (CSS variable)** defined in a single global file: `globals.css` (Next.js) or `src/index.css` (Vite).

When a user changes one token — say, the primary brand color — every button, form, card, navbar, hero section, and modal across the entire application updates automatically. No hunting through component files.

This is enforced at the registry level: components that use hardcoded colors are rejected by CI validation.

---

### How It Works — The Token Layer

```
devkit.config.json         ← User sets their brand values here (colors, fonts, radius)
        │
        ▼
devkit theme apply         ← CLI reads config and generates CSS variables
        │
        ▼
globals.css / index.css    ← Single source of truth for all visual tokens
        │
        ▼
All DevKit components      ← Read ONLY from CSS variables, never hardcoded
```

The user **never touches component files** to change appearance. They configure in one place and run one command (or it runs automatically on `devkit add`).

---

### Token Categories

DevKit defines a standard set of token categories that all components must respect:

#### Color Tokens

```css
/* globals.css — generated and managed by DevKit */
:root {
  /* ── Brand Colors ── */
  --color-primary:         #6366f1;   /* Main brand color — buttons, links, accents */
  --color-primary-hover:   #4f46e5;   /* Hover state of primary */
  --color-primary-active:  #4338ca;   /* Active/pressed state */
  --color-primary-subtle:  #eef2ff;   /* Light tint — badges, highlights */
  --color-primary-text:    #ffffff;   /* Text on primary background */

  --color-secondary:       #f59e0b;   /* Secondary accent color */
  --color-secondary-hover: #d97706;
  --color-secondary-subtle:#fffbeb;
  --color-secondary-text:  #ffffff;

  /* ── Neutral / Surface ── */
  --color-bg:              #ffffff;   /* Page background */
  --color-bg-subtle:       #f9fafb;   /* Card backgrounds, section alternates */
  --color-bg-muted:        #f3f4f6;   /* Input backgrounds, disabled states */
  --color-border:          #e5e7eb;   /* Borders, dividers */
  --color-border-strong:   #d1d5db;   /* Emphasized borders */

  /* ── Text ── */
  --color-text:            #111827;   /* Primary body text */
  --color-text-muted:      #6b7280;   /* Secondary/helper text */
  --color-text-subtle:     #9ca3af;   /* Placeholders, disabled text */
  --color-text-inverse:    #ffffff;   /* Text on dark backgrounds */

  /* ── Semantic ── */
  --color-success:         #10b981;
  --color-success-subtle:  #ecfdf5;
  --color-success-text:    #065f46;

  --color-warning:         #f59e0b;
  --color-warning-subtle:  #fffbeb;
  --color-warning-text:    #92400e;

  --color-error:           #ef4444;
  --color-error-subtle:    #fef2f2;
  --color-error-text:      #991b1b;

  --color-info:            #3b82f6;
  --color-info-subtle:     #eff6ff;
  --color-info-text:       #1e40af;

  /* ── Overlay / Shadow ── */
  --color-overlay:         rgba(0, 0, 0, 0.5);
  --color-shadow:          rgba(0, 0, 0, 0.08);
}
```

#### Typography Tokens

```css
:root {
  /* ── Font Families ── */
  --font-sans:    'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Inter', sans-serif;   /* Used for headings */

  /* ── Font Sizes ── */
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */
  --text-5xl:  3rem;       /* 48px */
  --text-6xl:  3.75rem;    /* 60px */

  /* ── Font Weights ── */
  --weight-normal:    400;
  --weight-medium:    500;
  --weight-semibold:  600;
  --weight-bold:      700;
  --weight-extrabold: 800;

  /* ── Line Heights ── */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed:1.625;
}
```

#### Shape & Spacing Tokens

```css
:root {
  /* ── Border Radius ── */
  --radius-sm:   0.25rem;   /* 4px  — tags, badges */
  --radius-md:   0.5rem;    /* 8px  — inputs, small cards */
  --radius-lg:   0.75rem;   /* 12px — cards, modals */
  --radius-xl:   1rem;      /* 16px — panels */
  --radius-2xl:  1.5rem;    /* 24px — large sections */
  --radius-full: 9999px;    /* pills, avatars */

  /* ── Spacing Scale ── */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  /* ── Shadows ── */
  --shadow-sm:  0 1px 2px var(--color-shadow);
  --shadow-md:  0 4px 6px -1px var(--color-shadow);
  --shadow-lg:  0 10px 15px -3px var(--color-shadow);
  --shadow-xl:  0 20px 25px -5px var(--color-shadow);

  /* ── Transitions ── */
  --transition-fast:   150ms ease;
  --transition-normal: 200ms ease;
  --transition-slow:   300ms ease;

  /* ── Z-Index Scale ── */
  --z-dropdown:  1000;
  --z-sticky:    1100;
  --z-overlay:   1200;
  --z-modal:     1300;
  --z-toast:     1400;
  --z-tooltip:   1500;
}
```

#### Dark Mode Tokens

Dark mode is handled by overriding tokens under a `.dark` class (or `[data-theme="dark"]`). The components never need to know about dark mode — they always read from the same variable names:

```css
.dark {
  --color-primary:         #818cf8;
  --color-primary-hover:   #6366f1;
  --color-primary-subtle:  #1e1b4b;
  --color-primary-text:    #ffffff;

  --color-bg:              #0f172a;
  --color-bg-subtle:       #1e293b;
  --color-bg-muted:        #334155;
  --color-border:          #334155;
  --color-border-strong:   #475569;

  --color-text:            #f1f5f9;
  --color-text-muted:      #94a3b8;
  --color-text-subtle:     #64748b;
  --color-text-inverse:    #0f172a;

  --color-success:         #34d399;
  --color-success-subtle:  #064e3b;
  --color-warning:         #fbbf24;
  --color-warning-subtle:  #451a03;
  --color-error:           #f87171;
  --color-error-subtle:    #450a0a;
  --color-info:            #60a5fa;
  --color-info-subtle:     #1e3a5f;
  --color-overlay:         rgba(0, 0, 0, 0.7);
  --color-shadow:          rgba(0, 0, 0, 0.3);
}
```

---

### Theme Configuration in `devkit.config.json`

The user configures their brand values under a `theme` key. They only need to specify the values they want to override — DevKit fills in the rest using sensible defaults and auto-derives hover/subtle/text variants:

```json
{
  "theme": {
    "preset": "default",
    "colors": {
      "primary": "#6366f1",
      "secondary": "#f59e0b"
    },
    "fonts": {
      "sans": "Inter",
      "mono": "JetBrains Mono",
      "display": "Inter"
    },
    "radius": "md",
    "darkMode": true,
    "darkModeStrategy": "class"
  }
}
```

**What each field does:**

| Field | Type | Description |
|-------|------|-------------|
| `preset` | string | Start from a named preset: `default`, `minimal`, `bold`, `playful`, `corporate` |
| `colors.primary` | hex | Main brand color — DevKit auto-generates hover, active, subtle, and text variants |
| `colors.secondary` | hex | Accent color — same auto-generation |
| `fonts.sans` | string | Body font family (Google Fonts name or system font) |
| `fonts.mono` | string | Monospace font for code blocks |
| `fonts.display` | string | Heading font (can differ from body) |
| `radius` | `none` \| `sm` \| `md` \| `lg` \| `full` | Global border radius scale. `none` = sharp corners everywhere. `full` = pill-style everywhere. |
| `darkMode` | boolean | Whether dark mode tokens are generated |
| `darkModeStrategy` | `class` \| `media` | `class` = toggle `.dark` on `<html>`. `media` = follows OS preference automatically |

---

### Auto-Derivation of Color Variants

When the user sets `colors.primary: "#6366f1"`, DevKit automatically computes and writes all related tokens:

```
primary          → #6366f1            (exact value from user)
primary-hover    → #4f46e5            (10% darker)
primary-active   → #4338ca            (20% darker)
primary-subtle   → #eef2ff            (90% lighter tint)
primary-text     → #ffffff or #111827 (auto — whichever has better contrast ratio per WCAG AA)
```

The user **never has to think about hover states or accessible text contrast** — DevKit calculates these using WCAG contrast ratio formulas at theme-apply time.

---

### Built-In Theme Presets

DevKit ships with 5 built-in presets. The user can use one as a starting point and override individual values:

| Preset | Primary | Secondary | Radius | Style |
|--------|---------|-----------|--------|-------|
| `default` | Indigo `#6366f1` | Amber `#f59e0b` | `md` | Balanced, modern SaaS |
| `minimal` | Slate `#475569` | Sky `#0ea5e9` | `sm` | Clean, editorial |
| `bold` | Violet `#7c3aed` | Pink `#ec4899` | `lg` | Vibrant, expressive |
| `playful` | Emerald `#10b981` | Orange `#f97316` | `full` | Friendly, rounded |
| `corporate` | Blue `#1d4ed8` | Gray `#374151` | `none` | Formal, enterprise |

```bash
devkit theme preset bold          # Switch to bold preset
devkit theme preset minimal       # Switch to minimal
```

---

### `devkit theme` CLI Commands

```bash
# Apply current theme config to globals.css
devkit theme apply

# Preview what the generated CSS will look like (no file changes)
devkit theme preview

# Switch to a preset (updates devkit.config.json + regenerates globals.css)
devkit theme preset bold

# Set a single token value
devkit theme set colors.primary "#e11d48"

# See all current token values
devkit theme list

# Reset all theme values to the default preset
devkit theme reset

# Check if any component is using hardcoded colors (anti-pattern detector)
devkit theme audit
```

---

### How Components Use Tokens — The Rules

Every component in the registry must follow these rules. These are enforced by registry CI:

#### Rule 1 — No hardcoded colors in component files

```tsx
/* ✗ WRONG — never allowed in a DevKit component */
<button className="bg-indigo-600 text-white hover:bg-indigo-700">

/* ✓ CORRECT — uses global token via Tailwind CSS variable */
<button className="bg-[var(--color-primary)] text-[var(--color-primary-text)] hover:bg-[var(--color-primary-hover)]">
```

#### Rule 2 — No hardcoded font sizes or spacing values

```tsx
/* ✗ WRONG */
<h1 style={{ fontSize: "3rem", marginBottom: "24px" }}>

/* ✓ CORRECT */
<h1 style={{ fontSize: "var(--text-5xl)", marginBottom: "var(--space-6)" }}>
```

#### Rule 3 — No hardcoded border radius

```tsx
/* ✗ WRONG */
<div className="rounded-lg">

/* ✓ CORRECT */
<div style={{ borderRadius: "var(--radius-lg)" }}>
/* or via a utility class generated by DevKit: */
<div className="devkit-radius-lg">
```

#### Rule 4 — Semantic tokens, not raw values

```tsx
/* ✗ WRONG — even if it's a CSS variable, raw palette variables are forbidden */
<p style={{ color: "var(--slate-500)" }}>

/* ✓ CORRECT — semantic token that knows what it means in context */
<p style={{ color: "var(--color-text-muted)" }}>
```

---

### TailwindCSS 4 Integration

TailwindCSS 4 natively reads CSS variables for its color palette. DevKit configures this automatically in the `globals.css` file using Tailwind's `@theme` block:

```css
/* globals.css — generated by DevKit */
@import "tailwindcss";

@theme {
  --color-primary:         var(--color-primary);
  --color-secondary:       var(--color-secondary);
  --color-bg:              var(--color-bg);
  --color-surface:         var(--color-bg-subtle);
  --color-border:          var(--color-border);
  --color-text:            var(--color-text);
  --color-text-muted:      var(--color-text-muted);
  --color-success:         var(--color-success);
  --color-warning:         var(--color-warning);
  --color-error:           var(--color-error);

  --font-sans:             var(--font-sans);
  --font-mono:             var(--font-mono);
  --font-display:          var(--font-display);

  --radius-sm:             var(--radius-sm);
  --radius-md:             var(--radius-md);
  --radius-lg:             var(--radius-lg);
  --radius-full:           var(--radius-full);
}
```

This means **both Tailwind utility classes and raw CSS variables** work identically with the same tokens:

```tsx
/* These two are equivalent — both use the same underlying token */
<div className="bg-primary text-text-muted border-border">
<div style={{ background: "var(--color-primary)", color: "var(--color-text-muted)" }}>
```

---

### Google Fonts Auto-Loading

If the user specifies a Google Font in `devkit.config.json`, DevKit automatically adds the font import to `globals.css`:

```css
/* Auto-generated by DevKit based on theme.fonts config */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');
```

---

### Theme File — What DevKit Owns vs. What the User Owns

| Section | Owner | Policy |
|---------|-------|--------|
| `:root { }` token block | DevKit | Fully managed. Regenerated on `devkit theme apply`. Do not edit manually. |
| `.dark { }` token block | DevKit | Fully managed. Regenerated on `devkit theme apply`. Do not edit manually. |
| `@theme { }` Tailwind block | DevKit | Fully managed. |
| `@import url(...)` font imports | DevKit | Managed, generated from `theme.fonts` config. |
| Everything else in `globals.css` | User | Free to add custom styles below the DevKit-managed block. Never touched by DevKit. |

DevKit wraps its section with clear markers:

```css
/* ── DevKit Managed Theme Block — do not edit below this line ── */
/* ── Generated by DevKit 1.0.0 on 2026-04-05 ── */
:root { ... }
.dark { ... }
@theme { ... }
/* ── End DevKit Managed Theme Block ── */

/* Your custom styles go here — DevKit will never touch this area */
```

---

### Single-Change Cascade — Full Example

The user decides to change their brand color from indigo to rose:

**Step 1 — Change one value:**
```bash
devkit theme set colors.primary "#e11d48"
```

**Step 2 — Apply:**
```bash
devkit theme apply
```

**What updates automatically:**
- All buttons (primary, outline, ghost) → rose
- All links → rose
- All form focus rings → rose
- All badges and tags → rose tint background
- All CTAs in hero sections → rose
- All active nav items → rose
- All pricing plan highlights → rose
- All notification action buttons → rose
- All loading spinners → rose
- Dark mode variants → auto-derived rose that works on dark backgrounds

**What the user did:** Changed one hex value. That's it.

---

### Theme Versioning

The `globals.css` token block is part of the DevKit managed system. When DevKit releases a new token (e.g., a new semantic color like `--color-skeleton`), it is added via `devkit upgrade` without touching user-defined styles below the managed block.

---

## 8. Registry Architecture

### Registry Repository Structure

```
github.com/Roboticela/devkit-registry
│
├── registry.json                          ← Master index of all components
├── schemas/
│   ├── devkit-config.json                 ← JSON Schema for devkit.config.json
│   └── component.json                     ← JSON Schema for component.json
│
└── components/
    ├── auth/
    │   ├── component.json                 ← Component metadata & version history
    │   ├── CHANGELOG.md
    │   ├── nextjs-compact/
    │   │   ├── v1/                        ← Files for v1.x.x
    │   │   │   ├── files/                 ← All files to copy into user project
    │   │   │   ├── scripts/
    │   │   │   │   ├── install.ts         ← Run after file copy
    │   │   │   │   ├── uninstall.ts       ← Run on removal
    │   │   │   │   └── migrate.ts         ← Run on version upgrade
    │   │   │   └── manifest.json          ← File list + injections + deps
    │   │   └── v2/
    │   │       ├── files/
    │   │       ├── scripts/
    │   │       └── manifest.json
    │   └── vite-express-tauri/
    │       ├── v1/
    │       │   ├── files/
    │       │   ├── scripts/
    │       │   └── manifest.json
    │       └── v2/
    │           ├── files/
    │           ├── scripts/
    │           └── manifest.json
    │
    ├── hero-section/
    │   ├── component.json
    │   ├── CHANGELOG.md
    │   ├── nextjs-compact/
    │   │   └── v1/
    │   │       ├── variants/
    │   │       │   ├── centered/          ← Variant: classic centered hero
    │   │       │   │   ├── files/
    │   │       │   │   └── manifest.json
    │   │       │   ├── split-image/       ← Variant: text left, image right
    │   │       │   │   ├── files/
    │   │       │   │   └── manifest.json
    │   │       │   ├── video-background/  ← Variant: full-screen video bg
    │   │       │   ├── gradient-mesh/     ← Variant: animated gradient
    │   │       │   ├── particles/         ← Variant: particle animation
    │   │       │   └── minimal/           ← Variant: clean text-only
    │   │       └── scripts/
    │   └── vite-express-tauri/
    │       └── v1/
    │           └── variants/ (same structure)
    │
    ├── profile/
    ├── landing-page/
    ├── pricing/
    ├── blog/
    ├── dashboard/
    ├── admin-panel/
    ├── notifications/
    ├── subscriptions/
    ├── file-upload/
    ├── contact-form/
    ├── waitlist/
    ├── changelog/
    ├── docs-site/
    ├── desktop-updater/
    ├── desktop-tray/
    ├── deep-link-auth/
    ├── offline-storage/
    └── system-notifications/
```

### `component.json` Example

```json
{
  "name": "auth",
  "displayName": "Authentication",
  "description": "Complete authentication system: email/password login, registration, email verification, forgot/reset password, Google OAuth.",
  "category": "authentication",
  "icon": "lock",
  "author": "Roboticela",
  "license": "MIT",
  "tags": ["auth", "login", "register", "oauth", "jwt", "email"],
  "templates": ["nextjs-compact", "vite-express-tauri"],
  "platforms": ["web", "desktop"],
  "hasVariants": false,
  "versions": {
    "latest": "2.1.0",
    "stable": "2.1.0",
    "history": [
      { "version": "2.1.0", "releaseDate": "2026-03-01", "breaking": false },
      { "version": "2.0.0", "releaseDate": "2026-01-15", "breaking": true, "breakingFrom": "1.x" },
      { "version": "1.3.2", "releaseDate": "2025-11-10", "breaking": false }
    ]
  },
  "requiredConfig": ["site.name", "site.url"],
  "optionalConfig": [
    "auth.google.clientId",
    "auth.google.clientSecret",
    "auth.smtp.host",
    "auth.smtp.port",
    "auth.smtp.user",
    "auth.smtp.password"
  ]
}
```

### Registry API (Self-hosted with Hono.js or Express)

```
GET  /api/v1/components                         ← List all components
GET  /api/v1/components?template=nextjs-compact ← Filtered list
GET  /api/v1/components/:name                   ← Component details
GET  /api/v1/components/:name/versions          ← All versions
GET  /api/v1/components/:name/variants          ← Variants (if any)
GET  /api/v1/download/:name/:version/:template  ← Download tarball
GET  /api/v1/download/:name/:version/:template/variants/:variant ← Variant tarball
GET  /api/v1/schema/devkit-config               ← JSON Schema
GET  /api/v1/health                             ← Health check
```

---

## 9. Versioning & Compatibility Strategy

### Semantic Versioning (SemVer)

All components follow SemVer strictly:

| Version change | Meaning |
|---------------|---------|
| `PATCH` (x.x.1) | Bug fixes, style tweaks — always safe to update |
| `MINOR` (x.1.0) | New optional features, new variants — backward compatible |
| `MAJOR` (1.0.0) | Breaking changes in file structure or config API |

### No-Breaking-Changes Policy

When a component releases a **major version**, the previous major version receives security patches for 12 months. Users on v1 are **never automatically moved to v2**. The upgrade requires an explicit command:

```bash
devkit update auth@2.0.0   # Explicit major upgrade
```

The CLI will show a migration guide and prompt confirmation before applying breaking changes.

### File Ownership & Hash Tracking

DevKit tracks every file it places in the project via SHA-256 hash. When an update is available:

- **File unchanged from last install** → updated automatically
- **File modified by user** → skipped, user is warned, merge required manually

This ensures user customizations are never silently overwritten.

### Lock File Reproducibility

Running `devkit install` (with no arguments) from a fresh clone installs the exact same component versions as recorded in `devkit.lock.json`, making builds deterministic.

### Ejecting from DevKit

If a user wants to fully own a component and stop receiving updates:

```bash
devkit eject auth
```

This removes the manifest and lock entry, leaving the files untouched. The user is now fully responsible for maintaining that code.

---

## 10. Essential Components Catalog

### Category: Authentication & Identity

#### `auth`
Complete authentication system.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web + Desktop |
| Variants | None (behavior-configured, not design-varied) |
| Backend Routes | `/api/auth/login`, `/api/auth/register`, `/api/auth/logout`, `/api/auth/refresh`, `/api/auth/verify-email`, `/api/auth/forgot-password`, `/api/auth/reset-password`, `/api/auth/google`, `/api/auth/google/callback` |
| Frontend Pages | Login, Register, ForgotPassword, ResetPassword, VerifyEmail, OAuthCallback |
| Providers | Email+Password, Google OAuth |
| Features | JWT access + refresh tokens, email verification, password reset via email, rate limiting, CSRF protection |
| Config Required | `site.name`, `site.url` |
| Config Optional | Google credentials, SMTP settings |

---

#### `profile`
User profile management.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web + Desktop |
| Depends On | `auth` |
| Variants | None |
| Features | View/edit profile, upload avatar (R2/local), change email, change password, delete account, email notification preferences |
| Config Optional | `storage.r2.*` (for avatar uploads) |

---

### Category: Landing & Marketing

#### `landing-page`
Full landing page with configurable sections.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | None (composed of sub-components like `hero-section`, `pricing`, etc.) |
| Features | Orchestrates hero, features, pricing, testimonials, FAQ, CTA, footer sections on a single page |
| Config | `site.name`, `site.description`, `site.url` |

---

#### `hero-section`
The top banner section of a landing page.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **6 variants** (see below) |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `centered` | Centered heading + subheading + CTA buttons. Classic SaaS style. |
| `split-image` | Text on left, product screenshot/image on right. |
| `video-background` | Full-screen looping video behind text and CTA. |
| `gradient-mesh` | Animated CSS gradient mesh background with floating shapes. |
| `particles` | Interactive particle canvas animation behind text. |
| `minimal` | Ultra-clean, typography-only hero. No background decorations. |

---

#### `pricing`
Pricing table component.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **3 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `cards` | Side-by-side plan cards (Free, Pro, Enterprise). |
| `toggle` | Monthly/Annual billing toggle with price recalculation. |
| `comparison-table` | Feature comparison table across plans. |

---

#### `waitlist`
Email waitlist capture with confirmation email.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **2 variants** |
| Config Required | SMTP settings |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `minimal` | Single email input with submit button. |
| `with-referral` | Email input + referral tracking link after signup. |

---

#### `testimonials`
Customer testimonials/social proof section.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **3 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `grid` | Static 3-column grid of testimonial cards. |
| `carousel` | Auto-scrolling carousel with pause on hover. |
| `masonry` | Pinterest-style masonry layout. |

---

#### `features-section`
Product features showcase.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **3 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `icon-grid` | Icon + heading + description grid (3 or 4 columns). |
| `alternating` | Alternating text-left/image-right feature rows. |
| `tabbed` | Feature tabs — click a tab to see feature detail. |

---

#### `faq`
Frequently asked questions.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `accordion` | Expand/collapse answers. |
| `two-column` | Two-column Q&A layout. |

---

#### `contact-form`
Contact / support form with email delivery.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Config Required | SMTP settings |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `simple` | Name, email, message fields. |
| `with-subject` | Name, email, subject dropdown, message. |

---

### Category: Application / Dashboard

#### `dashboard`
Main application dashboard layout with navigation.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web + Desktop |
| Depends On | `auth` |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `sidebar` | Fixed sidebar navigation + main content area. |
| `top-nav` | Top navigation bar + full-width content area. |

---

#### `admin-panel`
Admin-only dashboard for user management, stats.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Depends On | `auth`, `dashboard` |
| Variants | None |
| Features | User list/search, ban/unban, subscription status, system stats panel |

---

#### `notifications`
In-app notification system.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web + Desktop |
| Depends On | `auth` |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `dropdown` | Bell icon with notification dropdown. |
| `sidebar-panel` | Dedicated notifications sidebar panel. |

---

### Category: Monetization

#### `subscriptions`
Subscription billing integration (Paddle).

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Depends On | `auth` |
| Variants | None |
| Features | Checkout flow, subscription status page, webhook handler, plan upgrade/downgrade, cancellation |
| Config Required | `subscriptions.paddle.*` |

---

### Category: Content

#### `blog`
Full blog with posts, categories, tags.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `list` | Post list with search and filters. |
| `magazine` | Magazine-style featured post + grid. |

---

#### `changelog`
Public changelog page.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `timeline` | Vertical timeline of releases. |
| `cards` | Card grid of version releases. |

---

#### `docs-site`
MDX-based documentation site.

| Item | Details |
|------|---------|
| Templates | `nextjs-compact` **only** |
| Platform | Web |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `sidebar-nav` | Sidebar navigation + content area (classic docs layout). |
| `top-nav` | Top navigation with breadcrumbs. |

---

### Category: Storage & Media

#### `file-upload`
File upload with storage backend.

| Item | Details |
|------|---------|
| Templates | Both |
| Platform | Web + Desktop |
| Depends On | `auth` |
| Variants | **2 variants** |
| Config Optional | `storage.r2.*` |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `dropzone` | Drag-and-drop file upload zone. |
| `inline` | Compact inline file picker with progress. |

---

### Category: Desktop-Only (Tauri)

#### `desktop-updater`
Auto-update mechanism for Tauri desktop apps.

| Item | Details |
|------|---------|
| Templates | `vite-express-tauri` **only** |
| Platform | Desktop only |
| Variants | **2 variants** |

**Variants:**

| Variant ID | Description |
|-----------|-------------|
| `banner` | Top-of-screen update available banner. |
| `modal` | Full update dialog with changelog. |

---

#### `desktop-tray`
System tray icon with context menu.

| Item | Details |
|------|---------|
| Templates | `vite-express-tauri` **only** |
| Platform | Desktop only |
| Variants | None |
| Features | Show/hide window, quit app, status indicator in tray |

---

#### `deep-link-auth`
Desktop OAuth deep-link callback handler (for Google/GitHub OAuth in Tauri).

| Item | Details |
|------|---------|
| Templates | `vite-express-tauri` **only** |
| Platform | Desktop only |
| Depends On | `auth` |
| Variants | None |
| Features | Registers custom URL scheme (e.g. `myapp://auth/callback`), handles token exchange |

---

#### `offline-storage`
Local-first IndexedDB storage with optional sync.

| Item | Details |
|------|---------|
| Templates | `vite-express-tauri` **only** |
| Platform | Web + Desktop |
| Variants | None |
| Features | IndexedDB wrapper, sync queue for when online, conflict resolution |

---

#### `system-notifications`
Native OS desktop notifications via Tauri.

| Item | Details |
|------|---------|
| Templates | `vite-express-tauri` **only** |
| Platform | Desktop only |
| Variants | None |
| Features | Send native notifications, click handlers, notification permissions request |

---

## 11. Variant System

### How Variants Work

Variants are different **visual/structural implementations** of the same component. They share the same purpose but differ in design, layout, or interaction pattern.

**Rules:**
1. Only one variant of a component can be installed at a time
2. Only the chosen variant's code is downloaded — other variants are never fetched
3. Switching variants requires removing the old one and installing the new: `devkit remove hero-section && devkit add hero-section --variant=particles`
4. Variants are versioned together with their parent component

### Variant Decision Guide

Not every component needs variants. Variants are introduced when:
- The UI/layout differs significantly enough that it cannot be controlled by simple props
- The underlying structure (number of files, page layout) changes between options
- Different variants may have different dependencies

### Components with Variants (Summary)

| Component | Variant Count | Variant Names |
|-----------|--------------|---------------|
| `hero-section` | 6 | centered, split-image, video-background, gradient-mesh, particles, minimal |
| `pricing` | 3 | cards, toggle, comparison-table |
| `testimonials` | 3 | grid, carousel, masonry |
| `features-section` | 3 | icon-grid, alternating, tabbed |
| `faq` | 2 | accordion, two-column |
| `waitlist` | 2 | minimal, with-referral |
| `contact-form` | 2 | simple, with-subject |
| `dashboard` | 2 | sidebar, top-nav |
| `notifications` | 2 | dropdown, sidebar-panel |
| `blog` | 2 | list, magazine |
| `changelog` | 2 | timeline, cards |
| `docs-site` | 2 | sidebar-nav, top-nav |
| `file-upload` | 2 | dropzone, inline |
| `desktop-updater` | 2 | banner, modal |

---

## 12. Cross-Platform Support

### Platform Declarations

Each component declares platform support in `component.json`:

```json
{
  "platforms": ["web", "desktop"]
}
```

| Value | Meaning |
|-------|---------|
| `web` | Works in browser |
| `desktop` | Works as Tauri desktop app |

If a component declares only `desktop`, the CLI will block installation in projects being deployed as web-only.

### How Platform Differences Are Handled

For `vite-express-tauri` components that support both web and desktop, platform-conditional code uses a Tauri availability check:

```typescript
import { isTauri } from "@/lib/platform";

if (isTauri()) {
  // Tauri-specific: deep link OAuth callback
} else {
  // Web: regular redirect OAuth callback
}
```

The `platform.ts` utility is injected once (during `devkit init`) and used by all components.

---

## 13. Hosting & Deployment of the Registry

### Option A — GitHub + GitHub Releases + CDN (Recommended for Start)

**Free to set up. Scales easily.**

1. **Registry repo** at `github.com/Roboticela/devkit-registry` — public, contains all component files
2. **GitHub Actions** CI on every push to validate component metadata and generate release tarballs
3. **GitHub Releases** used to publish versioned component tarballs (e.g. `auth-2.1.0-vite-express-tauri.tar.gz`)
4. **Cloudflare CDN** (free tier) in front of GitHub Releases for fast global delivery
5. **Simple JSON API** served via Cloudflare Workers (free) at `registry.devkit.roboticela.com/api/v1/`

**Cost:** Free at start. Scales to very high traffic on Cloudflare's free tier.

**Architecture:**
```
GitHub Repo → GitHub Actions → GitHub Releases
                                      ↓
                            Cloudflare R2 (asset storage)
                                      ↓
                            Cloudflare CDN (global cache)
                                      ↓
                            Cloudflare Workers (API layer)
                                      ↓
                            CLI downloads components
```

---

### Option B — Self-Hosted Registry Server

For full control, run a Node.js/Express registry API server:

```
VPS or Cloud VM
├── Node.js Registry API (Express/Hono)
├── PostgreSQL (component metadata, download stats)
├── Nginx (reverse proxy + HTTPS)
└── File storage: local disk or Cloudflare R2
```

**Endpoints hosted at:** `registry.devkit.roboticela.com`

**Docker deployment:**
```yaml
# docker-compose.yml for registry server
services:
  registry:
    image: roboticela/devkit-registry
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: ${DATABASE_URL}
      STORAGE_TYPE: r2
      R2_BUCKET: devkit-components
  nginx:
    image: nginx:alpine
    ports: ["80:80", "443:443"]
```

---

### Option C — NPM-Based Distribution (No Registry Server)

Each component is published as its own npm package under the `@roboticela-devkit` scope:

```bash
npm install @roboticela-devkit/auth
npm install @roboticela-devkit/hero-section-split-image
```

The DevKit CLI reads from the npm registry instead of a custom one. **Simpler to start, less control.**

---

### Recommended Rollout Plan

| Phase | Action |
|-------|--------|
| Phase 1 | GitHub repo + GitHub Releases + static JSON registry (Cloudflare Worker) |
| Phase 2 | Migrate to self-hosted registry with download analytics |
| Phase 3 | Add authentication to registry (private/paid components) |

---

## 14. Developer Workflow (End-to-End)

### Path A — Starting fresh with `devkit create` (Recommended)

The single command that does everything: scaffolds, configures, themes, and adds initial components.

```bash
# Option 1: Fully interactive
devkit create my-saas-app

# Option 2: All flags, fully non-interactive
devkit create my-saas-app \
  --template=nextjs-compact \
  --preset=default \
  --add=auth,hero-section,pricing \
  --variant=hero-section:split-image \
  --variant=pricing:toggle \
  --git --install
```

After `devkit create` completes, the project is **immediately runnable**:

```bash
cd my-saas-app
cp .env.example .env       # Fill in secrets (JWT, SMTP, Google OAuth)
npm run dev                # Start the dev server — everything already wired up
```

---

### Path B — Adopting DevKit into an existing project

For projects that were cloned or created manually before DevKit was introduced:

```bash
# 1. Enter the project
cd my-existing-project

# 2. Initialize DevKit (detects template automatically)
devkit init
# > Detected template: vite-express-tauri
# > Enter site name: My App
# > Enter site URL: https://myapp.com
# > Created devkit.config.json
# > Created devkit.lock.json
# > Applied theme: default
# > DevKit ready!

# 3. Browse available components
devkit list
devkit list --template=vite-express-tauri

# 4. Add components one by one
devkit add auth
# > Checking compatibility... OK (vite-express-tauri)
# > Downloading auth@2.1.0...
# > Installing files...
# > Running npm install (jsonwebtoken, bcryptjs, nodemailer)
# > Injecting routes into src/main.tsx...
# > Registering API routes in server/src/index.ts...
# > Done!
# > Next steps:
# >   Set GOOGLE_CLIENT_ID in .env (optional, for Google OAuth)
# >   Set SMTP_HOST, SMTP_USER, SMTP_PASSWORD in .env (for email)
# >   Run devkit doctor to verify configuration

devkit add hero-section --variant=split-image
# > Downloading hero-section@1.3.0 variant=split-image...
# > Installing to src/components/hero/...
# > Done!

devkit add pricing --variant=toggle
devkit add dashboard --variant=sidebar

# 5. Check for missing config / env vars
devkit doctor
# > ✓ Template: vite-express-tauri
# > ✓ auth@2.1.0 — OK
# > ✗ auth — Missing env var: JWT_ACCESS_SECRET
# > ✗ auth — Missing env var: JWT_REFRESH_SECRET
# > ⚠ auth — Optional: GOOGLE_CLIENT_ID not set (Google OAuth disabled)

# 6. Start the dev server
npm run dev
```

---

### Upgrading a component later

```bash
# Check what updates are available
devkit list --installed

# Update a single component
devkit update auth

# Upgrade all components
devkit upgrade

# Upgrade to a major version (breaking change — requires explicit target)
devkit update auth@3.0.0
# > WARNING: This is a MAJOR version upgrade (2.x → 3.x)
# > Breaking changes:
# >   - JWT config keys renamed
# >   - Google OAuth requires new scope
# > Read the full migration guide: https://registry.devkit.roboticela.com/components/auth/migrate/2-to-3
# > Continue? (yes/no): yes
```

---

### Redeploying — zero-effort updates

After upgrading components and testing locally:

```bash
git add devkit.lock.json devkit.config.json
git commit -m "upgrade: auth 2.1.0 → 2.2.0"
git push
```

The deployment pipeline (Vercel / your VPS) runs `devkit install` (which restores from lock file) automatically, exactly like `npm install`.

---

## 15. Registry Folder Structure

This is the full structure of the `devkit-registry` GitHub repository:

```
devkit-registry/
├── registry.json                    ← Master component index
├── schemas/
│   ├── devkit-config.json
│   └── component.json
│
└── components/
    │
    ├── auth/
    │   ├── component.json
    │   ├── CHANGELOG.md
    │   ├── nextjs-compact/
    │   │   ├── v2/
    │   │   │   ├── manifest.json
    │   │   │   ├── scripts/
    │   │   │   │   ├── install.ts
    │   │   │   │   ├── uninstall.ts
    │   │   │   │   └── migrate-from-v1.ts
    │   │   │   └── files/
    │   │   │       ├── app/
    │   │   │       │   ├── auth/
    │   │   │       │   │   ├── login/page.tsx
    │   │   │       │   │   ├── register/page.tsx
    │   │   │       │   │   ├── forgot-password/page.tsx
    │   │   │       │   │   ├── reset-password/page.tsx
    │   │   │       │   │   └── verify-email/page.tsx
    │   │   │       │   └── api/
    │   │   │       │       └── auth/
    │   │   │       │           └── [...route]/route.ts
    │   │   │       ├── components/
    │   │   │       │   └── auth/
    │   │   │       │       ├── LoginForm.tsx
    │   │   │       │       ├── RegisterForm.tsx
    │   │   │       │       ├── OAuthButton.tsx
    │   │   │       │       └── AuthProvider.tsx
    │   │   │       └── lib/
    │   │   │           └── auth/
    │   │   │               ├── authService.ts
    │   │   │               └── jwtService.ts
    │   │   └── v1/ (legacy, security patches only)
    │   │
    │   └── vite-express-tauri/
    │       └── v2/
    │           ├── manifest.json
    │           ├── scripts/
    │           └── files/
    │               ├── src/
    │               │   ├── pages/auth/
    │               │   │   ├── LoginPage.tsx
    │               │   │   ├── RegisterPage.tsx
    │               │   │   ├── ForgotPasswordPage.tsx
    │               │   │   ├── ResetPasswordPage.tsx
    │               │   │   └── VerifyEmailPage.tsx
    │               │   ├── components/auth/
    │               │   │   ├── LoginForm.tsx
    │               │   │   ├── RegisterForm.tsx
    │               │   │   └── OAuthButton.tsx
    │               │   ├── contexts/AuthContext.tsx
    │               │   └── lib/authService.ts
    │               └── server/
    │                   ├── routes/
    │                   │   └── auth.ts
    │                   ├── middleware/
    │                   │   └── requireAuth.ts
    │                   ├── services/
    │                   │   ├── jwtService.ts
    │                   │   └── emailService.ts
    │                   └── prisma/
    │                       └── migrations/
    │                           └── 20260101_add_auth_tables/
    │
    ├── hero-section/
    │   ├── component.json
    │   ├── CHANGELOG.md
    │   ├── nextjs-compact/
    │   │   └── v1/
    │   │       ├── scripts/
    │   │       └── variants/
    │   │           ├── centered/
    │   │           │   ├── manifest.json
    │   │           │   └── files/
    │   │           │       └── components/hero/HeroSection.tsx
    │   │           ├── split-image/
    │   │           │   ├── manifest.json
    │   │           │   └── files/
    │   │           │       ├── components/hero/HeroSection.tsx
    │   │           │       └── components/hero/HeroImage.tsx
    │   │           ├── video-background/
    │   │           ├── gradient-mesh/
    │   │           ├── particles/
    │   │           └── minimal/
    │   └── vite-express-tauri/
    │       └── v1/
    │           └── variants/ (same structure)
    │
    ├── profile/
    ├── pricing/
    ├── dashboard/
    ├── admin-panel/
    ├── notifications/
    ├── subscriptions/
    ├── blog/
    ├── contact-form/
    ├── waitlist/
    ├── changelog/
    ├── features-section/
    ├── testimonials/
    ├── faq/
    ├── file-upload/
    ├── docs-site/            ← nextjs-compact only
    ├── desktop-updater/      ← vite-express-tauri only
    ├── desktop-tray/         ← vite-express-tauri only
    ├── deep-link-auth/       ← vite-express-tauri only
    ├── offline-storage/      ← vite-express-tauri only
    └── system-notifications/ ← vite-express-tauri only
```

---

## 16. Project Folder Structure After Install

### After `devkit add auth hero-section pricing` in `nextjs-compact`:

```
my-nextjs-project/
├── app/
│   ├── auth/                          ← Created by: auth component
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify-email/page.tsx
│   ├── api/
│   │   └── auth/
│   │       └── [...route]/route.ts    ← Created by: auth component
│   ├── globals.css
│   ├── layout.tsx                     ← Modified by: auth (AuthProvider injected)
│   └── page.tsx                       ← Modified by: hero-section (HeroSection injected)
├── components/
│   ├── auth/                          ← Created by: auth component
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── OAuthButton.tsx
│   │   └── AuthProvider.tsx
│   ├── hero/                          ← Created by: hero-section (split-image variant)
│   │   ├── HeroSection.tsx
│   │   └── HeroImage.tsx
│   └── pricing/                       ← Created by: pricing (toggle variant)
│       └── PricingSection.tsx
├── lib/
│   └── auth/                          ← Created by: auth component
│       ├── authService.ts
│       └── jwtService.ts
├── .devkit/                           ← DevKit internal — do not manually edit
│   ├── auth.manifest.json
│   ├── hero-section.manifest.json
│   └── pricing.manifest.json
├── devkit.config.json                 ← Your configuration (commit this)
├── devkit.lock.json                   ← Version lock (commit this)
├── .env.devkit                        ← Required env vars list (commit this)
├── .env                               ← Your secrets (DO NOT commit)
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

### After `devkit add auth hero-section pricing dashboard` in `vite-express-tauri`:

```
my-vite-project/
├── src/
│   ├── pages/
│   │   ├── auth/                      ← Created by: auth
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   ├── ResetPasswordPage.tsx
│   │   │   └── VerifyEmailPage.tsx
│   │   ├── dashboard/                 ← Created by: dashboard (sidebar variant)
│   │   │   └── DashboardPage.tsx
│   │   └── LandingPage.tsx
│   ├── components/
│   │   ├── auth/                      ← Created by: auth
│   │   ├── hero/                      ← Created by: hero-section
│   │   ├── pricing/                   ← Created by: pricing
│   │   └── dashboard/                 ← Created by: dashboard
│   ├── contexts/
│   │   └── AuthContext.tsx            ← Created by: auth
│   ├── lib/
│   │   ├── authService.ts             ← Created by: auth
│   │   └── platform.ts                ← Created by: devkit init
│   └── main.tsx                       ← Modified by: devkit (routes injected)
│
├── server/
│   ├── routes/
│   │   └── auth.ts                    ← Created by: auth
│   ├── middleware/
│   │   └── requireAuth.ts             ← Created by: auth
│   ├── services/
│   │   ├── jwtService.ts              ← Created by: auth
│   │   └── emailService.ts            ← Created by: auth
│   ├── prisma/
│   │   ├── schema.prisma              ← Modified by: auth (User, Session models added)
│   │   └── migrations/
│   └── src/
│       └── index.ts                   ← Modified by: devkit (routes registered)
│
├── src-tauri/                         ← Tauri desktop (unchanged by most components)
│
├── .devkit/
│   ├── auth.manifest.json
│   ├── hero-section.manifest.json
│   ├── pricing.manifest.json
│   └── dashboard.manifest.json
├── devkit.config.json
├── devkit.lock.json
├── .env.devkit
├── .env
└── package.json
```

---

## 17. Component Development Guide

### How to Build a New Component for the Registry

If you want to add a new component to the DevKit registry (either official or community):

#### Step 1 — Create the component directory

```
components/my-component/
├── component.json
├── CHANGELOG.md
├── nextjs-compact/   (if supported)
│   └── v1/
│       ├── manifest.json
│       ├── scripts/
│       │   ├── install.ts
│       │   └── uninstall.ts
│       └── files/
└── vite-express-tauri/   (if supported)
    └── v1/
        ├── manifest.json
        ├── scripts/
        └── files/
```

#### Step 2 — Write `component.json`

Define name, templates, platforms, versions, required config, and optional config.

#### Step 3 — Write the component files

Place all files that should be copied into the user's project inside `files/`. Use template variables where the user's config values should be injected:

```typescript
// In a component file template:
const SITE_NAME = "{{site.name}}";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
```

Template variables (`{{key}}`) are replaced at install time from `devkit.config.json`.

#### Step 4 — Write `manifest.json`

List every file, its destination path in the user project, and all route injections.

```json
{
  "files": [
    {
      "source": "files/src/pages/auth/LoginPage.tsx",
      "destination": "src/pages/auth/LoginPage.tsx"
    }
  ],
  "injections": [
    {
      "file": "src/main.tsx",
      "marker": "/* devkit:routes */",
      "content": "<Route path=\"/auth/*\" element={<AuthRouter />} />"
    }
  ],
  "dependencies": {
    "frontend": ["jsonwebtoken"],
    "backend": ["bcryptjs", "nodemailer"]
  },
  "envVars": ["JWT_SECRET", "SMTP_HOST"]
}
```

#### Step 5 — Write install/uninstall scripts

```typescript
// scripts/install.ts
export async function install(context: DevKitContext) {
  // Run Prisma migrations
  await context.exec("npx prisma migrate dev --name add_auth");
  // Generate Prisma client
  await context.exec("npx prisma generate");
}

export async function uninstall(context: DevKitContext) {
  // Reverse migrations if needed
}
```

#### Step 6 — Submit PR to devkit-registry

Open a PR to `github.com/Roboticela/devkit-registry`. CI will:
- Validate `component.json` against JSON Schema
- Run lint on all TypeScript/TSX files in `files/`
- Check that `manifest.json` matches the actual files present
- Ensure all required fields in `component.json` are present

---

## 18. Roadmap & Milestones

### Phase 1 — Foundation (Weeks 1–4)

- [ ] Build the DevKit CLI (`@roboticela/devkit`) with `create`, `init`, `list`, `add`, `remove` commands
- [ ] Implement `devkit create` — interactive template selection, git init, npm install, theme apply, component install in one flow
- [ ] Publish CLI to npm as `@roboticela/devkit` (supports both `devkit create` and `npx @roboticela/devkit create`)
- [ ] Implement `devkit theme apply`, `devkit theme preset`, `devkit theme set`, `devkit theme audit` commands
- [ ] Build CSS variable generator with WCAG-AA auto-contrast and color derivation engine
- [ ] Generate global `globals.css` / `index.css` with full token set on `devkit init`
- [ ] Validate TailwindCSS 4 `@theme` block integration for both templates
- [ ] Set up registry GitHub repo with schema validation CI (includes hardcoded-color lint rule)
- [ ] Publish `auth` component for both templates (v1) — fully token-compliant
- [ ] Publish `hero-section` (all 6 variants) for both templates — fully token-compliant
- [ ] Publish `profile` component for both templates
- [ ] Set up Cloudflare Worker API + GitHub Releases CDN for registry

### Phase 2 — Core Components (Weeks 5–8)

- [ ] `pricing` (3 variants) for both templates
- [ ] `landing-page` orchestration component
- [ ] `dashboard` (2 variants) for both templates
- [ ] `contact-form` (2 variants) for both templates
- [ ] `waitlist` (2 variants) for both templates
- [ ] `features-section` (3 variants) for both templates
- [ ] `testimonials` (3 variants) for both templates
- [ ] `faq` (2 variants) for both templates
- [ ] `devkit update`, `devkit upgrade`, `devkit doctor` CLI commands

### Phase 3 — Advanced Components (Weeks 9–14)

- [ ] `subscriptions` (Paddle) for both templates
- [ ] `blog` (2 variants) for both templates
- [ ] `changelog` (2 variants) for both templates
- [ ] `admin-panel` for both templates
- [ ] `notifications` (2 variants) for both templates
- [ ] `file-upload` (2 variants) for both templates
- [ ] `docs-site` (2 variants) for `nextjs-compact` only
- [ ] Desktop-only components: `desktop-tray`, `desktop-updater`, `deep-link-auth`, `offline-storage`, `system-notifications`

### Phase 4 — Ecosystem (Weeks 15–20)

- [ ] `devkit eject` and `devkit config` commands
- [ ] Self-hosted registry server (Hono.js + PostgreSQL + R2)
- [ ] Download analytics dashboard for registry
- [ ] Community component submission process
- [ ] DevKit documentation site (built with `docs-site` component, of course)
- [ ] VSCode/Cursor extension for inline component browsing

### Phase 5 — Scale (Month 6+)

- [ ] Private/paid component tier
- [ ] Team-scoped component registry (custom org registry)
- [ ] AI-assisted component configuration (suggest config values based on project)
- [ ] Component marketplace

---

## Summary

| Item | Decision |
|------|---------|
| Templates | `nextjs-compact` (Next.js) + `vite-express-tauri` (Vite + Express + Tauri) |
| CLI package | `@roboticela/devkit` on npm — `devkit create` is the primary entry point |
| Registry hosting | GitHub Releases + Cloudflare CDN + Cloudflare Worker API |
| Versioning | SemVer, no auto-breaking upgrades, file-hash tracking |
| Config format | `devkit.config.json` (env var references) + `devkit.lock.json` |
| Component delivery | Template-specific tarballs, variant-specific downloads |
| Total components planned | 22 components, 46 variants across both templates |
| Deployment integration | `devkit install` in CI (like `npm install`) |
| Breaking change policy | Major versions opt-in only, 12-month LTS patches for previous major |
| **Theming** | CSS custom properties in `globals.css`; one config change cascades everywhere |
| **Token categories** | Color, typography, spacing, radius, shadow, z-index, transitions |
| **Dark mode** | Fully auto-generated `.dark` override block from a single toggle |
| **Color auto-derivation** | DevKit computes hover/active/subtle/text variants from one hex value; WCAG AA enforced |
| **TailwindCSS integration** | `@theme` block wires CSS variables into Tailwind utility classes |
| **Theme presets** | 5 built-in presets: default, minimal, bold, playful, corporate |
| **Hardcoded color policy** | Registry CI rejects any component using hardcoded colors or sizes |
