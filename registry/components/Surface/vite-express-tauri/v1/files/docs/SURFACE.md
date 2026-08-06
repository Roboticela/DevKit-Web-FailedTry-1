# Surface System

**Package:** `surface` · **Layer:** 1 Foundation · **ID:** 18  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Enterprise visual layers for every UI plane — pages, cards, modals, sheets, side panels, tooltips, popovers, dropdowns, menus, widgets, and overlays. Hierarchy comes from **semantic elevation tokens**, **materials**, and spacing — not one-off chrome.

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
@import "./elevation-system.css"; /* optional — richer elev shadows */
@import "./surface-system.css";
```

## Variants

| Variant | Use |
|---------|-----|
| `page` | Full-bleed canvas |
| `card` | Grouped content |
| `panel` | Inset / secondary region |
| `sheet` | Drawer / bottom sheet |
| `side-panel` / `sidebar` | Persistent / floating side chrome |
| `modal` / `overlay` | Dialog faces |
| `popover` / `dropdown` / `menu` | Floating menus |
| `tooltip` | Compact hint chrome |
| `dashboard` | Spacious shell |
| `widget` | Dense interactive tile |

## API

```tsx
<Surface variant="card" elevation={2} interactive stack contain>
  …
</Surface>

<CardSurface>…</CardSurface>
<TooltipSurface>Save</TooltipSurface>
<DropdownSurface>…</DropdownSurface>
<MenuSurface>…</MenuSurface>
<SidePanelSurface side="end">…</SidePanelSurface>
<ModalSurface size="lg">…</ModalSurface>
<OverlaySurface>…</OverlaySurface>

<Surface outlined interactive>Outline</Surface>
<Surface material="frosted" veil elevation={3}>Frosted + veil</Surface>
<Surface interactive pressed>Pressed</Surface>

<GlassSurface>…</GlassSurface>
<FrostedSurface variant="sheet">…</FrostedSurface>

<Overlay open={open} onClose={close}>
  <Title variant="section">Confirm</Title>
</Overlay>
```

## Materials & elevation

- `material`: `solid` | `glass` | `frosted` | `material` | `translucent` | `veil`
- `elevation`: `0`–`5` (maps to `--elevation-*` tokens)
- `outlined` / `quiet` / `sunken` / `veil`
- `interactive` — hover, press depth, focus ring
- `motion` — elevation/color transitions (honors reduced motion)
- `contain` — `contain: layout paint style` + `content-visibility` for lists of cards
- High contrast disables blur and restores stronger borders
- Adaptive dark mode boosts material saturation slightly

## Performance

- Paint containment on frosted/glass layers
- Optional `contain` for widget/card grids
- `isolation: isolate` to limit backdrop-filter invalidation
- No perpetual `will-change`

## Companions

- `glass-surface` → `GlassSurface`
- `frosted-surface` → `FrostedSurface`
- `shadow-layer` → `ShadowLayer`
- `overlay` → `Overlay`
