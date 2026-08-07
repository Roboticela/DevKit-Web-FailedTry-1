# Segmented Control

**ID 094** — Action & Control Compositions.

Small set of mutually exclusive choices (practical range **2–5**).

Examples: Day | Week | Month · List | Grid · Small | Medium | Large

Distinct from Interaction **008 Segmented Control**: composition default for narrow layouts is **`wrap`** (adapt), not forced scroll. Never auto-converts to a dropdown.

For larger sets use Select, List, Tabs, or another primitive.

## Selection

Single selection via `role="radiogroup"` / `role="radio"`.

Selected state uses **fill + border + heavier weight** — not color alone.

## API

| Prop | Notes |
|------|--------|
| `label` | Required group name |
| `options` | `{ id, label, icon?, disabled?, iconOnly? }[]` |
| `overflow` | `wrap` (default) · `stack` · `scroll` (opt-in) |
| `equalWidth` | Default `true` |
| `size` | `sm` · `md` · `lg` |

Icons are optional and must carry clear meaning. Prefer text when localization or recognition is unclear.

## Keyboard

Arrow keys move selection (RTL-aware). Home / End. Roving `tabIndex` on the selected segment.

## Themes

Light · Dark · High Contrast · RTL · `prefers-reduced-motion`.
