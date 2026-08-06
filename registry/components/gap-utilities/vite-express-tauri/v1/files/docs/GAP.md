# Gap System

DevKit Layer 1 foundation (`gap-utilities`, id **23**).

Spacing **between** children — Grid, Stack, Flex, Nav, Forms, Tables, Toolbars, Cards, Lists. Semantic tokens only; no manual margins between siblings.

## Install

```bash
npx @roboticela/devkit add gap-utilities
```

```ts
import "@/styles/responsive-spacing.css";
import "@/styles/gap-system.css";
import { Gap, GapStack, gapClassName } from "@/components/ui/Gap";
```

## Presets

`none` · `compact` · `comfortable` · `spacious` · `stack` · `inline` · `grid` / `grid-tight` / `grid-loose` · `form` · `nav` · `toolbar` · `card` · `list` · `table` · `section` · `responsive`

## Quick start

```tsx
<Gap preset="stack">
  <Item /><Item />
</Gap>

<Gap preset="toolbar" divider="x">
  <Btn /><Btn />
</Gap>

<Gap gap={{ base: 2, md: 4, lg: 6 }} gapX="3" gapY="4" motion />
<Gap nested inherit={false}>…</Gap>
```

## Nested inheritance

Parent sets `--dk-gap`. Children with `nested` dampen by 75%; `inherit` copies parent gap vars.

## Dividers

`divider="y"` | `"x"` inserts border + padding between siblings (optional `strong`).

## Density

`data-density` retargets `--gap-*` and `--dk-gap-scale` for compact / spacious.

## Integration

Classes: `.dk-stack-gap`, `.dk-grid-gap-token`, `.dk-toolbar-gap`, `.dk-form-gap`, `.dk-card-gap`, `.dk-list-gap`. Bridges `--stack-gap`, `--inline-gap`, `--flex-gap`.
