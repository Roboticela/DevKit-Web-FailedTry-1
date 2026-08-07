# Nav Item

Core navigation control for primary/secondary nav lists and drawers.

## States
default, hover, focus-visible, current (`aria-current="page"`), selected, disabled, expanded.

## Composition
Pass registry `Badge` via `badge`. Pass meaningful icons via `icon`.

## Anti-patterns
- Do not use for generic page actions — use Button / IconButton.
- Do not communicate current page by color alone — `aria-current` is set.
