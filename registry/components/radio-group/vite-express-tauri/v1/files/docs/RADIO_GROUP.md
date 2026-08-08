# Radio Group

Mutually exclusive single-select. Composes **Radio**. Do not invent custom radio chrome.

## Usage

```tsx
<RadioGroup
  label="Authentication method"
  value={method}
  onValueChange={setMethod}
  items={[
    { value: "password", label: "Password", description: "Sign in with your password." },
    { value: "passkey", label: "Passkey", description: "Use Face ID, Touch ID, or a security key." },
  ]}
/>
```

## Features

- `role="radiogroup"` with keyboard-native radio navigation
- Icon + trailing slots on each Radio
- Vertical / horizontal / responsive orientation
- Validation and disabled states
