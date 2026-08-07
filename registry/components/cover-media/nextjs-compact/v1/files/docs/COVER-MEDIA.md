# Cover Media

Fills a defined rectangular region with controlled cropping — article headers, product imagery, profile covers, feature sections, content cards, and media previews.

## Fit

| `objectFit` | Use |
|-------------|-----|
| `cover` (default) | Fill the region; crop with focal control |
| `contain` | Full asset visible; may letterbox |

## Aspect presets (ratios only)

| `aspect` | Ratio |
|----------|--------|
| `compact` | 4 / 3 |
| `standard` (default) | 16 / 9 |
| `wide` | 2 / 1 |
| `hero` | 21 / 9 |
| `custom` | use `aspectRatio` (e.g. `"3 / 2"`) |

On narrow viewports, `wide` and `hero` soften to 16 / 9 so the crop stays useful. Do not invent arbitrary pixel dimensions.

## Focal point

| `focal` | `object-position` |
|---------|-------------------|
| `top` | center top |
| `center` (default) | center center |
| `bottom` | center bottom |
| `left` | left center |
| `right` | right center |
| `custom` | `objectPosition` (e.g. `"30% 20%"`) |

Prefer `top` (or custom) for portraits and human subjects — do not blindly center-crop.

## Radius

`none` (default) · `sm` · `md` — global radius tokens. Avoid excessive rounding.

## Overlay / caption / metadata

```tsx
<CoverMedia
  src="/hero.jpg"
  alt="Team workshop"
  aspect="hero"
  focal="top"
  radius="sm"
>
  <CoverMedia.Overlay>
    <strong>Q3 kickoff</strong>
  </CoverMedia.Overlay>
  <CoverMedia.Caption>Design systems meetup</CoverMedia.Caption>
  <CoverMedia.Metadata>San Francisco · 2026</CoverMedia.Metadata>
</CoverMedia>
```

When text sits over media, a **solid scrim** provides contrast (not a heavy gradient). Disable with `contrastProtection={false}` when the host supplies its own treatment.

## Accessibility

Meaningful covers need `alt`. Decorative covers: `decorative`.
