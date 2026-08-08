# Continue With Microsoft

Microsoft OAuth / Entra ID control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithMicrosoft
  state="loading"
  onContinue={() => startMicrosoftOAuth()}
  fullWidth
/>
```

Defaults: `provider="microsoft"`, official Microsoft four-square mark, label `Continue with Microsoft`, `variant="secondary"`.

Export `MicrosoftIcon` when you need the glyph alone.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` map to `state` when `state` is omitted.
