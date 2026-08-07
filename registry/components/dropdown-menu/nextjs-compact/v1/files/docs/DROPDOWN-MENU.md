# Dropdown Menu

Command-oriented collection of actions anchored to a trigger.

Builds on the **Menu** primitive (055) for item semantics and keyboard patterns.
This package owns triggering, positioning, and mobile sheet presentation.

**Examples:** Edit, Duplicate, Move, Archive, Delete.

Do **not** use as a generic form container — prefer Popover for filters/config panels.

## Features

- Menu items with optional icons and shortcuts
- Separators between meaningful groups only
- Disabled items (no activation)
- Destructive items (calm distinction)
- Nested submenus
- Checkbox-style and radio-style items
- Type-ahead to jump by label prefix

## Presentation

| `presentation` | Behavior |
|----------------|----------|
| `auto` (default) | Dropdown on desktop/pointer; bottom sheet on narrow/coarse touch |
| `menu` | Always dropdown |
| `sheet` | Always sheet |

Sheet uses a drill-down stack for nested menus (Back). Desktop opens a flyout submenu.

## Keyboard

| Key | Action |
|-----|--------|
| ↓ / ↑ | Next / previous item |
| Enter / Space | Activate |
| Escape | Close submenu, then menu |
| → / ← | Open / close submenu (mirrored in RTL) |
| Home / End | First / last item |
| Type-ahead | Focus matching label |

Focus moves into the menu on open and returns to the trigger on close.

## Semantics

- Trigger: `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`
- Surface: `role="menu"`
- Items: `menuitem` / `menuitemcheckbox` / `menuitemradio`
- Separators: `role="separator"`

## Composition

```tsx
<DropdownMenu
  label="Document actions"
  items={[
    { id: "edit", label: "Edit", shortcut: "⌘E", onSelect: edit },
    { id: "dup", label: "Duplicate", onSelect: dup },
    { type: "separator" },
    {
      id: "move",
      label: "Move",
      children: [
        { id: "folder-a", label: "Folder A", onSelect: () => move("a") },
        { id: "folder-b", label: "Folder B", onSelect: () => move("b") },
      ],
    },
    { type: "separator" },
    {
      id: "star",
      type: "checkbox",
      label: "Starred",
      checked: starred,
      onCheckedChange: setStarred,
    },
    { type: "separator" },
    {
      id: "del",
      label: "Delete",
      destructive: true,
      onSelect: remove,
    },
  ]}
>
  <Button>Actions</Button>
</DropdownMenu>
```

## Accessibility

Touch, RTL, screen readers, high contrast, dynamic text. Z-index: `var(--z-dropdown)`. No box-shadow / no gradients.
