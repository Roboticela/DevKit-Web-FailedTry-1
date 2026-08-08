# Two-Factor Authentication

Orchestrates the complete 2FA workflow. Composes **Select Authentication Method**, **Verification Code Input**, **Authenticator App Setup**, **Backup Codes**, **Recovery Code Login**, **Authentication Loading**, **Authentication Success**, and **Authentication Error**. Never recreate OTP, QR, recovery, or status chrome.

## Modes

- `challenge` — pick a method → verify (OTP / passkey / recovery) → success / error
- `enroll` — Authenticator App Setup → Backup Codes → success

## Usage

```tsx
<TwoFactorAuthentication
  mode="challenge"
  methods={["authenticator-app", "email-code", "sms-code", "passkey", "recovery-code"]}
  onStartChallenge={async (method) => {}}
  onVerifyCode={async ({ method, code }) => {}}
  onAuthenticatePasskey={async () => {}}
  onAuthenticateRecoveryCode={async (code) => {}}
  codeExpiresInSeconds={60}
  onComplete={({ method }) => {}}
/>
```

```tsx
<TwoFactorAuthentication
  mode="enroll"
  issuer="Roboticela"
  accountName="ada@example.com"
  qrSrc="/api/mfa/qr.png"
  secretKey="JBSWY3DPEHPK3PXP"
  backupCodes={["A1B2C3D4", "E5F6G7H8"]}
  onEnrollVerify={async (code) => {}}
  onBackupCodesRegenerate={async () => {}}
/>
```

## Extensibility

Use `renderMethodChallenge` / `passkeySlot` / method slots for future authentication methods without forking the orchestrator.
