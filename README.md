# Roboticela DevKit — Monorepo

> Five-layer reusable UI component system for both official templates. Scaffolds remain supported but are empty for now.

---

## Folder Structure

```
DevKit/
├── .cursor/rule/design-rule.md   ← Apple-level design language
├── devkit-plan.md                ← Historical full-system plan
├── registry/                     ← Hono registry + component packages
│   └── components/
│       ├── layers.json           ← Layer taxonomy (IDs 1–3000)
│       ├── registry.json         ← Installable package index
│       └── <name>/               ← One package per component
└── cli/                          ← @roboticela/devkit CLI
```

---

## Package kinds

| Kind | Meaning | Status |
|------|---------|--------|
| `component` | Reusable UI (tokens → templates) | Layer 1 shipping; layers 2–5 next |
| `scaffold` | Full features (routes, APIs, flows) | Supported in schema; **empty for now** |

Every reusable component targets **both** `nextjs-compact` and `vite-express-tauri`. Users select packages with `devkit add <name>`.

---

## Five layers

| Layer | IDs | Category | Scope |
|-------|-----|----------|--------|
| 1 Foundation | 1–100 | `foundation` | Tokens, typography, icons, surfaces, layout |
| 2 Basic | 101–500 | `basic` | Buttons, inputs, chips, avatars, badges, … |
| 3 Composite | 501–1500 | `composite` | Tables, forms, nav, charts, dialogs, … |
| 4 Advanced | 1501–2500 | `advanced` | Kanban, Gantt, AI chat, dashboards, … |
| 5 Templates | 2501–3000 | `templates` | Page templates, auth UI, admin/CRM layouts |

Currently published: **Layer 1** (`tokens`, `typography`, `icon`, `surface`, `stack`, `grid`, `divider`).

---

## Registry Server

```bash
cd registry
npm install
npm run dev
# → http://localhost:4000
# → GET /health
# → GET /api/v1/layers
# → GET /api/v1/components
# → GET /api/v1/components?layer=1&kind=component
# → GET /api/v1/components?kind=scaffold   # empty for now
```

---

## CLI

```bash
cd cli
npm install

# Browse
npx tsx src/index.ts list
npx tsx src/index.ts list --layer=1
npx tsx src/index.ts list --category=foundation
npx tsx src/index.ts list --kind=component
npx tsx src/index.ts list --kind=scaffold

# Install (from a DevKit project)
npx tsx src/index.ts add tokens
npx tsx src/index.ts add typography
```

Local registry: `DEVKIT_REGISTRY=http://localhost:4000`

---

## Design language

See [`.cursor/rule/design-rule.md`](.cursor/rule/design-rule.md). Historical architecture notes: [`devkit-plan.md`](devkit-plan.md).
