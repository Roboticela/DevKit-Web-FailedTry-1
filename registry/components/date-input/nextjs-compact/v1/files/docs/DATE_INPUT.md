# Date Input (017)

Locale-aware **calendar date** field. Manual typing is first-class; the calendar trigger opens a built-in mobile wheel picker with a rounded center selection lens.

## Value model

| Layer | Representation |
|-------|----------------|
| Submitted | ISO `YYYY-MM-DD` or `null` (timezone-independent) |
| Display | Locale-formatted string (`Intl.DateTimeFormat`) |
| Raw while typing | Unchanged until blur |

**Never assumes `MM/DD/YYYY`.** Placeholder and wheel column order are derived from `locale`.

## Guidance

| Do | Don’t |
|----|--------|
| Allow keyboard entry without opening a picker | Force picker-only interaction |
| Keep invalid typed text for correction | Silently rewrite mid-edit |
| Use the built-in wheel picker from the calendar trigger | Assume a single calendar layout for all locales |
| Override with `pickerSlot` only when composing a custom UI | Hardcode month/day/year order |

## Features

- `locale`, `min`, `max`, `isDateDisabled`
- Clear control, required / optional, validation messages
- Accessible calendar trigger (`aria-label`, `aria-expanded`, `type="button"`)
- Built-in mobile wheel picker (locale-ordered month / day / year)
- `pickerSlot` replaces the built-in picker when provided
- ArrowDown / F4 open picker when the calendar trigger is shown

## States

empty · focused · filled · invalid · disabled · read-only · loading

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/DateInput.tsx`, `components/ui/DateWheelPicker.tsx`, `styles/date-input.css` |
| `vite-express-tauri` | `src/components/ui/DateInput.tsx`, `src/components/ui/DateWheelPicker.tsx`, `src/styles/date-input.css` |
