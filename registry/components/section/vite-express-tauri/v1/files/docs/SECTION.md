# Section

**Package:** `section` · **Layer:** 1 Foundation · **ID:** 17  
**Group:** Layout System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Logical content groups across pages — optional header, description, actions, body, footer, loading/empty states, collapse, sticky headers, anchors, and visibility analytics.

## Install

```bash
devkit add responsive-spacing container section
```

```css
@import "./responsive-spacing.css";
@import "./container-system.css"; /* optional — width tokens */
@import "./section-system.css";
```

## API

```tsx
import { Section, SectionHeader, SectionBody, SectionFooter } from "./Section";

<Section
  title="Overview"
  description="Key metrics for this period."
  actions={<Button>Export</Button>}
  footer="Updated 2h ago"
  width="dashboard"
  background="surface"
  stickyHeader
  collapsible
  onVisible={({ id, visible }) => track("section_view", { id, visible })}
>
  …body…
</Section>

{/* Compound */}
<Section nested elevated width="reading">
  <Section.Header title="Details" actions={…} />
  <Section.Body>…</Section.Body>
  <Section.Footer>…</Section.Footer>
</Section>

{/* States */}
<Section title="Inbox" loading />
<Section title="Inbox" empty emptyState={{ title: "No messages", description: "…" }} />
```

## Features

| Feature | Prop / behavior |
|---------|-----------------|
| Header / description / actions / footer | `title` `description` `actions` `footer` |
| Loading / empty | `loading` `empty` `emptyState` |
| Collapse | `collapsible` `open` `defaultOpen` `onToggle` |
| Sticky header | `stickyHeader` `stickyOffset` |
| Nested + heading hierarchy | `nested` / auto `h2→h6` via context |
| Width inheritance | `width` — form, reading, dashboard, … |
| Background / elevation | `background` `elevated` `elevation` |
| Anchors / scroll targets | `id` / `anchor` + `scroll-margin` |
| Lazy reveal | `lazy` |
| Enter motion | `animate` |
| Analytics | `onVisible` + `visibilityThreshold` |
| Compact (legacy) | `compact` |
| Landmarks | `as="section\|main\|aside\|article"` |

## Accessibility

- Semantic `<section>` (or chosen landmark) with `aria-labelledby` when titled
- Collapse control exposes `aria-expanded` / `aria-controls`
- Collapsed panel uses `inert` while closed
- Loading/empty use `role="status"`
- Screen-reader-only labels on the toggle

## Legacy

`<Section compact>` still works for simple vertical rhythm wrappers.
