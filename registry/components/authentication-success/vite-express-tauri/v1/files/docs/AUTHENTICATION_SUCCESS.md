# Authentication Success

Successful authentication confirmation. Composes **Alert** only — do not invent success cards.

## Purpose

Confirm sign-in, account creation, password reset, passkey, email verification, two-factor, and session restoration. Optional redirect countdown lives in the Alert body; Continue uses Alert actions.

For failures, compose **Authentication Error** instead.

## Composition

| Primitive | Role |
|-----------|------|
| Alert | Success tone, meaningful method icon, message, countdown, actions |
| Slots | `actionSlot`, `alertSlot`, `icon` |

## Flows

| `flow` | Default title |
|--------|---------------|
| `sign-in` | Signed in |
| `account-creation` | Account created |
| `password-reset` | Password updated |
| `passkey` | Passkey authenticated |
| `email-verification` | Email verified |
| `two-factor` | Two-factor complete |
| `session-restoration` | Session restored |

## Usage

```tsx
<AuthenticationSuccess
  flow="sign-in"
  redirectTo="/dashboard"
  redirectDelay={5}
  onRedirect={() => navigate("/dashboard")}
  onContinue={() => navigate("/dashboard")}
/>
```

Or pass full `actions` for multiple CTAs.

## vs Verification Success

- **Authentication Success** — end of any auth method (Alert only)
- **Verification Success** — code/factor verification step (Alert + Badge)

## Accessibility

- Wrapper `role="status"`; Alert polite live region by default
- Redirect countdown announced politely in the body
- Icons are decorative; title + body carry meaning

## Anti-patterns

- Do not rebuild success banners with raw Text
- Do not rely on color alone — Alert icon + text
