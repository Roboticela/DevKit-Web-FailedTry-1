# Radio Group (024)

Mutually exclusive collection of options. **Only one** may be selected.

Do **not** use when users should select multiple values — use Checkbox Group (022).

## Anatomy

| Part | Role |
|------|------|
| Group label | Semantic name (`aria-labelledby` / `role="radiogroup"`) |
| Description | Optional supporting context |
| Options | Radio (023) items — full row is the target |
| Validation | Group-level error message |

## Keyboard

| Key | Behavior |
|-----|----------|
| Tab | Enter / leave the group (one tab stop) |
| ↑ ↓ ← → | Move between enabled options and select |
| Home / End | First / last enabled option |
| Space | Select the focused option |

## Layout

| `orientation` | Behavior |
|---------------|----------|
| `vertical` (default) | Stacked list |
| `horizontal` | Row for short labels; natural content widths |
| `responsive` | Horizontal when space allows; stacks on compact / mobile |

Options are **not** forced to equal widths.

## Features

- `label`, `description`, `required`, `optional`, `errorMessage`
- Controlled `value` / `null` + `onValueChange`, or `defaultValue`
- Per-item `disabled` + group `disabled`
- Shared form `name`
- Light / Dark / High Contrast / RTL / reduced motion / screen readers

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/RadioGroup.tsx`, `styles/radio-group.css` (+ Radio) |
| `vite-express-tauri` | `src/components/ui/RadioGroup.tsx`, `src/styles/radio-group.css` (+ Radio) |
