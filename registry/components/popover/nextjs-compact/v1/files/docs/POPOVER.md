# Popover

Contextual surface anchored to a triggering element. May contain **interactive** content (unlike Tooltip).

## Use for

- Contextual information and details
- Compact controls, filters, formatting options
- Date-related controls and small configuration panels

Do not use for full-page workflows — prefer Dialog / Drawer / Modal Surface.

## Behavior

| Concern | Default | Configurable |
|---------|---------|--------------|
| Outside click dismiss | on | `closeOnOutsideClick` |
| Escape dismiss | on | `closeOnEscape` |
| Close button | off | `showCloseButton` |
| Explicit dismiss | — | `onOpenChange(false)` from actions inside `content` |
| Arrow | off | `arrow` |

Interacting **inside** the popover never auto-closes it.

## Placement

`top` · `bottom` · `left` · `right` · `auto`

Stays anchored to the trigger. Repositions on scroll/resize. Flips when space is insufficient. Long content scrolls inside the surface; the panel never exceeds the usable viewport.

## Focus & modality

| Mode | Behavior |
|------|----------|
| Non-modal (`modal={false}`, default) | No focus trap. Focus moves into the surface when opened; restored to the trigger on close. |
| Modal (`modal`) | `aria-modal`, optional scrim, Tab cycles within the surface. |

## Semantics

- Surface: `role="dialog"`
- Trigger: `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
- Optional `title` → `aria-labelledby`

## Composition

```tsx
<Popover
  title="Filters"
  showCloseButton
  arrow
  content={
    <>
      <Switch label="Unread only" />
      <Button size="sm" onClick={() => apply()}>Apply</Button>
    </>
  }
>
  <Button>Filters</Button>
</Popover>
```

Dismiss from an explicit action by controlling `open` / calling `onOpenChange(false)`.

## Accessibility

Keyboard, touch, screen readers, RTL, dynamic text, Light / Dark / High Contrast. Z-index: `var(--z-popover)`. No box-shadow / no gradients.
