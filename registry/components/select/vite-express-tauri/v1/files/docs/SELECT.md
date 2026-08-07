# Select (026)

Choose **one** option from a predefined list.

Not a Combobox — options are not freely typed.

## Presentation

| `presentation` | Behavior |
|----------------|----------|
| `auto` (default) | Native picker on compact/touch; listbox popover on desktop |
| `listbox` | Always DevKit listbox |
| `native` | Always platform select (often better for simple mobile cases) |

The visible trigger always uses DevKit form-control language. Native UI is used only for the choice sheet when appropriate.

## Features

- `label`, `description`, `placeholder`, `helpText`, validation messages
- `required` / `optional`, `disabled`, `clearable`, meaningful `leadingIcon`
- Controlled `value` / `null` + `onValueChange`
- Small → large option sets (scrollable listbox, viewport clamping)
- Type-ahead on desktop listbox
- RTL, high contrast, reduced motion, screen readers

## Keyboard (listbox)

| Key | Behavior |
|-----|----------|
| Enter / Space / ↓ | Open |
| ↑ ↓ | Navigate options |
| Enter / Space | Select |
| Escape | Close |
| Home / End | First / last enabled |
| Type-ahead | Jump to matching label |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Select.tsx`, `styles/select.css` |
| `vite-express-tauri` | `src/components/ui/Select.tsx`, `src/styles/select.css` |
