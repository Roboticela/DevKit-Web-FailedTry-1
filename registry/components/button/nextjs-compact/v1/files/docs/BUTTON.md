# Button (001)

Foundational generic action control for DevKit. Part of **Interaction Controls** under Foundations & Interface Primitives.

Use **Icon Button (002)** for icon-only actions. `Button` always requires a visible text label.

## Anatomy

1. Hit target (invisible ≥44×44)
2. Content row: optional leading icon · label · optional trailing icon
3. Loading overlay (spinner) when `loading`

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `size` | `xs` \| `sm` \| `md` \| `lg` \| `xl` | `md` | Heights 28 / 32 / 40 / 48 / 56 |
| `variant` | `primary` \| `secondary` \| `tertiary` \| `destructive` \| `success` \| `quiet` \| `inverse` | `primary` | Hierarchy via fill + border + weight |
| `leadingIcon` | `ReactNode` | — | Action/category; ~18–20px |
| `trailingIcon` | `ReactNode` | — | Navigation/expansion |
| `loading` | `boolean` | `false` | Preserves dimensions; disables press |
| `loadingLabel` | `string` | derived | Screen-reader name while loading |
| `fullWidth` | `boolean` | `false` | Stretch to container |
| `children` | `ReactNode` | required | Visible label |
| `disabled` | `boolean` | `false` | |

Native `button` attributes (`type`, `onClick`, `aria-*`, etc.) are forwarded.

## Variants

- **primary** — strongest emphasis (filled accent)
- **secondary** — subordinate (surface + border)
- **tertiary** — lightweight (text treatment)
- **destructive** — risk via tinted surface + border (not loud by default; solid on hover)
- **success** — positive confirmation (tinted)
- **quiet** — muted ghost
- **inverse** — for contrasting surfaces

## States

`default` · `hover` · `focus-visible` · `pressed` (`:active`) · `disabled` · `loading`

## Behavior

- Keyboard: native `Enter` / `Space` activation
- Touch: expanded hit area to ≥44×44 without changing visual size
- Loading: label/icons stay in layout (`opacity: 0`) with centered spinner
- RTL: logical padding; icon slots follow DOM order
- Reduced motion: no press scale; spinner becomes static
- Compact widths: label may wrap; height grows from min-height
- Long labels: ellipsis on wider viewports; wrap on compact

## Tokens used

`--control-height-*`, `--space-*`, `--radius-*`, `--color-accent-*`, `--color-error-*`, `--color-success-*`, `--color-text-*`, `--color-surface-*`, `--color-border-*`, `--font-size-*`, `--weight-*`, `--duration-*`, `--ease-standard`, `--touch-target-min`, `--focus-ring-*`, `--icon-*`

## Install paths

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Button.tsx`, `styles/button.css` |
| `vite-express-tauri` | `src/components/ui/Button.tsx`, `src/styles/button.css` |

Import the CSS once in the app entry / layout.
