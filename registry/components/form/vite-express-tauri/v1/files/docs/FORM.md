# Form

Semantic form shell with header, fields, actions, and optional error summary (**Alert**). Feature forms should compose this instead of inventing wrappers.

## Usage

```tsx
<Form title="Sign in" onSubmit={handleSubmit} errorSummary={error}>
  <Form.Fields>{/* Text Input, Password Input, Checkbox */}</Form.Fields>
  <Form.Actions>{/* Button */}</Form.Actions>
</Form>
```
