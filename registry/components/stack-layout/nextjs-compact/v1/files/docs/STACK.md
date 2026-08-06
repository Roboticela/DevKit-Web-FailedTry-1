# Stack Layout

**Package:** `stack-layout` · **Layer:** 1 Foundation · **ID:** 13  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Preferred layout primitive for arranging children with consistent token spacing. Replaces manual margins. Supports vertical, horizontal, and inline stacks with responsive direction, gap, and alignment.

## Install

```bash
devkit add responsive-spacing stack-layout
```

```css
@import "./responsive-spacing.css";
@import "./stack-system.css";
```

## API

```tsx
import { Stack, HStack, VStack, InlineStack, StackLayout } from "./StackLayout";

<VStack gap="comfortable">
  <Title>…</Title>
  <BodyText>…</BodyText>
</VStack>

<HStack gap="compact" align="center" justify="between">
  <Label>…</Label>
  <Button>…</Button>
</HStack>

<InlineStack gap="sm">
  <Chip />
  <Chip />
</InlineStack>

{/* Responsive: column on phone → row on tablet */}
<Stack
  direction={{ base: "vertical", md: "horizontal" }}
  gap={{ base: "compact", md: "comfortable", lg: "spacious" }}
  align={{ base: "stretch", md: "center" }}
  separator
>
  …
</Stack>
```

## Spacing

| `gap` | Token |
|-------|--------|
| `none` | 0 |
| `compact` / `xs` / `sm` | tight |
| `comfortable` / `md` / `equal` | default stack gap |
| `spacious` / `lg`–`2xl` | open |
| `responsive` | compact → comfortable → spacious by breakpoint |
| `0`–`12` | `--space-*` scale |
| CSS length | sets `--stack-gap` directly (legacy `gap="var(--space-stack-gap)"`) |

Density (`data-density`) scales compact / comfortable / spacious automatically.

## Features

- **Direction** — `vertical` / `horizontal` (+ `column` / `row` aliases), `inline`, `reverse`, `wrap`
- **Align** — start, center, end, stretch, baseline
- **Justify** — start, center, end, between, around, evenly, stretch
- **Separators** — `separator` / `separator="strong"` or custom node; `divided` for border-between
- **Nested** — `nested` tightens gap one step
- **Collapse empty** — skips null / hidden / `[data-empty]` children (default on)
- **Motion** — enter animation + stagger; honors `prefers-reduced-motion` / `data-motion`
- **Lazy** — `content-visibility: auto` on items
- **Virtual** — windowed rendering for long stacks (`virtual={{ itemSize, height, overscan }}`)
- **Keyboard** — `keyboardNav` enables arrow / Home / End focus movement
- **Semantics** — `as="ul|ol|section|nav|…"` with listitem roles when applicable

## Aliases

`Stack` ≡ `StackLayout` · `VStack` · `HStack` · `InlineStack`
