# Icon Container

Controlled visual region for an icon — feature indicators, status symbols, list leading icons, empty-state icons, and compact identifiers.

## Defaults

| Prop | Default | Notes |
|------|---------|--------|
| `shape` | `transparent` | Do not force colored circles |
| `size` | `md` | Global control-height tokens |
| `tone` | `neutral` | Semantic color tokens only |
| `decorative` | `true` | Hidden from assistive tech |

The container stays quiet so the **icon** leads. Prefer `currentColor` SVGs.

## Size → tokens

| `size` | Container | Icon |
|--------|-----------|------|
| `sm` | `--control-height-xs` | `--icon-16` |
| `md` | `--control-height-sm` | `--icon-20` |
| `lg` | `--control-height-md` | `--icon-24` |

## Shape

| `shape` | Use |
|---------|-----|
| `transparent` | Default — list leading / inline symbols |
| `square` | Compact framed mark |
| `rounded` | Rounded square frame |
| `circle` | Soft badge-like mark (opt-in) |

Framed shapes use a subtle surface; they must not outcompete the glyph.

## Tone (semantic state)

`neutral` · `positive` · `warning` · `negative` · `informational`

Icons inherit the matching semantic token. Do not pass arbitrary colors.

## Optical centering

Glyphs use a slight vertical optical nudge (`translateY`) — matching Icon Button — so stroke icons do not look top-heavy in the box.

## Decorative vs semantic

```tsx
{/* Decorative — no SR output */}
<IconContainer icon={<StarIcon />} shape="rounded" tone="informational" />

{/* Semantic — provide a label */}
<IconContainer
  decorative={false}
  label="Warning"
  tone="warning"
  shape="circle"
  icon={<AlertIcon />}
/>
```

## Themes

Light · Dark · High Contrast · RTL (logical layout; mirror directional icons in the host glyph when needed).
