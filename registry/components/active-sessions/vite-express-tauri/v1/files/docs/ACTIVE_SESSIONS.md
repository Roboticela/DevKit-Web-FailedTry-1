# Active Sessions

Manage authenticated sessions across devices. Composes **Data Table**, **Card**, **Badge**, **Avatar**, **Button**, **Dialog**, **Dropdown Menu**, **Tooltip**, **Empty State** (via Data Table), **Skeleton**, **Icon**, **Tag**, **Authentication Loading**, and **Authentication Error**.

## Usage

```tsx
<ActiveSessions
  sessions={[
    {
      id: "1",
      deviceName: "MacBook Pro",
      deviceKind: "laptop",
      browser: "Chrome",
      os: "macOS 15",
      location: "San Francisco, US",
      ipAddress: "203.0.113.10",
      lastActiveAt: new Date().toISOString(),
      isCurrent: true,
      trusted: true,
    },
  ]}
  showIp
  onRevoke={async (id) => {/* revoke session */}}
  onRevokeAll={async () => {/* revoke others */}}
  onTrust={async (id, trusted) => {/* update trust */}}
/>
```

## Status

- `idle` — Card + Data Table + confirmation dialogs
- `loading` — Authentication Loading
- `error` — Authentication Error (retry returns to idle)

Use `refreshing` for Skeleton placeholders while refetching without leaving the table.
