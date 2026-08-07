# Password Input (015)

Masked credential entry with an accessible show/hide control.

## Guidance

| Do | Don’t |
|----|--------|
| Mask by default | Expose password without explicit user action |
| Use `type="button"` for visibility | Let the toggle submit the form |
| Compose strength via `strengthSlot` | Bake a strength meter into this primitive |
| Keep password-manager autocomplete | Blindly set `autocomplete="off"` |

## Purpose → autocomplete

| `purpose` | Default `autoComplete` |
|-----------|------------------------|
| `current` | `current-password` |
| `new` | `new-password` |
| `confirm` | `new-password` |

## Visibility toggle

- Accessible name: “Show password” / “Hide password”
- State: `aria-pressed`
- Restores selection / focus after type swap when the browser allows
- Adequate contrast against the field surface

## Composable slots

- `requirements` — policy copy (not a strength engine)
- `strengthSlot` — future Password Strength Indicator
- `errorMessage` / `successMessage` / `helpText` — validation / help

## Paste

`allowPaste` defaults to `true`. Set `false` only when application security requires it.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/PasswordInput.tsx`, `styles/password-input.css` |
| `vite-express-tauri` | `src/components/ui/PasswordInput.tsx`, `src/styles/password-input.css` |
