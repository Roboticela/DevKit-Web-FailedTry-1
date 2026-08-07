# Textarea (012)

Foundational **multi-line** textual input. Visually related to Text Input (011).

## Guidance

| Do | Don’t |
|----|--------|
| Start auto-grow at min height, stop at max, then scroll | Let the field grow without bound |
| Keep counter quiet in the footer | Pack decorative icons into the text surface |
| Use shared field label / validation language | Invent a separate form chrome |
| Prefer `resize="vertical"` on desktop when manual resize helps | Force awkward resize grips on coarse touch |

## Height

| Preset | px |
|--------|-----|
| `sm` (default min) | 96 |
| `md` | 128 |
| `lg` | 160 |
| `xl` | 240 |

Props: `height`, `minHeight`, `maxHeight` (number, CSS length, or preset).

## Resize modes (`resize`)

| Mode | Behavior |
|------|----------|
| `none` (default) | Fixed / clamped height |
| `vertical` | Manual vertical resize (desktop) |
| `both` | Manual both axes; falls back to vertical on narrow / touch |
| `auto` | Grows from min → max with content, then internal scroll |

## Padding & type

- Padding: **12px 12px**
- Text: **16px / 24px**
- Label → control / control → message: **6px** (Form Controls)

## API (summary)

| Prop | Notes |
|------|--------|
| `label` / `description` / `helpText` | Field chrome |
| `validation` + messages | error / success / warning |
| `minLength` / `maxLength` / `showCount` | Trailing counter |
| `leadingAffordance` | Rare contextual glyph outside the text stream |
| `loading` / `disabled` / `readOnly` | States |
| `value` / `defaultValue` / `onValueChange` | Controlled / uncontrolled |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Textarea.tsx`, `styles/textarea.css` |
| `vite-express-tauri` | `src/components/ui/Textarea.tsx`, `src/styles/textarea.css` |
