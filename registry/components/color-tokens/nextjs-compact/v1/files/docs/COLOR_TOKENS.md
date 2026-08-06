# Color Token System

**Package:** `color-tokens` · **Layer:** 1 Foundation · **ID:** 1  
**Themes:** Light · Dark · High Contrast · High Contrast Dark  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Semantic color foundation for every DevKit component. Inspired by Apple Human Interface Guidelines: calm, elegant, premium, accessible. Components must consume these CSS variables — never hardcode hex values.

## Install

```bash
devkit add color-tokens
```

Import once in the global stylesheet:

```css
/* Next.js — styles/ or app/globals.css */
@import "./color-tokens.css";
/* Optional Tailwind v4 bridge */
@import "./color-tokens.tailwind.css";
```

```css
/* Vite — src/index.css */
@import "./styles/color-tokens.css";
```

## Naming convention

```
--color-{domain}-{role}[-state]
```

| Segment | Examples |
|---------|----------|
| domain | `bg`, `surface`, `text`, `icon`, `primary`, `danger`, `ai`, `chart` |
| role | `base`, `card`, `secondary`, `muted`, `ring` |
| state | `hover`, `pressed`, `disabled` (when needed) |

Examples: `--color-text-secondary`, `--color-primary-hover`, `--color-surface-card`.

## Themes

| Mode | Activation |
|------|------------|
| Light (default) | `:root` or `data-theme="light"` |
| Dark | `data-theme="dark"` or class `.dark` |
| High contrast | `data-theme="high-contrast"` or `data-contrast="high"` |
| High contrast dark | `data-theme="high-contrast-dark"` |

```html
<html data-theme="dark">
```

Theme switches animate via `--theme-duration` / `--theme-ease` on `html`/`body`. Add class `dk-theme-transition` on surfaces that should animate. Respects `prefers-reduced-motion`.

Future custom themes: define the same token names under `[data-theme="brand-x"]`.

## Token groups

### Background layers
`--color-bg-canvas`, `--color-bg-base`, `--color-bg-subtle`, `--color-bg-muted`, `--color-bg-emphasis`, `--color-bg-inverse`

Light avoids harsh pure-white canvas (`#f2f2f7` / `#f5f5f7`). Dark uses deep layers (`#0c0c0e` → `#2c2c2e`), not flat pure black for elevation.

### Surfaces / cards
`--color-surface-0` … `--color-surface-3`, `--color-surface-card`, `--color-surface-popover`, `--color-surface-overlay`, `--color-surface-sunken`, `--color-surface-tooltip`

Depth comes from **surface hierarchy**, not heavy shadows.

### Borders & separators
`--color-border-subtle`, `--color-border`, `--color-border-strong`, `--color-separator`, `--color-separator-opaque`

### Text hierarchy
`--color-text-primary` → `--color-text-quaternary`, plus link, placeholder, inverse, and on-fill text tokens.

Target contrast: body text ≥ **4.5:1** (WCAG AA) on base backgrounds.

### Icons
`--color-icon-primary`, `--color-icon-secondary`, `--color-icon-tertiary`, `--color-icon-inverse`, `--color-icon-disabled`, `--color-icon-on-primary`

### Actions
Primary / secondary with `hover`, `pressed`, `muted`, `border`, `text` variants.

### Status & domains
`success`, `warning`, `danger`, `info`, `ai`, `automation`, `billing`, `security`, `notifications` — each with muted/border/text companions.

### Charts
`--color-chart-1` … `--color-chart-8`, plus grid/axis/label.

### Interaction
`hover`, `pressed`, `selected`, `disabled-*`, `focus-ring`, `focus-ring-offset`.

### Overlays & materials
Scrims and translucent materials (`--color-material-thin|regular|thick|chrome`) for sheets and chrome — soft blur targets when a blur token package lands.

## Tailwind

With the bridge file:

```html
<div class="bg-dk-card text-dk-text border border-dk-border">
  <button class="bg-dk-primary text-dk-on-primary">Save</button>
</div>
```

## Accessibility

- Light/dark palettes tuned for AA text contrast on base surfaces.
- High-contrast themes use stronger borders and higher-contrast links/focus.
- `:focus-visible` uses `--color-focus-ring`.
- Do not rely on color alone for status — pair with icon/label.

## Responsive adaptation

Colors are theme tokens, not breakpoint tokens. Prefer the same semantics across mobile → ultrawide. Density/spacing belong to the spacing system; color roles stay stable.

## Do / don’t

```css
/* ❌ */
.button { background: #0071e3; color: #fff; }

/* ✅ */
.button {
  background: var(--color-primary);
  color: var(--color-primary-text);
}
.button:hover { background: var(--color-primary-hover); }
.button:active { background: var(--color-primary-pressed); }
```
