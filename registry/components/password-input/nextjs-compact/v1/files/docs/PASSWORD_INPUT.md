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

Composes **Password Visibility Toggle** → **Icon Button** (Eye / Eye Off).

- Accessible name: “Show password” / “Hide password”
- State: `aria-pressed` via Icon Button `selected`
- Restores selection / focus after type swap when the browser allows
- Do not restyle a custom button inside this field

## Composable slots

- `requirements` — compose **Password Checklist** (flow UI) or **Password Requirements** (raw checklist)
- `strengthSlot` — compose **Password Strength** (Progress Bar + Badge)
- `errorMessage` / `successMessage` / `helpText` — validation / help

## Paste

`allowPaste` defaults to `true`. Set `false` only when application security requires it.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/PasswordInput.tsx`, `styles/password-input.css` |
| `vite-express-tauri` | `src/components/ui/PasswordInput.tsx`, `src/styles/password-input.css` |
