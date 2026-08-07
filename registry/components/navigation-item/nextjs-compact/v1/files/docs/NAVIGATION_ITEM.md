# Navigation Item (037)

Atomic **destination** for navigation structures — usable alone or inside Navigation Menu, Tab Bar, Bottom Navigation, and future composites.

## Semantics

| Intent | API | Element |
|--------|-----|---------|
| Navigate | `href` | `<a>` |
| Open submenu / children | `expandable` | `<button aria-expanded>` |
| Select destination (SPA / host) | `onSelect` without `href` | `<button>` |
| Arbitrary action | — | Use Button / Link Button instead |

## Features

- Icon, label, secondary text, badge
- Active indicator (`start` | `underline` | `none`) — not color alone
- External-link glyph + SR note
- Disclosure chevron for expandable parents
- States: default, hover, focus, active, pressed, disabled, visited
- `single-line` / `multiline`; truncate only with `title` + accessible name
- Optical icon column alignment; ≥44×44 hit; RTL; high contrast; reduced motion

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/NavigationItem.tsx`, `styles/navigation-item.css` |
| `vite-express-tauri` | `src/components/ui/NavigationItem.tsx`, `src/styles/navigation-item.css` |

## Example

```tsx
<NavigationItem
  label="Projects"
  description="Active workspaces"
  icon={<GridIcon />}
  badge={3}
  href="#projects"
  active
/>

<NavigationItem
  label="More"
  icon={<MoreIcon />}
  expandable
  expanded={open}
  onExpandedChange={setOpen}
/>

<NavigationItem
  label="Docs"
  href="https://example.com"
  external
/>
```
