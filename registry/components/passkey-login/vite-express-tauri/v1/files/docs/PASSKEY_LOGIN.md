# Passkey Login

WebAuthn passwordless sign-in. Composes **Button**, **Card**, **Alert**, **Authentication Loading**, **Authentication Error**, and **Authentication Success**. Do not recreate auth status chrome.

## Purpose

Start a passkey ceremony, show authenticator compatibility (Face ID, Touch ID, Windows Hello, Android Credential Manager, security keys, browser passkeys), and route outcomes through existing authentication status components.

## Composition

| Primitive | Role |
|-----------|------|
| Card | Login surface |
| Alert | Idle intro / unsupported warning |
| Button | Continue with passkey · cancel · fallback |
| Authentication Loading | `flow="passkey"` while waiting |
| Authentication Error | `flow="passkey"` (`canceled`, `expired`, …) |
| Authentication Success | `flow="passkey"` after acceptance |

## Usage

```tsx
<PasskeyLogin
  timeoutMs={60_000}
  onAuthenticate={async () => {
    await startWebAuthnAssertion();
  }}
  onFallback={() => navigate("/sign-in/password")}
  onContinue={() => navigate("/app")}
/>
```

Export `detectPasskeySupport()` when you need the capability probe alone.

## Status

`idle` · `loading` · `success` · `error` · `unsupported`

- Abort / NotAllowed → `canceled`
- Timeout (`timeoutMs` or TimeoutError) → `expired`

## Variants

`stacked` · `compact` · `split`

## Accessibility

- Region labeled by the passkey title
- Primary Button keyboard activation
- Loading / error / success a11y from authentication status packages
- Authenticator list exposed as a labeled list

## Anti-patterns

- Do not build custom spinners or success/error banners — use Authentication Loading / Error / Success
- Do not hardcode a single authenticator UX — list supported kinds and let the platform chooser run
