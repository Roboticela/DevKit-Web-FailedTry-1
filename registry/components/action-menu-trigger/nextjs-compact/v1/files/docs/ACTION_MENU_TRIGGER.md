# Action Menu Trigger (010)

Opens a **contextual collection of actions**. Distinct from Split Button (004): there is no primary action — the control only discloses the menu.

## Guidance

| Do | Don’t |
|----|--------|
| Disclose that more actions exist (chevron / more glyph) | Hide menu affordance |
| Separate destructive actions + require confirmation | Fire destructive `onSelect` immediately |
| Use sheet presentation on narrow touch screens | Force desktop dropdown on small touch UIs |
| Group related actions | Dump large catalogs into the menu |

## Appearances

| `appearance` | Use |
|--------------|-----|
| `labeled` | Text button + optional icon + chevron |
| `icon` | Icon-only (default more-vertical); `label` required for a11y |
| `contextual` | Low-emphasis inline / row trigger |

## Presentation

| `presentation` | Behavior |
|----------------|----------|
| `auto` (default) | Dropdown when wide / fine pointer; bottom sheet when narrow or coarse + &lt;768px |
| `menu` | Always connected dropdown |
| `sheet` | Always bottom sheet |

Open dropdown shares a border with the trigger (`menu-open` / connected corners). Sheet uses a scrim + bottom panel.

## Destructive actions

- Destructive items are auto-grouped under a separated **Destructive** section when using flat `items`.
- Prefer explicit `groups` for hierarchy.
- Destructive items default to `requiresConfirm: true`. Selecting them opens a confirm step; `onSelect` runs only after Confirm.

## API (summary)

| Prop | Notes |
|------|--------|
| `label` | Accessible name (required) |
| `children` | Visible text for `labeled` |
| `icon` | Leading / primary icon |
| `items` / `groups` | Actions |
| `size` | `xs`…`xl` |
| `variant` | `secondary` \| `outline` \| `subtle` \| `ghost` |
| `open` / `defaultOpen` / `onOpenChange` | Controlled open |

## Keyboard

| Key | Behavior |
|-----|----------|
| Enter / Space / ↓ | Open (from trigger) |
| ↑ / ↓ | Move among items |
| Home / End | First / last enabled |
| Escape | Close confirm, then menu; restore focus to trigger |

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/ActionMenuTrigger.tsx`, `styles/action-menu-trigger.css` |
| `vite-express-tauri` | `src/components/ui/ActionMenuTrigger.tsx`, `src/styles/action-menu-trigger.css` |
