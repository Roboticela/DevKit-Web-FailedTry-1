# Alert Dialog

High-priority modal that requires the user’s attention before continuing.

**Use for:** destructive confirmation, irreversible actions, critical warnings, security-sensitive decisions, serious errors needing acknowledgement.

**Do not use** for routine informational messages — prefer Dialog, Toast, or Alert.

## Communicates

1. **What** happened / is at stake?
2. **What** will happen if they proceed?
3. **What** choices are available?

Keep copy concise. Avoid vague labels like “OK”, “Yes”, or “Continue” when a specific verb is possible (`Delete`, `Cancel`, `Revoke access`, `Discard changes`).

## Structure

```
Title
Description
Actions — cancel (safe) + action (consequence)
```

## Deliberate interaction

| Behavior | Default |
|----------|---------|
| Outside / scrim click | **Never** dismisses |
| Escape | `cancel` — activates the safe action |
| Escape `none` | No dismiss (host configures deliberately) |
| Initial focus | **Cancel / safe action** — never the destructive action by default |
| Close (X) control | Not included — choices must be explicit |

## Actions

Pass DevKit `Button` nodes:

- `cancelAction` — safe path (quiet / secondary)
- `action` — consequence; use `variant="destructive"` when destructive

Destructive actions must be visually clear — do not rely on placement alone.

## Semantics

`role="alertdialog"` · `aria-modal="true"` · labelled by title · described by description.

Z-index: `var(--z-critical)`. Subtle opacity enter only. No scale / bounce. No box-shadow / gradients.

## Composition

```tsx
<AlertDialog
  open={open}
  onOpenChange={setOpen}
  tone="destructive"
  title="Delete this project?"
  description="This permanently removes the project and its files. This cannot be undone."
  cancelAction={
    <Button variant="quiet" onClick={() => setOpen(false)}>
      Cancel
    </Button>
  }
  action={
    <Button variant="destructive" onClick={onDelete}>
      Delete project
    </Button>
  }
/>
```
