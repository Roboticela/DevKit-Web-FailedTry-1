# Responsive Margin System

DevKit Layer 1 foundation (`margin-utilities`, id **21**).

Eliminates hardcoded margins. Every margin is a **semantic token** or **scale step** from `responsive-spacing`, adapted by breakpoint and density.

## Install

```bash
npx @roboticela/devkit add margin-utilities
```

```ts
import "@/styles/responsive-spacing.css";
import "@/styles/margin-system.css";
import { Margin, MarginSection, marginClassName } from "@/components/ui/Margin";
```

## Principles

1. Prefer **presets** (`section`, `card`, `form`, …) over raw scales
2. Use **logical** props: `ms` / `me` / `mt` / `mb` (RTL-safe)
3. Never pass pixel strings — use scale `0–24` or `"auto"`
4. Nest inside Container/Section with `nested` to avoid double page margins
5. In flex/grid, use `collapse` or `flow` so adjacent margins do not double

## Quick start

```tsx
<Margin preset="page" safe="page-x">
  <Margin flow="section">
    <Margin preset="section-gap">Hero</Margin>
    <Margin preset="card">Card block</Margin>
  </Margin>
</Margin>

<Margin mt={{ base: 4, md: 8, lg: 12 }} ms="auto" motion>
  Responsive + RTL-aware
</Margin>
```

## Density

Inherits `data-density` from `DensityProvider` via `--margin-*` → `--space-*` bridges.

## Breakpoints

Mobile-first: `dk-md:mt-8`, `dk-lg:mx-auto` (`sm` 480 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1440).

## Integration

Grid, Flex, Stack, Container, Cards, Modals, Forms, Tables share `--space-*` / `--margin-*` tokens (`.dk-m-gutter`, `.dk-m-stack-flow`, `.dk-margin-collapse`).
