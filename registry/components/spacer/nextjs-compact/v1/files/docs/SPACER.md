# Spacer

**Package:** `spacer` · **Layer:** 1 Foundation · **ID:** 15  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Tokenized whitespace so developers never insert empty margins or arbitrary pixel gaps. Integrates with Stack, Flex, Grid, and Container.

## Install

```bash
devkit add responsive-spacing spacer
```

```css
@import "./responsive-spacing.css";
@import "./spacer-system.css";
```

## API

```tsx
import {
  Spacer,
  SpacerSection, SpacerCard, SpacerForm, SpacerHero,
  SpacerTiny, SpacerSmall, SpacerMedium, SpacerLarge, SpacerXL,
  FlexGrowSpacer,
} from "./Spacer";

{/* Fixed vertical token gap */}
<Spacer preset="section" />
<SpacerSection />

{/* Horizontal gap in a row */}
<Spacer axis="x" preset="card" />

{/* Flex grow — push siblings apart */}
<Spacer />           {/* axis="auto" */}
<FlexGrowSpacer />

{/* Adaptive to parent Stack/Flex direction */}
<Spacer axis="adaptive" preset="medium" />

{/* Responsive size */}
<Spacer preset={{ base: "small", md: "large", lg: "section" }} />

{/* Safe area · keyboard */}
<Spacer safeArea="bottom" preset="nav" />
<Spacer keyboard />

{/* Invisible separator */}
<Spacer preset="medium" separator />
```

## Presets

| Preset | Token |
|--------|--------|
| `tiny` | `--spacer-size-tiny` |
| `small` | `--spacer-size-small` |
| `medium` | `--spacer-size-medium` |
| `large` | `--spacer-size-large` |
| `xl` | `--spacer-size-xl` |
| `section` | `--space-section-gap` |
| `card` | `--space-card-gap` |
| `form` | `--space-form-gap` |
| `modal` | `--space-modal-gap` |
| `nav` | `--space-nav-gap` |
| `hero` | `--space-section-y` |
| `responsive` | small → medium → large by breakpoint |

Also: `stack`, `inline`, `page`, and scale `space={0|1|2|…|24}`.

## Modes

- **Fixed** — `axis="x"|"y"` + preset/space
- **Proportional** — `grow` or `proportion="8%"`
- **Adaptive** — `axis="adaptive"` follows parent flex/stack direction
- **Safe area** — `safeArea="top"|"bottom"|"x"|"y"|…`
- **Keyboard** — `keyboard` uses `env(keyboard-inset-height)`
- **Separator** — `separator` draws a hairline through the gap
- **Motion** — size/flex transitions (honors reduced motion)

## Legacy

`axis` + `size="…"` still sets `--spacer-size` for back-compat with the grid companion API.

## Debug

Add `data-spacer-debug` on an ancestor to tint spacers while tuning layout.
