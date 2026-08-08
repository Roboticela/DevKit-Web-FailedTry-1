# Continue With X

X (formerly Twitter) OAuth control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithX
  state="loading"
  onContinue={() => startXOAuth()}
  fullWidth
/>
```

Defaults: `provider="x"`, X mark (`currentColor`), label `Continue with X`, `variant="secondary"`.

Export `XIcon` when you need the glyph alone.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` map to `state` when `state` is omitted. Keyboard focus and navigation come from the shared Button primitive.
