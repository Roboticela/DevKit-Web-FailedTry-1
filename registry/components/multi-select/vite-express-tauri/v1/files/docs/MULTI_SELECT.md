# Multi-Select (028)

Select **multiple** options from a predefined collection.

## Selected value display

| `displayMode` | Behavior |
|---------------|----------|
| `auto` (default) | Chips up to `maxVisibleChips`, then a count summary |
| `chips` | Token chips (+N overflow) — wrap, no horizontal overflow |
| `text` | Compact comma-separated labels (ellipsis) |
| `count` | Summary e.g. “12 selected” |

Every chip is individually removable when removal is permitted. Clear-all is available for count/text modes and inside the panel.

## Presentation

| `presentation` | Behavior |
|----------------|----------|
| `auto` | Bottom sheet on compact/touch; anchored popover on desktop |
| `popover` | Always anchored dropdown |
| `sheet` | Always expanded mobile-style surface |

## Features

- Search / filter (or parent-owned via `filter={false}` + `onSearchChange` for async)
- Select all (filtered), clear all
- Disabled options, loading, no-results
- `maxSelections` / `minSelections` with messages
- Grouped options (`option.group` + optional `groups` labels)
- Window virtualization when filtered count &gt; `virtualizeThreshold` (default 80)
- Keyboard: ↓/↑ navigate, Space toggle, Enter confirm/close, Escape close
- Screen readers (`aria-multiselectable`), RTL, high contrast, reduced motion

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/MultiSelect.tsx`, `styles/multi-select.css` |
| `vite-express-tauri` | `src/components/ui/MultiSelect.tsx`, `src/styles/multi-select.css` |
