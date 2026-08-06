# Safe Area

**Package:** `safe-area` · **Layer:** 1 Foundation · **ID:** 19  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Automatically respects device constraints — Dynamic Island, notches, home indicators, fold hinges, desktop titlebars, browser chrome, keyboards, and embedded webviews.

## Install

```bash
devkit add safe-area
```

```css
@import "./safe-area-system.css";
```

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

`viewport-fit=cover` is required for `env(safe-area-inset-*)` to be non-zero on notched devices.

## API

```tsx
import {
  SafeArea,
  SafeAreaProvider,
  useSafeArea,
  useSafeAreaInsets,
  getSafeAreaInsets,
  SafeAreaBottomBar,
  SafeAreaFab,
} from "./SafeArea";

<SafeAreaProvider>
  <SafeArea edges="all">…</SafeArea>
  <SafeArea edges="y" mode="nav">…</SafeArea>
  <SafeArea top bottom={false} left right mode="fab" />
  <SafeArea mode="keyboard" min={{ bottom: "4rem" }} />
  <SafeArea fold mode="immersive" />
</SafeAreaProvider>

function Hud() {
  const { top, bottom, keyboard, orientation, refresh } = useSafeArea();
  return <span>{top} / {bottom} · kb {keyboard} · {orientation}</span>;
}
```

## Edges

| Value | Pads |
|-------|------|
| `all` (default) | top + right + bottom + left |
| `x` / `y` | horizontal / vertical |
| `top` `bottom` `left` `right` | single edge |
| `["top","bottom"]` | list |
| `top={8}` etc. | enable + extra offset |

## Modes

| Mode | Behavior |
|------|----------|
| `immersive` | Edge padding only — no extra chrome |
| `fullscreen` | + titlebar inset, min 100dvh |
| `nav` | Extra bottom for tab bar |
| `fab` | Extra bottom/right for FAB |
| `panel` | Gutter around floating panel |
| `keyboard` | Bottom includes visualViewport keyboard inset |

## Hooks

- `useSafeArea()` — live insets + `keyboard` + `orientation` + `refresh`
- `useSafeAreaInsets()` — insets only
- `getSafeAreaInsets()` — one-shot snapshot (SSR-safe zeros)

`SafeAreaProvider` syncs `--safe-measured-*` and `--safe-keyboard` on `:root` and updates on resize / orientation / visualViewport.

## Helpers

- `SafeAreaTopBar` / `SafeAreaBottomBar` — fixed chrome
- `SafeAreaFab` — FAB anchor
- `nested` — skip double device insets
- `fold` — include hinge env when present
- `data-safe-debug` on an ancestor — outline safe regions

## Legacy

`<SafeArea edges="all|x|y|top|bottom">` remains supported.
