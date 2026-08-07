# Caption

Secondary explanatory information — metadata, image descriptions, supporting hints, timestamps, and secondary notes.

**Caption supports. Label identifies.** Do not use Caption for primary instructions. Do not communicate important warnings only through caption styling.

## Modes

| `mode` | Use |
|--------|-----|
| `multiline` (default) | Hints, descriptions — wraps naturally |
| `short` | Compact metadata / timestamps |

## Size

| `size` | Tokens |
|--------|--------|
| `md` (default) | `--font-size-body-sm` (fallback caption) — preferred for readability |
| `sm` | `--font-size-caption` |

Caption stays visually secondary (secondary color, lighter weight) without becoming unreadably small.

## Association

| Context | Pattern |
|---------|---------|
| Image / media | `as="figcaption"` inside `<figure>` |
| Form field | Set `id` and point the control’s `aria-describedby` at it |
| Content / data block | Same `id` + `aria-describedby` on the described element |

```tsx
<figure>
  <img src="/photo.jpg" alt="Team workshop" />
  <Caption as="figcaption">Design systems meetup, 2026</Caption>
</figure>

<Label htmlFor="name">Display name</Label>
<input id="name" aria-describedby="name-hint" />
<Caption id="name-hint" mode="multiline">
  Shown on your public profile.
</Caption>

<Caption mode="short" size="sm">Updated 2 hours ago</Caption>
```

## Truncation

`truncate` is opt-in for dense metadata. Full string is exposed via native `title` when possible.

## Themes

Light · Dark · High Contrast · LTR / RTL · localization · dynamic text.
