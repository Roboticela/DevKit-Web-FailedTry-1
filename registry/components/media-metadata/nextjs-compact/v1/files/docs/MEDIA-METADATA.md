# Media Metadata

Secondary information associated with visual or media content — type, size, dimensions, duration, date, author, status, and custom fields.

Visually subordinate to media titles/content. Do not overload small surfaces.

Composable with Image, Thumbnail, Media Object, Media Preview, Card, List Item, and Content Block.

## Density

| `density` | Use |
|-----------|-----|
| `compact` | Tight lists / thumbnails |
| `standard` (default) | Previews, cards, media objects |

## Items

Kinds: `type` · `dimensions` · `duration` · `size` · `date` · `author` · `status` · `custom`

```tsx
<MediaMetadata density="compact" aria-label="Photo details">
  <MediaMetadata.Item kind="type">Photo</MediaMetadata.Item>
  <MediaMetadata.Item kind="size">
    {formatMediaFileSize(2_400_000)}
  </MediaMetadata.Item>
  <MediaMetadata.Item kind="dimensions">
    {formatMediaDimensions(1920, 1080)}
  </MediaMetadata.Item>
</MediaMetadata>

<MediaMetadata
  items={[
    { kind: "type", value: "Video" },
    { kind: "duration", value: formatMediaDuration(272) },
    { kind: "custom", value: "1080p", label: "Resolution" },
  ]}
/>
```

Items wrap and stack on narrow viewports — they are never forced onto one horizontal line.

## Formatting helpers (localizable)

| Helper | Example |
|--------|---------|
| `formatMediaFileSize(bytes, locale?)` | `2.4 MB` via `Intl.NumberFormat` units |
| `formatMediaDuration(seconds)` | `4:32` / `1:04:32` |
| `formatMediaDimensions(w, h, locale?)` | `1920 × 1080` |
| `formatMediaDate(value, locale?, options?)` | locale medium date |

Hosts may also pass already-localized strings.

## Accessibility

- Group has an accessible name (`aria-label`, default “Media details”).
- Provide `label` on items when the visible value is ambiguous (especially `status`).
- Do not communicate status by color alone — keep textual values.

## Themes

Light · Dark · High Contrast · RTL.
