# Paragraph

Readable body content — descriptions, instructions, explanations, long-form, and supporting text.

## Variants

Only when matching global tokens exist:

| `variant` | Tokens |
|-----------|--------|
| `standard` (default) | `--font-size-body`, `--line-height-body`, primary text |
| `lead` | `--font-size-body-lg` / `--font-size-lg`, comfortable body line-height |
| `secondary` | `--font-size-body-sm` (fallback body), secondary text color |

Do not invent arbitrary paragraph sizes.

## Measure

| `measure` | Behavior |
|-----------|----------|
| `reading` (default) | Caps width with `--content-width-reading` / `--reading-width` (fallback `65ch`) |
| `none` | Fills the parent |

On mobile, reading measure uses available width; side spacing comes from the host layout.

## Rhythm

Consecutive `.dk-paragraph` siblings get modest `margin-block-start` (`--space-3`) — enough separation without excessive gaps between short paragraphs. Do not use `<br>` for layout spacing.

## Inline content

Links use underline + link color (not color alone) with visible `:focus-visible`. `strong` / `em` / `code` remain readable.

```tsx
<Paragraph variant="lead">
  Welcome to the workspace overview.
</Paragraph>
<Paragraph>
  Use this area for instructions and explanations. Inline{" "}
  <a href="#docs">links</a> and <strong>emphasis</strong> stay accessible.
</Paragraph>
<Paragraph variant="secondary">
  Supporting note — quieter than the primary body.
</Paragraph>
```

## Themes

Light · Dark · High Contrast · LTR / RTL · localization · dynamic type.
