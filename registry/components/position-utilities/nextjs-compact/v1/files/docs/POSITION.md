# Position System

DevKit Layer 1 foundation (`position-utilities`, id **29**).

Semantic positioning for FABs, menus, overlays, tooltips, badges, sticky chrome, and floating UI — with z-index layers, safe areas, and collision-aware floating.

## Install

```bash
npx @roboticela/devkit add position-utilities
```

```ts
import "@/styles/position-system.css";
import {
  Position,
  PositionFab,
  FloatingPosition,
  PositionAnchor,
} from "@/components/ui/Position";
```

## Modes

`static` · `relative` · `absolute` · `fixed` · `sticky` · `floating` · `anchor` · `layered`

## Presets

| Preset | Use |
|--------|-----|
| `fab` / `fab-start` | Floating action |
| `sticky-header` / `sticky-footer` | Sticky chrome |
| `floating-nav` | Bottom / top fixed nav |
| `overlay` / `modal` | Full-viewport layers |
| `toast` / `toast-bottom` | Notifications |
| `badge` | Absolute corner badge |
| `tooltip` / `popover` / `menu` | Anchored layers |

## Quick start

```tsx
<PositionFab>＋</PositionFab>
<PositionStickyHeader>Title</PositionStickyHeader>

<PositionAnchor>
  <button>Open</button>
  <Position place="bottom" preset="popover">Menu</Position>
</PositionAnchor>

const anchorRef = useRef(null);
<button ref={anchorRef}>…</button>
<FloatingPosition anchorRef={anchorRef} placement="bottom" role="menu" flip shift>
  Contextual menu
</FloatingPosition>
```

## Layers (z-index)

`--z-base` → `--z-raised` → `--z-sticky` → `--z-nav` → `--z-fab` → `--z-overlay` → `--z-dropdown` → `--z-popover` → `--z-tooltip` → `--z-modal` → `--z-toast` → `--z-max`

## Floating collision

`FloatingPosition` / `useFloatingPosition` measure anchor + floating node, then **flip** and **shift** to stay in the viewport (RTL-aware, scroll/resize observers).

## Safe area

Presets and `safe` / `inset-*-safe` respect `env(safe-area-inset-*)` and optional `--safe-*` from Safe Area.
