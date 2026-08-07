# Radio (023)

One **mutually exclusive** choice within a Radio Group.

Do **not** use Radio for independent multi-select — use Checkbox (021). Prefer Radio Group (024) for a labeled set; a standalone Radio should share a `name` with its siblings.

## Visual

| Token | Value |
|-------|--------|
| Control (MD) | 20px circle |
| Hit area | ≥44×44 |
| Selected | Stronger ring + filled center dot (shape + color) |

## States

unselected · selected · disabled unselected · disabled selected · focus · hover · pressed · error

Disabled labels stay readable — not washed out to illegibility.

## Interaction

| Key | Behavior |
|-----|----------|
| Space | Selects the focused option |
| Arrow keys | Move between options that share a `name` (native) / within Radio Group |

The label is clickable/tappable. Multiline labels align the control to the first line.

## Features

- `label`, `description`, `required`, `errorMessage`
- Controlled `checked` + `onCheckedChange`
- Shared `name` + `value` for form sets
- Light / Dark / High Contrast / RTL / reduced motion

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Radio.tsx`, `styles/radio.css` |
| `vite-express-tauri` | `src/components/ui/Radio.tsx`, `src/styles/radio.css` |
