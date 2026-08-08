# Verification Email Sent

Confirmation after a verification email is sent. Composes **Alert**, **Card**, **Button**, **Countdown Timer**, and **Resend Verification**. Do not reimplement resend or countdown logic.

## Purpose

Show that a verification email was delivered, display the destination address, surface link-expiry timing, and offer resend / open inbox / change email actions.

## Composition

| Primitive | Role |
|-----------|------|
| Card | Confirmation surface (`Header` / `Body` / `Footer` / `Actions`) |
| Alert | Sent / loading / error messaging + destination email |
| Countdown Timer | Verification **link expiry** window (`email-confirmation`) |
| Resend Verification | Resend action + **cooldown** (owns its own Countdown Timer) |
| Button | Open email app · Change email |

## Usage

```tsx
<VerificationEmailSent
  email="ada@example.com"
  onResend={() => api.resendVerification()}
  onChangeEmail={() => goToEmailStep()}
  linkExpiryDuration={120}
  resendCooldownDuration={60}
/>
```

## Status

Page-level `status`: `sent` · `loading` · `error` (Alert variant follows).  
Resend state stays on **Resend Verification** via `resendStatus` / `onResend` / `onResendStatusChange`.

## Variants

`stacked` · `compact` · `split`

## Accessibility

- Region labeled by the confirmation title
- Alert live region (`polite` / `assertive` on error)
- Actions use Button keyboard support and meaningful leading icons
- Destination email is emphasized in the Alert body

## Anti-patterns

- Do not build a custom resend button + timer — use Resend Verification
- Do not invent a second cooldown — Countdown Timer here is for **link expiry** only
