# Action Group

**ID 095** — Action & Control Compositions.

Flexible semantic grouping of related actions with **mixed** visual treatment.

Unlike **Button Group (091)**, actions do not need identical chrome.

Example: `[Create]` · `[Import]` · `[More]`

## Composition

Compose existing primitives — Button, Icon Button, Split Button, menu triggers.

Do **not** create another button implementation here.

```tsx
<ActionGroup label="Document actions" orientation="responsive">
  <ActionGroup.Primary>
    <Button variant="primary">Create</Button>
  </ActionGroup.Primary>
  <ActionGroup.Item rank="secondary">
    <Button variant="secondary">Import</Button>
  </ActionGroup.Item>
  <ActionGroup.Overflow>
    <DropdownMenu label="More actions" items={moreItems}>
      <Button variant="secondary">More</Button>
    </DropdownMenu>
  </ActionGroup.Overflow>
</ActionGroup>
```

Or slots: `primary` · `actions` · `overflow`.

## Hierarchy

- **Primary** — first / emphasized region; use a primary Button variant
- **Secondary** — available without competing with primary
- **Overflow** — hand off excess secondary actions (compose Overflow Action / menu)

## Layout

| Prop | Values | Default |
|------|--------|---------|
| `orientation` | `horizontal` · `vertical` · `responsive` | `responsive` |
| `flow` | `wrap` · `nowrap` | `wrap` |
| `align` | `start` · `end` · `center` · `between` · `stretch` | `start` |
| `density` | `compact` · `standard` · `spacious` | `standard` |

`responsive` stacks on narrow viewports — does not force desktop horizontal layout on mobile.

## Unavailable actions

- `loading` / `disabled` — on the child control
- `ActionGroup.Item hidden` — omitted from layout (**no empty gap**)

## Themes

Light · Dark · High Contrast · RTL.
