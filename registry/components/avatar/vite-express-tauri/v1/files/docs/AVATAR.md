# Avatar

Represents a person, organization, object, or identity. Facial imagery is never the only way to communicate identity — initials and icons are first-class.

## Fallback (deterministic)

1. Image (`src`, while loading successfully)
2. Initials (from `initials` or `name`)
3. Generic identity icon (person / organization / entity glyph, or custom `icon`)

```tsx
<Avatar name="Ada Lovelace" src="/ada.jpg" presence="online" />
{/* image fails → "AL" → person icon */}
```

## Sizes → tokens

| Size | Token |
|------|--------|
| `xs` | `--control-height-xs` |
| `sm` | `--control-height-sm` |
| `md` | `--control-height-md` (default) |
| `lg` | `--control-height-lg` |
| `xl` | `--control-height-xl` |
| `2xl` | `--space-16` |

## Entity & shape

| `entity` | Default shape | Fallback glyph |
|----------|---------------|----------------|
| `person` | circle | person |
| `organization` | rounded | building |
| `generic` | rounded | mark |

Override with `shape`: `circle` | `rounded` | `square`.

## Initials

`getAvatarInitials(name)` supports localized and non–first+last names:

- Multiple tokens → first character of first + last token
- Single Latin word → first two letters
- Single CJK / other script token → first character
- Host may pass explicit `initials` when generation should be app-owned

## Presence

`online` · `offline` · `busy` · `away` · `unknown`

Communicated with **shape + mark + accessible name**, not color alone. Anchored to the inline-end corner so it does not cover the face center.

Optional `status` slot for verified / custom marks (inline-start corner). Provide `statusLabel` when meaningful.

## Accessibility

- Meaningful: `alt` / `name` / `aria-label` (presence appended when set)
- Decorative: `decorative` → `aria-hidden`
- Images use empty `alt` on the `<img>`; naming is on the host
- RTL via logical presence/status placement
- Light / Dark / High Contrast

Images use `object-fit: cover` — aspect ratio preserved, crop predictable, no distortion.
