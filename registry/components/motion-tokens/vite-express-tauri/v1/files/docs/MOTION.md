# Motion System

**Package:** `motion-tokens` · **Layer:** 1 Foundation · **ID:** 38  
**Group:** Theme Engine  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Apple-inspired purposeful motion — natural, interruptible, compositor-friendly (`transform` + `opacity`). Reinforces understanding for pages, hover, press, modals, drawers, dropdowns, tooltips, loading, drag, reorder, notifications, skeletons, and success feedback.

## Install

```bash
devkit add color-tokens dynamic-theme motion-tokens
```

```css
@import "./theme-engine.css";
@import "./motion-system.css";
```

## Tokens

`--motion-duration-*`, `--motion-ease-*`, `--motion-distance-*`, `--motion-stagger*`

Honor `prefers-reduced-motion`, `data-motion="reduce"`, or force with `data-motion="full"`.

## API

```tsx
<Motion preset="modal" in={open}>…</Motion>
<MotionStagger>
  <div>One</div>
  <div>Two</div>
</MotionStagger>

<button className="dk-press dk-press-highlight">Press</button>
<div className="dk-skeleton dk-skeleton-text" />
<span className="dk-spinner" />

const reduced = useReducedMotion();
useMotionPreference("system");
```

## Presets

`fade`, `scale`, `slide-up/down/left/right`, `page`, `modal`, `drawer`, `sheet`, `dropdown`, `tooltip`, `notify`, `success`

## Companions (61–70)

`fade-animation`, `scale-animation`, `slide-animation`, `page-transition`, `loading-transition`, `hover-animation`, `press-animation`, `ripple-alternative`, `drag-animation`, `skeleton-animation`
