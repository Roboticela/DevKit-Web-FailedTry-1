# Number Input (014)

Numeric data-entry control. Direct typing is first-class; steppers are optional.

## Value model

| Concept | Representation |
|---------|----------------|
| Empty | `null` (not `0`, not `""` alone) |
| Zero | `0` |
| Invalid mid-edit | raw text kept; numeric commit deferred |
| Submitted | `onValueChange(number \| null)` |
| Raw | `onRawChange(string)` while typing |

**Never reformat while focused** — locale / precision formatting applies on blur when configured.

## Features

- Integer or decimal (`decimal`)
- Negative or `positiveOnly`
- `min` / `max` / `step` / `precision`
- `prefix` / `suffix` (currency, %, units — no duplicate components)
- Optional `stepper` with ≥44×44 effective touch targets
- ArrowUp / ArrowDown step when appropriate
- Mobile: `inputMode="numeric"` or `decimal`

## States

empty · zero · focused · filled · invalid · disabled · read-only · loading · min · max

## API (summary)

| Prop | Notes |
|------|--------|
| `value` / `defaultValue` | `number \| null` |
| `onValueChange` | Committed numeric / empty |
| `onRawChange` | Live string |
| `stepper` | Optional increment UI |
| `locale` / `formatOnBlur` | Blur formatting only |
| `validation` + messages | Shared field chrome |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/NumberInput.tsx`, `styles/number-input.css` |
| `vite-express-tauri` | `src/components/ui/NumberInput.tsx`, `src/styles/number-input.css` |
