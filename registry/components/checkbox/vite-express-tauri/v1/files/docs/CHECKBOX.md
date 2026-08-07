# Checkbox (021)

Independent **boolean** choice, or one item in a multi-selection set.

Prefer a **Switch** when the choice is an immediate on/off system setting.

## Value model

| State | Meaning |
|-------|---------|
| Unchecked | Not selected |
| Checked | Selected |
| Indeterminate | Derived / partial selection (e.g. parent of mixed children) |

**Indeterminate is not user-selectable.** Space or click resolves it toward checked (platform convention).

## Guidance

| Do | Don’t |
|----|--------|
| Make the label clickable | Rely on the tiny box alone as the hit target |
| Align the box to the first line of long labels | Vertically center against a multiline block |
| Use a distinct dash for indeterminate | Treat indeterminate as a third toggle value |
| Keep selection feedback immediate and restrained | Animate the checkmark excessively |

## Features

- Visual box **20px at MD** (sizes XS–XL); hit area **≥44×44**
- `label`, `description`, `errorMessage`, `required`, `optional`
- Controlled `checked` / `indeterminate` + `onCheckedChange`
- Keyboard: **Space** toggles
- Screen reader: checked · unchecked · mixed · disabled · required · invalid
- Light / Dark / High Contrast / RTL / reduced motion

## States

unchecked · checked · indeterminate · disabled (each) · focus · hover · pressed · error

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Checkbox.tsx`, `styles/checkbox.css` |
| `vite-express-tauri` | `src/components/ui/Checkbox.tsx`, `src/styles/checkbox.css` |
