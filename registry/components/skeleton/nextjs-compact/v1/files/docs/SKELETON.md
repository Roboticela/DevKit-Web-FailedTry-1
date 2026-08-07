# Skeleton (049)

Structural placeholder for content that is **expected to load**.

Do **not** use for empty, error, or completed states — use Empty State / Alert instead.

## Shapes

| Shape | Approximates |
|-------|----------------|
| `text` | Body line(s) |
| `title` | Heading line |
| `avatar` / `circle` | Circular media |
| `thumbnail` | Square media |
| `rectangle` | Block / card media |
| custom | `width` / `height` (+ `shape="rectangle"`) |

`lines` stacks staggered text/title lines for paragraph-like structure.

## Motion

Default: calm **opacity pulse** (not a bright shimmer). Static under `prefers-reduced-motion`.

## Composition

`SkeletonGroup` lays out related shapes. Hosts should match final content dimensions to avoid layout shift and set `aria-busy` on the content region.

Non-interactive (`pointer-events: none`).

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Skeleton.tsx`, `styles/skeleton.css` |
| `vite-express-tauri` | `src/components/ui/Skeleton.tsx`, `src/styles/skeleton.css` |

## Example

```tsx
<SkeletonGroup label="Loading profile">
  <SkeletonGroup orientation="horizontal" gap="md" label="Loading profile">
    <Skeleton shape="avatar" size="md" />
    <div style={{ flex: 1 }}>
      <Skeleton shape="title" />
      <Skeleton shape="text" lines={3} />
    </div>
  </SkeletonGroup>
  <Skeleton shape="rectangle" height={160} />
</SkeletonGroup>
```
