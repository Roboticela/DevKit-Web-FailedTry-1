# Progress Bar (046)

Measurable progress toward a **known** completion point.

Use **Spinner** when progress is unknown. Do not show a percentage when the value is not meaningful — prefer status text such as “Uploading…”.

## Modes

| Mode | When |
|------|------|
| Determinate | Finite `value` (default `min` 0 / `max` 100) |
| Indeterminate | `value={null}` or `mode="indeterminate"` |

## Features

- Label, optional value/percentage, description, `meta` slot (time remaining, phase — host-owned)
- Densities: `standard` · `compact`
- Tones: `neutral` · `informational` · `positive` · `warning` · `negative`
- Semantic `role="progressbar"` with `aria-valuenow` / `min` / `max`
- Restrained indeterminate motion; reduced-motion → static segment
- RTL: fill grows from inline-start; indeterminate direction mirrored

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/ProgressBar.tsx`, `styles/progress-bar.css` |
| `vite-express-tauri` | `src/components/ui/ProgressBar.tsx`, `src/styles/progress-bar.css` |

## Example

```tsx
<ProgressBar
  label="Uploading report"
  value={45}
  showValue
  description="12 of 28 files"
  meta="About 1 min left"
/>

<ProgressBar
  label="Preparing export"
  value={null}
  description="Uploading…"
/>
```
