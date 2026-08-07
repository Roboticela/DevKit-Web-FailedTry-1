# Divider

Subtle structural separation between related content groups. Not decorative — use only when spacing alone cannot communicate grouping.

## Orientation

| `orientation` | Use |
|---------------|-----|
| `horizontal` (default) | Between stacked sections |
| `vertical` | Between side-by-side regions |

Vertical dividers use `align-self: stretch` — place them in a flex row so they grow with neighboring content. Do **not** set a fixed height.

## Variants

| `variant` | Behavior |
|-----------|----------|
| `full` | Edge to edge (default) |
| `inset` | Indented from both inline (or block, when vertical) edges |
| `section` | Full span with larger section spacing |
| `content` | Content-aligned inset matching typical content padding |

## Semantics

```tsx
{/* Decorative (default) — hidden from AT */}
<Divider />

{/* Meaningful section boundary */}
<Divider semantic aria-label="Account details" />
```

Do not insert dividers automatically between every component.

## Themes

Uses `--color-border-subtle` — quiet contrast. High Contrast thickens the rule and uses `CanvasText` for sufficient separation.

Supports mobile / tablet / desktop and RTL (logical margins).
