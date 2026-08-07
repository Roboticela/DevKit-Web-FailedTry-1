# Card

Flexible surface for grouping related content. Generic primitive for higher-level compositions.

Default visual treatment is minimal — a quiet border establishes grouping. Do not elevate every card.

## Variants

| `variant` | Treatment |
|-----------|-----------|
| `standard` | Subtle border (default) |
| `compact` | Tighter padding and type |
| `elevated` | Stronger surface / border tokens (no shadow) |
| `outlined` | Transparent fill, clearer outline |

Additional states:

- `interactive` — hover / focus / pressed (opt-in only)
- `selected` — selected / active grouping
- `disabled` — non-interactive appearance

## Slots

All optional and composable:

```tsx
<Card variant="standard">
  <Card.Media aspectRatio="16 / 9">
    <img src="…" alt="…" />
  </Card.Media>
  <Card.Content>
    <Card.Header>
      <Card.Status>{/* Badge / StatusIndicator */}</Card.Status>
      <Card.Title>Title</Card.Title>
      <Card.Description>Supporting text</Card.Description>
      <Card.Metadata>Updated · 2h ago</Card.Metadata>
    </Card.Header>
    <Card.Body>{/* free content */}</Card.Body>
    <Card.Footer>
      <Card.Actions>
        <Button size="sm" variant="quiet">Secondary</Button>
        <Button size="sm">Primary</Button>
      </Card.Actions>
    </Card.Footer>
  </Card.Content>
</Card>
```

`Card.Content` groups text regions beside media for horizontal / responsive layouts.

## Orientation

| `orientation` | Behavior |
|---------------|----------|
| `vertical` | Stack (default) |
| `horizontal` | Media beside content |
| `responsive` | Stack on mobile; horizontal from 640px |

## Interactivity

- Set `interactive` only when the card itself is the control.
- Prefer `Card.Title` `href` / `onClick` when the card also has independent footer actions — do not nest conflicting clickable hosts.
- Whole-card `href` renders an `<a>`; whole-card `onClick` uses `role="button"` on a non-`<button>` host so nested actions remain valid when intentionally composed.

## Media

`Card.Media` preserves aspect ratio via `aspectRatio` (CSS). `fit`: `cover` (default) | `contain` | … Supports image, video preview, illustration, icon, or custom content. Do not force fixed card heights that leave large empty space.

## Accessibility

Focus-visible on interactive cards and title links · RTL · dark · high contrast · dynamic text · reduced motion (no transition). No heavy shadows or gradients.
