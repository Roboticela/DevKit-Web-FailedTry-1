# Icon Button Group

**ID 092** — Action & Control Compositions.

Clusters related **icon-only** actions (zoom, media, formatting, view switching, compact utilities).

Compose DevKit **Icon Button (002)**. Do not create custom icon-button dimensions.

## Rules

- Every Icon Button must have an accessible `label`.
- Icons must be understandable and consistent.
- Selected / active / disabled live on each Icon Button (`selected`, `disabled`, variants).
- Selected uses Icon Button’s non-color cues (filled surface, stronger border, `aria-pressed`).
- Primary actions may use a stronger Icon Button `variant` (e.g. `filled`) — do not make every control identical when hierarchy matters.
- Touch targets remain Icon Button’s (≥ global minimum).
- For large sets, prefer **Overflow Action** — do not overcrowd mobile.
- Keyboard: each Icon Button is an independent control.

## API

| Prop | Values | Default |
|------|--------|---------|
| `label` | string (required) | — |
| `orientation` | `horizontal` · `vertical` | `horizontal` |
| `density` | `compact` · `standard` | `standard` |
| `separation` | `joined` · `separated` | `joined` |
| `overflow` | `wrap` · `stack` | `wrap` |

```tsx
<IconButtonGroup label="View density">
  <IconButton label="Comfortable" icon={<ListIcon />} selected={mode === "list"} />
  <IconButton label="Compact" icon={<GridIcon />} selected={mode === "grid"} />
</IconButtonGroup>
```

## Themes

Light · Dark · High Contrast · RTL (logical properties).
