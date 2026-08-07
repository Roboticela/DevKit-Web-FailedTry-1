# Dialog

Modal surface for focused interaction.

**Use when** the user must temporarily focus on a task, a compact workflow needs attention, or information is required before continuing.

**Prefer** Popover or non-modal content when the user can safely continue without interruption.

## Structure

```
Header   — title, optional description, close control
Content  — scrollable body
Footer   — actions (clear hierarchy) or custom footer
```

## Props (high level)

| Prop | Notes |
|------|--------|
| `title` / `description` | Header copy (host-localized) |
| `children` | Body content |
| `primaryAction` / `secondaryAction` | Compose DevKit `Button` — primary is visually dominant |
| `footer` | Replace default action row |
| `size` | `sm` · `md` · `lg` · `fullscreen` |
| `loading` | Busy state; blocks dismiss while loading |
| `error` | Alert region above the footer |
| `closeOnEscape` | Default `true` — set `false` for non-dismissible flows |
| `closeOnOutsideClick` | Default `false` — important dialogs stay open |
| `stickyFooter` | Default `true` — actions remain reachable while content scrolls |

Destructive actions: use `Button variant="destructive"` in the action slots.

## Behavior

When opened:

1. Triggering context is preserved (focus restored on close)
2. Focus moves into the dialog
3. Background interaction is blocked (scrim + scroll lock)
4. Focus is trapped inside
5. Focus returns to the previous element on close

Escape closes when `closeOnEscape` is true. Outside click does **not** close by default.

## Responsive

On narrow viewports, `md` / `lg` expand toward a near-fullscreen / bottom sheet–like surface. Do not force a tiny desktop dialog onto mobile. Use `fullscreen` when the task needs the full viewport.

## Animation

Subtle opacity only. No scale overshoot, bounce, or dramatic zoom. Honors reduced motion.

## Accessibility

`role="dialog"` · `aria-modal="true"` · labelled by title · description/error via `aria-describedby`. Keyboard, touch, screen readers, RTL, dynamic text, high contrast.

Z-index: `var(--z-modal)`. No box-shadow / no gradients.

## Composition

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Rename project"
  description="Choose a clear name your team will recognize."
  size="md"
  primaryAction={
    <Button onClick={save} disabled={saving}>
      Save
    </Button>
  }
  secondaryAction={
    <Button variant="quiet" onClick={() => setOpen(false)}>
      Cancel
    </Button>
  }
>
  <TextInput label="Name" value={name} onChange={setName} />
</Dialog>
```
