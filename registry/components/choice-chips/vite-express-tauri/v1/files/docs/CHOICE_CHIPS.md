# Choice Chips (029)

Compact controls for selecting or filtering among a **small** set of related choices.

Visually distinct from Button, Tag, Badge, Checkbox, and Radio.

Selection-only — do not mix action semantics in the same group.

## Selection modes

| `selectionMode` | Behavior |
|-----------------|----------|
| `single` (default) | Mutually exclusive (`role="radiogroup"` / `radio`) |
| `multiple` | Independent toggles (`role="group"` / `checkbox`) |

## Selected state

Selected chips show **all** of:
- check mark
- semibold label
- emphasis (2px) accent border
- accent-subtle fill

Color alone is never the only signal.

## Features

- Optional meaningful leading icons
- Disabled (group or per-chip)
- Focus / pressed / hover
- Horizontal wrapping — never a forced single overflowing row
- ≥44×44 effective touch targets
- Short, moderate, and localized labels; RTL via logical CSS
- Label, description, help, validation messages
- `allowDeselect` for single mode (optional clear)

## Keyboard

| Key | Behavior |
|-----|----------|
| Tab | Enter / leave the group (roving tabindex) |
| ← → ↑ ↓ | Move between chips |
| Home / End | First / last enabled |
| Space / Enter | Select (single) or toggle (multiple) |

## When not to use

Avoid large option sets — prefer Select, Combobox, or Multi-Select.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/ChoiceChips.tsx`, `styles/choice-chips.css` |
| `vite-express-tauri` | `src/components/ui/ChoiceChips.tsx`, `src/styles/choice-chips.css` |
