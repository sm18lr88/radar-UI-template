# Component Inventory

LLM inventory of reusable and private surfaces.

## Public primitives

- `Badge`: status, note, structural, and accent tones.
- `StatusDot`: compact health/status indicator.
- `Card`, `MetricTile`: reusable content surfaces.
- `Dialog`: modal container with overlay and close affordance.
- `PageHeader`: consistent route hierarchy with optional action slot.
- `EmptyState`, `LoadingState`, `ErrorState`: reusable state blocks.
- `TemplateProviders`: wraps theme and toast providers for app consumers.

Public primitives must be exported through `src/index.ts` before downstream use.

## Public composition surfaces

- `AppShell`: configurable brand, nav, command trigger, scope slot, right extras, theme toggle.
- `CommandPalette`: command schema from config, keyboard navigation, empty results.
- `ThemeProvider`: light/dark class and `colorScheme` with local storage.
- `ToastProvider`: theme-aware toast stack.

These are intentionally exported through `src/index.ts`, along with their named prop/context types. Import them from the package root rather than deep paths.

## Private implementation surfaces

- `src/demo/*`: example pages and opinionated fixture copy.
- `src/routing.ts`: internal browser/Electron route adapter.
- `src/components/ui/useModalDialog.ts`: modal implementation detail.

Do not deep-import private surfaces from downstream apps.

## Demo routes

- `/app`: dashboard overview.
- `/app/table`: dense table pattern.
- `/app/detail`: detail/drawer pattern.
- `/app/preferences`: dialog/form pattern.
- `/app/states`: loading, empty, and error state blocks.
- `/primitives`: primitive gallery.
- `/site`: website/landing page surface.

## Desktop surfaces

- `electron/main.cjs`: desktop window/tray lifecycle.
- `scripts/desktop-smoke.mjs`: source and installed executable smoke.
- `scripts/desktop-build.mjs`: Electron `file://` build mode.
- `scripts/desktop-package.mjs`: Windows artifact staging and copy-back.

Desktop surfaces are part of the template contract. Update docs and smoke checks when behavior changes.
