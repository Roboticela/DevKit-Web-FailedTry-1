# Surface System

**Package:** `surface` · **Layer:** 1 Foundation · **ID:** 18  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Apple-inspired layered surfaces for pages, cards, panels, sheets, popovers, sidebars, modals, dashboards, widgets, and overlays. Hierarchy comes from **elevation** (background + soft border), **materials** (glass / frosted), and spacing — not heavy chrome or shadows.

## Install

```bash
devkit add color-tokens dynamic-theme responsive-spacing surface
# companions:
devkit add glass-surface frosted-surface shadow-layer overlay
```

```css
@import "./color-tokens.css";
@import "./theme-engine.css";
@import "./responsive-spacing.css";
@import "./surface-system.css";
```

## Variants

| Variant | Use |
|---------|-----|
| `page` | Full-bleed canvas |
| `card` | Grouped content |
| `panel` | Inset / secondary region |
| `sheet` | Drawer / bottom sheet |
| `popover` | Compact float |
| `sidebar` | Persistent nav |
| `modal` | Dialog face |
| `dashboard` | Spacious shell |
| `widget` | Dense tile |

## API

```tsx
<Surface variant="card" elevation={2} stack>
  …
</Surface>

<CardSurface>…</CardSurface>
<ModalSurface size="lg">…</ModalSurface>
<GlassSurface>…</GlassSurface>
<FrostedSurface variant="sheet">…</FrostedSurface>
<ShadowLayer level={3}>…</ShadowLayer>

<Overlay open={open} onClose={close} placement="center">
  <Title variant="section">Confirm</Title>
</Overlay>
```

## Materials & elevation

- `material`: `solid` | `glass` | `frosted` | `material`
- `elevation`: `0`–`4` (maps to theme-engine `--elevation-*`)
- High contrast disables blur and restores stronger borders
- `--surface-shadow` defaults to `none` (depth via surfaces)

## Companions

- `glass-surface` → `GlassSurface`
- `frosted-surface` → `FrostedSurface`
- `shadow-layer` → `ShadowLayer`
- `overlay` → `Overlay`
