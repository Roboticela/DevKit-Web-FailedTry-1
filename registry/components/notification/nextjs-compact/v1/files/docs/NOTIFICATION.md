# Notification (044)

Reusable **user-event item** (message, import finished, invite, security event, …).

Do **not** build a notification center here — hosts compose lists and panels.

## Content

- Icon or avatar
- Title (optional `titleHref` / `onTitleClick` — title only, not the whole row)
- Description
- Timestamp (relative / absolute / auto + locale)
- Unread / read
- Primary & secondary actions (separate controls)
- Dismiss (opt-in)
- Optional thumbnail

## Unread vs read

Not background alone:

- Unread indicator mark
- Stronger title weight
- Screen-reader “Unread” / “Read”
- Optional surface + border emphasis

## Truncation

Descriptions wrap by default. Set `truncateDescription` only when the consuming pattern requires it — full text stays in `title` tooltip when the description is a string.

## Actions

Independent actions stay separate and focusable. Do not make the entire notification a single click target when multiple actions exist.

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/Notification.tsx`, `styles/notification.css` |
| `vite-express-tauri` | `src/components/ui/Notification.tsx`, `src/styles/notification.css` |

## Example

```tsx
<Notification
  unread
  tone="informational"
  title="Team invitation"
  description="Alex invited you to join Design Systems."
  timestamp={Date.now() - 5 * 60 * 1000}
  timestampFormat="relative"
  primaryAction={{ label: "Accept", onClick: accept }}
  secondaryAction={{ label: "Decline", onClick: decline }}
  dismissible
  onDismiss={dismiss}
/>
```
