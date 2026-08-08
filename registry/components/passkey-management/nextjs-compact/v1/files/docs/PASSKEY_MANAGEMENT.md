# Passkey Management

Manage registered WebAuthn credentials. Composes **Data Table**, **Card**, **Badge**, **Button**, **Dialog**, and **Empty State** (plus **Text Input** for rename and **Tag** for filters). Do not invent custom tables or dialogs.

## Usage

```tsx
<PasskeyManagement
  passkeys={[
    {
      id: "1",
      name: "MacBook Pro",
      device: "mac",
      browser: "Safari",
      os: "macOS 15",
      createdAt: "2026-01-12",
      lastUsedAt: "2026-08-01",
      isDefault: true,
    },
  ]}
  onRename={async (id, name) => {}}
  onRemove={async (id) => {}}
  onSetDefault={async (id) => {}}
  onAdd={() => {}}
/>
```

## Features

- Device icons, browser / OS columns, created & last-used dates
- Default Badge, rename / remove Dialogs, set-default action
- Search, sort, and device filters
- Empty State when no credentials are registered
