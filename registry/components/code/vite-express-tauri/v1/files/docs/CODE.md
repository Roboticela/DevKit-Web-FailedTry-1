# Code

Short inline technical content — commands, identifiers, and keyboard shortcuts.

Uses the global `--font-mono` token. **No syntax highlighting** — that belongs to Code Block (088) or a higher-level system.

## Variants

| `variant` | Default element | Use |
|-----------|-----------------|-----|
| `inline` (default) | `code` | Commands / short snippets (`npm install`) |
| `identifier` | `code` | Names/ids (`userId`) — prefers scroll over careless breaks |
| `keyboard` | `kbd` | Shortcuts (`Ctrl + K`) |

```tsx
Run <Code>npm install</Code> then restart.

The field <Code variant="identifier">userId</Code> is required.

Press <Code variant="keyboard">Ctrl + K</Code> to open search.
```

## Overflow

| `overflow` | Behavior |
|------------|----------|
| `wrap` | Soft wrap (default for `inline`) |
| `nowrap` | Single line |
| `scroll` | Single line + horizontal scroll (default for `identifier`) |

Do not break code identifiers arbitrarily when that would change meaning — prefer `scroll` for long tokens.

## Compact

Inline code uses a light surface and small padding — not a large container. Full multi-line listings belong in Code Block.

## Themes

Light · Dark · High Contrast · RTL (unicode-bidi isolate for mixed scripts).
