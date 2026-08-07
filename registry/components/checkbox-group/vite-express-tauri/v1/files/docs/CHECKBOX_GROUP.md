# Checkbox Group (022)

Related **independent** multi-select choices. Each item stays individually selectable and focusable.

Compose from Checkbox (021). Prefer a Radio Group for mutually exclusive options.

## Anatomy

| Part | Role |
|------|------|
| Group label | Semantic name (`aria-labelledby`) |
| Description | Optional supporting context |
| Select all | Optional derived parent |
| Items | Independent checkboxes |
| Validation | Group-level error message |

## Select all

When enabled, the parent reflects children:

| Children | Parent |
|----------|--------|
| All selected | Checked |
| None selected | Unchecked |
| Some selected | Indeterminate |

Indeterminate is **derived only** — never a third persistent selection value. Activating the parent selects or clears enabled children.

## Layout

| `orientation` | Behavior |
|---------------|----------|
| `vertical` (default) | Stacked list |
| `horizontal` | Row when labels stay short |
| `responsive` | Horizontal when space allows; stacks on compact |

Long labels force stacking on compact widths so accessibility does not suffer.

## Guidance

| Do | Don’t |
|----|--------|
| Group with spacing and hierarchy | Wrap the set in heavy cards / boxes |
| Keep every checkbox keyboard-accessible | Trap focus inside the group |
| Disable individual items when needed | Replace checkboxes with a single multi-value control for unrelated choices |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/CheckboxGroup.tsx`, `styles/checkbox-group.css` (+ Checkbox) |
| `vite-express-tauri` | `src/components/ui/CheckboxGroup.tsx`, `src/styles/checkbox-group.css` (+ Checkbox) |
