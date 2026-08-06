# Shape System

**Package:** `rounded-corner` · **Layer:** 1 Foundation · **ID:** 74  
**Group:** Shape System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Unified corner language — sharp to fully rounded — for buttons, inputs, cards, chips, avatars, containers, and nested surfaces. Smooth Apple-inspired curves via rem-based semantic tokens.

## Install

```bash
devkit add color-tokens responsive-spacing rounded-corner
# companions:
devkit add circle-shape pill-shape avatar-shape border divider separator
```

```css
@import "./shape-system.css"; /* before surface-system */
@import "./surface-system.css";
```

## Scale

| Token | Approx |
|-------|--------|
| `--radius-none` … `--radius-4xl` | 0 → 32px |
| `--radius-full` | pill / circle |
| `--radius-smooth` | default soft card curve |

## Semantic roles

`--radius-button`, `--radius-input`, `--radius-card`, `--radius-container`, `--radius-modal`, `--radius-chip`, `--radius-avatar`, `--radius-avatar-square`, `--radius-avatar-soft`, …

Responsive + `data-density` adjust roles without changing component code.

## Nested radii

```tsx
<RoundedCorner nest nestRadius="card" className="dk-surface dk-surface-pad-md">
  <ShapeNested className="dk-surface dk-surface-sunken dk-surface-pad-sm">
    Nested child shares continuous curvature
  </ShapeNested>
</RoundedCorner>
```

Formula: `max(0, parentRadius − inset)`.

## Components

- `RoundedCorner` / `Shape` / `ShapeNested`
- `CircleShape`, `PillShape`, `AvatarShape`
- `Border`, `Divider` / `Separator`

## Companions

`circle-shape`, `pill-shape`, `avatar-shape`, `border`, `divider`, `separator` — same APIs, installable alone (bundle `Surface`-style copies of the needed files).
