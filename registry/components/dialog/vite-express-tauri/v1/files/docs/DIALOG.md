# Dialog

General modal surface. Compose **Button** in `actions`. Prefer **Alert Dialog** for destructive confirmations that must not dismiss on outside click.

## Usage

```tsx
<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Rename passkey"
  description="Choose a name you will recognize."
  actions={
    <>
      <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={save}>Save</Button>
    </>
  }
>
  <TextInput label="Name" value={name} onValueChange={setName} />
</Dialog>
```

## Sizes

`sm` · `md` · `lg`
