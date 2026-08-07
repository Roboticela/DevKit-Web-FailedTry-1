# Alert (041)

Persistent **contextual feedback** within the current interface. Not a toast.

## Variants

`informational` · `success` · `warning` · `error` · `neutral`

Status is communicated with semantic icon + text + surface/border — not color alone.

## Configuration

- Optional title (message-only alerts are valid)
- Description / children
- Default or custom icon (`icon={false}` to hide)
- Actions (`actions` API or `actionSlot`)
- Dismiss — **opt-in only** when dismissal is appropriate
- `density`: `standard` | `compact`

## Accessibility

| Variant | Default live behavior |
|---------|----------------------|
| `error` | `role="alert"` (assertive) |
| others | `role="status"` (polite) |

Override with `live="polite" | "assertive" | "off"`. Use `off` for static persistent conditions that should not re-announce.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Alert.tsx`, `styles/alert.css` |
| `vite-express-tauri` | `src/components/ui/Alert.tsx`, `src/styles/alert.css` |

## Example

```tsx
<Alert variant="warning" title="Payment method expiring">
  Update your card before March 1 to avoid service interruption.
  <Alert /* actions */ />
</Alert>

<Alert
  variant="error"
  title="Couldn’t save changes"
  actions={[
    { label: "Retry", emphasis: "primary", onClick: retry },
    { label: "Contact support", href: "/support", emphasis: "tertiary" },
  ]}
>
  The server returned an unexpected error. Your draft is still local.
</Alert>

{/* Persistent condition — not dismissible */}
<Alert variant="informational" live="off">
  You are viewing a read-only archive.
</Alert>
```
