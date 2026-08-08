# Resend Verification

Cooldown-gated resend control for auth workflows. Composes **Button**, **Icon**, and **Countdown Timer** — do not invent a custom countdown.

## Purpose

Email verification, OTP, password reset, magic link, and two-factor resend with automatic cooldown, disabled interactions while waiting, and loading / success / error feedback.

## Composition

| Primitive | Role |
|-----------|------|
| Button | Resend action (`loading`, `disabled`, `leadingIcon`) |
| Icon | Flow mark + success / error feedback glyphs |
| Countdown Timer | Cooldown clock — `reset()` after a successful resend |

## Flows

| `flow` | Default cooldown | Default label |
|--------|------------------|---------------|
| `email-verification` | 60s | Resend verification email |
| `otp-verification` | 60s | Resend code |
| `password-reset` | 60s | Resend reset link |
| `magic-link` | 120s | Resend magic link |
| `two-factor` | 30s | Resend authentication code |

Override with `cooldownDuration` / `duration`.

## Usage

```tsx
<ResendVerification
  flow="otp-verification"
  cooldownDuration={45}
  onResend={async () => {
    await api.resendCode();
  }}
/>
```

## Status

`idle` · `cooldown` · `loading` · `success` · `error`

- Cooldown auto-starts when `autoStartCooldown` is true (default).
- Button stays disabled during cooldown / loading.
- Successful `onResend` shows success feedback and restarts Countdown Timer.
- Rejected `onResend` shows error feedback and keeps resend available.

## Variants

`stacked` · `inline` · `compact`

## Accessibility

- Group labeled by the resend action
- Button keyboard activation via shared Button primitive
- Success uses `role="status"`; errors use `role="alert"`
- Icons wrapped in registry **Icon** (decorative on the button; labeled in feedback)

## Anti-patterns

- Do not implement a parallel countdown — use Countdown Timer
- Do not build a text-only resend control without an icon
