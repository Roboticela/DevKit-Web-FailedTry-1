# Icon System

**Package:** `icon` · **Layer:** 1 Foundation · **ID:** 51  
**Group:** Icon System  
**Templates:** `nextjs-compact`, `vite-express-tauri`

## Purpose

Premium Apple-inspired icon language — consistent stroke (1.5), 24×24 proportions, optical text alignment, theming via `currentColor`, and a searchable registry with aliases + a11y labels.

## Variants

| Variant | Use |
|---------|-----|
| `outlined` | Default UI |
| `filled` | Selected / emphasis |
| `duotone` | Soft fill + stroke |
| `status` | Semantic color (success, warning, …) |

## Categories

navigation, actions, communication, ai, automation, files, billing, analytics, security, settings, collaboration, notifications, media, commerce, development, accessibility, status, brand

## API

```tsx
import { Icon, IconLabel, IconButton, searchIcons } from "@/components/ui/Icon";

<Icon name="search" label="Search" size="md" />
<Icon name="sparkles" variant="duotone" status="ai" />
<IconLabel icon="settings">Preferences</IconLabel>
<IconButton name="trash" label="Delete" tone="danger" />

searchIcons("bill"); // credit-card, receipt, …
```

## Companions

`icon-button`, `animated-icon`, `status-icon`, `brand-icon`, `file-icon`, `social-icon`, `ai-icon`, `emoji-renderer`, `icon-badge`

## Rules

- Every interactive control that has an icon must use a **meaningful** `label` (visible or `aria-label`)
- Prefer registry names over custom SVGs
- Decorative icons: omit `label` (auto `aria-hidden`)
