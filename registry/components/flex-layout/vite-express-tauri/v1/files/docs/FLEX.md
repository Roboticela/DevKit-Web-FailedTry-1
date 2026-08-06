# Flex Layout

**Package:** `flex-layout` · **Layer:** 1 Foundation · **ID:** 12  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Advanced Flexbox without raw CSS in application code. Directions, grow/shrink/basis, order, alignment, constraints, overflow, adaptive gaps, and semantic presets for common UI patterns.

## Install

```bash
devkit add responsive-spacing flex-layout
```

```css
@import "./responsive-spacing.css";
@import "./flex-system.css";
```

## API

```tsx
import {
  Flex, FlexItem, FlexSpacer,
  FlexNavbar, FlexToolbar, FlexFormRow, FlexActionGroup,
  FlexProfileHeader, FlexCardFooter, FlexFilterBar,
  FlexStatsRow, FlexDashboardSummary, FlexButtonGroup,
} from "./FlexLayout";

<Flex direction="row" align="center" justify="between" gap="comfortable">
  <FlexItem>Left</FlexItem>
  <FlexSpacer />
  <FlexItem shrink={false}>Right</FlexItem>
</Flex>

{/* Responsive */}
<Flex
  direction={{ base: "column", md: "row" }}
  gap={{ base: "compact", lg: "spacious" }}
  align={{ base: "stretch", md: "center" }}
  wrap
>
  …
</Flex>

{/* Preset */}
<FlexNavbar>
  <FlexItem>Brand</FlexItem>
  <FlexItem>Actions</FlexItem>
</FlexNavbar>

<FlexProfileHeader>
  <FlexItem flexRole="avatar">…</FlexItem>
  <FlexItem flexRole="identity">…</FlexItem>
  <FlexItem flexRole="actions">…</FlexItem>
</FlexProfileHeader>
```

## Presets

| Preset | Use |
|--------|-----|
| `navbar` | Brand left · actions right |
| `toolbar` | Compact control row |
| `form-row` | Label + control (stacks → row at md) |
| `dashboard-summary` | Equal metric tiles |
| `action-group` | Primary / secondary actions |
| `profile-header` | Avatar · identity · actions |
| `card-footer` | Meta · actions |
| `filter-bar` | Filters · trailing actions |
| `stats-row` | Evenly spaced metrics |
| `button-group` | Column → row button set |

## FlexItem

`grow` · `shrink` · `basis` · `order` · `align` · `flex` · `minWidth` / `maxWidth` · `minHeight` / `maxHeight` · `overflow` · `intrinsic` · `flexRole`

## Features

- Token gaps + density adaptation
- Responsive direction / wrap / align / justify / gap
- Equal distribution (`equal`)
- Nested flex rhythm
- Motion-aware resizing (honors reduced motion)
- Overflow handling on container and items
- Semantic `as` + preset `data-flex-role` hooks
