# Key-Value Pair

Structured metadata as a label and corresponding value.

```
Email
hello@example.com

Plan
Professional

Created
August 7, 2026
```

Label is visually secondary; value receives stronger hierarchy. `aria-labelledby` keeps the relationship clear for assistive technology.

## Composition

```tsx
<KeyValuePair
  label="Email"
  value="hello@example.com"
  valueType="email"
  action={
    <IconButton aria-label="Copy email" onClick={copyEmail}>
      {/* copy glyph */}
    </IconButton>
  }
/>
```

Optional: `description`, `icon`, `status`, `action`.

**Do not embed a custom copy button** — compose DevKit Interaction Controls (`Button` / `IconButton`).

## Orientation

| `orientation` | Behavior |
|---------------|----------|
| `responsive` (default) | Vertical on narrow screens; horizontal from 640px |
| `horizontal` | Label beside value (preferred where space allows) |
| `vertical` | Label above value (narrow screens / complex values) |

## Value types & overflow

| `valueType` | Notes |
|-------------|--------|
| `text` | Default |
| `multiline` / `address` | Preserve line breaks; wrap |
| `email` / `url` / `id` | Monospace hint; wrap with break-all |
| `number` / `date` | Tabular nums |

`overflow`: `wrap` (default) — do not force a single line. `clip` — ellipsis only when intentional.

## Accessibility

- Value is labelled by the label node
- Description linked via `aria-describedby`
- RTL · localization · dynamic text · high contrast · screen readers
- No heavy shadows / gradients
