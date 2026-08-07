# Roboticela DevKit — Monorepo

Reusable UI system. Categories are empty and ready to fill.

## Categories

| Category | Directory | Status |
|----------|-----------|--------|
| Components | `registry/components` | empty |
| Pages | `registry/pages` | empty |
| Scaffolds | `registry/scaffolds` | empty |

## Preview

```bash
cd playground
npm install
npm run dev
```

Opens `http://localhost:5173` — Components / Pages / Scaffolds (0 packages).

## Registry Server

```bash
cd registry
npm install
npm run dev
# → GET /api/v1/categories
# → GET /api/v1/components
# → GET /api/v1/components?category=components|pages|scaffolds
```

## CLI

```bash
cd cli
npm install
npx tsx src/index.ts list
```

Local registry: `DEVKIT_REGISTRY=http://localhost:4000`
