# Input Group (020)

Compositional primitive that joins an input with **related** prefixes, suffixes, icons, units, currency, or actions.

## Purpose

Contextual composition around form controls — not a generic layout component.

Do not merge unrelated controls merely because they can share a border.

## Patterns

| Pattern | Composition |
|---------|-------------|
| Prefix | `Addon` + `Input` |
| Suffix / unit / currency | `Input` + `Addon` |
| Leading / trailing icon | `Icon` + `Input` / `Input` + `Icon` |
| Action | `Input` + `Button` |
| Search + action | `Input` (Search Field) + `Button` |

## Compound API

```tsx
<InputGroup label="Website">
  <InputGroup.Addon>https://</InputGroup.Addon>
  <InputGroup.Input>
    <TextInput label="Domain" hideLabel placeholder="example.com" />
  </InputGroup.Input>
</InputGroup>
```

Slots: `Addon` · `Icon` · `Input` · `Button`

## States

Group shell reflects: focus-within · error · success · warning · disabled · read-only · loading

Nested controls keep independent focus indicators and remain independently accessible.

## Layout

| `orientation` | Behavior |
|---------------|----------|
| `responsive` (default) | Row on wider viewports; stack under 480px |
| `horizontal` | Always row |
| `vertical` | Always column |

`attached` (default `true`) shares one border. Set `false` for spaced related controls.

## Composes with

Text Input · Number Input · Search Field · Button · Icon Button · Date/Time inputs · future form primitives

Pass `hideLabel` on nested fields when the group already provides the label.
