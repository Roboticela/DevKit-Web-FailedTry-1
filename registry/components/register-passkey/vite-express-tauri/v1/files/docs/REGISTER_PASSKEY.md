# Register Passkey

WebAuthn **credential registration**. Composes **Passkey Login** for the ceremony (no duplicated WebAuthn UI) plus **Button**, **Card**, **Alert**, **Authentication Loading**, **Authentication Error**, and **Authentication Success**.

## Purpose

1. Confirm supported authenticators / browser compatibility  
2. Run registration via Passkey Login (`onRegister` → `navigator.credentials.create` in the host)  
3. Surface loading, cancel, timeout, and success through existing authentication status components

## Composition

| Primitive | Role |
|-----------|------|
| Card / Alert / Button | Confirmation step |
| Authentication Loading | Support probe |
| Authentication Error | Unsupported browser / device |
| Passkey Login | Registration ceremony, cancel, timeout, fallbacks |
| Authentication Success | “Passkey registered” (via Passkey Login `successSlot`) |

## Usage

```tsx
<RegisterPasskey
  accountLabel="ada@example.com"
  timeoutMs={60_000}
  onRegister={async () => {
    await startWebAuthnRegistration();
  }}
  onFallback={() => navigate("/security")}
  onContinue={() => navigate("/security/passkeys")}
/>
```

Use `skipConfirmation` to open the ceremony immediately. Re-exports `detectPasskeySupport`.

## Steps

`confirm` · `register`

## Anti-patterns

- Do not fork Passkey Login for create vs get — pass `onRegister` into the shared ceremony
- Do not rebuild loading / error / success banners — use Authentication * packages
