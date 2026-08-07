# Image Placeholder

Represents the visual area where an image is unavailable or not yet available — loading, missing media, unavailable image, or reserved media space.

**Not Skeleton.** Skeleton stands in for expected content shapes while loading. Image Placeholder is a **media region** without currently available media.

## States

| `state` | Meaning | Visual |
|---------|---------|--------|
| `loading` | Media not yet arrived | Neutral; calm icon pulse (reduced-motion safe) |
| `missing` (default) | No image provided | Neutral |
| `unavailable` | Image exists but cannot be shown | Neutral |
| `error` | Actual load/failure problem | Slightly stronger border/text — still restrained |

Do not make missing/unavailable look like a system error.

## Aspect ratio

| `aspect` | Ratio |
|----------|--------|
| `square` | 1 |
| `portrait` | 3 / 4 |
| `landscape` (default) | 4 / 3 |
| `wide` | 16 / 9 |
| `custom` | `aspectRatio` (e.g. `"16 / 9"`) |

The box locks aspect ratio from width so replacing it with a real image does not shift layout. Content never distorts when the container resizes.

## Optional content

- `showIcon` / `icon` — generic or type glyph (default on)
- `mediaType` — `image` · `photo` · `video` · `document` · `generic`
- `typeLabel` — short token (PNG, JPG)
- `message` — **short** phrase only (clamped to 2 lines; hidden in tiny boxes)

```tsx
<ImagePlaceholder
  state="missing"
  aspect="wide"
  mediaType="image"
  typeLabel="PNG"
  message="No image"
/>

<ImagePlaceholder state="loading" aspect="square" decorative />

<ImagePlaceholder
  state="error"
  aspect="landscape"
  message="Couldn’t load"
  label="Product photo failed to load"
/>
```

## Themes

Light · Dark · High Contrast · RTL · responsive (copy hides when the box is too small).
