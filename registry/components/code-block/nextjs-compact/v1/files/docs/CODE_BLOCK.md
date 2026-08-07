# Code Block

Multiline source code or preformatted technical content.

Not a code editor. For short inline tokens use **Code (087)**.

## Features

| Feature | Notes |
|---------|--------|
| Language indicator | `language` + `showLanguage` |
| Line numbers | Optional (`showLineNumbers`) — **never** included in copied text |
| Copy | Uses Icon Button classes by default; override with `copyAction` (compose DevKit `IconButton`) |
| Copy feedback | Polite `aria-live` announcement |
| Overflow | Default **`scroll`** (preserve formatting); opt-in **`wrap`** |
| Highlighted lines | `highlightedLines` — background + edge mark (not color alone) |
| Collapsed | Preview + expand/collapse when source exceeds `collapsedLines` |
| States | `idle` · `loading` · `empty` · `error` |
| Bounded height | `maxHeight` (default `24rem`) — container does not grow infinitely |
| Large files | `startLine`, `totalLines`, `renderLine` for host virtualization / windowing |

## Copy

```tsx
<CodeBlock
  language="ts"
  showLineNumbers
  code={`const id = userId;\nconsole.log(id);`}
  copyAction={({ copy, copied, copyLabel, copiedLabel }) => (
    <IconButton
      size="sm"
      variant="subtle"
      label={copied ? copiedLabel : copyLabel}
      icon={copied ? <CheckIcon /> : <CopyIcon />}
      onClick={() => void copy()}
    />
  )}
/>
```

Copied text is the plain `code` string only.

## Syntax highlighting

Pass structured `children` (or `renderLine`) with `data-dk-token` hooks:

`keyword` · `string` · `comment` · `number` · `punctuation`

Tokens use weight / style / marks in addition to color. High contrast reinforces non-color cues.

## Direction

- **Code** region: always `dir="ltr"` (syntax).
- **Chrome** (language, actions): follows surrounding RTL UI.

## Themes

Light · Dark · High Contrast · `prefers-reduced-motion` (loading spinner).
