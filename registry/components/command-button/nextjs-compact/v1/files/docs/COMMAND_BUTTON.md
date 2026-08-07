# Command Button (009)

Workflow-oriented action for **command palettes**, command menus, and shortcut-aware surfaces.

Unlike Button (001), Command Button is built to carry richer metadata without visual noise.

## Anatomy

1. Leading icon (optional)
2. Label (required)
3. Description (optional, quiet)
4. Status indicator (optional)
5. Shortcut hint (desktop / fine pointer)
6. Trailing affordance (optional)

## Guidance

| Do | Don’t |
|----|--------|
| Keep chrome calm despite metadata | Compete with Button for generic CTAs |
| Hide shortcuts on mobile | Show ⌘K chrome on touch-first UIs |
| Use `role="option"` / `menuitem` in palettes | Invent a parallel interaction model |
| Multi-cue selected state | Color-only selection |

## States

default · hover · focus · pressed · disabled · loading · selected

## API (summary)

| Prop | Notes |
|------|--------|
| `label` | Required primary text |
| `description` | Contextual secondary line |
| `leadingIcon` | Category / action glyph |
| `shortcut` | `string` or `string[]` → `<kbd>` chips; `aria-keyshortcuts` |
| `trailingAffordance` | Chevron / enter / submenu |
| `status` | `none` \| `info` \| `success` \| `warning` \| `error` |
| `selected` | Palette highlight (`aria-selected` / `aria-pressed`) |
| `role` | `button` (default) \| `option` \| `menuitem` |
| `commandId` | Host id via `data-command-id` |
| `size` | `xs`…`xl` |
| `variant` | `subtle` \| `outline` \| `quiet` \| `destructive` |

## Keyboard

| Context | Behavior |
|---------|----------|
| `button` | Enter / Space activate (native) |
| `option` / `menuitem` | Enter / Space activate; host owns ↑↓ list navigation |
| Shortcuts | Visual hints only — hosts bind real accelerators |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/CommandButton.tsx`, `styles/command-button.css` |
| `vite-express-tauri` | `src/components/ui/CommandButton.tsx`, `src/styles/command-button.css` |
