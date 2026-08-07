# List Item

Atomic content row used within [List](./LIST.md).

## Regions

| Region | Typical content |
|--------|-----------------|
| Leading | Avatar, icon, checkbox, radio, thumbnail, status |
| Primary | Title, label |
| Secondary | Description, metadata, timestamp |
| Trailing | Status, value, badge, action, disclosure |

Primary stays visually dominant — secondary uses muted type and smaller size.

## Line modes

| `lines` | Behavior |
|---------|----------|
| `one` | Primary only (secondary hidden) |
| `two` | Primary + single-line description |
| `multi` | Primary + wrapping description — do not clip important names/statuses |

## Density

`compact` · `comfortable` (default) · `spacious`

Minimum effective touch target: **44×44px** on the row and interactive trailing controls.

## Interactivity

```tsx
{/* Whole row is the control */}
<ListItem interactive href="/settings" lines="one">
  <ListItem.Leading>{icon}</ListItem.Leading>
  <ListItem.Primary>
    <ListItem.Title>Settings</ListItem.Title>
  </ListItem.Primary>
  <ListItem.Trailing>
    <ListItem.Disclosure />
  </ListItem.Trailing>
</ListItem>

{/* Independent trailing actions — title carries navigation */}
<ListItem interactive hasTrailingActions lines="two">
  <ListItem.Leading>{avatar}</ListItem.Leading>
  <ListItem.Primary>
    <ListItem.Title href="/people/ada">Ada Lovelace</ListItem.Title>
  </ListItem.Primary>
  <ListItem.Secondary>
    <ListItem.Description>Mathematician</ListItem.Description>
    <ListItem.Timestamp dateTime="2026-08-07">2h ago</ListItem.Timestamp>
  </ListItem.Secondary>
  <ListItem.Trailing>
    <ListItem.Action>
      <Button size="sm" variant="quiet">Message</Button>
    </ListItem.Action>
  </ListItem.Trailing>
</ListItem>
```

When `hasTrailingActions` is set (or inferred from trailing + `interactive`), the row host is **not** a single button/link — avoid ambiguous clicks.

## RTL

Leading/trailing placement mirrors automatically. Disclosure chevron flips in RTL.

## With List (062)

Use inside `List` for spacing, grouping, and selection. `List.Item` remains the selection/keyboard-aware companion; `ListItem` is the richer atomic chrome. Both share density language (`compact` / `comfortable` / `spacious`).

## Accessibility

Semantic `<a>` or `role="button"` when the whole row is interactive · focus-visible · title-link when split · dark · high contrast · reduced motion · no heavy shadows / gradients.
