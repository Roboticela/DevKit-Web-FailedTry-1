# Text Input (011)

Foundational **single-line** textual data-entry control for Form Controls.

## Guidance

| Do | Don’t |
|----|--------|
| Keep a visible label | Rely on floating labels or placeholder-as-label |
| Use semantic `type` for email/url/tel/search/username | Fork new components for app-specific formats |
| Pair validation color with icon + message | Color-only error/success |
| Reserve message space (`stableMessages`) | Let errors jump the layout |
| Show clear only when there is a value | Always show a clear affordance |

## Anatomy

1. Label (+ required / optional)
2. Description
3. Control: leading icon · prefix · input · suffix · loading · clear · trailing / status
4. Footer: help / validation message · character counter

## Semantic types

`text` · `email` · `url` · `tel` · `search` · `username`  

`username` → native `type="text"` + `autocomplete="username"`. Visual identity is shared.

## Spacing (Form Controls)

| Relationship | Token |
|--------------|--------|
| Label → control | 6px |
| Control → message | 6px |
| Field → field | 16px |
| Horizontal padding | 12px (`space-3`) |
| Default text | 16px / 24px |
| Default height | MD = 40px (hit ≥44) |

## States

empty · focused · filled · disabled · read-only · invalid · valid · warning · loading

## API (summary)

| Prop | Notes |
|------|--------|
| `label` | Visible label |
| `type` | Semantic kind |
| `size` | `xs`…`xl` |
| `validation` | `none` \| `error` \| `success` \| `warning` |
| `errorMessage` / `successMessage` / `warningMessage` / `helpText` | Footer copy |
| `leadingIcon` / `trailingIcon` | Affordances |
| `prefix` / `suffix` | Static addons |
| `clearable` | Independent clear control when filled |
| `loading` | Spinner; field read-only while loading |
| `showCount` / `maxLength` | Character counter |
| `value` / `defaultValue` / `onValueChange` | Controlled / uncontrolled |

Native autocomplete, inputMode, copy/paste/cut/select-all/undo/redo are preserved via the underlying `<input>`.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/TextInput.tsx`, `styles/text-input.css` |
| `vite-express-tauri` | `src/components/ui/TextInput.tsx`, `src/styles/text-input.css` |
