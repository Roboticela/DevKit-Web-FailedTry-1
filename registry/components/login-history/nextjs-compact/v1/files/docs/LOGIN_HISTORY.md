# Login History

Authentication history timeline. Composes **Data Table**, **Badge**, **Avatar**, **Tooltip**, **Action Segmented Control** (Filter), **Search Field** (Search Input), **Empty State**, **Skeleton**, **Icon**, **Tag**, **Card**, and **Button**.

## Usage

```tsx
<LoginHistory
  events={[
    {
      id: "1",
      timestamp: "2026-08-08T08:30:00Z",
      outcome: "success",
      method: "passkey",
      deviceKind: "laptop",
      deviceName: "MacBook Pro",
      browser: "Chrome",
      os: "macOS 15",
      location: "San Francisco, US",
    },
  ]}
  showExport
  onExport={(rows, format) => {
    // optional host-owned export; default CSV download when omitted
  }}
/>
```

## Filters

- Outcome filter — Action Segmented Control (`all` · `success` · `failure`)
- Method filter — Tag chips for methods present in the dataset
- Search — Search Field via Data Table

## Export

Exports the currently filtered + searched rows as CSV (or via `onExport`).
