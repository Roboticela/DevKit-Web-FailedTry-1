# Switch (025)

Immediate binary **ON / OFF** setting.

Do **not** use Switch as a Checkbox replacement, for navigation, multi-choice selection, form submission, or large option sets.

## Visual

| Token | MD |
|-------|-----|
| Track | 48×28 |
| Hit area | ≥44×44 |
| Selected cues | Accent track + thumb at inline-end + optional “On/Off” status text |

Thumb travel uses **logical** `inset-inline-start` so OFF stays at the reading start and ON at the end — semantic ON/OFF is preserved in RTL (not a blind mirror of every detail).

## States

off · on · disabled off · disabled on · focus · hover · pressed · loading · error

## Loading

When `loading` is true:
- toggles are blocked (`disabled` + `aria-busy`)
- progress is shown in the thumb
- keep `checked` aligned with the real application result after success or failure

## Interaction

| Input | Behavior |
|-------|----------|
| Click / tap label or control | Toggle (when interactive) |
| Space / Enter | Toggle |
| Screen reader | `role="switch"` + `aria-checked` |

Motion is quick and subtle; disabled under `prefers-reduced-motion`.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Switch.tsx`, `styles/switch.css` |
| `vite-express-tauri` | `src/components/ui/Switch.tsx`, `src/styles/switch.css` |
