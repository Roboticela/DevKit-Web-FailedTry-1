# Magic Link Login

Passwordless sign-in via email magic link. Composes **Text Input**, **Button**, and **Verification Email Sent**. Optional federated buttons use **Continue With Provider**. Do not reimplement confirmation, expiry, or resend UI.

## Purpose

1. Collect email and request a secure sign-in link  
2. Hand off to **Verification Email Sent** for confirmation, link expiry, resend, open inbox, and change email

## Composition

| Primitive | Role |
|-----------|------|
| Text Input | Email entry + validation |
| Button | “Email magic link” submit |
| Verification Email Sent | Confirmation, expiry timer, resend |
| Continue With Provider | Optional configurable providers |

## Usage

```tsx
<MagicLinkLogin
  onRequestLink={async (email) => api.sendMagicLink(email)}
  providers={[
    { id: "google", label: "Continue with Google", icon: <GoogleIcon />, onContinue: startGoogle },
  ]}
/>
```

## Views

`request` · `sent`  
Controlled via `view` / `onViewChange`. Successful `onRequestLink` switches to `sent`.

## Status (request view)

`idle` · `loading` · `error`

## Accessibility

- Native form submit + keyboard activation
- Labeled email field with validation messages
- Confirmation region from Verification Email Sent (live regions, resend cooldown)

## Anti-patterns

- Do not build a custom “email sent” panel — use Verification Email Sent
- Do not fork Continue With Provider for federated options
