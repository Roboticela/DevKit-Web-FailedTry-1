# Media Object

Combines media with adjacent textual content — avatar + name, thumbnail + title, icon + file name, image + article information.

## Structure

| Region | Role |
|--------|------|
| Media | Leading or trailing visual (Avatar, Thumbnail, Image, icon) |
| Body | Title, description, metadata, status |
| Trailing | Optional actions / extras |

## Media size → tokens

| `mediaSize` | Token |
|-------------|--------|
| `xs` | `--control-height-xs` |
| `sm` | `--control-height-sm` |
| `md` | `--control-height-md` (default) |
| `lg` | `--control-height-lg` |
| `xl` | `--space-16` |

The media region keeps a fixed box so layout does not shift with content. Compose Thumbnail/Avatar inside — do not invent ad-hoc sizes.

## Layout

| `layout` | Behavior |
|----------|----------|
| `auto` (default) | Horizontal; wraps / stacks when the container is narrow |
| `horizontal` | Stay in a row |
| `stack` | Always column |

`align`: `start` (default) or `center` for cross-axis alignment.

`mediaPosition`: `leading` (default) or `trailing`.

## Props API

```tsx
<MediaObject
  media={<Avatar name="Ada Lovelace" size="md" />}
  title="Ada Lovelace"
  description="Mathematician"
  metadata="Online"
  mediaSize="md"
/>
```

## Compound API

```tsx
<MediaObject mediaSize="lg" layout="auto">
  <MediaObject.Media>
    <Thumbnail src="/cover.jpg" alt="" decorative size="lg" />
  </MediaObject.Media>
  <MediaObject.Body>
    <MediaObject.Title>Quarterly report</MediaObject.Title>
    <MediaObject.Description>
      Finance summary for Q3 — figures and notes.
    </MediaObject.Description>
    <MediaObject.Metadata>PDF · 2.4 MB</MediaObject.Metadata>
    <MediaObject.Status>Shared</MediaObject.Status>
  </MediaObject.Body>
  <MediaObject.Trailing>
    <MediaObject.Actions>{/* IconButton */}</MediaObject.Actions>
  </MediaObject.Trailing>
</MediaObject>
```

## Interactivity

- Whole-object link/button: `interactive` + `href` / `onActivate`, and **no** independent trailing controls.
- Split model: set `hasTrailingActions` (or pass trailing while `interactive`). Host stays a `div`; put navigation on `MediaObject.Title` (`href` / `onClick`). Trailing stops propagation.

Do not make the entire object clickable when trailing has independent controls unless the interaction model explicitly supports it.

## Balance

- Titles wrap (`overflow-wrap: anywhere`) — no hardcoded max length.
- Body uses `min-width` so text never collapses beside media.
- Works with short titles, long titles, missing description, multiline description, and trailing metadata.
