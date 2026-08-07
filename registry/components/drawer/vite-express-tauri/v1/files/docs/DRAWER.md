# Drawer

Temporary surface that enters from the side of the viewport.

**Typical uses:** navigation, filters, secondary tools, contextual details, settings, supporting content.

May contain forms, lists, navigation, actions, and other DevKit primitives.

## Structure

```
Header  — title, optional description, close (stays accessible)
Content — scrollable
Footer  — actions or custom footer (optional sticky)
```

## Sides & RTL

| Prop | Behavior |
|------|----------|
| `side` | `left` · `right` (default `right`) |
| `sideMode` | `physical` (default) — does not flip in RTL · `logical` — maps to inline-start/end |

Do not blindly mirror when the app defines a physical side.

## Modal vs non-modal

| Mode | Behavior |
|------|----------|
| `modal` (default) | Focus trap, scrim, no background interaction |
| `modal={false}` | No focus trap; background interaction only if `allowBackgroundInteraction` |

Accidental background interaction is blocked in modal mode.

## Dismiss

- Escape (configurable)
- Close control
- Outside / scrim (default on when modal)
- Touch swipe toward the edge (or down when presented as a mobile sheet)

## Responsive

Widths: `sm` · `md` · `lg` — capped with `min(100%, …)` / viewport fractions on large screens.

On narrow viewports with `mobileAsSheet` (default): presents as a full-width bottom sheet. Do not force a narrow desktop side panel onto mobile.

## Accessibility

`role="dialog"` · `aria-modal` when modal · focus restore · keyboard · screen readers · touch · RTL · high contrast.

Z-index: `var(--z-drawer)`. Border separation only — no heavy shadows, no gradients. Slide enter (opacity-only under reduced motion).

## Composition

```tsx
<Drawer
  open={open}
  onOpenChange={setOpen}
  side="right"
  title="Filters"
  primaryAction={<Button onClick={apply}>Apply</Button>}
  secondaryAction={<Button variant="quiet" onClick={() => setOpen(false)}>Cancel</Button>}
>
  {/* forms, lists, navigation… */}
</Drawer>
```
