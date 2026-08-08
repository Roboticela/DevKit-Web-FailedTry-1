# Authentication Loading

Auth-step progress UI. Composes **Spinner** and **Skeleton** / **Skeleton Group** — do not invent custom loaders.

## Purpose

Show meaningful progress for sign-in, account creation, password reset, passkey auth, email verification, and session restoration.

After the step completes, compose **Authentication Success** (Alert). On failure, compose **Authentication Error** (Alert).

## Composition

| Primitive | Role |
|-----------|------|
| Spinner | Indeterminate auth activity + status label |
| Skeleton / Skeleton Group | Structural placeholder for the upcoming form / session chrome |
| Slots | `spinnerSlot`, `skeletonSlot`, `footerSlot` |

## Flows

| `flow` | Default message |
|--------|-----------------|
| `sign-in` | Signing you in |
| `account-creation` | Creating your account |
| `password-reset` | Resetting your password |
| `passkey` | Verifying passkey |
| `email-verification` | Verifying your email |
| `session-restoration` | Restoring your session |

## Variants

`stacked` (default) · `compact` · `inline` · `form`

## Usage

```tsx
<AuthenticationLoading flow="sign-in" />

<AuthenticationLoading
  flow="email-verification"
  message="Checking code"
  description="This usually takes a moment."
/>
```

Set `aria-busy` on the replaced form region in the host when swapping live content for this loader.

## Accessibility

- Root uses `role="status"`, `aria-busy`, and polite live updates
- Spinner announces the message; Skeleton Group shares the same status label
- Respects reduced motion via Skeleton’s built-in behavior

## Anti-patterns

- Do not build custom spinners or shimmer bars
- Do not use Progress Bar here unless progress is known — prefer Spinner
