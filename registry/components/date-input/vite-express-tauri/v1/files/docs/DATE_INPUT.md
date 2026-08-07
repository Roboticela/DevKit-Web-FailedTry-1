# Date Input (017)

Locale-aware **calendar date** field. Manual typing is first-class; the calendar trigger opens a composed Date Picker (not embedded here).

## Value model

| Layer | Representation |
|-------|----------------|
| Submitted | ISO `YYYY-MM-DD` or `null` (timezone-independent) |
| Display | Locale-formatted string (`Intl.DateTimeFormat`) |
| Raw while typing | Unchanged until blur |

**Never assumes `MM/DD/YYYY`.** Placeholder order is derived from `locale`.

## Guidance

| Do | Don’t |
|----|--------|
| Allow keyboard entry without opening a picker | Force calendar-only interaction |
| Keep invalid typed text for correction | Silently rewrite mid-edit |
| Compose Date Picker via `onOpenPicker` / `pickerSlot` | Embed a full calendar in every field |

## Features

- `locale`, `min`, `max`, `isDateDisabled`
- Clear control, required / optional, validation messages
- Accessible calendar trigger (`aria-label`, `aria-expanded`, `type="button"`)
- ArrowDown / F4 open picker when `onOpenPicker` is provided

## States

empty · focused · filled · invalid · disabled · read-only · loading

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/DateInput.tsx`, `styles/date-input.css` |
| `vite-express-tauri` | `src/components/ui/DateInput.tsx`, `src/styles/date-input.css` |
