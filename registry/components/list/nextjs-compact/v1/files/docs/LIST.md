# List

Container for ordered or unordered collections of related items.

Manages item spacing, grouping, optional dividers, density, and selection. Does **not** invent its own empty UI — compose [Empty State](./EMPTY-STATE.md).

## Density

| `density` | Spacing |
|-----------|---------|
| `compact` | Tight padding, no item gap |
| `comfortable` | Default |
| `spacious` | More padding and gap |

Items remain readable at large text / zoom — interactive rows keep a minimum touch target.

## Selection

| `selectionMode` | Behavior |
|-----------------|----------|
| `none` | Informational — no selection semantics (default) |
| `single` | One selected key |
| `multiple` | Many selected keys |

Controlled via `selectedKeys` / `defaultSelectedKeys` / `onSelectionChange`.

`interactive` defaults to `true` when selection is enabled; set it explicitly for clickable informational rows without selection.

## Dividers

| `dividers` | Behavior |
|------------|----------|
| `none` | Default — no separators |
| `between` | Hairline between adjacent items |

Use `List.Divider` for an explicit break (e.g. between groups). Do not force a divider on every item.

## Line styles

`List.Item` `lines`:

| Value | Use |
|-------|-----|
| `one` | Single-line label |
| `two` | Label + one-line description |
| `multi` | Label + wrapping description |

## Composition

```tsx
<List
  density="comfortable"
  selectionMode="multiple"
  aria-label="Notifications"
  onSelectionChange={setKeys}
>
  <List.Group label="Today">
    <List.Item itemKey="a" lines="two" leading={…}>
      <List.ItemLabel>Title</List.ItemLabel>
      <List.ItemDescription>Supporting text</List.ItemDescription>
    </List.Item>
  </List.Group>
  <List.Divider />
  <List.Item itemKey="b" lines="one">
    <List.ItemLabel>Another row</List.ItemLabel>
  </List.Item>
</List>

{/* Empty */}
<List empty={<EmptyState title="Nothing here" variant="no-results" />} />
```

## Keyboard (interactive / selectable)

Arrow Up / Down · Home / End · Enter / Space

Informational lists (`selectionMode="none"` without `interactive`) do not take a roving tab stop.

## Virtualization

Long lists may virtualize children at the implementation layer without changing this visual contract (same item classes, density, and dividers).

## Accessibility

`list` / `listbox` + `option` when selectable · `aria-multiselectable` · RTL · high contrast · localization · no heavy shadows / gradients.
