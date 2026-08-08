# Continue With Discord

Discord OAuth control. Extends **Continue With Provider** — do not duplicate layout or auth chrome.

## Usage

```tsx
<ContinueWithDiscord
  state="loading"
  onContinue={() => startDiscordOAuth()}
  fullWidth
/>
```

Defaults: `provider="discord"`, Discord Clyde mark (blurple `#5865F2`), label `Continue with Discord`, `variant="secondary"`.

Export `DiscordIcon` when you need the glyph alone.

## Accessibility / states

Inherited from Continue With Provider (`idle` · `loading` · `success` · `error` · `disabled`). Aliases: `loading` / `disabled` map to `state` when `state` is omitted. Keyboard focus and navigation come from the shared Button primitive.
