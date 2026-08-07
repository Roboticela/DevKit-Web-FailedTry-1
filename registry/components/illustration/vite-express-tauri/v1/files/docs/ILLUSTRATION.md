# Illustration

Presentation container for conceptual visual assets — empty state, onboarding, success, failure, information, and product context.

Not an illustration library. Compose your SVG/PNG/WebP (or inline vector) inside this frame.

## Size

| `size` | Role | Max (token-derived) |
|--------|------|---------------------|
| `sm` | Compact accent | `2 × --space-16` |
| `md` (default) | Typical empty / info | `3 × --space-16` |
| `lg` | Emphasized section | `4 × --space-16` (larger on desktop) |
| `hero` | Explicit dominating presentation | Full width; capped block size |

Do not use `hero` inside dense functional UI unless the layout is intentionally illustration-led.

On mobile, `md` / `lg` / `hero` reduce max block size so illustrations do not dominate the viewport.

## Fit

| `fit` | Behavior |
|-------|----------|
| `contain` (default) | Scale inside the box; never crop or stretch |
| `natural` | Intrinsic aspect; capped by max size only |

Optional `aspectRatio` (e.g. `"4 / 3"`) reserves space; media still uses contain.

## Alignment

`start` · `center` (default) · `end` — logical, RTL-safe.

## Accessibility

```tsx
{/* Meaningful */}
<Illustration
  src="/empty-inbox.svg"
  alt="No messages in your inbox"
  purpose="empty"
  size="md"
/>

{/* Decorative */}
<Illustration src="/flourish.svg" decorative size="sm" />

{/* Inline vector */}
<Illustration purpose="success" size="lg" alt="Setup complete">
  <SuccessSvg />
</Illustration>
```

If the illustration communicates information, provide `alt` (or `aria-label` via non-img children path). If purely decorative, set `decorative`.

## Motion

Animations are **off** by default. Set `animated` only when the host intentionally animates children/CSS. Under `prefers-reduced-motion` or `data-motion="reduce"`, animations and transitions are forced off.

## Do not

- Distortion / `object-fit: fill`
- Decorative frames or competing chrome
- Default animation
- Hero sizing for every empty state
