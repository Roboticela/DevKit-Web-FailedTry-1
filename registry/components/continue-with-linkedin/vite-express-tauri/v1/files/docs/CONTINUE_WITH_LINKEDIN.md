# Continue With LinkedIn

LinkedIn OAuth control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithLinkedIn
  state="loading"
  onContinue={() => startLinkedInOAuth()}
  fullWidth
/>
```

Defaults: `provider="linkedin"`, LinkedIn “in” mark (`#0A66C2`), label `Continue with LinkedIn`, `variant="secondary"`.

Export `LinkedInIcon` when you need the glyph alone.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` map to `state` when `state` is omitted. Keyboard focus and navigation come from the shared Button primitive.
