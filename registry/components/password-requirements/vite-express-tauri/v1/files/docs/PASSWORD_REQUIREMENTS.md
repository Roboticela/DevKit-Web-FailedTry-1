# Password Requirements

Live password rule checklist. Composes **List** and **List Item** — do not invent list rows.

## Purpose

Show which password rules are met while typing. Use with Password Input via the `requirements` slot, or beside any password field.

For registration / reset / change / onboarding chrome (title + progress Badge), compose **Password Checklist** instead of wrapping this yourself.

## Composition

| Primitive | Role |
|-----------|------|
| List | Accessible list container + keyboard item registry |
| List Item | Leading status icon + title / description |
| Slots | `metIcon`, `unmetIcon`, `pendingIcon`, `renderItem` |

## States

| Status | When | Icon |
|--------|------|------|
| `pending` | Empty value (default) | Clock / pending |
| `met` | Rule passes | Success |
| `unmet` | Rule fails after typing | Error |

## Custom rules

```tsx
<PasswordRequirements
  value={password}
  rules={[
    { id: "len", label: "8+ characters", test: (p) => p.length >= 8 },
    { id: "num", label: "Includes a number", test: (p) => /\d/.test(p) },
  ]}
/>
```

Or pass controlled `results` from your validator.

## Variants

`checklist` (default) · `compact` · `detailed`

## Accessibility

- List is labeled by the visible/hidden heading
- Each List Item has an accessible name including met/unmet
- Soft status summary via `aria-live="polite"`
- Do not rely on icon color alone

## Anti-patterns

- Do not build a custom `<ul>` / checklist row
- Do not use this as a strength meter — compose **Password Strength** for scores

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/PasswordRequirements.tsx`, `styles/password-requirements.css` (+ List, List Item) |
| `vite-express-tauri` | `src/components/ui/PasswordRequirements.tsx`, `styles/password-requirements.css` (+ List, List Item) |
