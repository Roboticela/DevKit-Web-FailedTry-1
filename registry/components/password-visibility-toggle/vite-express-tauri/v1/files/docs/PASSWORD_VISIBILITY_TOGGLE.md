# Password Visibility Toggle

Accessible show/hide control for password fields. Composes **Icon Button** — do not reinvent a button.

## Purpose

Toggle password masking only. Use with Password Input (or any password-capable field) across login, registration, reset, change-password, and security forms.

## Composition

| Slot / prop | Role |
|-------------|------|
| Icon Button | Interaction chrome, sizes, variants, focus/hover/disabled |
| `showIcon` / `hideIcon` | Eye / Eye Off (overrideable) |
| `controls` | `aria-controls` → related input id |

## States

| State | Behavior |
|-------|----------|
| Hidden (default) | Eye icon, label “Show password”, `aria-pressed="false"` |
| Visible | Eye Off icon, label “Hide password”, `aria-pressed="true"` |
| Hover / focus / active | From Icon Button |
| Disabled | Icon Button `disabled` |
| Read-only | Blocks toggle (`aria-readonly`), keeps announcement |
| Loading | Icon Button loading |

## Accessibility

- `type="button"` — never submits the form
- Accessible name changes with state
- `aria-pressed` reflects visibility
- Keyboard: native button activation (Enter / Space)
- Prefer `controls` pointing at the password input id

## Anti-patterns

- Do not build a custom `<button>` for this control
- Do not style eye icons with color alone for state — Icon Button `selected` + label change
- Do not use for non-password reveal patterns (use a dedicated control)

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/PasswordVisibilityToggle.tsx`, `styles/password-visibility-toggle.css` (+ Icon Button) |
| `vite-express-tauri` | `src/components/ui/PasswordVisibilityToggle.tsx`, `src/styles/password-visibility-toggle.css` (+ Icon Button) |
