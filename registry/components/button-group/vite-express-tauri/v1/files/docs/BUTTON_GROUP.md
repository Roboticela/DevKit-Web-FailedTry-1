# Button Group (003)

Combines related actions into one coherent control group. Compose with **Button (001)** and **Icon Button (002)**.

Do not group unrelated actions just because they fit side by side.

## Anatomy

1. Group container (`role="group"` + `aria-label`)
2. Child action controls (buttons / icon buttons)
3. Optional join treatment when `gap="none"`

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | `string` | **required** | Accessible group name |
| `orientation` | `horizontal` \| `vertical` \| `responsive` | `horizontal` | Desktop default horizontal |
| `gap` | `none` \| `sm` \| `md` | `none` | `none`=0 joined · `sm`=8px · `md`=12px |
| `equalWidth` | `boolean` | `false` | Equal flex children |
| `allowMixedSizes` | `boolean` | `false` | Opt-in mixed XS–XL children |
| `overflow` | `wrap` \| `stack` \| `scroll` | `wrap` | Compact behavior for `responsive` |

## Behavior

- **Joined (`gap="none"`):** shared borders, adjusted radii, focus/hover raise `z-index` so each control stays identifiable.
- **Separate (`sm`/`md`):** visually distinct related actions.
- **Loading:** child Button/IconButton preserve their own dimensions — group layout does not shift.
- **Disabled:** disable individual children; group remains navigable to remaining actions.
- **Keyboard:** tab order follows DOM; each child keeps Enter/Space.
- **RTL:** logical margins (`margin-inline-start`) and logical radii.
- **Responsive:** under 480px, `stack` becomes a column; `wrap` wraps; `scroll` keeps a single scrollable row.

## Examples

```tsx
<ButtonGroup label="Document actions">
  <Button variant="secondary">Cancel</Button>
  <Button>Save</Button>
</ButtonGroup>

<ButtonGroup label="View mode" gap="sm">
  <Button variant="secondary">List</Button>
  <Button variant="secondary">Grid</Button>
</ButtonGroup>

<ButtonGroup label="Toolbar" orientation="responsive" overflow="stack">
  <IconButton label="Add" icon={<PlusIcon />} />
  <IconButton label="More" icon={<MoreIcon />} />
</ButtonGroup>
```

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/ButtonGroup.tsx`, `styles/button-group.css` |
| `vite-express-tauri` | `src/components/ui/ButtonGroup.tsx`, `src/styles/button-group.css` |

Import CSS after `button.css` / `icon-button.css`.
