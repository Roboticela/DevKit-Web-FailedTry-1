# Icon

Decorative or semantic SVG host. Pass marks as `children` — this is not an icon font or glyph catalog.

## Usage

```tsx
<Icon size="sm" aria-hidden>
  <svg viewBox="0 0 24 24">...</svg>
</Icon>

<Icon size="md" label="GitHub">
  <GitHubMark />
</Icon>
```

When `label` is set, the icon is exposed as `role="img"`. Otherwise it is decorative (`aria-hidden`).

## Sizes

`xs` · `sm` · `md` · `lg` · `xl`

## Anti-patterns

- Do not put interactive controls inside Icon — use Icon Button
- Do not invent ad-hoc size styles — use the size prop
