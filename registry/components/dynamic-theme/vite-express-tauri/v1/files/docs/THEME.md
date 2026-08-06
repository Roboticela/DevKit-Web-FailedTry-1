# Theme Engine

**Package:** `dynamic-theme` · **Layer:** 1 Foundation · **ID:** 34  
**Group:** Theme Engine  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Runtime theme orchestration for Light, Dark, High Contrast, High Contrast Dark, system preference, and custom themes. Switches color tokens (via `data-theme`), elevation, blur/materials, motion, and light typography adjustments — instantly, without layout shift.

## Install

```bash
devkit add color-tokens dynamic-theme light-theme dark-theme high-contrast-theme
# optional companions:
devkit add elevation-tokens motion-tokens blur-tokens gradient-tokens
```

```css
@import "./color-tokens.css";
@import "./theme-engine.css";
@import "./light-theme.css";
@import "./dark-theme.css";
@import "./high-contrast-theme.css";
```

```tsx
import { ThemeProvider, ThemeScript, useTheme } from "@/components/ui/ThemeProvider";
```

Put `<ThemeScript />` in `<head>` (or the inline init string) to avoid FOUC.

## Modes

| Preference | Applied `data-theme` | Notes |
|------------|----------------------|--------|
| `system` | `light` or `dark` | follows `prefers-color-scheme` |
| `light` | `light` | soft layered neutrals |
| `dark` | `dark` + `.dark` | deep surfaces |
| `high-contrast` | `high-contrast` + `data-contrast` | stronger borders; blur off |
| `high-contrast-dark` | `high-contrast-dark` + `.dark` | HC dark |
| custom id | your id | register via `registerTheme` / `themes` prop |

## API

```tsx
<ThemeProvider defaultTheme="system" storageKey="devkit-theme">
  <App />
</ThemeProvider>

const { theme, resolvedTheme, setTheme, setVars, registerTheme } = useTheme();

setTheme("dark");
setVars({ "--color-primary": "#0a84ff" }); // runtime accent — no remount
registerTheme({
  id: "midnight",
  colorScheme: "dark",
  vars: { "--color-bg-base": "#0b1020", "--color-primary": "#7aa2ff" },
});
setTheme("midnight");
```

## Engine tokens

- **Elevation** — `.dk-elev-0`…`.dk-elev-4` (surface hierarchy; `--elevation-*-shadow` defaults to `none`)
- **Motion** — `--motion-duration-*`, `--motion-ease-*`; `data-motion="reduce"` or `prefers-reduced-motion`
- **Blur** — `.dk-material`, `.dk-blur-*` (disabled in high contrast)
- **Gradient slots** — `--gradient-*` default `none` (custom themes only)
- **Transitions** — `.dk-theme-transition`; engine sets `data-theme-transition="none"` during swaps

## Persistence & performance

- Preference stored in `localStorage` (`devkit-theme` by default)
- Theme swaps toggle attributes/classes only — CSS variables resolve instantly
- Transitions briefly disabled on change to prevent flash and layout thrash
