# Previous / Next Navigation (040)

Sequential movement through related content (docs, articles, tutorials, records, setup steps).

## Semantics

- DOM order is always **Previous → Next**.
- In RTL, visual placement may flip via logical CSS — **meaning does not reverse**.
- Use real `<a href>` for document destinations. Buttons only when there is no URL (`onSelect`).

## Boundaries

| Position | Previous | Next |
|----------|----------|------|
| First | missing → `boundary="disable"` or `"hide"` | available |
| Middle | available | available |
| Last | available | missing → disable or hide |

## Features

- Optional direction labels, destination titles, icons
- `layout`: `split` (desktop-balanced) · `stack` (mobile / long titles) · `auto`
- Long titles ellipsize with `title` / `aria-label` for full discovery
- ≥44×44 hits, keyboard, screen readers, RTL, HC, dynamic text

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/PreviousNextNavigation.tsx`, `styles/previous-next-navigation.css` |
| `vite-express-tauri` | `src/components/ui/PreviousNextNavigation.tsx`, `src/styles/previous-next-navigation.css` |

## Example

```tsx
<PreviousNextNavigation
  previous={{
    href: "/docs/intro",
    title: "Introduction",
  }}
  next={{
    href: "/docs/install",
    title: "Installation",
  }}
/>

{/* First page */}
<PreviousNextNavigation
  boundary="hide"
  next={{ href: "/docs/intro", title: "Introduction" }}
/>
```
