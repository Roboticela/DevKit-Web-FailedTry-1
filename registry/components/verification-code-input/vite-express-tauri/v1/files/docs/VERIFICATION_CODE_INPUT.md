# Verification Code Input

Multi-cell auth code entry. Composes **Text Input** for every cell — never invent raw `<input>` fields.

Also composes **Label**, **Text**, **Alert**, and **Spinner**.

## Purpose

Email verification, password reset, authenticator apps, and two-factor authentication. Pair with **Countdown Timer** via `footerSlot` for resend cooldowns. After success, compose **Verification Success** (Alert + Badge). On failure, compose **Verification Failed** (Alert).

## Composition

| Primitive | Role |
|-----------|------|
| Text Input | Each digit/character cell + OTP autofill sink |
| Label | Group title (required / optional) |
| Text | Description / help |
| Alert | Error / success / warning messages |
| Spinner | Verifying state |
| Slots | `footerSlot`, `loadingSlot` |

## Flows

| `flow` | Default label |
|--------|---------------|
| `email-verification` | Email verification code |
| `password-reset` | Password reset code |
| `authenticator` | Authenticator code |
| `two-factor` | Two-factor code |

Defaults: length `6`, mode `numeric`. Override with `length` / `mode`.

## Behavior

- Auto-advance on entry
- Intelligent Backspace (clear current, else previous)
- Full-code paste
- Mobile `autocomplete="one-time-code"` (first cell + autofill Text Input)
- Arrow / Home / End keyboard navigation
- `onComplete` when all cells filled

## Usage

```tsx
<VerificationCodeInput
  flow="two-factor"
  value={code}
  onValueChange={setCode}
  onComplete={verify}
  footerSlot={
    <CountdownTimer
      flow="verification"
      expiredSlot={<Button>Resend code</Button>}
    />
  }
/>
```

## vs OTP Input

Prefer **Verification Code Input** when composing Text Input is required. OTP Input remains for legacy multi-cell chrome that does not wrap Text Input.

## Anti-patterns

- Do not add bare `<input>` cells
- Do not rebuild field chrome — use Text Input validation affordances + Alert for group messages
