# Blockquote

Quoted content with optional citation — not a testimonial card, marketing quote, or review composition.

## Distinguishing treatment

Uses spacing, an inline-start border, typography, and indentation from the global design system.

Does **not** use oversized quotation marks as the primary visual treatment.

## API

| Prop | Role |
|------|------|
| `quote` / `children` | Quotation body (wraps naturally on mobile) |
| `author` | Attribution — secondary |
| `source` | Publication / title |
| `sourceHref` | Makes plain `source` navigable via DevKit **Link** styles |
| `sourceExternal` | Opt-in external mark on the built-in source link |
| `citation` | Full citation override (replaces author/source composition) |
| `cite` | HTML `cite` URL on `<blockquote>` |
| `dir` | `auto` (default) · `ltr` · `rtl` for the quotation body |
| `measure` | `reading` (default) · `none` |
| `size` | `standard` · `compact` |

```tsx
<Blockquote
  author="Ada Lovelace"
  source="Notes on the Analytical Engine"
  sourceHref="https://example.com/notes"
  cite="https://example.com/notes"
>
  The Analytical Engine weaves algebraical patterns just as the Jacquard loom
  weaves flowers and leaves.
</Blockquote>
```

Compose the Link component directly when you need full Link behavior:

```tsx
<Blockquote
  author="Design Constitution"
  source={
    <Link href="/constitution" variant="inline">
      Core principles
    </Link>
  }
>
  Typography must prioritize readability, hierarchy, and accessibility.
</Blockquote>
```

## Direction

- Quotation body: `dir="auto"` by default so localized and mixed scripts resolve correctly.
- Border/indent use logical properties — RTL surrounding UI flips the edge mark.

## Themes

Light · Dark · High Contrast.
