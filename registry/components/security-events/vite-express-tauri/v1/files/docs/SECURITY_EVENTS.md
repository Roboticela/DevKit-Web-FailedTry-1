# Security Events

Security-related account activity. Composes **Data Table**, **Timeline**, **Badge**, **Action Segmented Control** (Filter), **Search Field**, **Empty State**, **Skeleton**, **Dialog**, **Icon**, **Tag**, **Card**, and **Button**.

Do not fork Timeline or audit-log layouts — reuse this package.

## Usage

```tsx
<SecurityEvents
  events={[
    {
      id: "1",
      type: "password-change",
      timestamp: "2026-08-08T10:00:00Z",
      description: "Password updated from Settings",
      actor: "ada@example.com",
      location: "San Francisco, US",
    },
  ]}
  defaultView="timeline"
  groupBy="day"
  showExport
/>
```

## Views

- `timeline` — Timeline with day / type grouping
- `table` — Data Table with sort + search

## Event types

password-change · passkey-registration · authenticator-setup · recovery-code-generation · email-verification · login-failure · suspicious-activity · device-change · session-revocation · administrative-action
