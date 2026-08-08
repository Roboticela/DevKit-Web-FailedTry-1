# Select Authentication Method

Choose how to authenticate. Composes **Card**, **Button**, **Radio Group**, **Divider**, and **Icon**. Do not invent custom selection controls.

## Usage

```tsx
<SelectAuthenticationMethod
  recommendedMethod="passkey"
  methods={["password", "passkey", "magic-link"]}
  onContinue={async (method) => {
    // route to password / passkey / magic-link flow
  }}
  providers={[
    { id: "google", label: "Continue with Google", onContinue: () => {} },
  ]}
/>
```

## Methods

Password, Passkey, Authenticator App, Email Verification Code, SMS Verification Code, Recovery Code, Magic Link — each with a meaningful Icon, description, and optional Recommended Badge.
