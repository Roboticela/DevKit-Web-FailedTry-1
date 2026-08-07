# Roboticela DevKit — Monorepo

> Empty reusable UI component system. No components or scaffolds are registered yet.

---

## Preview

```bash
cd playground
npm install
npm run dev
```

Opens `http://localhost:5173` — empty catalog.

---

## Layers (reserved)

| Layer | IDs | Category | Scope |
|-------|-----|----------|--------|
| 1 Foundation | 1–100 | `foundation` | — |
| 2 Basic | 101–500 | `basic` | — |
| 3 Composite | 501–1500 | `composite` | — |
| 4 Advanced | 1501–2500 | `advanced` | — |
| 5 Templates | 2501–3000 | `templates` | — |

Components live under `registry/components/`. The index is empty: `registry/components/registry.json`.

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

See [`.cursor/rule/design-rule.md`](.cursor/rule/design-rule.md). Historical architecture notes: [`devkit-plan.md`](devkit-plan.md).
