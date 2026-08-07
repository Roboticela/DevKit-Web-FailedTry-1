# Thumbnail

Compact representation of larger visual content — files, products, media, documents, messages, lists, and previews.

## Aspect

| `aspect` | Ratio |
|----------|--------|
| `square` (default) | 1 |
| `portrait` | 3 / 4 |
| `landscape` | 4 / 3 |
| `custom` | use `aspectRatio` (e.g. `"16 / 9"`) |

## Fit

| Kind default | Fit |
|--------------|-----|
| `image` / `video` | `cover` (photographic) |
| `document` / `file` / `generic` | `contain` (full visibility) |

Override with `objectFit`.

## Sizes → tokens

| Size | Token |
|------|--------|
| `xs` | `--control-height-xs` |
| `sm` | `--control-height-sm` |
| `md` | `--control-height-md` (default) |
| `lg` | `--control-height-lg` |
| `xl` | `--space-16` (preview) |

## States

`selected` · `loading` · `error` · `disabled`

## Overlays (keep sparse)

`showPlay` · `showSelection` · `status` · `fileType` · `duration`

Do not stack many indicators on a small thumbnail — hierarchy should favor the media.

## Interactivity

```tsx
<Thumbnail
  src="/clip.jpg"
  alt="Product demo"
  kind="video"
  size="lg"
  aspect="landscape"
  showPlay
  duration="3:42"
  interactive
  onActivate={openPreview}
/>
```

Interactive thumbnails render as `<button>` or `<a>` with focus-visible and Enter/Space. Not interactive by default.

## Fallbacks

Missing/broken `src` shows kind glyph (`image` · `video` · `document` · `file` · `generic`) or custom `fallback`.
