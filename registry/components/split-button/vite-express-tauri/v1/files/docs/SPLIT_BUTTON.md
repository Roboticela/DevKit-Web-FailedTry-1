# Split Button (004)

Combines a **primary immediate action** with a **secondary menu of alternatives**. Both regions are visually related but independently interactive and focusable.

## Anatomy

1. Primary action button (label + optional leading icon)
2. Menu trigger (≥44×44, chevron communicates “more choices”)
3. Menu (`role="menu"`) with alternative items

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | `ReactNode` | required | Primary action label |
| `menuLabel` | `string` | **required** | Accessible name for the menu trigger only |
| `items` | `SplitButtonItem[]` | required | Alternative actions |
| `onPrimaryClick` | `fn` | — | Primary activation |
| `size` | `xs`–`xl` | `md` | |
| `variant` | `primary` \| `secondary` \| `destructive` | `primary` | |
| `loading` | `boolean` | `false` | Preserves primary size; disables both regions |
| `disabled` | `boolean` | `false` | |
| `fullWidth` | `boolean` | `false` | Also auto full-width under 480px |
| `open` / `defaultOpen` / `onOpenChange` | controlled API | — | Menu open state |
| `leadingIcon` | `ReactNode` | — | |

### SplitButtonItem

```ts
{ id: string; label: string; disabled?: boolean; destructive?: boolean; onSelect?: () => void }
```

## Keyboard

| Key | Behavior |
|-----|----------|
| Tab | Moves between primary and menu trigger |
| Enter / Space | Activates focused region (primary, trigger, or menu item) |
| ArrowDown on trigger | Opens menu |
| ArrowUp / ArrowDown / Home / End | Move within open menu |
| Escape | Closes menu and returns focus to trigger |

## States

`default` · `hover` · `focus` · `pressed` · `disabled` · `loading` · `menu-open`

## Mobile

Under 480px the control becomes full-width; menu stretches to the control width. Trigger width never drops below 44px.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/SplitButton.tsx`, `styles/split-button.css` |
| `vite-express-tauri` | `src/components/ui/SplitButton.tsx`, `src/styles/split-button.css` |
