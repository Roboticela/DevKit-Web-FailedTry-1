# Progress Circle (047)

Compact **measurable** progress — use when horizontal space is limited or a circular treatment communicates state more clearly.

Not decorative. Prefer **Progress Bar** for richer labeling; prefer **Spinner** when no progress value exists.

## Sizes

| Size | Diameter |
|------|----------|
| `sm` | 24px |
| `md` | 40px |
| `lg` | 64px |

## Modes

- **Determinate** — arc maps accurately to `value` within `min`–`max` (default 0–100)
- **Indeterminate** — restrained rotation; static under `prefers-reduced-motion`

## Center label

Optional short value via `showValue` (e.g. `45%`). Suppressed at `sm`. Do not put long text inside the circle.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/ProgressCircle.tsx`, `styles/progress-circle.css` |
| `vite-express-tauri` | `src/components/ui/ProgressCircle.tsx`, `src/styles/progress-circle.css` |

## Example

```tsx
<ProgressCircle label="Sync" value={72} size="md" showValue />

<ProgressCircle
  label="Preparing"
  value={null}
  size="sm"
  description="Working…"
/>
```
