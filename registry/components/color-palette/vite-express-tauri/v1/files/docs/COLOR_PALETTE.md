# Color Palette

Selectable color swatch radiogroup for accents and brand colors.

## Purpose
Let users pick a color from a curated palette with clear selection and focus states.

## Accessibility
- `role="radiogroup"` / `role="radio"`
- Each swatch has an accessible `aria-label`
- Selection uses outline + border — not color alone

## Anti-patterns
- Do not use for continuous color picking (use a dedicated picker).
- Do not omit labels — at least `aria-label` / `title` is required.
