# Search Field (013)

Specialized **find / query** control. Semantically distinct from Text Input (011).

## Guidance

| Do | Don’t |
|----|--------|
| Use for content search | Replace Text Input for email/name/etc. |
| Provide a label or `aria-label` | Rely on placeholder as the only name |
| Compose suggestions / results outside | Embed palettes or result lists here |
| Opt into debounce via `debounceMs` | Assume one hardcoded search timing |

## Default anatomy

1. Leading search icon (meaningful)
2. `type="search"` input
3. Reserved trailing slot — clear **or** loading (no layout jump)

Clear appears only when the value is non-empty.

## States

empty · typing · populated · focused · loading · results available · no results · disabled

`resultsStatus` (`idle` | `available` | `empty`) signals availability for SR / hosts — it does **not** render results UI.

## Search behaviors (host-driven)

| Pattern | Hook |
|---------|------|
| Instant | `onValueChange` |
| Debounced | `onDebouncedChange` + `debounceMs` |
| Submit | `onSearch` (Enter) |
| Async | set `loading` while fetching |

## Keyboard

| Key | Behavior |
|-----|----------|
| Enter | `onSearch(value)` |
| Escape | Clear (default) or dismiss (`escapeAction`) |
| ↑ / ↓ | Not handled — reserved for suggestion hosts |

Integration attributes for future patterns: `aria-controls`, `aria-expanded`, `aria-autocomplete`.

## Appearance

| `appearance` | Use |
|--------------|-----|
| `field` (default) | Form layouts; full-width on mobile |
| `toolbar` | Compact desktop toolbars / headers |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/SearchField.tsx`, `styles/search-field.css` |
| `vite-express-tauri` | `src/components/ui/SearchField.tsx`, `src/styles/search-field.css` |
