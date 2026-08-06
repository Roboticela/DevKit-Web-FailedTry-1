# Spacing System

**Package:** `responsive-spacing` · **Layer:** 1 Foundation · **ID:** 24  
**Group:** Spacing System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Universal spacing tokens that govern margins, padding, gaps, and semantic layout rhythm across every DevKit component. Apple-inspired calm rhythm — no arbitrary pixel values.

## Install

```bash
devkit add color-tokens typography-tokens responsive-grid responsive-spacing
```

```css
@import "./color-tokens.css";
@import "./typography-tokens.css";
@import "./responsive-spacing.css"; /* load before or after grid — bridges gutters */
@import "./responsive-grid.css";
@import "./responsive-spacing.tailwind.css"; /* optional */
```

## Primitive scale

4px unit (`--space-unit`). Steps: `0`, `px`, `0.5` … `32` → `--space-0` … `--space-32`.

Use rem so browser text zoom scales spacing with type.

## Semantic roles

| Token | Use |
|-------|-----|
| `--space-page-x` / `--space-page-y` | Page chrome padding |
| `--space-section-y` / `--space-section-gap` | Section rhythm |
| `--space-card-padding` / `--space-card-gap` | Cards / surfaces |
| `--space-form-*` | Forms & fields |
| `--space-modal-*` | Dialogs / sheets |
| `--space-table-cell-*` | Tables |
| `--space-nav-*` | Navigation items |
| `--space-type-*` | Typography stack / paragraphs |
| `--space-control-*` / `--space-inline-gap` / `--space-stack-gap` | Controls & clusters |
| `--space-touch-min` | Minimum touch target (~44px) |

Classes: `.dk-space-page`, `.dk-space-section`, `.dk-space-card`, `.dk-space-form`, `.dk-space-modal`, `.dk-space-table-cell`, `.dk-space-nav-item`, `.dk-space-stack`, `.dk-space-inline`.

## Density modes

Set on `<html>`:

| Mode | Attribute | Feel |
|------|-----------|------|
| Compact | `data-density="compact"` | Dense enterprise tables / tools |
| Comfortable | default / `comfortable` | Balanced product UI |
| Spacious | `data-density="spacious"` | Marketing / executive calm |

```tsx
import { DensityProvider } from ".../DensityProvider";
<DensityProvider density="compact">{children}</DensityProvider>
```

Semantic tokens and grid bridges (`--grid-gutter`, `--container-padding`, `--section-space-y`) update with density and breakpoints.

## Responsive rhythm

Semantic page/section/card spacing steps up at **768**, **1024**, and **1280** while the primitive scale stays stable — hierarchy preserved, not “everything bigger.”

## Utilities

- Margin: `.dk-m-*`, `.dk-mx-*`, `.dk-my-*`, `.dk-mt-*`, …
- Padding: `.dk-p-*`, `.dk-px-*`, `.dk-py-*`, …
- Gap: `.dk-gap-*`, `.dk-gap-x-*`, `.dk-gap-y-*`
- Content width: `.dk-content-width`, `-prose`, `-ui`, `-wide`, `-full`
- Align / distribute / position / overflow companions

## Do / don’t

```css
/* ❌ */
.card { padding: 13px; margin-bottom: 22px; }

/* ✅ */
.card {
  padding: var(--space-card-padding);
  margin-bottom: var(--space-stack-gap);
}
```
