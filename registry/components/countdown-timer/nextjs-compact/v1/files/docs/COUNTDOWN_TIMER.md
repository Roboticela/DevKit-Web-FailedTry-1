# Countdown Timer

Auth remaining-time UI. Composes **Progress Bar**, **Text** (`as="time"`), **Badge**, and **Icon Button**. Do not invent custom meters or control chrome.

## Purpose

OTP verification cooldowns and email confirmation windows. Pair beside **OTP Input** or under a confirmation prompt. Use `expiredSlot` for Resend (**Button** / **Link Button**).

## Composition

| Primitive | Role |
|-----------|------|
| Text (`time`) | Live remaining clock + timer icon |
| Progress Bar | Depleting remaining duration |
| Badge | Active / Paused / Expired status |
| Icon Button | Pause, resume, reset |
| Slots | `icon`, `timeSlot`, `progressSlot`, `badgeSlot`, `controlsSlot`, `expiredSlot` |

## Flows

| `flow` | Default duration | Default label |
|--------|------------------|---------------|
| `verification` | 60s | Code expires in |
| `email-confirmation` | 120s | Confirm within |

Override with `duration` / `remaining`.

## API highlights

- Auto tick with pause / resume / reset (imperative `CountdownTimerHandle`)
- `onTick`, `onExpire`, `onPause`, `onResume`, `onReset`, `onStateChange`
- Variants: `stacked` · `compact` · `inline` · `meter`
- `formatCountdownSeconds` helper for `m:ss`

## Usage

```tsx
<CountdownTimer
  flow="verification"
  onExpire={() => setCanResend(true)}
  expiredSlot={<Button onClick={resend}>Resend code</Button>}
/>
```

## Accessibility

- Group labeled by the visible / SR label
- Soft `aria-live` announcements for pause / expire
- Controls expose accessible names (Pause / Resume / Reset)
- Remaining time uses semantic `<time>` via Text

## Anti-patterns

- Do not build a custom progress track or icon-only unlabeled controls
- Do not use Spinner for a known remaining duration — use this + Progress Bar
