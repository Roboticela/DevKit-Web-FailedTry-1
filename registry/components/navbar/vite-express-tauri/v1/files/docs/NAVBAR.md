# Navbar

Slot-based primary navigation composition.

## Slots
`brand`, `primary`, `secondary`, `search`, `actions`, `account`, `mobileTrigger`, `context`

## Layouts
`standard` | `minimal` | `split` | `centered` | `compact`

## Behavior
`static` | `sticky`; `scrolled` compact chrome; safe-area insets; primary collapses below `md` (use NavigationDrawer + mobileTrigger).

## Composition
Compose Brand, NavItem, SearchField, IconButton, Badge, Avatar, ActionSegmentedControl, DropdownMenu, NavigationDrawer from the registry — do not recreate them inside Navbar.

## Anti-patterns
- Do not hardcode product-specific links inside the package.
- Do not use box-shadow or blur glass for elevation.
