# Stepper (035)

Communicate progress through **ordered stages** (workflows, setup, onboarding, checkout, configuration, task progress).

## Statuses

| Status | Meaning |
|--------|---------|
| `completed` | Stage finished (not merely visited) |
| `current` | Active stage — unmistakable |
| `upcoming` | Not yet reached |
| `disabled` | Unavailable |
| `error` | Needs attention |

When `status` is omitted, it is derived from the controlled `value` index (before → completed, match → current, after → upcoming). Set `error` / `disabled` explicitly.

## Orientation

| Value | Behavior |
|-------|----------|
| `auto` (default) | Vertical under ~480px; horizontal otherwise |
| `horizontal` | Row of stages |
| `vertical` | Stacked stages |
| `compact` | “Step X of N” + current stage |

## Mode

| Value | Behavior |
|-------|----------|
| `linear` | Only current and earlier steps are activatable |
| `non-linear` | Any non-disabled step may be activated |

Set `interactive={false}` for informational steppers — they will not look or behave clickable.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Stepper.tsx`, `styles/stepper.css` |
| `vite-express-tauri` | `src/components/ui/Stepper.tsx`, `src/styles/stepper.css` |

## Example

```tsx
<Stepper
  label="Checkout"
  mode="linear"
  orientation="auto"
  value={step}
  onValueChange={setStep}
  steps={[
    { id: "cart", label: "Cart", description: "Review items" },
    { id: "shipping", label: "Shipping" },
    { id: "pay", label: "Payment", status: "error" },
    { id: "done", label: "Confirm" },
  ]}
/>
```
