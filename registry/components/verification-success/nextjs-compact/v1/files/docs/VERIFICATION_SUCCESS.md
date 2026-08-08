# Verification Success

Post-verification confirmation. Composes **Alert** and **Badge** only — do not invent status chrome.

## Purpose

Confirm email, phone, passkey, or two-factor success. Optional redirect countdown + Continue actions via Alert’s action API.

For failures, compose **Verification Failed** instead.

## Composition

| Primitive | Role |
|-----------|------|
| Badge | Verified status + optional redirect countdown |
| Alert | Success title, message, actions, confirmation icon |
| Slots | `badgeSlot`, `redirectBadgeSlot`, `alertSlot`, `actionSlot`, `icon` |

## Flows

| `flow` | Default title |
|--------|---------------|
| `email-verification` | Email verified |
| `phone-verification` | Phone verified |
| `passkeys` | Passkey verified |
| `two-factor` | Two-factor verified |

## Redirect

```tsx
<VerificationSuccess
  flow="email-verification"
  redirectTo="/dashboard"
  redirectDelay={5}
  onRedirect={() => navigate("/dashboard")}
  actions={[{ label: "Continue", href: "/dashboard", emphasis: "primary" }]}
/>
```

## Variants

`stacked` (default) · `compact` · `inline` · `banner`

## Accessibility

- Wrapper exposes `role="status"`; Alert uses polite live region by default
- Badge labels are meaningful (`accessibleLabel`)
- Icons are decorative; title/body carry the meaning

## Anti-patterns

- Do not build custom success cards or toast-only confirmations when this Alert composition fits
- Do not rely on color alone — Badge + Alert icon + text
