# Floating Action Button (006)

Prominent contextual action above application content.

Use **only** when one action deserves persistent prominence — not merely because a control can float.

## Anatomy

1. Elevated surface (tonal fill + border — **no box-shadow**)
2. Icon (default 24px at MD)
3. Optional visible label (`label` / `extended`)
4. Loading overlay

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | `string` | **required** | Accessible name; visible when not icon-only |
| `icon` | `ReactNode` | **required** | |
| `size` | `sm` \| `md` \| `lg` | `md` | Touch ≥48×48 |
| `appearance` | `icon` \| `label` \| `extended` | `icon` | |
| `position` | `bottom-end` \| `bottom-start` \| `top-end` \| `top-start` \| `inline` | `bottom-end` | `inline` for desktop contextual layout |
| `compact` | `boolean` \| `"auto"` | `"auto"` | Collapses label under 480px when `auto`/`true` |
| `loading` | `boolean` | `false` | Preserves size |
| `offsetBottom` / `offsetInline` | CSS length | — | Extra inset beyond safe-area |

### Host CSS variables

| Variable | Purpose |
|----------|---------|
| `--dk-fab-nav-offset` | Bottom navigation height |
| `--dk-fab-keyboard-offset` | Virtual keyboard inset |
| `--dk-fab-offset-bottom` / `--dk-fab-offset-inline` / `--dk-fab-offset-top` | Edge padding |

Safe-area: `env(safe-area-inset-*)` is included automatically for fixed positions.

## Placement rules

Do **not** cover: critical text, form controls, system notifications, navigation, or essential content.

- **Mobile:** fixed + safe-area; raise `--dk-fab-nav-offset` when a bottom nav exists.
- **Desktop:** prefer `position="inline"` in a contextual region rather than copying a mobile corner.
- **Modals:** hosts may set `data-modal-open="true"` on a root to hide fixed FABs.

## States

`default` · `hover` · `focus-visible` · `pressed` · `disabled` · `loading`

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/FloatingActionButton.tsx`, `styles/floating-action-button.css` |
| `vite-express-tauri` | `src/components/ui/FloatingActionButton.tsx`, `src/styles/floating-action-button.css` |
