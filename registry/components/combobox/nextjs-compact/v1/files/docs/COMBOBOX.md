# Combobox (027)

Editable text entry combined with selection from suggestions — searchable / type-ahead.

Not a Select: the input stays editable. Options are suggestions, not the only interaction model.

## Modes

| Prop | Behavior |
|------|----------|
| `allowsCustomValue={false}` (default) | Only choosing an option commits `value`. Typed text is kept visible but is not auto-accepted as a valid selection. |
| `allowsCustomValue` | Free text may be committed on Enter / blur. |
| `filter` | Client-side filter (`true` default, custom fn, or `false` for parent-owned / async lists). |
| `loading` | Reserved trailing spinner — no layout shift. |
| `selectionMode` | `single` now; `multiple` reserved for future composition. |

## Features

- Label, description, help, validation, disabled, clear, leading icon
- Controlled `value` + `inputValue` (typed string never cleared just because suggestions are empty)
- Async suggestions via parent-updated `options` + `onInputChange`
- Informative no-results copy (`noResultsLabel`)
- Anchored listbox; repositions with `visualViewport` for mobile keyboards
- Keyboard: ↓/↑ navigate, Enter selects, Escape closes, typing filters/requests
- Screen readers (`role="combobox"` + listbox), RTL, high contrast, reduced motion

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Combobox.tsx`, `styles/combobox.css` |
| `vite-express-tauri` | `src/components/ui/Combobox.tsx`, `src/styles/combobox.css` |
