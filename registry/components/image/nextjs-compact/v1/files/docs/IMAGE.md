# Image

Fundamental visual-content primitive for raster (and picture-sourced) media.

Does **not** default to distortion — `object-fit: fill` is opt-in. Prefer `cover` / `contain` / natural (`none`).

## Basics

```tsx
<Image
  src="/hero.jpg"
  srcSet="/hero-800.jpg 800w, /hero-1600.jpg 1600w"
  sizes="(max-width: 640px) 100vw, 640px"
  alt="Product on a desk"
  aspectRatio="16 / 9"
  objectFit="cover"
  loading="lazy"
/>
```

## Accessibility

| Mode | Behavior |
|------|----------|
| Meaningful | Provide descriptive `alt` |
| Decorative | `decorative` → empty alt + `aria-hidden` |

Do not put decorative copy in `alt`. Do not omit `alt` on meaningful images.

## Loading

| Prop | Use |
|------|-----|
| `loading="lazy"` (default) | Below-the-fold |
| `loading="eager"` | Immediate |
| `priority` | Sets eager + `fetchPriority="high"` (LCP) |

When `aspectRatio` / dimensions are set, the frame reserves space while loading (optional `placeholder`, or a quiet skeleton).

## Error / fallback

Failed sources hide the broken `<img>` and show `fallback` (or a quiet default glyph). Compose EmptyState / illustration as needed.

## Responsive sources

- `srcSet` / `sizes` on the img
- `sources` → `<picture>` for formats / art direction

Do not hardcode a single resolution when variants exist.

## Object-fit

`contain` · `cover` (default with aspect ratio) · `fill` (explicit only) · `none` · `scale-down`

## Radius

`none` (default) · `sm` · `md` · `lg` · `full` · `square` — via global radius tokens. Do not auto-round every image.

## Themes

Light / Dark / High Contrast · RTL-safe framing · reduced motion respects opacity transition.
