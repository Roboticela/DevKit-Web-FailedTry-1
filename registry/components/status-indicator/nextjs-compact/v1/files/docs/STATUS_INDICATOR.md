# Status Indicator (042)

Compact representation of an entity, process, or resource state.

## Design

- **Host vocabulary** (`Active`, `Draft`, `Awaiting verification`, …) stays in `label` / `status`.
- **DevKit tones** provide the visual system: `neutral` · `positive` · `warning` · `negative` · `informational`.
- Compact — not a large pill.
- Status is not color-only: label and/or icon reinforce tone.

## Appearances

| Appearance | Use |
|------------|-----|
| `dot-text` | Default secondary contexts (tables, lists) |
| `icon-text` | Important states — prefer over color-only dots |
| `text` | Dense rows where a mark is redundant |
| `dot` | Extreme density; still requires `label` (SR) |

## Long labels

`wrap` defaults to `true`. Do not truncate strings like “Awaiting verification” into fragments.

Optional `details` → native tooltip + `aria-describedby`.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/StatusIndicator.tsx`, `styles/status-indicator.css` |
| `vite-express-tauri` | `src/components/ui/StatusIndicator.tsx`, `src/styles/status-indicator.css` |

## Example

```tsx
// App maps its vocabulary → tones
const map = {
  active: { tone: "positive", label: "Active" },
  pending: { tone: "warning", label: "Awaiting verification", appearance: "icon-text" },
  failed: { tone: "negative", label: "Failed", appearance: "icon-text" },
} as const;

<StatusIndicator
  status="pending"
  tone="warning"
  appearance="icon-text"
  label="Awaiting verification"
  details="Submitted 2 hours ago"
/>
```
