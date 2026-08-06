# Responsive Grid System

**Package:** `responsive-grid` · **Layer:** 1 Foundation · **ID:** 11  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Structural foundation for every DevKit layout — Apple-inspired balance, whitespace, and clarity. Mobile-first columns and gutters expand through tablet, laptop, desktop, and ultrawide without breaking hierarchy.

## Install

```bash
devkit add color-tokens typography-tokens responsive-grid
# recommended companions
devkit add container safe-area spacer stack-layout flex-layout
```

```css
@import "./color-tokens.css";
@import "./typography-tokens.css";
@import "./responsive-grid.css";
@import "./responsive-grid.tailwind.css"; /* optional */
```

## Breakpoints (mobile-first)

| Name | Min width | Default columns | Intent |
|------|-----------|-----------------|--------|
| Phone | 0 | 4 | Touch-first, full-bleed content |
| Phablet | 480 | 4 | Slightly roomier padding |
| Tablet | 768 | 8 | Two-up productivity |
| Laptop | 1024 | 12 | Full app chrome |
| Desktop | 1280 | 12 | Max content width expands |
| Ultrawide | 1440 / 1680 | 12 | Generous gutters, capped container |

Tokens: `--bp-*`, `--grid-columns`, `--grid-gutter`, `--container-max`, `--container-padding`.

## Core classes

| Class | Role |
|-------|------|
| `.dk-container` / `.dk-container-fluid` | Centered / full-bleed wrappers with safe padding |
| `.dk-grid` | 12-track (token-driven) CSS grid |
| `.dk-grid-cols-*` / `.dk-md-grid-cols-*` | Override column count |
| `.dk-col-*` / `.dk-md-col-*` / `.dk-lg-col-*` | Column spans |
| `.dk-grid-autofit` / `.dk-grid-autofill` | Auto-fit / auto-fill tracks |
| `.dk-masonry` | Column masonry (progressive) |
| `.dk-equal-height` | Stretch children to equal row height |
| `.dk-gap-tight` / `.dk-gap-loose` | Gutter density |
| `.dk-items-*` / `.dk-justify-*` / `.dk-content-*` | Alignment |
| `.dk-safe-area` | `env(safe-area-inset-*)` padding |
| `.dk-stack` / `.dk-inline` / `.dk-flex` | Companion layout primitives |
| `.dk-section` / `.dk-surface` / `.dk-aspect-*` | Page structure helpers |

Override locally:

```html
<div class="dk-grid" style="--grid-columns: 6; --grid-gutter: 1.25rem">
```

## React API

```tsx
import { ResponsiveGrid, GridItem } from ".../ResponsiveGrid";
import { Container } from ".../Container";
import { SafeArea } from ".../SafeArea";

<SafeArea>
  <Container>
    <ResponsiveGrid columns={{ sm: 4, md: 8, lg: 12 }} gap="default" equalHeight>
      <GridItem span={{ sm: 4, md: 4, lg: 3 }}>…</GridItem>
      <GridItem span={{ sm: 4, md: 4, lg: 9 }}>…</GridItem>
    </ResponsiveGrid>
  </Container>
</SafeArea>
```

## Nesting

Place `.dk-grid.dk-grid-nested` (or `<ResponsiveGrid nested>`) inside a `GridItem`. Nested grids get `min-width: 0` so tracks don’t blow out the parent.

## Touch vs productivity

- Mobile gutters start at **16px** (`--grid-gutter: 1rem`) for finger-friendly separation  
- Larger breakpoints increase gutter and container padding for calm whitespace  
- Container max-width caps ultrawide line lengths so hierarchy stays readable  

## Accessibility

- Prefer semantic landmarks (`main`, `section`) around containers  
- Don’t rely on grid alone for reading order — keep DOM order logical  
- Safe-area classes protect notches / home indicators on mobile & desktop PWA  

## Do / don’t

```tsx
// ❌ Fixed pixel columns that collapse on phone
<div style={{ display: "grid", gridTemplateColumns: "repeat(12, 80px)" }} />

// ✅ Token-driven responsive grid
<ResponsiveGrid columns={{ sm: 4, lg: 12 }}>
  <GridItem span={{ sm: 4, lg: 8 }}>Primary</GridItem>
  <GridItem span={{ sm: 4, lg: 4 }}>Aside</GridItem>
</ResponsiveGrid>
```
