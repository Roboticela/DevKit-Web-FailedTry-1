# Reset Password

Create and confirm a new password for recovery, change, and onboarding. Composes **Password Input** (with **Password Visibility Toggle**), **Password Strength**, **Password Requirements**, **Button**, **Card**, and **Alert**. Do not reimplement strength scoring or requirement evaluation.

## Purpose

Collect a new password (+ confirmation), optionally require the current password, show live strength and checklist progress, and submit with loading / success / error feedback.

## Composition

| Primitive | Role |
|-----------|------|
| Card | Form surface |
| Password Input | New / confirm / current fields |
| Password Visibility Toggle | Shared or per-field show/hide |
| Password Strength | Live quality meter (`strengthSlot`) |
| Password Requirements | Real-time policy rules (`requirements`) |
| Button | Submit · cancel |
| Alert | Success / error / informational |

## Flows

| `flow` | Checklist preset | Current password |
|--------|------------------|------------------|
| `recovery` | `reset` | no |
| `change` | `change` | yes (default) |
| `onboarding` | `onboarding` | no |

Override policy with `rules` (Password Requirements / Requirements rule objects).

## Usage

```tsx
<ResetPassword
  flow="recovery"
  onSubmit={async ({ password }) => api.resetPassword({ token, password })}
  onCancel={() => navigate("/sign-in")}
  showCancel
/>
```

## Status

`idle` · `loading` · `success` · `error`

## Variants

`stacked` · `compact` · `split`

## Accessibility

- Native `<form>` with keyboard submit
- Labeled password fields; mismatch / current errors announced via field validation
- Checklist and strength reuse registry a11y
- Shared visibility toggle exposes show/hide names

## Anti-patterns

- Do not invent custom strength meters or checklist logic — use Password Strength + Password Requirements
- Do not replace Password Input visibility with an unlabeled checkbox
