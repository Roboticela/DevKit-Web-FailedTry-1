# Toast (045)

Temporary feedback for events that do **not** need sustained attention (Saved, Copied, Export started).

Prefer **Alert** for persistent / critical in-context conditions. Error toasts default to **persistent** so critical failures are not solely disappearing notices.

## Variants

`neutral` · `informational` · `success` · `warning` · `error`

## Features

- Icon, message, optional action, dismiss
- Auto-dismiss (`duration`) or persistent (`duration={null}` / error default)
- Pause timer on hover / focus
- `ToastProvider` queues toasts (`maxVisible` default 3); `groupKey` replaces duplicates
- Placement: `auto` (mobile bottom-center, desktop bottom-end) + safe-area + optional `bottomOffset` for bottom nav
- Subtle enter motion; no bounce; reduced-motion honored
- Live regions: status (polite) / alert (assertive for warning & error)

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Toast.tsx`, `styles/toast.css` |
| `vite-express-tauri` | `src/components/ui/Toast.tsx`, `src/styles/toast.css` |

## Example

```tsx
<ToastProvider placement="auto" maxVisible={3} bottomOffset={56}>
  <App />
</ToastProvider>

const { publish } = useToast();

publish({
  variant: "success",
  message: "Changes published",
  groupKey: "publish",
});

publish({
  variant: "error",
  message: "Couldn’t save — try again",
  // persistent by default
  action: { label: "Retry", onClick: retry },
});
```
