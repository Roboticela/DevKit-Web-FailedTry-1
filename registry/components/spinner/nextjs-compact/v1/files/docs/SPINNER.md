# Spinner (048)

Indeterminate activity when the system is working and **duration is unknown**.

Use **Progress Bar** / **Progress Circle** when progress is known.

## Sizes

| Size | Diameter |
|------|----------|
| `xs` | 16px |
| `sm` | 20px |
| `md` | 24px (default) |
| `lg` | 32px |
| `xl` | 40px |

## Composition

The primitive does **not** decide page placement and does **not** include a full-screen overlay.

| Host pattern | How to compose |
|--------------|----------------|
| Inline | default `layout="inline"` in text/rows |
| Button | place inside Button/`loading` slot at `xs`/`sm` |
| Page region | `layout="block"` inside host content |
| Overlay | host builds modal/sheet; put Spinner inside |

Set `aria-busy="true"` on the busy parent region.

## Accessibility

- Visual graphic is `aria-hidden`
- Status label uses `role="status"` + `aria-live="polite"` once (not per animation cycle)
- `labelMode="none"` when the host already announces loading

## Reduced motion

SVG rotation is replaced by a static three-dot activity mark.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Spinner.tsx`, `styles/spinner.css` |
| `vite-express-tauri` | `src/components/ui/Spinner.tsx`, `src/styles/spinner.css` |

## Example

```tsx
<Spinner label="Saving" />

<Button disabled aria-busy="true">
  <Spinner size="xs" labelMode="none" /> Saving…
</Button>

{/* Host-owned overlay region */}
<div role="dialog" aria-busy="true" aria-labelledby="load-title">
  <Spinner layout="block" label="Loading workspace" labelMode="visible" labelPlacement="bottom" />
</div>
```
