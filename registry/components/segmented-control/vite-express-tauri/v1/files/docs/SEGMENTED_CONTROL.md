# Segmented Control (008)

Mutually exclusive selection among a **small** set of options.

## Guidance

| Do | Don’t |
|----|--------|
| 2–5 options | Large option sets (use Select / List) |
| Related modes or filters | Unrelated actions |
| Clear selected fill inside the track | Floating disconnected indicator |

## Anatomy

1. Track (recessed group surface)
2. Segments (`role="radio"` in `role="radiogroup"`)
3. Selected segment — elevated fill **inside** the track (border + weight + surface)

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `label` | `string` | required | Radiogroup accessible name |
| `options` | `SegmentedControlOption[]` | required | Prefer ≤5 |
| `value` / `defaultValue` / `onValueChange` | id string | — | Single selection |
| `size` | `sm` \| `md` \| `lg` | `md` | |
| `equalWidth` | `boolean` | `true` | |
| `overflow` | `scroll` \| `stack` \| `equal` | `scroll` | Narrow layouts |
| `disabled` | `boolean` | `false` | |

### Option

```ts
{
  id: string;
  label: string;          // always required (a11y)
  icon?: ReactNode;
  iconOnly?: boolean;     // only when icon meaning is obvious
  disabled?: boolean;
}
```

## Keyboard

| Key | Behavior |
|-----|----------|
| ← / → | Move selection (RTL-aware) |
| ↑ / ↓ | When `overflow="stack"` |
| Home / End | First / last enabled |
| Space / Enter | Activate focused segment |

Roving `tabIndex`: selected segment is tabbable.

## Mobile

- `scroll` — horizontal scroll + snap when labels don’t fit  
- `stack` — vertical list for long localized labels  
- Do not use for large catalogs  

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/SegmentedControl.tsx`, `styles/segmented-control.css` |
| `vite-express-tauri` | `src/components/ui/SegmentedControl.tsx`, `src/styles/segmented-control.css` |
