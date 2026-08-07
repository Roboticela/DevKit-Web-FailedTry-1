# Date & Time Input (019)

Coherent **date + time** composition. One temporal value, not two unrelated fields.

## Value model

| Mode | Canonical value |
|------|-----------------|
| `datetime` (default) | `YYYY-MM-DDTHH:mm` or `…THH:mm:ss` when complete; `null` if empty/incomplete |
| `date` | `YYYY-MM-DD` |
| `time` | `HH:mm` / `HH:mm:ss` |

Use `onPartsChange` for partial edits while either side is still empty.

## Defaults

- Mode: **date + hours + minutes**
- Seconds off (`withSeconds`)
- Timezone indicator off (`showTimeZone`)
- Advanced options via `advancedSlot` (progressive disclosure)

## Layout

| `orientation` | Behavior |
|---------------|----------|
| `responsive` (default) | Stack on compact; horizontal from tablet (768px+) |
| `vertical` | Always stacked |
| `horizontal` | Always side-by-side |

Shared shell, segment labels (“Date” / “Time”), and group-level validation keep the parts related.

## Dependencies

Install sibling packages into the same UI folder:

- `date-input`
- `time-input`

Import their CSS alongside `date-time-input.css`.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/DateTimeInput.tsx`, `styles/date-time-input.css` |
| `vite-express-tauri` | `src/components/ui/DateTimeInput.tsx`, `src/styles/date-time-input.css` |
