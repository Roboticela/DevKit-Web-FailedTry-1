# Continue With Google

Google OAuth control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithGoogle
  state="loading"
  onContinue={() => startGoogleOAuth()}
  fullWidth
/>
```

Defaults: `provider="google"`, official Google “G” mark, label `Continue with Google`, `variant="secondary"`.

Export `GoogleIcon` when you need the glyph alone.

## Extending other providers

Follow this same pattern (see Continue With Provider docs). Never fork the Provider button layout.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` props map to `state` when `state` is omitted.
