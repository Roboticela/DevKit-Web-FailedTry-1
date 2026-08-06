# Overflow Manager

DevKit Layer 1 foundation (`overflow-utilities`, id **30**).

Handles content overflow — scroll, clip, fade edges, virtual lists, sync, lazy load, and pull-to-refresh.

## Install

```bash
npx @roboticela/devkit add overflow-utilities
```

```ts
import "@/styles/overflow-system.css";
import {
  Overflow,
  useOverflowDetection,
  useScrollSync,
} from "@/components/ui/Overflow";
```

## Quick start

```tsx
<Overflow axis="y" fade scrollbar momentum focusable style={{ maxHeight: 240 }}>
  …long content…
</Overflow>

<Overflow
  virtual={{ itemSize: 44, height: 320, overscan: 6 }}
  onEndReached={() => loadMore()}
>
  {rows.map((r) => (
    <div key={r.id}>{r.label}</div>
  ))}
</Overflow>

<Overflow syncId="tables" preserveScrollKey="inbox">…</Overflow>
```

## Modes & axes

`mode`: `auto` · `hidden` · `clip` · `scroll` · `visible`  
`axis`: `x` · `y` · `both`

## Features

| Feature | API |
|---------|-----|
| Fade edges | `fade` / `fade="edges"` |
| Custom scrollbar | `scrollbar` / `scrollbar="hidden"` |
| Momentum + overscroll | `momentum` · `overscroll` |
| Nested containment | `nested` |
| Virtual scroll | `virtual={{ itemSize, height, overscan }}` |
| Lazy load | `onEndReached` |
| Preserve scroll | `preserveScrollKey` |
| Sync containers | `syncId` |
| Pull to refresh | `pullToRefresh` + `onRefresh` |
| Keyboard | `focusable` (arrows / page / home / end) |

## Hooks

```ts
const state = useOverflowDetection(ref);
const pos = useScrollPosition(ref);
useScrollSync("channel", ref);
usePreservedScroll("key", ref);
measureOverflow(el);
```
