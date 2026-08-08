# Authenticator App Setup

TOTP enrollment flow. Composes **QR Code Card**, **Verification Code Input**, **Button**, **Alert**, **Authentication Loading**, **Verification Success**, and **Verification Failed**. Do not reinvent QR or OTP cells.

## Usage

```tsx
<AuthenticatorAppSetup
  issuer="Roboticela"
  accountName="ada@example.com"
  qrSrc="/api/mfa/qr.png"
  secretKey="JBSWY3DPEHPK3PXP"
  expiresInSeconds={300}
  onQrRefresh={async () => {}}
  onVerify={async (code) => {
    // verify TOTP; throw { reason: "invalid" } on failure
  }}
  onContinue={() => {}}
/>
```

## Status

- `setup` — instructions + QR Code Card + Verification Code Input
- `verifying` — Authentication Loading
- `success` — Verification Success
- `failed` — Verification Failed (retry returns to setup)
