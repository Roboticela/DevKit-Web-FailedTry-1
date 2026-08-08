# Continue With Provider

Foundation for third-party authentication buttons. Composes **Button**, **Icon**, **Tooltip**, and **Divider** (via Group).

Provider-specific packages (**Continue With Google**, GitHub, …) **must extend this** — do not fork layout or invent parallel auth buttons.

## Composition

| Primitive | Role |
|-----------|------|
| Button | Label, loading, disabled, sizes, keyboard |
| Icon | Provider mark |
| Tooltip | Optional supplementary hint |
| Divider | Group separator (“Or continue with”) |

## States

`idle` · `loading` · `success` · `error` · `disabled`

## Usage

```tsx
<ContinueWithProvider
  provider="custom"
  label="Continue with Acme"
  icon={<AcmeMark />}
  state="idle"
  onContinue={(id) => startOAuth(id)}
/>

<ContinueWithProvider.Group dividerLabel="Or continue with">
  <ContinueWithGoogle onContinue={() => startGoogle()} />
  <ContinueWithGitHub onContinue={() => startGitHub()} />
</ContinueWithProvider.Group>
```

## Accessibility

- Button remains the interactive control (focus + keyboard)
- Loading announces via Button `loadingLabel`
- Soft status live region for success/error
- Icons are decorative inside the labeled Button

## Anti-patterns

- Do not build provider buttons from raw Button alone when a Continue With * package exists
- Do not put critical OAuth instructions only in the Tooltip
