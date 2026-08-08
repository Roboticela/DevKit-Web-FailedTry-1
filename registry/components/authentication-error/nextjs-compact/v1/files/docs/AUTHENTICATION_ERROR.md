# Authentication Error

Failed authentication messaging. Composes **Alert** only — do not invent error banners.

## Purpose

Surface invalid, expired, locked, network, or canceled failures across every auth method. Provide Retry and alternative-method actions via Alert.

## Composition

| Primitive | Role |
|-----------|------|
| Alert | Warning/error tone, meaningful icon, message, Retry / alternative actions |
| Slots | `actionSlot`, `alertSlot`, `icon` |

## Flows

`sign-in` · `account-creation` · `password-reset` · `passkey` · `email-verification` · `two-factor` · `session-restoration`

## Reasons

| `reason` | Alert tone |
|----------|------------|
| `invalid` | error |
| `expired` | warning |
| `locked` | warning |
| `network` | error |
| `canceled` | warning |
| `unknown` | error |

## Usage

```tsx
<AuthenticationError
  flow="sign-in"
  reason="invalid"
  onRetry={() => retrySignIn()}
  onTryAlternative={() => openMethodPicker()}
/>
```

Override copy with `title`, `description`, or `errorMessage`. Pass full `actions` when you need custom CTAs.

## Pairing

- Loading: **Authentication Loading**
- Success: **Authentication Success**
- Error: **Authentication Error**
- Session loss on protected routes: **Session Expired**
- Code-step failure: **Verification Failed**

## Accessibility

- Alert defaults to `live="assertive"`
- Icons are decorative; title + body carry meaning
- Actions use Alert’s accessible action row

## Anti-patterns

- Do not rebuild auth error cards with raw Text
- Do not rely on color alone for failure state
