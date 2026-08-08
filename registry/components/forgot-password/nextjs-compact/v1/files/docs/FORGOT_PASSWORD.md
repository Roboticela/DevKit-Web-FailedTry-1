# Forgot Password

Enterprise password-recovery request form. Composes **Text Input** (email Input), **Button**, **Card**, and **Alert**. Optional delivery method uses **Action Segmented Control** from the registry — do not invent custom radios.

## Purpose

Collect a work email, optionally choose **reset link** vs **verification code**, validate input, and submit with loading / success / error feedback.

## Composition

| Primitive | Role |
|-----------|------|
| Card | Form surface (`Title` / `Description` / `Body` / `Footer` / `Actions`) |
| Text Input | Email address (`type="email"`) with validation messages |
| Action Segmented Control | Reset link · verification code |
| Button | Submit · back to sign in |
| Alert | Success / error / informational (split variant) |

## Usage

```tsx
<ForgotPassword
  onSubmit={async ({ email, method }) => {
    await api.requestPasswordReset({ email, method });
  }}
  onBack={() => navigate("/sign-in")}
/>
```

## Status

`idle` · `loading` · `success` · `error`

`onSubmit` Promise: resolve → success Alert; reject → error Alert (uses `Error.message` when present).

## Methods

`reset-link` · `verification-code`  
Hide the chooser with `showMethodChoice={false}` or pass a single entry in `methods`.

## Variants

`stacked` · `compact` · `split`

## Accessibility

- Native `<form>` with keyboard submit
- Email field labeled; errors paired with `validation="error"`
- Method control exposes a radiogroup label
- Buttons include meaningful leading icons
- Success / error Alerts use polite / assertive live regions

## Anti-patterns

- Do not replace Text Input with a raw `<input>`
- Do not build a custom segmented method control — use Action Segmented Control
