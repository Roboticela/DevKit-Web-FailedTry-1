# Avatar Group

Compact arrangement of related identities.

```
[Avatar] [Avatar] [Avatar] [+8]
```

Only the visible `max` avatars are mounted — large groups (20+) do not render hundreds of nodes.

## Layout

| `layout` | Behavior |
|----------|----------|
| `overlap` (default) | Modest negative inline margin (~28%; ~34% in `compact`) with a surface ring so initials stay readable |
| `separated` | Gap between avatars |

Do not use aggressive overlap — each visible avatar must remain identifiable.

## Overflow

```tsx
<AvatarGroup max={3} aria-label="Assignees" overflowDetails={<ul>…</ul>}>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Turing" />
  <Avatar name="Katherine Johnson" />
  {/* … */}
</AvatarGroup>
```

- Overflow reads `+N` by default (`formatOverflow` to localize)
- `totalCount` when the full set is larger than the passed nodes (server-truncated / virtualized)
- Hover/focus may show `overflowTooltip`
- **Touch / keyboard:** overflow is a button; `overflowDetails` opens a disclosure panel (not hover-only)
- `renderOverflow` for composing DevKit Tooltip / Menu / Popover

## Items API

For large lists, prefer `items` + `renderItem` so only `max` Avatars mount:

```tsx
<AvatarGroup
  max={5}
  totalCount={128}
  items={page}
  renderItem={(item) => <Avatar name={item.name} src={item.src} />}
  formatOverflow={(n) => `+${n}`}
  overflowLabel={(n) => `${n} more people`}
/>
```

## Sizes

Same scale as Avatar: `xs` · `sm` · `md` · `lg` · `xl` · `2xl` (control-height / space tokens).

## RTL & themes

Overlap uses `margin-inline-start` so order mirrors correctly in RTL while document order stays first→last. Supports dark mode, high contrast, and localization of overflow copy.
