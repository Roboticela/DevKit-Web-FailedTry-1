# Menu

Generalized accessible collection for structured commands or options.

**Foundation for:** Dropdown Menu, Context Menu, and other command surfaces.

## Responsibility

| Menu owns | Parent overlay owns |
|-----------|---------------------|
| Semantics (`role="menu"`) | Positioning / collision |
| Keyboard navigation | Portals, triggers, scrims |
| Type-ahead | Open / close lifecycle |
| Item states | Viewport placement |
| Selection / activation | Sheet vs floating chrome |

Do **not** put positioning logic in Menu. Pass `style` / layout from the parent.

## Entries

- **item** — command (`onSelect`, optional `children` submenu)
- **checkbox** — `menuitemcheckbox`
- **radio** — `menuitemradio` (group via `name`)
- **separator** — meaningful groups only
- **label** — non-interactive group heading
- Icons, shortcut labels (visually secondary), disabled, destructive

## Submenus

| `submenuMode` | Behavior |
|---------------|----------|
| `defer` (default) | `onSubmenuOpen` — parent renders/positions another `Menu` |
| `inline` | Push level inside this Menu (sheet-friendly) |

## Keyboard

↑↓ · Home/End · Enter/Space · Escape · ←→ submenu (RTL-aware) · type-ahead

## States

Active / hover / selected use a **leading cue bar** plus background and focus ring — not background color alone.

## Sizes

`sm` · `md` · `lg` — row height respects `--touch-target-min` / control heights. No tiny rows.

## Composition

```tsx
{/* Parent positions the surface */}
<div style={{ position: "fixed", top, left, zIndex }}>
  <Menu
    label="Edit"
    items={[
      { type: "label", id: "fmt", label: "Format" },
      { id: "bold", label: "Bold", shortcut: "⌘B", onSelect: bold },
      { type: "separator" },
      {
        id: "star",
        type: "checkbox",
        label: "Starred",
        checked: starred,
        onCheckedChange: setStarred,
        keepOpen: true,
      },
    ]}
    onClose={() => setOpen(false)}
    onSubmenuOpen={(req) => placeSubmenu(req)}
  />
</div>
```

## Accessibility

RTL, screen readers, keyboard, touch-sized rows, localization, high contrast, long labels wrap. No box-shadow / no gradients.
