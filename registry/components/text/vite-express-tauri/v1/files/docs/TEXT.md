# Text

Fundamental typography primitive. Consumes global typography tokens. Visual style is independent of HTML semantics.

## Semantics vs style

```tsx
{/* Looks like body text, but is a span in a flex row */}
<Text as="span" size="md">Inline note</Text>

{/* Same visual size as a paragraph */}
<Text as="p" size="md">Block paragraph copy.</Text>
```

`as` chooses meaning (`p` · `div` · `span` · `label` · …). Size/weight/color never force the element type.

## Size → tokens

| `size` | Token |
|--------|--------|
| `xs` | `--font-size-caption` / `--font-size-xs` |
| `sm` | `--font-size-body-sm` / `--font-size-label` |
| `md` (default) | `--font-size-body` |
| `lg` | `--font-size-lg` |
| `xl` | `--font-size-xl` |
| `2xl` | `--font-size-heading-2` |
| `3xl` | `--font-size-heading-1` |

## Weight / color

- Weight: `regular` · `medium` · `semibold` · `bold` → `--weight-*`
- Color: `primary` · `secondary` · `tertiary` · `inverse` · `inherit` → `--color-text-*`

No arbitrary font sizes or colors when tokens exist.

## Alignment

`start` · `end` · `center` · `left` · `right`

Prefer logical `start` / `end` for RTL.

## Wrap / truncate

- Default: natural wrap (`wrap`). Soft `overflow-wrap: break-word` for long URLs/words — not `break-all`.
- `truncate` — single-line ellipsis (opt-in). Full text via native `title` / `truncateTitle`.
- `lineClamp={1…6}` — multi-line clamp (opt-in). Same full-text disclosure.
- `breakWords` — stronger `overflow-wrap: anywhere` when required.

## Decoration / transforms

Opt-in only. Default decoration and transform are `none`.

## Base for higher-level text

Heading, Paragraph, Label, Caption, and related primitives should build on Text (or the same tokens) rather than inventing parallel type scales.
