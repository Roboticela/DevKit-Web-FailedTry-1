# Density System

Part of **responsive-spacing** (id **24**). Application-wide display density — Compact, Comfortable, Spacious, and Custom — so every component adapts without local configuration.

## Install

```bash
npx @roboticela/devkit add responsive-spacing
```

```ts
import "@/styles/responsive-spacing.css";
import "@/styles/density-system.css";
import {
  DensityProvider,
  DensityScript,
  useDensity,
  DensityScope,
} from "@/components/ui/DensityProvider";
```

## App setup

```tsx
<html>
  <head>
    <DensityScript /> {/* avoid FOUC from localStorage */}
  </head>
  <body>
    <DensityProvider storageKey="devkit-density" defaultDensity="comfortable">
      <App />
    </DensityProvider>
  </body>
</html>
```

## Modes

| Mode | Effect |
|------|--------|
| `compact` | Tighter spacing, slightly smaller type/icons, denser rows (touch ≥ 40px) |
| `comfortable` | Default Apple-like rhythm |
| `spacious` | Airier padding, larger controls/rows |
| `custom` | Admin-defined CSS vars via `setCustom()` |

## Hook

```tsx
const { density, setDensity, setCustom, scale } = useDensity();

setDensity("compact");
setCustom({ scale: 1.08, typeScale: 1.02, touchMin: "2.75rem", scaleSpace: true });
```

## Scoped override

```tsx
<DensityScope density="compact">
  <table className="dk-density-table-row">…</table>
</DensityScope>
```

## Opt-in classes

`.dk-density-touch` · `.dk-density-control` · `.dk-density-row` · `.dk-density-table-row` · `.dk-density-list-item` · `.dk-density-nav-item` · `.dk-density-card` · `.dk-density-form` · `.dk-density-type-body`

Spacing / padding / gap packages already read `data-density` — cards, stacks, and forms adapt automatically when tokens are used.

## A11y

Compact keeps a usable touch floor (`--density-touch-min`). Prefer `comfortable` or `spacious` when targeting touch-first or large-text users. Density transitions honor reduced motion.
