# Continue With Slack

Slack OAuth control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithSlack
  state="loading"
  onContinue={() => startSlackOAuth()}
  fullWidth
/>
```

Defaults: `provider="slack"`, official multicolor Slack mark, label `Continue with Slack`, `variant="secondary"`.

Export `SlackIcon` when you need the glyph alone.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` map to `state` when `state` is omitted. Keyboard focus and navigation come from the shared Button primitive.
