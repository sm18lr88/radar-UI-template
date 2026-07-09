# Template Design Contract

This file is the visual and interaction authority for LLM agents editing the template.

## 1. Direction

Radar-inspired, cool, professional, and data-dense. The surface uses blue-tinted neutral layers, restrained brand blue, DM Sans Variable, DM Mono, subtle borders, and dimensional shadows. It should read as an operational control room, not a generic gray dashboard or decorative marketing toy.

Signature material: layered blue-neutral surfaces separated by tonal shifts, hairline borders, and restrained cool glows. Signature interaction: command-driven navigation that remains fully keyboard accessible.

## 2. Tokens

- Backgrounds: `bg-theme-base`, `bg-theme-sidebar`, `bg-theme-surface`, `bg-theme-elevated`, `bg-theme-hover`, `bg-theme-active`.
- Text: `text-theme-text-primary`, `text-theme-text-secondary`, `text-theme-text-tertiary`, `text-theme-text-disabled`.
- Borders: `border-theme-border`, `border-theme-border-light`, `border-theme-border-subtle`.
- Accent: `bg-accent`, `text-accent`, `text-accent-text`, `bg-accent-muted`.
- Status: `text-status-success`, `text-status-warning`, `text-status-error`, `text-status-info`, `.status-*`, `.status-dot-*`.
- Elevation: `shadow-theme-sm`, `shadow-theme-md`, `shadow-theme-lg`, `shadow-drawer`, `shadow-glow-brand-sm`.

Raw palette values belong only in `src/theme/variables.css`, `src/theme/tailwind-theme.css`, or centralized component classes in `src/theme/components.css`. JSX must use semantic tokens/classes.

## 3. Typography

- UI: DM Sans Variable through `font-sans` or inherited root typography.
- Code and keyboard hints: DM Mono through `font-mono` or `.inline-code`.
- Use Tailwind's standard type scale. Do not add arbitrary type sizes.
- Headings use restrained tracking and weight; body copy favors compact readable line lengths.

## 4. Layout and responsiveness

- Full-height shells use `min-h-[100dvh]`, never `h-screen`.
- Desktop at `md` and above uses the collapsible left rail.
- Mobile uses the header navigation select and icon command trigger; no route may become unreachable when the rail is hidden.
- Required QA widths: 390, 768, and 1440 CSS pixels.
- Dense tables may scroll inside their own container; the page itself must not horizontally overflow.
- Electron window minimum is 360×560 and must remain usable at that size.

## 5. Components and states

- `AppShell`: desktop rail, mobile route selector, top bar, command trigger, theme toggle, slots.
- `CommandPalette`: modal combobox/listbox, arrow navigation, empty results, Escape close, trapped focus, focus return.
- `Badge` and `StatusDot`: semantic status, note, structural, and accent vocabulary.
- `PageHeader`: consistent route hierarchy with eyebrow, title, description, and optional actions.
- `Card`, `MetricTile`: reusable content surfaces with optional heading/action anatomy.
- `Dialog`: labelled/described modal, overlay close, Escape close, focus trap, focus return.
- `EmptyState`, `LoadingState`, `ErrorState`: reusable state blocks; loading uses `role=status`, error uses `role=alert`.
- `ToastProvider`: polite live region with bounded visible stack and timed removal.

Every interactive primitive needs default, hover, active, focus-visible, disabled where applicable, keyboard, reduced-motion, light, and dark behavior.

## 6. Motion

- Motion communicates interaction/state only.
- Prefer `transform`, `opacity`, and color transitions.
- Rail width transition is the only accepted layout transition; preserve reduced-motion override.
- Do not add decorative looping motion. Loading spinner is state communication.

## 7. Accessibility

- Primary text/background contrast: at least 4.5:1.
- Focus/control boundaries: at least 3:1.
- Every icon-only button requires an accessible name.
- Modals trap focus, close with Escape, and restore focus.
- Desktop and mobile navigation must expose the same enabled routes.
- Status cannot rely on color alone when user-facing meaning is required.
- Reduced motion must preserve all content and interaction.

## 8. Desktop constraints

- Browser routes use pathnames; Electron `file://` routes use hashes.
- Internal links must use `routeHref`; imperative navigation uses `navigateToRoute`.
- Packaged renderer has no Node access and no permissions.
- New windows, webviews, and navigation outside the bundled index are denied.
- Desktop icon is generated from the template's visual language during desktop builds.

## Must not

- Must not hard-code common app identity outside `src/template.config.ts` or top-level `package.json` desktop metadata.
- Must not import product APIs or sibling package internals.
- Must not use raw gray/slate/white surface utilities or raw status colors in JSX.
- Must not use emoji as icons; use lucide-react or SVG.
- Must not ship a visually correct state without keyboard focus, contrast, reduced-motion, mobile, and Electron checks.
