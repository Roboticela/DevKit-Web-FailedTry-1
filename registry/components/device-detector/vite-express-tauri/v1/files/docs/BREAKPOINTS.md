# Breakpoint Manager

DevKit Layer 1 foundation (`device-detector`, id **98**).

Centralized responsive engine for the design system. **Semantic breakpoints** (`xs` → `3xl`) — not device product names. Every layout component should read from this manager instead of inventing its own `matchMedia` / pixel thresholds.

## Install

```bash
npx @roboticela/devkit add device-detector
```

```ts
import "@/styles/breakpoint-system.css";
import {
  BreakpointProvider,
  BreakpointScript,
  useBreakpoint,
  mq,
} from "@/components/ui/BreakpointManager";
```

## Semantic scale

| Token | Min width | Legacy alias |
|-------|-----------|--------------|
| `xs` | 0 | phone |
| `sm` | 480 | phablet |
| `md` | 768 | tablet |
| `lg` | 1024 | laptop |
| `xl` | 1280 | desktop |
| `2xl` | 1440 | ultrawide |
| `3xl` | 1680 | ultrawide-xl |

CSS variables: `--bp-xs` … `--bp-3xl` (plus legacy `--bp-tablet`, etc.).

## App setup (SSR-safe)

```tsx
// app/layout.tsx (Next) — before interactive UI
<html>
  <head>
    <BreakpointScript ssrBreakpoint="md" />
  </head>
  <body>
    <BreakpointProvider ssrBreakpoint="md" syncDocument syncCssVars>
      {children}
    </BreakpointProvider>
  </body>
</html>
```

`BreakpointScript` sets `data-bp` before paint. Provider hydrates, syncs document attributes, and keeps `--bp-width` / `--bp-current` live.

## Hooks

```tsx
const bp = useBreakpoint(); // "md"
const snap = useBreakpointSnapshot();
const wide = useBreakpointMatch("lg", "up");
const cols = useBreakpointValue({ xs: 1, md: 2, lg: 3 });

const landscape = useOrientation() === "landscape";
const fine = usePointer() === "fine";
const canHover = useHoverCapability() === "hover";
const touch = useTouch();
const { dense, dpr } = useDensity();
const fold = useFoldable();
const reduceMotion = usePrefersReducedMotion();
const reduceFx = usePrefersReducedTransparency();

const mqOk = useMediaQuery(mq.between("sm", "lg"));
const inPanel = useContainerQuery(ref, { from: "md" });

useLayoutRecalc(() => recalculateMasonry());
useBreakpointEvent((next, prev) => {
  if (prev && next.breakpoint !== prev.breakpoint) analytics.track("bp", next.breakpoint);
});
```

## Utilities & events

```ts
import {
  mq,
  resolveBreakpoint,
  matchesBreakpoint,
  getBreakpointSnapshot,
  subscribeBreakpoints,
  scheduleLayoutRecalc,
  BREAKPOINT_EVENT,
} from "@/components/ui/BreakpointManager";

window.matchMedia(mq.up("lg"));
window.addEventListener(BREAKPOINT_EVENT, (e) => { /* detail.snapshot */ });
scheduleLayoutRecalc(() => layout.invalidate());
```

Document attributes (when `syncDocument`):  
`data-bp`, `data-orientation`, `data-pointer`, `data-hover`, `data-touch`, `data-density`, `data-fold`, `data-transparency`, `data-contrast`.

During resize bursts: `data-bp-resizing="true"` — use `.dk-bp-recalc-quiet` to pause transitions.

## Components

```tsx
<BreakpointMatch above="md">Desktop chrome</BreakpointMatch>
<BreakpointMatch only="sm" fallback={<MobileNav />}>
  Compact nav
</BreakpointMatch>

<DeviceDetector>
  {/* mirrors snapshot onto data-* for scoped CSS */}
</DeviceDetector>
```

## CSS helpers

- Viewport: `.dk-mq-from-md`, `.dk-mq-landscape`, `.dk-mq-pointer-fine`, `.dk-mq-hover`, `.dk-mq-reduced-motion`, `.dk-mq-foldable`, …
- Synced: `.dk-bp-from-md`, `.dk-bp-only-lg` (needs Provider)
- Container: wrap with `.dk-cq`, children `.dk-cq-from-md`

## Design-system rule

Do **not** hardcode `768px` / `matchMedia` inside components. Import `mq`, `BREAKPOINTS`, or hooks from this package so spacing, grid, visibility, and surfaces stay aligned.
