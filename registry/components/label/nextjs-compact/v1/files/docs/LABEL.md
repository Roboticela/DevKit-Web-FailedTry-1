# Label

Concise identification for controls or content — forms, settings, inputs, selections, and data sections.

**Label identifies. Caption provides supporting context.** Do not use Label as a caption.

## Association

When tied to a form control, associate programmatically:

```tsx
<Label htmlFor="email" required>
  Email
</Label>
<input id="email" type="email" />
```

Or wrap the control. Do not ship a visual-only label that assistive technology cannot use.

Without `htmlFor`, the default element is `span` (content identification). Pass `as="label"` only when association is intentional.

## Required / optional

| Prop | Behavior |
|------|----------|
| `required` | Shows a mark (`*`) plus screen-reader text `(required)` — not color alone |
| `showRequiredLabel` | Also shows the required word visibly |
| `optional` | Shows localized `optionalLabel` (default `"Optional"`) when not required |

High contrast underlines required/optional indicators so they are not color-dependent.

## States

- `disabled` — muted; non-interactive targeting
- `error` — error context for invalid fields (pair with control messaging)
- `visuallyHidden` — hidden visually, kept for AT

## Size

| `size` | Tokens |
|--------|--------|
| `md` (default) | `--font-size-body-sm` / `--font-size-label` |
| `sm` | `--font-size-label` (still readable — no sub-caption micro type) |

Long and localized labels **wrap** by default. Do not force a single line when that harms usability.

## Themes

Light · Dark · High Contrast · LTR / RTL · dynamic text.
