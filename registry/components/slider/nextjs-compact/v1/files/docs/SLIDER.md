# Slider (030)

Select a **numeric** value from a continuous or stepped range.

Not for categorical choices — use Select, Radio, or Choice Chips instead.

## Default

Single-thumb slider. Dual-thumb `mode="range"` is reserved for future composition.

## Features

- `min`, `max`, `step` (integer or decimal)
- Label, live value display, unit, description, help, validation
- Disabled, focus, pressed/dragging
- Optional numeric input (`showInput`) for precise values
- Continuous `onValueChange` while dragging; `onValueCommit` on release
- Debounce expensive work at the application layer — the slider stays immediate
- Track shows filled range from minimum to current value; bounds labels show min/max
- Visible thumb may be smaller than its ≥44×44 hit target
- Keyboard, pointer, touch, stylus
- RTL (`inset-inline`), localization (`toLocaleString` / `formatValue`), HC, dark, reduced motion

## Keyboard

| Key | Behavior |
|-----|----------|
| ← / ↓ | Decrease by `step` |
| → / ↑ | Increase by `step` |
| Page Down / Page Up | Larger jump (`step * pageSteps`) |
| Home | Minimum |
| End | Maximum |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Slider.tsx`, `styles/slider.css` |
| `vite-express-tauri` | `src/components/ui/Slider.tsx`, `src/styles/slider.css` |
