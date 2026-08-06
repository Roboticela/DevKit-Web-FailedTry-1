# Roboticela DevKit — Monorepo

> Five-layer reusable UI component system for both official templates. Scaffolds remain supported but are empty for now.

---

## Preview components (easiest)

```bash
cd playground
npm install
npm run dev
```

Opens `http://localhost:5173` — **Typography Lab**, **Color Lab**, and Layer 1 catalog. Switch Light / Dark / High contrast in the header.

---

## Layer 1 — Foundation (IDs 1–100)

| Group | IDs | Packages |
|-------|-----|----------|
| Design Tokens | 1–10 | **color-tokens**, **typography-tokens** + font/weight/size/leading/tracking companions |
| Layout System | 11–20 | grid, flex, stack, inline, spacer, container, section, surface, safe-area, aspect-ratio |
| Spacing System | 21–30 | margin/padding/gap utilities, responsive spacing, alignment, … |
| Theme Engine | 31–40 | **light/dark/high-contrast**, **semantic + accent**; elevation/motion/blur/gradient stubs |
| Typography System | 41–50 | **display, heading, title, subtitle, body, caption, label, helper, code, numeric** |
| Icon System | 51–60 | icon, icon-button, status/brand/file/social/ai icons, … |
| Motion System | 61–70 | fade/scale/slide, transitions, hover/press, skeleton, … |
| Shape System | 71–80 | divider, separator, border, shapes, glass/frosted, shadow-layer |
| Accessibility System | 81–90 | focus ring, SR/ARIA helpers, touch targets, skip nav, … |
| Utility Components | 91–100 | portal, overlay, observers, theme/design providers |

**Ready:** color + typography systems (tokens, companions, React type packages). Docs: `docs/devkit/COLOR_TOKENS.md`, `docs/devkit/TYPOGRAPHY.md`.
---

## Five layers

| Layer | IDs | Category | Scope |
|-------|-----|----------|--------|
| 1 Foundation | 1–100 | `foundation` | 10 systems above |
| 2 Basic | 101–500 | `basic` | Buttons, inputs, chips, … |
| 3 Composite | 501–1500 | `composite` | Tables, forms, nav, … |
| 4 Advanced | 1501–2500 | `advanced` | Kanban, dashboards, … |
| 5 Templates | 2501–3000 | `templates` | Page templates & layouts |

---

## Registry Server

```bash
cd registry
npm install
npm run dev
# → GET /api/v1/layers
# → GET /api/v1/components?layer=1
# → GET /api/v1/components?group=design-tokens
```

---

## CLI

```bash
cd cli
npm install
npx tsx src/index.ts list --layer=1
npx tsx src/index.ts list --group=typography-system
```

Local registry: `DEVKIT_REGISTRY=http://localhost:4000`

---

## Design language

See [`.cursor/rule/design-rule.md`](.cursor/rule/design-rule.md). Historical architecture notes: [`devkit-plan.md`](devkit-plan.md).
