# QR Code Card

Authenticator app setup surface. Composes **Card**, **Button**, **Badge**, **Tooltip**, and **Icon** (plus **Skeleton** and **Countdown Timer** for loading / expiry). Do not invent custom cards, buttons, or timers.

## Usage

```tsx
<QrCodeCard
  issuer="Roboticela"
  accountName="ada@example.com"
  qrSrc="/api/mfa/qr.png"
  secretKey="JBSWY3DPEHPK3PXP"
  expiresInSeconds={300}
  onCopy={async (key) => navigator.clipboard.writeText(key)}
  onRefresh={async () => {
    // fetch a new QR + secret from the host
  }}
/>
```

## Features

- QR image (or `qrSlot`), manual setup key, copy + refresh actions
- Loading via Skeleton, expiry via Countdown Timer + Badge
- Tooltips on copy / refresh, keyboard-accessible Buttons
- Variants: `stacked` · `compact` · `split`
