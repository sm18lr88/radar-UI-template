# Rebrand Checklist

LLM-safe order for adapting the template to a new product.

## Edit order

1. `src/template.config.ts`: update `brand`, `surfaces`, `metrics`, and `records`.
2. `index.html`: update title and meta description.
3. `src/theme/variables.css`: retune `--color-brand`, `--color-brand-light`, and `--brand-rgb` only if the brand color changes.
4. `src/theme/tailwind-theme.css`: map any new CSS variables.
5. `DESIGN.md`: document token or component vocabulary changes before using them broadly.
6. `src/demo/*`: replace demo pages with product examples after config is correct.
7. `package.json`: for desktop products, update top-level `productName` and `build.appId`; Electron reads the name from package metadata.
9. `README.md` and docs: keep LLM-facing contracts accurate; do not convert them into marketing copy.

## Verification

Run:

```bash
npm run smoke
npm run desktop:smoke
npm run desktop:install-smoke
npm run copy-smoke
npm run package-smoke
```

If desktop package metadata changed, also run portable, installer, and installed-executable smoke from `docs/quality-gates.md`.

## Guardrails

- Do not hard-code the new brand in reusable components when `template.config.ts` can own it.
- Do not remove the browser/desktop split build invariant.
- Keep copy/package/install scripts self-cleaning; do not add fixed temp paths.
