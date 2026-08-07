# Icon Button (002)

Compact icon-only action control. Part of **Interaction Controls**.

Use only when the icon’s meaning is unambiguous. Prefer **Button (001)** with a text label for unfamiliar actions.

## Anatomy

1. Hit target (invisible ≥44×44; visual control may be smaller)
2. Optically centered icon glyph (16–24px by size)
3. Loading spinner overlay when `loading`

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | `string` | **required** | Accessible name (`aria-label`). Never omit. |
| `tooltip` | `string` \| `false` | `label` | Desktop `title`. Pass `false` to hide tooltip; a11y name remains. |
| `icon` / `children` | `ReactNode` | — | Meaningful icon graphic |
| `size` | `xs`–`xl` | `md` | Visual 28–56px |
| `variant` | see below | `neutral` | |
| `loading` | `boolean` | `false` | Preserves size |
| `loadingLabel` | `string` | `label, Loading` | |
| `selected` | `boolean` | `false` | Sets `aria-pressed` |

## Variants

`neutral` · `subtle` · `filled` · `outlined` · `destructive` · `inverse`

## States

`default` · `hover` · `focus-visible` · `pressed` · `disabled` · `loading` · `selected`

## Icon sizes

| Control | Icon |
|---------|------|
| XS 28 | 16 |
| SM 32 | 16 |
| MD 40 | 20 |
| LG 48 | 24 |
| XL 56 | 24 |

## Rules

- Tooltips must never be the only accessible name — `label` is authoritative.
- Optical centering uses a slight vertical nudge (`--dk-ib-optical-y`).
- No gradients / box-shadows.
- Reduced motion: no press scale; static spinner.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/IconButton.tsx`, `styles/icon-button.css` |
| `vite-express-tauri` | `src/components/ui/IconButton.tsx`, `src/styles/icon-button.css` |
