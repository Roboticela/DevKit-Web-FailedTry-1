# Session Expired

Protected-route prompt when a session ends. Composes **Alert** and **Button** — do not invent dialog chrome.

## Purpose

Explain why re-authentication is required after idle timeout, absolute lifetime, or revocation. Primary **Sign in again** and secondary navigation use registry Buttons inside Alert’s `actionSlot`.

## Composition

| Primitive | Role |
|-----------|------|
| Alert | Warning tone, security/time icon, explanation |
| Button | Primary re-auth + secondary (e.g. home) |
| Slots | `actionsSlot`, `alertSlot`, `icon` |

## Reasons

| `reason` | Meaning |
|----------|---------|
| `idle` | Inactivity timeout |
| `absolute` | Max session lifetime |
| `revoked` | Signed out elsewhere / revoked |
| `unknown` | Generic expiry |

## Variants

`stacked` (default) · `compact` · `banner` · `page` (centered route takeover)

## Usage

```tsx
<SessionExpired
  reason="idle"
  variant="page"
  returnUrl={location.pathname}
  onSignIn={() => navigate(`/login?returnUrl=${encodeURIComponent(location.pathname)}`)}
  onSecondary={() => navigate("/")}
/>
```

## Accessibility

- Alert uses assertive live region by default
- Buttons expose visible labels + meaningful leading icons
- `returnUrl` is plain text in the message (not color-only)

## Pairing

- Sign-in failure without lock: **Authentication Error**
- Session end on protected routes: **Session Expired**
- Account cannot authenticate: **Account Locked**

## Anti-patterns

- Do not build a custom modal shell — compose this Alert + Button layout
- Do not offer a dismiss that pretends the session is still valid
