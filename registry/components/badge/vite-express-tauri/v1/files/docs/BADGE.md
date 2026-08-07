# Badge (043)

Compact visual indicator attached to another UI element.

Use for counts, short labels, categories, compact status, unread marks — **not** long messages.

## Appearances

| Appearance | Use |
|------------|-----|
| `text` | Short label / category |
| `numeric` | Counts with overflow (`99+`) |
| `dot` | Unread / presence without a numeral |
| `icon-label` | Icon + short label |

## Overflow

```tsx
<Badge count={120} max={99} /> // → 99+
<Badge count={120} max={999} /> // → 120
<Badge count={120} max={null} /> // → 120 (no overflow)
```

`showZero` controls whether `0` is visible.

## Attachment

Wrap a host control; the badge overlays a logical corner (`anchor`, default `top-end`) without replacing the control.

```tsx
<Badge count={3} tone="negative" accessibleLabel="3 unread messages">
  <IconButton label="Inbox" />
</Badge>
```

## Accessibility

- Meaningful badges: `accessibleLabel` (e.g. unread counts)
- Decorative badges: `decorative` → `aria-hidden`

Do not communicate critical information through a badge alone.

## Shape

`auto` → soft radius for text/labels; pill for numeric/dot. Override with `soft` | `rounded` | `pill`.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Badge.tsx`, `styles/badge.css` |
| `vite-express-tauri` | `src/components/ui/Badge.tsx`, `src/styles/badge.css` |
