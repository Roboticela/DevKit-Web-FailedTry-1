# Verification Failed

Failed-verification messaging. Composes **Alert** only — do not invent error cards.

## Purpose

Surface invalid, expired, locked, or network failures across email, phone, passkey, 2FA, and password-reset flows. Provide Retry and Resend via Alert actions.

## Composition

| Primitive | Role |
|-----------|------|
| Alert | Warning/error tone, meaningful icon, message, Retry / Resend actions |
| Slots | `actionSlot`, `alertSlot`, `icon` |

## Flows

`email-verification` · `phone-verification` · `passkeys` · `two-factor` · `password-reset`

## Reasons

| `reason` | Alert tone | Default icon |
|----------|------------|--------------|
| `invalid` | error | Cross |
| `expired` | warning | Timer |
| `locked` | warning | Lock |
| `network` | error | Signal |
| `unknown` | error | Warning |

## Usage

```tsx
<VerificationFailed
  flow="two-factor"
  reason="expired"
  onRetry={() => setCode("")}
  onResend={resendCode}
/>
```

Or pass full `actions` / `actionSlot` when you need custom CTAs.

## Accessibility

- Alert defaults to `live="assertive"` for verification errors
- Icons are decorative; title + body carry meaning
- Actions use Alert’s accessible action row

## Pairing

- Entry: **Verification Code Input**
- Cooldown: **Countdown Timer**
- Success: **Verification Success**
- Failure: **Verification Failed**

## Anti-patterns

- Do not rebuild error banners with raw Text — compose this Alert wrapper
- Do not rely on color alone for failure state
