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

See `devkit-plan.md` Section 18 for milestones. Design language: `.cursor/rule/design-rule.md`.
