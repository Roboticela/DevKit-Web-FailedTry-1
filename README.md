# Roboticela DevKit — Monorepo

> Reusable UI component system. Layer 1 **Interaction Controls** (001–010) ready; **Form Controls** 011–020 ready. Other subgroups reserved.

---

## Preview

```bash
cd playground
npm install
npm run dev
```

Opens `http://localhost:5173` — shows reserved group/subgroups (0 packages).

---

## Layers (reserved)

| Layer | IDs | Category | Scope |
|-------|-----|----------|--------|
| 1 Foundation | 1–100 | `foundation` | Interaction Controls 001–010 ready; Form Controls 011–020 ready |
| 2 Basic | 101–500 | `basic` | — |
| 3 Composite | 501–1500 | `composite` | — |
| 4 Advanced | 1501–2500 | `advanced` | — |
| 5 Templates | 2501–3000 | `templates` | — |

### Layer 1 — Group 1

**Foundations & Interface Primitives** (`foundations-interface-primitives`) — available for `nextjs-compact` and `vite-express-tauri`.

#### Interaction Controls (`interaction-controls`) — IDs 001–010

| ID | Package | Display name | Status |
|----|---------|--------------|--------|
| 001 | `button` | Button | ready (`1.0.0`) |
| 002 | `icon-button` | Icon Button | ready (`1.0.0`) |
| 003 | `button-group` | Button Group | ready (`1.0.0`) |
| 004 | `split-button` | Split Button | ready (`1.0.0`) |
| 005 | `link-button` | Link Button | ready (`1.0.0`) |
| 006 | `floating-action-button` | Floating Action Button | ready (`1.0.0`) |
| 007 | `toggle-button` | Toggle Button | ready (`1.0.0`) |
| 008 | `segmented-control` | Segmented Control | ready (`1.0.0`) |
| 009 | `command-button` | Command Button | ready (`1.0.0`) |
| 010 | `action-menu-trigger` | Action Menu Trigger | ready (`1.0.0`) |

#### Form Controls (`form-controls`) — IDs 011–020

| ID | Package | Display name | Status |
|----|---------|--------------|--------|
| 011 | `text-input` | Text Input | ready (`1.0.0`) |
| 012 | `textarea` | Textarea | ready (`1.0.0`) |
| 013 | `search-field` | Search Field | ready (`1.0.0`) |
| 014 | `number-input` | Number Input | ready (`1.0.0`) |
| 015 | `password-input` | Password Input | ready (`1.0.0`) |
| 016 | `otp-input` | OTP / Verification Input | ready (`1.0.0`) |
| 017 | `date-input` | Date Input | ready (`1.0.0`) |
| 018 | `time-input` | Time Input | ready (`1.0.0`) |
| 019 | `date-time-input` | Date & Time Input | ready (`1.0.0`) |
| 020 | `input-group` | Input Group | ready (`1.0.0`) |

Other subgroups are reserved with no packages yet:

| Subgroup ID | Name |
|-------------|------|
| `selection-controls` | Selection Controls |
| `navigation-controls` | Navigation Controls |
| `feedback-status` | Feedback & Status |
| `content-display` | Content & Display |
| `layout-primitives` | Layout Primitives |
| `overlay-primitives` | Overlay Primitives |
| `data-display-primitives` | Data Display Primitives |
| `media-primitives` | Media Primitives |

Structure: `registry/components/layers.json`. Index: `registry/components/registry.json`.

---

## Registry Server

```bash
cd registry
npm install
npm run dev
# → GET /api/v1/layers
# → GET /api/v1/components
```

---

## CLI

```bash
cd cli
npm install
npx tsx src/index.ts list
```

Local registry: `DEVKIT_REGISTRY=http://localhost:4000`

---

## Design language

DevKit UI follows the **Design Constitution** (Apple-class craft, semantic tokens, no magic values):

| Doc | Role |
|-----|------|
| [`.cursor/rules/design-main-rule.mdc`](.cursor/rules/design-main-rule.mdc) | Full constitution §§01–100 (spacing, type, color, radius, motion, a11y, generator prompt) |
| [`.cursor/rule/design-rule.md`](.cursor/rule/design-rule.md) | Always-on summary for agents |
| [`.cursor/rules/devkit-design.mdc`](.cursor/rules/devkit-design.mdc) | Cursor always-apply rule |
| [`.cursor/rules/component-generator.mdc`](.cursor/rules/component-generator.mdc) | Component authoring prompt (§100) |

`devkit theme apply` emits constitution CSS variables (`--space-*`, `--radius-*`, `--color-*`, type, motion, z-index). Defaults: system fonts, accent `#0071e3`, radius personality `balanced`. No box-shadow or gradient tokens.
