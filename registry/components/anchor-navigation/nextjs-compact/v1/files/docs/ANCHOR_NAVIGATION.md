# Anchor Navigation (039)

In-page **section wayfinding** with real hash links.

## Features

- Anchor links (`<a href="#section">`) — not JS-only navigation
- Active section via scroll sync (`IntersectionObserver`)
- Sticky mode with `--dk-anchor-nav-offset` / `.dk-anchor-nav-target` scroll margin
- Horizontal / vertical / auto orientation
- Overflow: `scroll` (compact mobile) or `wrap`
- Smooth scroll enhancement respects `prefers-reduced-motion`
- Keyboard (arrows / Home / End), RTL, HC, ≥44×44 hits

## Scroll margin

Sticky chrome must not hide section headings. The nav sets `--dk-anchor-nav-offset`. Pair targets:

```html
<section id="pricing" class="dk-anchor-nav-target">…</section>
```

Or: `scroll-margin-block-start: var(--dk-anchor-nav-offset);`

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/AnchorNavigation.tsx`, `styles/anchor-navigation.css` |
| `vite-express-tauri` | `src/components/ui/AnchorNavigation.tsx`, `src/styles/anchor-navigation.css` |

## Example

```tsx
<AnchorNavigation
  label="On this page"
  sticky
  orientation="horizontal"
  overflow="scroll"
  items={[
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ]}
/>
```
