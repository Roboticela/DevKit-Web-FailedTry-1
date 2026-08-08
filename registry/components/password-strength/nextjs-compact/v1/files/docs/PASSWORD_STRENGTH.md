# Password Strength

Password quality meter for auth forms. Composes **Progress Bar** and **Badge** — do not invent a custom meter or status chip.

## Purpose

Show live password quality while typing, with optional feedback and recommendations. Use inside Password Input via `strengthSlot`, or beside any password field.

## Composition

| Primitive | Role |
|-----------|------|
| Progress Bar | Determinate score (0–100) or indeterminate while `loading` |
| Badge (`icon-label`) | Level status + security icon |
| Slots | `icon`, `badgeSlot`, `progressSlot`, `feedbackSlot`, `recommendationsSlot` |

## Levels

`empty` → `weak` → `fair` → `good` → `strong`

Mapped to Progress Bar / Badge tones (`neutral` / `negative` / `warning` / `informational` / `positive`).

## Algorithm

Default: `defaultPasswordStrengthAlgorithm` (length + character classes).

Override with `algorithm={(password) => result}` or pass a controlled `result`.

## Variants

| Variant | Layout |
|---------|--------|
| `stacked` | Badge, bar, feedback (default) |
| `compact` | Dense spacing, less copy |
| `inline` | Badge + bar on one row (stacks on narrow) |
| `detailed` | Includes recommendations |
| `meter` | Bar first, badge second |

## Accessibility

- Progress Bar provides the meter semantics
- Badge carries an accessible status name
- Feedback region uses `aria-live="polite"` for typing updates
- Recommendations list is labeled

## Anti-patterns

- Do not draw a custom progress track or status pill
- Do not use color alone for strength — keep Badge label + icon
- Do not block password submission solely on client strength scores

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/PasswordStrength.tsx`, `styles/password-strength.css` (+ Progress Bar, Badge) |
| `vite-express-tauri` | `src/components/ui/PasswordStrength.tsx`, `src/styles/password-strength.css` (+ Progress Bar, Badge) |
