# Timeline

Chronological or ordered event sequence.

Vertical is the default for content-heavy descriptions. Horizontal is appropriate only when event content stays short. On mobile, horizontal presentation collapses to vertical.

## Composition

```tsx
<Timeline orientation="vertical" aria-label="Shipment progress">
  <Timeline.Item status="completed" timestamp="Aug 5, 2026">
    <Timeline.Title>Order placed</Timeline.Title>
    <Timeline.Description>Payment confirmed.</Timeline.Description>
  </Timeline.Item>
  <Timeline.Item status="current" timestamp="Aug 7, 2026">
    <Timeline.Marker>
      <Avatar name="Carrier" size="xs" />
    </Timeline.Marker>
    <Timeline.Title>Out for delivery</Timeline.Title>
    <Timeline.Description>
      Long descriptions wrap freely — they are not forced into narrow fixed widths.
    </Timeline.Description>
    <Timeline.Status>{/* Badge */}</Timeline.Status>
    <Timeline.Metadata>Tracking · 1Z999</Timeline.Metadata>
  </Timeline.Item>
  <Timeline.Item status="upcoming" showIndex>
    <Timeline.Title>Delivered</Timeline.Title>
  </Timeline.Item>
</Timeline>
```

## Status

| `status` | Marker cue (not connector color alone) |
|----------|----------------------------------------|
| `completed` | Check glyph · success border |
| `current` | Dot · thicker ring |
| `upcoming` | Dashed marker · muted title |
| `warning` | Squared marker · warning glyph |
| `error` | Squared marker · error glyph |
| `neutral` | Quiet default |

## Marker

Compose number (`showIndex`), icon, avatar, or status indicator via `marker` / `Timeline.Marker` / `icon` / `avatar`.

## Interactivity

Events are **not** clickable by default. Opt in with `href`, `onActivate`, or `interactive`, and prefer DevKit Button / LinkButton for actions inside the content.

## Orientation

| Value | Behavior |
|-------|----------|
| `vertical` / `responsive` | Stacked events (default) |
| `horizontal` | Short events in a row; becomes vertical below 640px |

Connectors link consecutive events with a thin line; the last event has no trailing connector.

## Accessibility

`role="list"` / `listitem` · RTL · localization · long timestamps/descriptions · dynamic text · high contrast. No heavy shadows / gradients.
