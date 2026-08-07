# Data Row

Structured horizontal representation of related fields for detail views, records, metadata, and compact datasets. **Not** a complete table row.

## Example

```
Name      John Smith
Status    Active
Created   Aug 7, 2026
```

```tsx
<DataRow layout="responsive" density="comfortable">
  <DataRow.Field label="Name" value="John Smith" />
  <DataRow.Field label="Status" value="Active" />
  <DataRow.Field label="Created" value="Aug 7, 2026" valueType="date" />
  <DataRow.Field label="Amount" value="1,240.50" valueType="number" />
</DataRow>
```

## Layout

| `layout` | Behavior |
|----------|----------|
| `responsive` (default) | Stacked label/value pairs on narrow screens; horizontal columns from 640px |
| `horizontal` | Always label ‖ value columns |
| `stacked` | Always vertical pairs |

Do not squeeze columns until unreadable — responsive stacks instead.

## Field value types

| `valueType` | Treatment |
|-------------|-----------|
| `text` | Default, start-aligned |
| `number` | Tabular nums, end-aligned by default |
| `date` | Tabular nums |
| `email` / `url` / `id` | Monospace hint |

`valueAlign`: `start` | `end` | `center` overrides the default.

Overflow: `wrap` (default) — long values, URLs, emails, IDs wrap. Use `clip` only when ellipsis is intentional.

## Regions

- `DataRow.Leading` — identifier (avatar, icon, id mark)
- `DataRow.Field` — label + value
- `DataRow.Status` — status badge / indicator
- `DataRow.Actions` — compose DevKit Button (clicks do not activate the row)

## States

- `dividers` — optional separators between fields
- `interactive` — hover / focus / pressed (only when interactive)
- `selected`
- Whole-row `href` / `onActivate`, or `hasTrailingActions` when actions are independent

## Accessibility

Label/value association via `aria-labelledby` · RTL · dark · high contrast · reduced motion · no heavy shadows / gradients.
