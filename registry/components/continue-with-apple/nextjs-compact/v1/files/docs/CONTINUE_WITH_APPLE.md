# Continue With Apple

Sign in with Apple control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithApple
  state="loading"
  onContinue={() => startAppleSignIn()}
  fullWidth
/>
```

Defaults: `provider="apple"`, Apple mark (`currentColor`), label `Continue with Apple`, `variant="secondary"`.

Export `AppleIcon` when you need the glyph alone.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` map to `state` when `state` is omitted.
