# Button Group

**ID 091** — Action & Control Compositions.

Clusters related text/icon actions into one coherent visual group. Compose DevKit **Button** (and Icon Button when needed). Do **not** recreate button styling.

Distinct from Interaction Controls **003 Button Group** (`button-group`) — this composition entry emphasizes density, mobile wrap/stack, and guidance toward Action Group / Overflow for large sets.

## Rules

- Each button keeps its own semantics, focus, and `disabled` state.
- Do not merge children into one control.
- Do not disable the whole group because one action is unavailable.
- Keyboard: tab to each button independently.
- For **4+** actions, prefer **Action Group** or **Overflow Action**.
- Ordinary actions: **wrap** or **stack** — do not force horizontal scrolling.

## API

| Prop | Values | Default |
|------|--------|---------|
| `label` | string (required) | — |
| `orientation` | `horizontal` · `vertical` | `horizontal` |
| `density` | `compact` · `standard` | `standard` |
| `separation` | `joined` · `separated` | `joined` |
| `overflow` | `wrap` · `stack` | `wrap` |
| `equalWidth` | boolean | `false` |

```tsx
import { ActionButtonGroup } from "@/components/ui/ActionButtonGroup";
import { Button } from "@/components/ui/Button";

<ActionButtonGroup label="Document actions" density="standard">
  <Button variant="secondary">Cancel</Button>
  <Button variant="primary">Save</Button>
</ActionButtonGroup>
```

Primary vs secondary hierarchy comes from each Button’s `variant` — not from the group.

## Themes

Light · Dark · High Contrast · RTL (logical properties).
