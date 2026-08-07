# Context Menu

Actions relevant to a specific object, region, or selection.

Builds on the **Menu** primitive (055) for item semantics and keyboard patterns.
This package owns contextual triggers (right-click, long-press, keyboard equivalent)
and point-based positioning.

## Triggers

| Input | Behavior |
|-------|----------|
| Right / secondary click | Opens at pointer |
| Long-press (touch) | Opens at press point |
| `ContextMenu` / `Shift+F10` | Opens at target center (keyboard equivalent) |
| Controlled `open` | Host can open from an explicit action menu |

**Do not** make right-click the only way to reach an important action — expose a visible/keyboard path too.

## Items

- Actions with optional icons and shortcuts
- Separators between meaningful groups
- Disabled and destructive actions
- Nested submenus
- `keepOpen` when an action must leave the menu open

Selecting an action closes the menu unless `keepOpen` is set.

## Positioning

Opens near the contextual point with **12px** viewport edge padding so items stay reachable. Flips/shifts when space is insufficient. Repositions on scroll/resize.

## Presentation

| `presentation` | Behavior |
|----------------|----------|
| `auto` (default) | Floating menu; sheet on narrow/coarse touch |
| `menu` | Always floating |
| `sheet` | Always bottom sheet |

## Accessibility

- Closed menus are **not** rendered (nothing in the a11y tree)
- Surface: `role="menu"` while open
- Target: `aria-haspopup`, `aria-expanded`, `aria-controls` while open
- Escape closes (submenu first, then menu)
- Focus moves into the menu; restored to the prior element on close
- RTL, screen readers, touch, high contrast, dynamic text

## Composition

```tsx
<ContextMenu
  label="Message actions"
  items={[
    { id: "reply", label: "Reply", onSelect: reply },
    { id: "forward", label: "Forward", onSelect: forward },
    { type: "separator" },
    { id: "delete", label: "Delete", destructive: true, onSelect: remove },
  ]}
>
  <article tabIndex={0}>Message body…</article>
</ContextMenu>

{/* Explicit alternative — never rely on right-click alone */}
<Button onClick={() => setOpen(true)}>Actions</Button>
```

Z-index: `var(--z-dropdown)`. No box-shadow / no gradients.
