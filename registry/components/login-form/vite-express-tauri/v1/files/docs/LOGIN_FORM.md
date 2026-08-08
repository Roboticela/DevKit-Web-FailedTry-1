# Login Form

Modern SaaS sign-in. Composes **Form**, **Text Input**, **Password Input** (Password Visibility Toggle), **Checkbox**, **Link**, **Card**, **Alert**, **Icon**, **Button**, **Continue With Provider**, **Authentication Loading**, **Authentication Error**, and **Authentication Success**.

## Usage

```tsx
<LoginForm
  identifierMode="email"
  forgotPasswordHref="/forgot-password"
  providers={[
    { id: "google", label: "Continue with Google", onContinue: () => {} },
    { id: "microsoft", label: "Continue with Microsoft", onContinue: () => {} },
  ]}
  onSubmit={async ({ identifier, password, rememberMe }) => {
    // authenticate; throw { reason: "invalid" | "locked" | ... } on failure
  }}
  onContinue={() => {}}
/>
```

## Status

- `idle` — Card + Form fields + social providers
- `loading` — Authentication Loading
- `error` — Authentication Error (retry returns to idle)
- `success` — Authentication Success
