# Link Button (005)

Action control that **looks like a link** but performs an application action.

## Semantics (important)

| Kind | Element | Use when |
|------|---------|----------|
| Navigation link | `<a href>` | Changes location / opens a URL |
| **Link Button** | `<button>` | In-app action with link-like chrome |
| Button | `<button>` (Button 001) | Primary/secondary command chrome |

**Do not** render this component as an anchor for actions. **Do not** use Button 001 styling for quiet textual actions when a link affordance is clearer.

## Anatomy

1. Optional leading icon  
2. Underlined label  
3. Optional trailing icon  
4. Optional external indicator (decorative)

## API

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| `children` | `ReactNode` | required | Label |
| `layout` | `inline` \| `standalone` | `standalone` | Inline keeps persistent underline; standalone underlines on hover/focus |
| `tone` | `accent` \| `neutral` \| `destructive` | `accent` | |
| `leadingIcon` | `ReactNode` | — | |
| `trailingIcon` | `ReactNode` | — | |
| `external` | `boolean` | `false` | Visual external affordance only |
| `disabled` | `boolean` | `false` | |

## Underline

Consistent with calm typography:

- **inline** — underline at rest (muted), full color on hover/focus  
- **standalone** — transparent underline at rest, visible on hover/focus/press  

No extra ornaments, gradients, or shadows.

## Accessibility

- Native button keyboard (Enter / Space)  
- Visible focus ring  
- ≥44×44 hit area (especially standalone)  
- Long labels wrap (`overflow-wrap: anywhere`) without blowing layout  
- RTL via logical alignment; icons follow DOM order  
- Reduced motion: shorter color transitions  
- High contrast: thicker underline  

## Install

| Template | Files |
|----------|-------|
| `nextjs-compact` | `components/ui/LinkButton.tsx`, `styles/link-button.css` |
| `vite-express-tauri` | `src/components/ui/LinkButton.tsx`, `src/styles/link-button.css` |
