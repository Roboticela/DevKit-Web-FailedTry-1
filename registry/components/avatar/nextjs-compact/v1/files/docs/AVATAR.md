# Avatar

Person or entity face with optional presence status.

## Purpose
Identify a user/org visually with image, initials, or placeholder.

## Variants
- size: 24–64
- shape: `circle` | `rounded` | `square`
- status: online | offline | away | busy | dnd | unknown

## Composition
Pass `badge` slot to overlay the registry `Badge` component.

## Accessibility
`label` is required. Status is included in the accessible name when present.

## Anti-patterns
- Do not use color alone for status without the accessible name.
- Do not nest interactive controls inside an interactive avatar.
