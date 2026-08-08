# Continue With Facebook

Facebook OAuth control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithFacebook
  state="loading"
  onContinue={() => startFacebookOAuth()}
  fullWidth
/>
```

Defaults: `provider="facebook"`, Facebook “f” mark (`#1877F2`), label `Continue with Facebook`, `variant="secondary"`.

Export `FacebookIcon` when you need the glyph alone.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` map to `state` when `state` is omitted. Keyboard focus and navigation come from the shared Button primitive.
