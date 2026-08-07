# Breadcrumbs (033)

Communicate **hierarchical location** within a content structure.

Example: `Home › Products › Category › Current Page`

## Behavior

- Ancestor crumbs are links (or buttons for SPA hosts)
- The **current page is not a link** by default (`aria-current="page"`)
- Separators stay quiet — hierarchy without visual dominance
- Long trails collapse intermediate levels into an **overflow menu** (`…`) so hidden ancestors stay discoverable
- Optional home icon on the first crumb

## Mobile (`mobile` prop)

| Value | Presentation |
|-------|----------------|
| `auto` (default) | Full/collapsed trail on desktop; `ancestor › current` under ~480px |
| `full` | Always full / collapsed trail |
| `back` | `Back` + current page |
| `ancestor` | Immediate parent › current |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Breadcrumbs.tsx`, `styles/breadcrumbs.css` |
| `vite-express-tauri` | `src/components/ui/Breadcrumbs.tsx`, `src/styles/breadcrumbs.css` |

## Example

```tsx
<Breadcrumbs
  showHomeIcon
  collapse="auto"
  maxVisible={4}
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "products", label: "Products", href: "/products" },
    { id: "audio", label: "Audio", href: "/products/audio" },
    { id: "headphones", label: "Headphones", href: "/products/audio/headphones" },
    { id: "current", label: "Studio Pro" },
  ]}
/>
```
