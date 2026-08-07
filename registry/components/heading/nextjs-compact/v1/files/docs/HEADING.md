# Heading

Semantic document hierarchy (`h1`–`h6`) with visual size independent of level.

## Level vs size

| Prop | Role |
|------|------|
| `level` | Semantic outline (`1`–`6` → `h1`–`h6`). Default `2`. |
| `size` | Visual rank via typography tokens. Independent of `level`. |

Do **not** pick `level` to get a certain size. An `h2` may use `size="md"` when the layout needs it; an `h3` may use `size="lg"`.

When `size` is omitted, a restrained convenience map is used (`1→title`, `2→lg`, `3→md`, `4→sm`, `5–6→xs`) — always override when visuals must diverge.

## Size scale (restrained)

| `size` | Role |
|--------|------|
| `display` | Largest allowed — still capped; reduces on small screens |
| `title` | Page / section lead |
| `lg` | Strong section heading |
| `md` | Standard subsection |
| `sm` | Minor heading |
| `xs` | Compact heading |

Hierarchy uses **size, weight, and spacing**. Color is secondary — do not rely on color alone.

## Subtitle

Optional `subtitle` renders muted supporting text under the title. It does not replace heading hierarchy.

```tsx
<Heading level={1} size="title" subtitle="Account settings and preferences">
  Settings
</Heading>

{/* Semantic h2, visually same as a typical h3 */}
<Heading level={2} size="md">
  Related articles
</Heading>
```

## Alignment & wrapping

- `align`: prefer `start` / `end` (RTL-safe). Default `start`.
- `wrap`: default `wrap` — long headings wrap naturally. `balance` / `pretty` optional.
- `truncate` / `lineClamp`: **opt-in only**. Do not truncate important page titles; full text via native `title` when truncated.

## Responsive

Uses global typography tokens. Small screens reduce `display` / `title`. Large screens allow a modestly larger presentation — never decorative hugeness.

## Themes

Light · Dark · High Contrast · LTR / RTL · localization / dynamic text.
