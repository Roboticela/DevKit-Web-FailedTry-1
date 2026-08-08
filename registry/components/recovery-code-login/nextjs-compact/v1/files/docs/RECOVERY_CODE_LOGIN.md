# Recovery Code Login

Emergency 2FA sign-in with a one-time backup code. Composes **Text Input**, **Button**, **Alert**, **Authentication Loading**, and **Authentication Error**. Do not reinvent auth status chrome.

## Usage

```tsx
<RecoveryCodeLogin
  onAuthenticate={async (code) => {
    // verify recovery code; throw { reason: "invalid" | "locked" | ... } on failure
  }}
  onSuccess={() => {
    // navigate into the app
  }}
  onTryAlternative={() => {
    // return to authenticator / password method picker
  }}
/>
```

## Status

- `idle` — guidance Alert + recovery code Text Input + submit
- `loading` — Authentication Loading
- `error` — Authentication Error (retry returns to idle)

Helpers: `normalizeRecoveryCode`, `formatRecoveryCodeDisplay`.
