# Account Locked

Account restriction prompt for enterprise authentication. Composes **Alert** and **Button** — do not invent lockout dialogs.

## Purpose

Explain why sign-in is blocked (attempts, admin hold, policy, risk) and offer recovery + support actions.

## Composition

| Primitive | Role |
|-----------|------|
| Alert | Warning/error tone, security icon, restriction explanation |
| Button | Primary recovery + secondary support |
| Slots | `actionsSlot`, `alertSlot`, `icon` |

## Reasons

| `reason` | Meaning |
|----------|---------|
| `attempts` | Too many failed sign-ins |
| `admin` | Administrator hold |
| `policy` | Org / compliance policy |
| `risk` | Suspicious activity |
| `unknown` | Generic lock |

## Variants

`stacked` (default) · `compact` · `banner` · `page`

## Usage

```tsx
<AccountLocked
  reason="attempts"
  variant="page"
  unlockHint="15 minutes"
  referenceId="LK-2048"
  onRecover={() => navigate("/recover")}
  onSupport={() => openHelpDesk()}
/>
```

## Accessibility

- Alert assertive live region by default
- Buttons use visible labels + meaningful leading icons
- Reference ids are plain text for support handoff

## Pairing

- Sign-in failure without lock: **Authentication Error**
- Session end on protected routes: **Session Expired**
- Account cannot authenticate: **Account Locked**

## Anti-patterns

- Do not build custom lockout modals
- Do not offer “Continue” as if the account were usable
