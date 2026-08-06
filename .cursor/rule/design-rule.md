---
description: Apple-level UI/UX design language — applies to every page, component, and interaction
alwaysApply: true
---

# Apple-Level Design System (Master)

Overrides prior UI style guidance. Design as if Apple built this for professional business users: elegant, premium, minimal, spacious, calm, precise.

## Non-negotiables

- **Mobile-first**: Mobile → Tablet → Laptop → Desktop → Ultrawide. Expand up; never shrink a desktop layout down.
- **Clarity over decoration**: Whitespace > borders. Every pixel has purpose. No clutter, heavy outlines, busy backgrounds, random gradients, or large color blocks.
- **No generic SaaS look**: Soft layered surfaces (light: soft neutrals, not stark white; dark: deep layers, not pure black). Subtle depth via surface hierarchy—not heavy shadows or loud gradients.
- **Hierarchy on every screen**: Primary action → Secondary → Important info → Supporting → Metadata.
- **Consistency**: Same spacing, type scale, radius, icons, motion, and interaction patterns across all modules.

## Color & tokens

- Support light, dark, and high-contrast as intentional themes (not inversions).
- Accents sparingly for attention only. Semantic colors only: primary, secondary, success, warning, error, info, neutral, AI, automation, billing, security, notifications.
- Prefer existing CSS variables / design tokens; do not invent one-off hex values in components.

## Typography & icons

- Clear scale: Display, Heading, Title, Subtitle, Body, Caption, Label, Helper, Code, Numeric.
- Every interactive control gets a meaningful, consistent-weight icon aligned with its label. No decorative icons.

## Components

- **Buttons**: Primary / Secondary / Ghost / Outline / Text / Icon-only. Always: icon + label (except icon-only), hover, press, loading (preserve width), disabled, success. Destructive actions require confirmation.
- **Cards**: Separate with spacing first; soft radius; calm hover. Cards only when they aid interaction or grouping—not by default for decoration.
- **Forms**: Label, helper, validation (inline/smart), icons where useful, success/error states. Prefer auto-save / drafts when appropriate.
- **Tables**: Sticky header/columns, sort/filter, selection, rich cells, keyboard nav, strong hover/selection—tables are a flagship surface.
- **Nav**: Bottom nav (mobile), sidebar (desktop), breadcrumbs, clear location. Search available on every page.
- **Empty states**: Illustration + message + description + primary CTA (+ optional secondary). Never blank.
- **Loading**: Skeletons and progressive reveal over spinners when possible.
- **Modals**: Small/medium/large; full-screen on mobile; drawers/sheets as needed. Lightweight, not heavy chrome.
- **Notifications**: Toasts/banners/inline—never interrupt unnecessarily.

## Motion, a11y, performance

- Motion communicates purpose (page/modal/drawer, press, list, success)—never decoration. Honor `prefers-reduced-motion`.
- Full a11y: keyboard, focus rings, ARIA, semantics, large touch targets, high contrast.
- Feel instant: lazy load, virtual lists, code split, optimistic updates where safe.

## AI

AI is native—not isolated. Assist, suggest, autofill, summarize, and search from context across the app.

## Do / Don't

```tsx
// ❌ Crowded card with heavy border, no hierarchy, spinner-only loading
// ✅ Spacious group, soft surface, clear primary CTA, skeleton while loading
```

When building or restyling any UI, enforce this language end-to-end.
