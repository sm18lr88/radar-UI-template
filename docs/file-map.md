# File Map

LLM ownership map. Edit the owner file first; avoid cross-cutting changes unless the contract requires them.

| Path | Owns | Agent notes |
| --- | --- | --- |
| `src/template.config.ts` | App name, mark, surface registry, metrics, records, website copy | First edit for rebrands, inclusion/exclusion, and demo-data changes. |
| `src/surface-registry.ts` | Pure enabled-route, nav, and command projections plus registry invariants | Keep page components, handlers, permissions, and product data out. |
| `src/types.ts` | Public template data shapes | Change only when config/schema must grow. |
| `src/routing.ts` | Browser pathname and Electron hash routing | Preserve protocol-specific behavior and enabled-route fallback. |
| `src/App.tsx` | Surface projections and explicit page selection | Keep routes typed with `AppRoute`; do not move components into the registry. |
| `src/index.ts` | Public TypeScript exports | Update for reusable APIs only; avoid exporting demos. |
| `src/index.css` | Theme CSS import order | Keep font/theme imports centralized. |
| `public/favicon.svg` | Browser identity mark | Keep visually aligned with the generated desktop icon. |
| `src/theme/variables.css` | CSS variable source of truth | Pair token changes with `DESIGN.md`. |
| `src/theme/tailwind-theme.css` | Tailwind v4 token mapping | No raw palette drift. |
| `src/theme/components.css` | Shared component classes | Use for reusable classes, not one-off page styling. |
| `src/components/ui/` | Public UI primitives, including Tooltip, Facet, and Summary | Export through `src/components/ui/index.ts` and `src/index.ts` when public. |
| `src/components/shell/` | App chrome, nav rail, top bar | Reads config via props; do not hard-code app identity. |
| `src/components/command/` | Searchable command palette | Commands come from config. |
| `src/components/providers/` | Theme and toast providers | Keep provider stack in `TemplateProviders`. |
| `src/demo/` | Copyable example pages | Replace for products; do not treat as reusable API. |
| `src/tests/smoke.spec.ts` | Browser behavior and contrast smoke | Covers browser build, routes, command palette, theme. |
| `electron/main.cjs` | Electron main process, window, tray, lifecycle | Keep Node/Electron code isolated from React source. |
| `scripts/desktop-build.mjs` | Desktop Vite build env | Owns `RADAR_DESKTOP_BUILD=1`. |
| `scripts/check-typescript.mjs` | Compiler-major guard | Fails every type/build gate unless local TypeScript 7 resolves. |
| `scripts/desktop-icon.mjs` | Dependency-free 256px PNG generation | Generates ignored `assets/icon.png` for tray/window/installer use. |
| `scripts/desktop-package.mjs` | Windows artifact staging/copy | Stages in OS temp, copies to `release/`, cleans staging. |
| `scripts/desktop-smoke.mjs` | Electron source/packaged app smoke | Supports `RADAR_DESKTOP_EXECUTABLE` for installed-app smoke. |
| `scripts/desktop-install-smoke.mjs` | NSIS install/use/uninstall verification | Uses a self-cleaning OS temp directory. |
| `scripts/copy-smoke.mjs` | Detached copyability check | Uses a self-cleaning OS temp directory and excludes generated/test output. |
| `scripts/package-smoke.mjs` | Packed source-package contract | Checks tarball contents and typechecks a self-cleaning detached consumer. |
| `package.json` | Source-package entry/exports, scripts, product name, Electron Builder config | Source `main` stays `src/index.ts`; packaged `main` comes from `build.extraMetadata`. Pin Electron and builder exactly. |
| `vite.config.ts` | Vite plugins and browser/desktop `base` switch | Browser `/`; desktop `./`. |
| `release/` | Generated artifacts | Ignored. Do not commit. |

Public imports should flow through `src/index.ts`. Downstream apps should not import from `src/demo`, `src/routing.ts`, modal implementation hooks, or `electron` directly.
