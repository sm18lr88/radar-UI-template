# Radar UI Template Agent Guide

This file is for LLM/code agents editing `templates/radar-ui-template`. Follow it as an execution contract, not prose guidance.

## Required read order

1. `DESIGN.md` - visual tokens, component vocabulary, forbidden styling.
2. `docs/file-map.md` - ownership boundaries and extension points.
3. `docs/quality-gates.md` - final verification matrix.
4. `src/template.config.ts` - first stop for identity, enabled routes, nav, commands, metrics, records, and website copy.

## Build surfaces

- Browser surface: `npm run build`; deep links must work in Vite preview.
- Desktop surface: `npm run desktop:build`; Electron must load `dist/index.html` over `file://`.
- Do not replace the split build behavior. `vite.config.ts` switches `base` with `RADAR_DESKTOP_BUILD`.

## Commands

```bash
npm run tsc
npm run build
npm run smoke
npm run desktop:smoke
npm run desktop:pack
npm run desktop:installer
npm run desktop:install-smoke
npm run copy-smoke
npm run package-smoke
```

`npm run tsc` first asserts that the resolved compiler major is TypeScript 7. Do not bypass it with a global compiler.

## Ownership rules

- Public imports: use `src/index.ts` exports or package exports only.
- Public composition: `src/index.ts` exports the supported shell, command, provider, primitive, hook, and named prop/context types.
- Private internals: `src/demo`, `src/routing.ts`, modal implementation hooks, `src/App.tsx` route wiring, and `electron/main.cjs` lifecycle code.
- App identity, route inclusion, and demo copy belong in `src/template.config.ts` unless a new structural field is required.
- Exclude a route with its surface registry `enabled` field; route, nav, and command projections update together.
- Desktop product name is top-level `package.json` `productName`; app id is `build.appId`.

## Do not do

- Do not add product-specific APIs, live hooks, backend clients, or sibling package imports.
- Do not put common app identity, nav labels, command labels, or demo records directly inside reusable components.
- Do not use root-only aliases such as `../node_modules/typescript-7/bin/tsc`.
- Do not copy skill files into this template.
- Do not bypass the self-cleaning copy/package/install scripts with ad hoc fixed temp directories.

## Quality requirements

- TypeScript/JS: no `any`, no type suppressions, no non-null assertions.
- Styling: use theme tokens and shared classes, not raw gray/white/slate surfaces.
- Browser: verify `/app`, `/app/table`, `/app/detail`, `/app/preferences`, `/app/states`, `/primitives`, `/site`, command palette, theme toggle, dialog, keyboard focus, empty/error states, desktop and mobile widths.
- Desktop: verify Electron source launch, internal links, hide-to-tray on close, restore/quit path, portable artifact, NSIS installer, install, packaged executable, and uninstall when desktop packaging changes.
- Copyability: run detached smoke when package metadata, docs, exports, scripts, or packaging files change.
