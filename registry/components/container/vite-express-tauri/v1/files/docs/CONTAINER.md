# Responsive Container

**Package:** `container` · **Layer:** 1 Foundation · **ID:** 16  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Primary layout wrapper for screens, modals, dashboards, forms, and content sections. Mobile-first, safe-area aware (notch / home indicator / Dynamic Island), nested-safe, token padding.

## Install

```bash
devkit add responsive-spacing responsive-grid container
```

```css
@import "./responsive-spacing.css";
@import "./responsive-grid.css";
@import "./container-system.css";
```

## Variants

| Variant | Max width |
|---------|-----------|
| `fluid` / `full` | none |
| `fixed` / `centered` | `--container-width-default` |
| `narrow` / `reading` | 40rem |
| `form` | 28rem |
| `modal` | 32rem |
| `wide` | 72rem |
| `hero` | 80rem |
| `dashboard` | 90rem |
| `custom` | `--container-custom-width` / `maxWidth` prop |

## API

```tsx
<Container variant="dashboard" paddingY="section" stack safeArea>
  <Container variant="reading" nested>
    Article…
  </Container>
</Container>

<Container variant="modal" scrollLock elevated as="section" aria-label="Dialog body">
  …
</Container>

<Container variant="custom" maxWidth="56rem" sticky align="center" motion>
  …
</Container>
```

## Features

- Token padding (`padding` / `paddingX` / `paddingY`) — no hardcoded px
- Safe areas via `env(safe-area-inset-*)`
- Nested containers auto-tighten padding and skip double safe insets
- Sticky top/bottom, overflow auto/hidden/clip, scroll lock
- Motion-aware resize transitions (honors reduced motion)
- Landmark-friendly `as` (`main`, `section`, `aside`, …)
- Density adapts via `data-density`
- Foldable progressive: `fold` + `horizontal-viewport-segments`

## Legacy

`width="default" | "fluid" | "narrow" | "wide"` still works and maps to variants.
