# Shadow & Elevation System

**Package:** `elevation-tokens` · **Layer:** 1 Foundation · **ID:** 37  
**Group:** Theme Engine  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Premium visual depth via **surface hierarchy + subtle multi-layer shadows**. Supports buttons, cards, FABs, nav bars, modals, drawers, dropdowns, popovers, tooltips, overlays, and floating panels — with hover raise, pressed inset, and focus rings.

## Install

```bash
devkit add color-tokens dynamic-theme elevation-tokens
# companion:
devkit add shadow-layer
```

```css
@import "./theme-engine.css";
@import "./elevation-system.css"; /* after theme — sets --elevation-*-shadow */
```

## Levels

| Level | Use |
|-------|-----|
| 0 | Flat / pressed rest |
| 1 | Buttons, resting cards |
| 2 | Raised cards, nav, tooltips |
| 3 | Dropdowns, popovers, FAB |
| 4 | Modals, drawers |
| 5 | Highest floating chrome |

Dark mode uses deeper, softer shadows. High contrast and `data-elevation="flat"` disable shadows (borders carry hierarchy).

## Semantic roles

`.dk-elev-button`, `.dk-elev-card`, `.dk-elev-fab`, `.dk-elev-nav`, `.dk-elev-modal`, `.dk-elev-drawer`, `.dk-elev-dropdown`, `.dk-elev-popover`, `.dk-elev-tooltip`, `.dk-elev-panel`, `.dk-elev-panel-float`

```tsx
<Elevation semantic="card" interactive className="dk-surface dk-surface-card">
  …
</Elevation>

<Elevation semantic="fab" as="button">+</Elevation>
<ShadowLayer level={3}>Floating panel</ShadowLayer>
```

## States

- **Hover** — raises one level
- **Pressed** — inset shadow + 0.5px translate
- **Focus** — focus ring + soft elevation
- Transitions honor `prefers-reduced-motion` / `data-motion="reduce"`
