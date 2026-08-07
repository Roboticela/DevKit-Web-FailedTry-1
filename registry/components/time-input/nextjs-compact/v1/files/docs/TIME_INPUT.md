# Time Input (018)

Locale-aware **time** field. Manual typing is first-class; the clock trigger composes with an external Time Picker via `pickerSlot` / `onOpenPicker`.

## Value model

| Layer | Representation |
|-------|----------------|
| Submitted | `HH:mm` or `HH:mm:ss` (24-hour) or `null` |
| Display | Locale-formatted (`Intl`, 12h or 24h) |
| Raw while typing | Unchanged until blur |

**Never assumes AM/PM.** Day period appears only when the locale / `hourCycle` uses 12-hour time, or the user types it.

## Guidance

| Do | Don’t |
|----|--------|
| Default to hours + minutes | Require seconds unless needed |
| Allow keyboard entry without a picker | Force picker-only interaction |
| Compose a Time Picker through the clock trigger | Rely on browser `type="time"` chrome |
| Use `pickerSlot` for picker UI | Assume US 12-hour format universally |

## Features

- `locale`, `hourCycle` (`auto` | `h12` | `h23`), `withSeconds`
- `min`, `max`, `step` (seconds); ArrowUp / ArrowDown adjust by step
- Clear, required / optional, validation messages
- Accessible clock trigger (`aria-label`, `aria-expanded`, `type="button"`)
- `pickerSlot` for external Time Picker composition
- F4 / Alt+ArrowDown open picker when the clock trigger is shown

## States

empty · focused · filled · invalid · disabled · read-only · loading

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/TimeInput.tsx`, `styles/time-input.css` |
| `vite-express-tauri` | `src/components/ui/TimeInput.tsx`, `src/styles/time-input.css` |
