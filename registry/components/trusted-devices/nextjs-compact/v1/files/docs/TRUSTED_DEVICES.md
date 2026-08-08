# Trusted Devices

Manage remembered devices used during authentication. Composes **Card**, **Badge**, **Avatar**, **Button**, **Dialog**, **Empty State**, **Icon**, and **Text Input** (rename).

## Usage

```tsx
<TrustedDevices
  devices={[
    {
      id: "1",
      name: "MacBook Pro",
      deviceKind: "laptop",
      browser: "Chrome",
      os: "macOS 15",
      lastActiveAt: new Date().toISOString(),
      trustedAt: "2026-01-12",
      isCurrent: true,
    },
  ]}
  onRename={async (id, name) => {/* persist */}}
  onRemove={async (id) => {/* revoke trust */}}
  onRemoveAll={async () => {/* clear all */}}
/>
```

## Actions

- **Rename** — Dialog + Text Input
- **Remove** — confirmation Dialog
- **Remove all** — bulk confirmation Dialog
