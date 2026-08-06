# Alignment System

DevKit Layer 1 foundation (`alignment-utilities`, id **27**).

Align any component in any layout — logical **start/end** (RTL-safe), distribution, self/content/place, responsive overrides.

## Install

```bash
npx @roboticela/devkit add alignment-utilities
```

```ts
import "@/styles/alignment-system.css";
import { Align, AlignCenter, alignClassName } from "@/components/ui/Align";
```

## Presets

`start` · `center` · `end` · `stretch` · `between` · `around` · `evenly` · `baseline` · `safe` · `adaptive`

## Quick start

```tsx
<Align preset="center">…</Align>
<Align preset="between" display="row">Nav · Actions</Align>
<Align items="baseline" justify="start" />
<Align self="center" /> {/* self-alignment on child */}
<Align items={{ base: "center", md: "stretch" }} justify={{ base: "center", md: "between" }} />
<Align preset="safe" motion />
```

## Axes

| Prop | CSS |
|------|-----|
| `items` | align-items (cross-axis) |
| `justify` / `distribute` | justify-content (main-axis) |
| `content` | align-content (multi-line) |
| `self` | align-self |
| `place` | place-items |
| `text` | text-align (logical) |

## Nested · a11y · RTL

- `nested` resets child self-alignment + `min-size: 0`
- Prefer `safe` / `safe center` so overflow stays visible
- Use `start`/`end` — never physical left/right

## Integration

Works on Flex, Stack, Grid hosts, or wrap with `display="row|col|grid"`. Use `alignClassName({ preset: "between", display: false })` on existing layout components.
