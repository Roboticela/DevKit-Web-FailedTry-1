# Media Preview

Larger preview of visual or media content — not a lightbox, document editor, or complete media player.

## Kind

| `kind` | Default aspect | Fit | Notes |
|--------|----------------|-----|--------|
| `image` | landscape | cover | Still image preview |
| `video` | wide | cover | Poster / still only — no playback engine |
| `document` | portrait | contain | Representation only — no editing |
| `audio` | square | cover | Artwork / cover art |
| `generic` | landscape | contain | Fallback glyph when empty/error |

## Size

| `size` | Max width (token-derived) |
|--------|---------------------------|
| `sm` | `3 × --space-16` |
| `md` (default) | `4 × --space-16` (larger on desktop) |
| `lg` | `5 × --space-16` (larger on desktop) |

## States

`loading` · `loaded` · `error` · `empty`

Controlled via `state`, or derived from `loading` / `error` / missing `src`.

## Info

Optional: `title` · `type` · `duration` · `fileSize` · `status`

## Actions

Compose DevKit `Button` / `IconButton` — do not invent controls.

```tsx
<MediaPreview
  kind="video"
  poster="/poster.jpg"
  title="Product demo"
  type="MP4"
  duration="3:42"
  interactive
  onOpen={openPreview}
>
  <MediaPreview.Actions>
    <IconButton label="Play" size="sm" variant="subtle" icon={<PlayIcon />} />
    <IconButton label="Download" size="sm" variant="subtle" icon={<DownloadIcon />} />
    <IconButton label="Expand" size="sm" variant="subtle" icon={<ExpandIcon />} />
  </MediaPreview.Actions>
</MediaPreview>
```

When actions are present with `interactive` / `onOpen`, the media surface is a separate control so buttons are not nested.

Video `showPlayMark` (default on for loaded video) is visual only — wire play through actions or `onOpen`.

## Accessibility

Interactive previews expose an accessible name (`aria-label`, `title`, or `alt`). Touch targets for actions use DevKit control sizing (≥44×44).
