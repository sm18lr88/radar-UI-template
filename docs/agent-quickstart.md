# Agent Quickstart

Use this as the minimal LLM execution path.

## Step order

1. Read `AGENTS.md`.
2. Read `DESIGN.md`.
3. Read `docs/file-map.md`.
4. Identify touched surface: browser, desktop, package/export, theme, demo, docs.
5. Make the smallest change in the owning file.
6. Run the matching gates from `docs/quality-gates.md`.
7. Remove task-created temp artifacts before final response.

## Fast routing

| Request touches | Start here | Must also check |
| --- | --- | --- |
| Brand/copy/routes/nav/commands/demo data | `src/template.config.ts` | Toggle the route's `enabled` field to exclude a surface |
| Visual tokens | `DESIGN.md`, then `src/theme/*` | browser smoke |
| Reusable UI primitive | `src/components/ui/*` | `src/index.ts`, `docs/component-inventory.md` |
| App route/demo screen | `src/App.tsx`, `src/demo/*` | `src/tests/smoke.spec.ts` |
| Desktop window/tray | `electron/main.cjs` | `scripts/desktop-smoke.mjs` |
| Windows package/install | `package.json`, `scripts/desktop-package.mjs` | `desktop:install-smoke` |
| Public package API | `src/index.ts`, `package.json` exports | package smoke and copy smoke |

## Stop conditions

- Stop and ask only if a requested change needs a product decision not represented in config or docs.
- Otherwise implement and verify; do not return a plan when the edit is clear.
