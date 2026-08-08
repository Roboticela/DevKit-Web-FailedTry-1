# Backup Codes

Two-factor recovery codes. Composes **Card**, **Button**, **Dialog**, **Alert**, and **Icon** (plus **Checkbox** for acknowledgement). Do not invent custom cards or dialogs.

## Usage

```tsx
<BackupCodes
  codes={["A1B2C3D4", "E5F6G7H8", "I9J0K1L2", "M3N4O5P6"]}
  concealUntilReveal
  requireAcknowledgement
  onRegenerate={async () => {
    // host invalidates old codes and returns a new set
  }}
  onAcknowledgedChange={(ok) => {}}
/>
```

## Features

- Secure display (optional conceal/reveal), used-code marking
- Copy, download `.txt`, print
- Regenerate with confirmation Dialog
- Warning Alert for secure storage guidance
