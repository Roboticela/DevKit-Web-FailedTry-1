# OTP / Verification Input (016)

Short verification code entry. Visual cells, **one logical value**.

## Defaults

- Length: **6**
- Mode: **numeric**
- Supported lengths: 4 · 5 · 6 · 8 (or any positive `length`)

## Behavior

| Action | Result |
|--------|--------|
| Type | Auto-advance to next cell |
| Backspace | Clear current, or move back and clear |
| Delete | Clear current cell |
| Paste `123456` | Fill the whole code |
| Autofill | `autocomplete="one-time-code"` sink |

Invalid codes do **not** wipe the entry by default (`preserveOnInvalid`).

## States

empty · partial · complete · invalid · disabled · loading · success

## Modes

| `mode` | Characters | Mobile keyboard |
|--------|------------|-----------------|
| `numeric` | 0–9 | numeric |
| `alphanumeric` | A–Z, 0–9 | text |

## API (summary)

| Prop | Notes |
|------|--------|
| `value` / `onValueChange` | Combined string |
| `onComplete` | When all cells filled |
| `length` | Default 6 |
| `mode` | `numeric` \| `alphanumeric` |
| `validation` + messages | Stable footer (no layout jump) |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/OtpInput.tsx`, `styles/otp-input.css` |
| `vite-express-tauri` | `src/components/ui/OtpInput.tsx`, `src/styles/otp-input.css` |
