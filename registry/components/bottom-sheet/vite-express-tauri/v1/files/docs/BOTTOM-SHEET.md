# Bottom Sheet

Temporary surface emerging from the bottom of the viewport. Optimized for touch.

## Sizes

| `size` | Typical height |
|--------|----------------|
| `compact` | ~32vh |
| `standard` | ~48vh (default) |
| `expanded` | ~72vh |
| `full` | Near full viewport |

## Structure

```
Optional drag handle
Header — title, description, close
Content — scrollable region
Footer — actions (sticky when needed)
```

The handle is optional. **Dragging is never the only way to close** — always provide close control and/or Escape / outside tap as configured.

## Dismiss

| Method | Notes |
|--------|--------|
| Explicit close | Always available when `showCloseButton` |
| Escape | Default on for modal/non-modal; off for persistent |
| Outside tap | Default on for modal/non-modal; off for persistent |
| Drag down | Default on except persistent; only when content is scrolled to top |

For important workflows use `variant="persistent"` or disable outside/drag dismiss deliberately.

## Variants

| `variant` | Behavior |
|-----------|----------|
| `modal` (default) | Scrim, focus trap, blocks background |
| `non-modal` | No trap; background only if `allowBackgroundInteraction` |
| `persistent` | Deliberate dismiss only |

## Desktop

`desktopPresentation`:

- `auto` / `dialog` (≥1024px) — centered dialog-like panel (no forced mobile drag UX)
- `sheet` — keep bottom sheet on desktop

## Keyboard & forms

- Sheet body scrolls; the page behind does not (when modal / locked).
- `visualViewport` inset lifts the sheet above the virtual keyboard so fields/actions stay reachable.
- Safe-area insets respected.

## Accessibility

`role="dialog"` · `aria-modal` when modal · focus restore · RTL · high contrast · dynamic text · reduced motion (no slide, opacity only for dialog form).

Z-index: `var(--z-drawer)`. Border separation — no heavy shadows / gradients.

## Composition

```tsx
<BottomSheet
  open={open}
  onOpenChange={setOpen}
  size="standard"
  title="Share"
  primaryAction={<Button onClick={share}>Share link</Button>}
  secondaryAction={<Button variant="quiet" onClick={() => setOpen(false)}>Cancel</Button>}
>
  {/* content */}
</BottomSheet>
```
