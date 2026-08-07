# Toggle Button (007)

Binary / stateful action control (`aria-pressed`).

## When to use

| Use Toggle Button | Prefer instead |
|-------------------|----------------|
| Toolbar bold/italic, view mode chips, filters | — |
| Settings preference on/off | **Switch** |
| Leave the current view | **Link** / navigation |

Do not use for navigation.

## Anatomy

1. Optional selection indicator (empty square → check)
2. Optional icon (`icon` / `pressedIcon`)
3. Optional label (`label` / `pressedLabel`)

Selected state is multi-cue: **stronger border**, **filled surface**, **indicator**, and optional **icon/text change** — not color alone.

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | `string` | required | Accessible name; visible unless icon-only |
| `pressedLabel` | `string` | — | Label while pressed |
| `icon` / `pressedIcon` | `ReactNode` | — | Icon swap on press |
| `appearance` | `icon` \| `text` \| `icon-text` | auto | |
| `variant` | `outline` \| `subtle` \| `filled` | `outline` | |
| `size` | `xs`–`xl` | `md` | |
| `pressed` / `defaultPressed` / `onPressedChange` | controlled API | — | |
| `showIndicator` | `boolean` | auto | Default off for icon-only |

## Keyboard & AT

- Native `button`: Enter / Space toggles  
- `aria-pressed` reflects on/off for screen readers  
- Visible focus ring; ≥44×44 hit area  

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/ToggleButton.tsx`, `styles/toggle-button.css` |
| `vite-express-tauri` | `src/components/ui/ToggleButton.tsx`, `src/styles/toggle-button.css` |
