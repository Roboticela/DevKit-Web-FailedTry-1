---
description: DevKit Design Constitution summary — Apple-class craft, semantic tokens, applies to every UI change
alwaysApply: true
---

# DevKit Design System (Always Apply)

Full token bible and generator prompt: [design-main-rule.mdc](../rules/design-main-rule.mdc) (sections 01–100).

Feel: **calm + premium + precise + fluid + intelligent + beautiful + highly usable.**  
Do not copy Apple’s proprietary UI, assets, icons, exact layouts, or branded elements.

## Non-negotiables

- **Mobile-first, content-driven**: Compact → Mobile → Tablet → Desktop → Large → XL → Ultra Wide. One component adapts; never separate mobile/desktop components.
- **Tokens only**: No magic `17px`, `#123456`, or one-off radii/shadows. Primitive → Semantic → Component → Rendered.
- **Hierarchy**: One primary action per local context. Primary → Secondary → Tertiary attention.
- **Surfaces over decoration**: Whitespace, typography, tonal contrast, proportion. No excessive cards, borders, glass, badges, or animation.
- **No shadows / no gradients** in DevKit UI (use tonal elevation and borders instead).
- **Scrollbars**: DevKit-managed thin scrollbars via `--scrollbar-*` tokens (never browser chrome defaults). Use `.dk-scroll` / `.dk-scroll--thin` / `.dk-scroll--hidden` on overflow regions.
- **Themes**: Light, Dark, High Contrast, and Custom Brand are independent palettes—not inversions.
- **A11y**: Visible focus, keyboard, ≥44×44 touch targets, never color-only status, honor `prefers-reduced-motion`.

## Canonical scales (use these exact tokens)

**Space (4px base / 8px rhythm):** `space-0…64` → 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128, 160, 192, 256px. No arbitrary 7/11/13/19/27px.

**Breakpoints:** Compact 0–479 · Mobile 480–767 · Tablet 768–1023 · Desktop 1024–1279 · Large 1280–1535 · XL 1536–1919 · Ultra 1920+.

**Containers:** xs 480 · sm 640 · md 768 · lg 960 · xl 1200 · 2xl 1440 · 3xl 1600 · full 100%. Default app content 1440px.

**Page padding:** &lt;480→16 · 480–767→20 · tablet 24 · 1024–1279→32 · 1280–1535→40 · 1536+→48.

**Type (size / line / weight):** Display 64/68/700 · 56/60/700 · 48/52/700 · Title 40/48/700 · 32/40/700 · 28/36/700 · Heading 24/32/650→600 · 20/28/650→600 · 18/24/650→600 · Body 17/26/400 · 16/24/400 · 14/20/400 · Label 14/20/550→500 · Caption 12/16/450→400 · Micro 11/14/500. Weights: 400 / 500 / 600 / 700 / 800 only. System font stack (licensed fallbacks—do not ship proprietary SF fonts).

**Radius:** 0, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, full. Micro 6–8 · inputs 10–12 · buttons 10–14 · cards 16–20 · dialogs/sheets 20–28.

**Control heights:** XS 28 · SM 32 · MD 40 (default) · LG 48 · XL 56. Touch target ≥44px (prefer 48).

**Motion:** instant 0 · micro 80 · fast 120 · quick 160 · standard 200 · smooth 240 · medium 300 · large 400 · dramatic 500ms. Default UI 160–240ms. Reduced motion ≤120ms opacity/crossfade.

**Z-index:** base 0 · raised 10 · sticky 100 · navigation 200 · floating 300 · dropdown 400 · popover 500 · tooltip 600 · drawer 700 · modal 800 · critical 900 · system 1000.

**Color ratio:** ~85–92% neutral · 5–10% text · 2–5% accent/semantic. Accent ≤10% of screen. Semantic domains: success, warning, error, info (+ product domains as needed).

**Elevation:** 0–5 via surface tone + border (not box-shadow). 0 content · 1 cards · 2 floating · 3 popover · 4 modal · 5 overlay.

## Components

Buttons: Primary / Secondary / Ghost / Outline / Text / Icon-only — icon+label (except icon-only), hover/press/focus/loading/disabled. Cards only when they aid interaction. Forms: label → 6px → input → 6px help; fields 16px apart. Tables are flagship. Empty = message + CTA. Loading = skeleton when possible. Search available on every page where content is browsable.

## Density / personality (global, not per-component chaos)

Density: Compact | Comfortable (default) | Spacious.  
Radius personality: Sharp | Balanced (default) | Soft.  
Motion: Reduced | Balanced (default) | Expressive — a11y overrides.  
Material: Solid | Subtle (default) | Expressive — keep readable, solid fallback.

## Generator rule

When authoring any component, follow §100 in `design-main-rule.md`. Specify only what is unique to that component; inherit all global foundation rules. A component is incomplete until it works across phone/tablet/desktop, light/dark/HC, mouse/keyboard/touch, loading/empty/error, LTR/RTL, and reduced motion.
