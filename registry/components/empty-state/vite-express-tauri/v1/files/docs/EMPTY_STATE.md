# Empty State

Placeholder when a region has no items. Compose **Button** actions — do not invent empty chrome elsewhere.

## Usage

```tsx
<EmptyState
  title="No passkeys yet"
  description="Register a passkey to sign in without a password."
  icon={<KeyIcon />}
  actions={<Button onClick={onRegister}>Register passkey</Button>}
/>
```

## Variants

`stacked` · `compact` · `inline`
