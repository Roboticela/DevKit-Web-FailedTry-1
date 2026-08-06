# Responsive Padding System

DevKit Layer 1 foundation (`padding-utilities`, id **22**).

Internal spacing for every component — **semantic tokens**, density-aware, RTL-safe. Never hardcode px.

## Install

```bash
npx @roboticela/devkit add padding-utilities
```

```ts
import "@/styles/responsive-spacing.css";
import "@/styles/padding-system.css";
import { Padding, PaddingCard, paddingClassName } from "@/components/ui/Padding";
```

## Presets

| Preset | Role |
|--------|------|
| `none` | Zero padding |
| `compact` / `comfortable` / `spacious` | Density rhythm |
| `hero` | Landing / hero blocks |
| `modal` / `sheet` | Dialogs & sheets |
| `card` | Cards / surfaces |
| `dashboard` | Dashboard chrome |
| `table-cell` / `table-header` | Tables |
| `form-field` / `input` / `button` | Controls |
| `nav` | Navigation items |
| `container` / `section` / `page` | Layout shells |

## Quick start

```tsx
<Padding preset="card">…</Padding>
<Padding preset="modal" safe="y" motion>…</Padding>
<Padding px={{ base: 4, md: 6, lg: 8 }} py="3" />
<Padding ps="4" pe="2" /> {/* logical / RTL */}

<div className={paddingClassName({ preset: "table-cell" })} />
```

## Density & theme

Inherits `data-density` and spacing tokens. Compact / comfortable / spacious (and theme `[data-theme]`) retarget `--padding-*`.

## Breakpoints

`dk-md:px-6`, `dk-lg:py-8` (`sm`–`2xl` aligned with Breakpoint Manager).

## Integration

Use `dk-card-p`, `dk-modal-p`, `dk-dashboard-p`, `dk-table-cell-p`, `dk-input-p`, `dk-button-p` on existing surfaces — or wrap with `<Padding>`.
