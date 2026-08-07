# Link

Navigation to another destination or resource — internal, external, or in-page anchor.

**Navigation → Link (`<a>`). Action → Button / LinkButton.** Do not use Link for button actions.

## Variants

| `variant` | Behavior |
|-----------|----------|
| `inline` (default) | Flows with text; underline by default |
| `standalone` | Body-sized; underline present, strengthens on hover/focus |

Distinguishable without color alone — underline is always part of the treatment.

## Destinations

```tsx
{/* Internal */}
<Link href="/settings">Settings</Link>

{/* Anchor */}
<Link href="#section-2">Jump to section</Link>

{/* External — icon opt-in only */}
<Link href="https://example.com" target="_blank" external>
  Documentation
</Link>
```

Do **not** add external-link icons to every link. Use `external` when the design requires indication. `target="_blank"` sets `rel="noopener noreferrer"` by default.

## Icons

`leadingIcon` / `trailingIcon` are decorative (`aria-hidden`). Keep a readable accessible name via children or `aria-label`.

## States

default · hover · focus-visible · visited (anchors) · active/pressed · disabled (rare)

Do not disable links unnecessarily — prefer omitting the link.

## Long URLs

Labels use `overflow-wrap: anywhere` so long URLs do not break the layout.

## Themes

Light · Dark · High Contrast · LTR / RTL · localization · dynamic text.
