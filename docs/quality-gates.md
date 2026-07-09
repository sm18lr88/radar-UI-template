# Quality Gates

Run the smallest gate set that covers the changed surface. Run the full matrix for release/package changes.

## Always

```bash
npm run tsc
```

## Browser UI, routes, theme, or config

```bash
npm run smoke
```

The command rebuilds browser `dist/` and covers pathname routing, enabled-route fallback, desktop/mobile navigation, command palette, dialog focus restoration, state surfaces, and contrast.

## Electron UI or lifecycle

```bash
npm run desktop:smoke
```

The command rebuilds desktop `dist/`, launches Electron, exercises command and internal-link navigation, checks renderer errors, verifies hide-to-tray, verifies restore through the single-instance path, and quits.

## Windows packaging/install

```bash
npm run desktop:pack
npm run desktop:install-smoke
```

`desktop:install-smoke` builds the NSIS installer, installs into an OS temp directory, drives the installed executable, invokes the uninstaller, and removes the temp directory in `finally`.

Check packaged contents when dependencies or Electron Builder config changes:

```powershell
npm run desktop:dir
$asar = "release/win-unpacked/resources/app.asar"
node -e "const asar=require('@electron/asar'); const files=asar.listPackage(process.argv[1]); console.log(files.filter(f=>f.includes('node_modules')));" $asar
```

Expected: no packaged `node_modules`; the renderer is already bundled.

## Copyability/package surface

```bash
npm run copy-smoke
npm run package-smoke
```

The copy smoke installs with lifecycle scripts disabled, runs browser and desktop builds, and removes its OS temp directory in `finally`. The package smoke inspects the actual tarball, installs it into a detached consumer, typechecks public imports, and also cleans its OS temp directory in `finally`.

## Dependency/security

```bash
npm audit --omit=dev
```

## Final temp check

Scripts must clean their own staging directories. Before final response, verify no task artifacts remain:

```powershell
$tempRoot = [IO.Path]::GetTempPath()
Get-ChildItem -LiteralPath $tempRoot -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -like "radar-ui-template*" -or $_.FullName -like "*radar-ui-template*" }
```

## Manual visual pass when UI changes

1. Inspect `/app`, `/app/table`, `/app/detail`, `/app/preferences`, `/app/states`, `/primitives`, `/site`.
2. Toggle light/dark mode.
3. Use desktop rail and mobile navigation.
4. Drive command palette, dialog keyboard loop, empty results, and focus return.
5. Emulate reduced motion.
6. Check 1440x1000, 768x900, and 390x844 with no horizontal overflow.

Contrast targets: primary text/background at least 4.5:1; focus/control boundaries at least 3:1.
