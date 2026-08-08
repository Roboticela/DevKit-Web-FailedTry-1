# Registration Form

SaaS account creation. Composes **Form**, **Text Input**, **Password Input** (Password Visibility Toggle), **Password Strength**, **Password Requirements**, **Checkbox**, **Link**, **Card**, **Alert**, **Icon**, **Button**, **Continue With Provider**, **Authentication Loading**, **Authentication Error**, and **Authentication Success**.

## Usage

```tsx
<RegistrationForm
  termsHref="/terms"
  privacyHref="/privacy"
  signInHref="/login"
  providers={[
    { id: "google", label: "Continue with Google", onContinue: () => {} },
    { id: "microsoft", label: "Continue with Microsoft", onContinue: () => {} },
  ]}
  onSubmit={async ({ fullName, email, password, acceptTerms, marketingConsent }) => {
    // create account; throw { reason: "invalid" | "network" | ... } on failure
  }}
  onContinue={() => {}}
/>
```

## Status

- `idle` — Card + Form fields + social providers
- `loading` — Authentication Loading (`account-creation`)
- `error` — Authentication Error (retry returns to idle)
- `success` — Authentication Success

## Password policy

Delegates to **Password Strength** and **Password Requirements** (`flow="registration"`). Do not reimplement scoring or rule evaluation in the host.
