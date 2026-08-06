# Typography Token System

**Package:** `typography-tokens` · **Layer:** 1 Foundation · **ID:** 2  
**Depends on:** `color-tokens` (for text color roles)  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Apple HIG–inspired semantic typography for every surface in the product. Hierarchy, rhythm, responsive scaling, truncation, wrapping, localization, and accessibility are defined once — components consume tokens/classes, never hardcoded sizes.

## Install

```bash
devkit add color-tokens typography-tokens
```

```css
@import "./color-tokens.css";
@import "./typography-tokens.css";
@import "./typography-tokens.tailwind.css"; /* optional */
```

## Naming

| Layer | Pattern | Example |
|-------|---------|---------|
| Family | `--font-{role}` | `--font-sans`, `--font-mono` |
| Weight | `--font-weight-{name}` | `--font-weight-semibold` |
| Style metrics | `--text-{role}-size\|leading\|tracking\|weight` | `--text-body-size` |
| Utility class | `.dk-type-{role}` | `.dk-type-page-title` |

## Roles

| Role | Class | Typical use |
|------|-------|-------------|
| Display | `.dk-type-display` | Marketing / empty-state impact |
| Hero | `.dk-type-hero` | Feature statements |
| Page title | `.dk-type-page-title` | Top of page |
| Section title | `.dk-type-section-title` | Section headers |
| Heading 1–6 | `.dk-type-h1` … `.dk-type-h6` | Document hierarchy |
| Subtitle | `.dk-type-subtitle` | Supporting title line |
| Body | `.dk-type-body` | Primary reading |
| Small body | `.dk-type-body-sm` | Dense secondary copy |
| Caption | `.dk-type-caption` | Metadata |
| Label | `.dk-type-label` | Form labels |
| Helper | `.dk-type-helper` | Field help / hints |
| Button | `.dk-type-button` | Control labels |
| Code | `.dk-type-code` | Inline / block code |
| Numeric | `.dk-type-numeric` | Tabular numbers |
| Statistics | `.dk-type-stat` | KPI figures |
| Table | `.dk-type-table` | Cell text |
| Table header | `.dk-type-table-header` | Column headers |
| Badge | `.dk-type-badge` | Chips / badges |

## Responsive scaling

Mobile-first with `clamp()` fluid sizes, then refinements at:

- **768px** — tablet body/button/table bump  
- **1024px** — desktop caption/label/helper  
- **1440px** — ultrawide keeps body stable (no runaway scale)

Sizes use **rem** so browser text zoom works.

## Rhythm & helpers

- `.dk-type-muted` / `.dk-type-subtle` / `.dk-type-inverse` — color roles  
- `.dk-truncate` — single-line ellipsis  
- `.dk-line-clamp-2` / `.dk-line-clamp-3` — multi-line clamp  
- `.dk-wrap-balance` / `.dk-wrap-pretty` — modern wrapping  
- `.dk-hyphens` — localization-friendly wrapping  

## Localization

- CJK (`zh`/`ja`/`ko`): PingFang / Hiragino / Noto fallbacks, stricter line breaks  
- RTL (`ar`/`he`): tracking reset to `0`  
- Prefer `lang` on `<html>`  

## Accessibility

- Do not set `html { font-size }` below `100%`  
- Body leading ~1.5 for readability  
- Pair color contrast from `color-tokens`  
- Prefer semantic HTML (`h1`–`h6`, `p`, `label`, `code`) via React packages  

## React packages (Typography System)

| Package | Export | Notes |
|---------|--------|-------|
| `display-text` | `DisplayText` | `variant="display" \| "hero"` |
| `heading` | `Heading` | `level={1..6}` |
| `title` | `Title` | `variant="page" \| "section"` |
| `subtitle` | `Subtitle` | |
| `body-text` | `BodyText` | `size="md" \| "sm"` |
| `caption` | `Caption` | |
| `label` | `Label` | |
| `helper-text` | `HelperText` | |
| `code-text` | `CodeText` | |
| `numeric-display` | `NumericDisplay` | `variant="numeric" \| "stat"` |

Button / table / badge text: use `.dk-type-button`, `.dk-type-table`, `.dk-type-badge` (and table header class) until dedicated UI packages land.

## Do / don’t

```tsx
// ❌
<h1 style={{ fontSize: 32, fontWeight: 700 }}>Dashboard</h1>

// ✅
import { Title } from ".../Title";
<Title variant="page">Dashboard</Title>
// or
<h1 className="dk-type-page-title">Dashboard</h1>
```
