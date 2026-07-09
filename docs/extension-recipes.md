# Extension Recipes

LLM recipes for common template changes. Follow the order; verify with `docs/quality-gates.md`.

## Add a browser route

1. Add the route literal to `APP_ROUTES` in `src/types.ts`.
2. Add its required definition to `surfaces.routes` in `src/template.config.ts`.
3. Add nested nav and command metadata when user-facing, with independent channel order values.
4. Render the page from `src/App.tsx`.
5. Put example-only UI in `src/demo`; put reusable UI in `src/components/ui` only after a second caller exists.
6. Add or update browser and Electron smoke coverage for the route.

## Exclude a surface

1. Set the route's `enabled` field to `false` in `src/template.config.ts`.
2. Leave or remove its nav/command definitions; disabled surfaces disappear from every projection automatically.
3. Remove implementation files only when the exclusion is permanent for the copied product.
4. Keep `surfaces.defaultRoute` enabled; registry validation enforces this at startup.

## Include or exclude a section/component

1. For app chrome, use the existing `AppShell` slots (`scopeControls`, `rightExtras`, `children`) instead of branching inside the shell.
2. For route content, edit the owning file under `src/demo/`; permanent product exclusions should delete unused JSX rather than add long-lived feature flags.
3. Add a config flag only when the same built artifact must support both states at runtime. Put that typed flag in `TemplateConfig`, not in a reusable component.
4. Remove obsolete exports from `src/index.ts` when deleting a public primitive.
5. Keep every rendered button/link/select functional and add one observable smoke assertion for its outcome.

## Add a nav item

1. Edit `src/template.config.ts`.
2. Add nested `nav` metadata to the route with a lucide icon, stable `id`, unique `order`, label, and description.
3. Do not modify `AppShell` unless nav rendering behavior changes.

## Add a command

1. Edit the route's nested `command` metadata in `src/template.config.ts`.
2. Include a unique `id` and `order`, label, description, and keywords; the route path is projected from its registry key.
3. Command palette filtering/navigation should not need changes.

## Add a reusable primitive

1. Confirm at least two callers or a real public API need.
2. Add the component under `src/components/ui`.
3. Export from `src/components/ui/index.ts` and `src/index.ts` only if public.
4. Document in `docs/component-inventory.md` and `DESIGN.md` if it changes the component vocabulary.

## Add a theme token

1. Document the token in `DESIGN.md`.
2. Add the CSS variable in `src/theme/variables.css`.
3. Map it in `src/theme/tailwind-theme.css`.
4. Use token classes; do not introduce raw gray/white/slate surfaces.

## Change desktop window or tray behavior

1. Edit `electron/main.cjs`.
2. Update `scripts/desktop-smoke.mjs` for the observable behavior.
3. Run `npm run desktop:smoke`.
4. If packaging behavior changes, run `desktop:pack`, `desktop:installer`, and installed-executable smoke.

## Change packaging/install behavior

1. Edit `package.json` Electron Builder config or `scripts/desktop-package.mjs`.
2. Keep Electron version exact, not a semver range.
3. Keep packaging staged outside the workspace and copied into `release/`.
4. Run portable and `desktop:install-smoke` verification.
5. Preserve `finally` cleanup for every temp directory.
