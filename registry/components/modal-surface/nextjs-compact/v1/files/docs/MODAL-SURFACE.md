# Modal Surface

Generic elevated temporary surface. Low-level foundation for Dialog, Alert Dialog, and other modal compositions.

Provides surface, backdrop, focus management, positioning, dismissal, and responsive sizing — **without** forcing title, buttons, icons, or illustrations. Those belong to the consuming composition.

## Sizes

| `size` | Typical width |
|--------|----------------|
| `sm` | ~20rem |
| `md` | ~28rem (default) |
| `lg` | ~40rem |
| `fullscreen` | Full viewport |

## Positions

| `position` | Alignment |
|------------|-----------|
| `center` | Vertically and horizontally centered (default) |
| `top` | Top-aligned |
| `bottom` | Bottom-aligned |

## Slots

Compose content freely, or use optional regions:

```tsx
<ModalSurface
  open={open}
  onOpenChange={setOpen}
  size="md"
  position="center"
  aria-labelledby="ms-title"
  closeOnOutsideClick
>
  <ModalSurface.Header>
    <h2 id="ms-title">Custom title</h2>
  </ModalSurface.Header>
  <ModalSurface.Body>
    {/* forms, lists, media, settings, custom content */}
  </ModalSurface.Body>
  <ModalSurface.Footer>
    <Button variant="quiet" onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={save}>Save</Button>
  </ModalSurface.Footer>
</ModalSurface>
```

Children may also be placed directly on the surface without using the slot components.

## Behavior

| Mode | Behavior |
|------|----------|
| `modal` (default) | Backdrop, focus trap, scroll lock, blocks background |
| `modal={false}` | No trap; set `allowBackgroundInteraction` to keep the page usable |

### Dismissal

| Method | Default |
|--------|---------|
| Escape | On |
| Outside click | **Off** (configure deliberately) |
| Consumer close control | Compose yourself |

For critical confirmations, keep outside dismiss off and prefer `role="alertdialog"` with an explicit Cancel/Confirm.

### Scroll lock

When locking scroll, body padding compensates for the scrollbar width so the page does not jump horizontally.

### Keyboard & safe areas

- `visualViewport` adjusts bottom padding so the virtual keyboard does not cover the surface.
- Safe-area insets on the viewport padding.
- Body region scrolls; the page behind stays put when locked.

## Accessibility

`role="dialog"` (or `alertdialog`) · `aria-modal` when modal · `aria-label` / `aria-labelledby` / `aria-describedby` · focus trap (modal) · focus restore · RTL · high contrast · dynamic text · reduced motion.

Z-index: `var(--z-modal)`. Border separation — no heavy shadows / gradients.

## Architecture note

Higher-level Dialog / Alert Dialog compositions should build on this primitive where the architecture allows, rather than re-implementing modal behavior independently.
