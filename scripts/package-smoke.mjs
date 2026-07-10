import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const packageMetadata = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
const npmCli = process.env.npm_execpath

if (!npmCli) {
  console.error('npm_execpath is not set')
  process.exit(1)
}

const tempRoot = mkdtempSync(join(tmpdir(), 'radar-ui-template-package-'))
let exitCode = 0

function runNpm(args, cwd, capture = false) {
  const result = spawnSync(process.execPath, [npmCli, ...args], {
    cwd,
    encoding: capture ? 'utf8' : undefined,
    stdio: capture ? 'pipe' : 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) {
    if (capture && result.stderr) console.error(result.stderr)
    throw new Error(`npm ${args.join(' ')} exited with ${result.status ?? 1}`)
  }
  return result.stdout ?? ''
}

try {
  const packOutput = runNpm(['pack', '--json', '--pack-destination', tempRoot], packageRoot, true)
  const packResult = JSON.parse(packOutput)[0]
  if (!packResult || !Array.isArray(packResult.files) || typeof packResult.filename !== 'string') {
    throw new Error('npm pack returned an unexpected result')
  }

  const packedFiles = new Set(packResult.files.map((file) => file.path))
  const requiredFiles = [
    'AGENTS.md',
    'DESIGN.md',
    'LICENSE',
    'README.md',
    'docs/component-inventory.md',
    'package.json',
    'src/index.css',
    'src/index.ts',
    'src/style.css.d.ts',
  ]
  for (const file of requiredFiles) {
    if (!packedFiles.has(file)) throw new Error(`Packed package is missing ${file}`)
  }
  const exportTargets = Object.values(packageMetadata.exports).flatMap((target) =>
    typeof target === 'string' ? [target] : Object.values(target),
  )
  for (const target of exportTargets) {
    const packedTarget = target.replace(/^\.\//, '')
    if (!packedFiles.has(packedTarget)) throw new Error(`Package export target is missing ${packedTarget}`)
  }

  const forbiddenPrefixes = ['dist/', 'electron/', 'node_modules/', 'release/', 'scripts/', 'src/tests/']
  const forbiddenFile = [...packedFiles].find((file) => forbiddenPrefixes.some((prefix) => file.startsWith(prefix)))
  if (forbiddenFile) throw new Error(`Packed package contains private file ${forbiddenFile}`)

  const consumerRoot = join(tempRoot, 'consumer')
  const tarballPath = join(tempRoot, packResult.filename)
  mkdirSync(consumerRoot)
  const consumerMetadata = {
    private: true,
    type: 'module',
    scripts: {
      build: 'vite build',
    },
    dependencies: {
      [packageMetadata.name]: `file:${tarballPath}`,
      react: packageMetadata.devDependencies.react,
      'react-dom': packageMetadata.devDependencies['react-dom'],
      tailwindcss: packageMetadata.peerDependencies.tailwindcss,
    },
    devDependencies: {
      '@tailwindcss/vite': packageMetadata.devDependencies['@tailwindcss/vite'],
      '@types/react': packageMetadata.devDependencies['@types/react'],
      '@types/react-dom': packageMetadata.devDependencies['@types/react-dom'],
      '@vitejs/plugin-react': packageMetadata.devDependencies['@vitejs/plugin-react'],
      typescript: packageMetadata.devDependencies.typescript,
      vite: packageMetadata.devDependencies.vite,
    },
  }
  const tsconfig = {
    compilerOptions: {
      jsx: 'react-jsx',
      module: 'ESNext',
      moduleResolution: 'Bundler',
      noEmit: true,
      strict: true,
      target: 'ES2022',
    },
    include: ['consumer.tsx'],
  }
  const consumerSource = `
import { createRoot } from 'react-dom/client'
import {
  AppShell,
  APP_ROUTES,
  Badge,
  Card,
  CommandPalette,
  Dialog,
  EmptyState,
  ErrorState,
  Facet,
  LoadingState,
  MetricTile,
  PageHeader,
  StatusDot,
  Summary,
  TemplateApp,
  TemplateProviders,
  ThemeProvider,
  ToastProvider,
  Tooltip,
  matchesCommand,
  defineSurfaceRegistry,
  isAppRoute,
  isRouteEnabled,
  selectCommandItems,
  selectEnabledRoutes,
  selectNavItems,
  templateConfig,
  useTheme,
  useToast,
} from '${packageMetadata.name}'
import '${packageMetadata.name}/style.css'
import type {
  AppRoute,
  AppShellChrome,
  AppShellProps,
  BadgeProps,
  CardProps,
  CommandItem,
  CommandPaletteProps,
  DemoRecord,
  DialogProps,
  EmptyStateProps,
  ErrorStateProps,
  FacetProps,
  LoadingStateProps,
  MetricTileProps,
  PageHeaderProps,
  StatusDotProps,
  SummaryItem,
  SummaryProps,
  ShellSlot,
  SurfaceCommand,
  SurfaceDefinition,
  SurfaceNav,
  SurfaceRegistry,
  TemplateConfig,
  TemplateProvidersProps,
  Theme,
  ThemeContextValue,
  ThemeProviderProps,
  Toast,
  ToastContextValue,
  ToastInput,
  ToastProviderProps,
  TooltipProps,
  WebsiteContent,
  WebsiteFaq,
  WebsiteFeature,
} from '${packageMetadata.name}'

const values = [
  APP_ROUTES, AppShell, Badge, Card, CommandPalette, Dialog, EmptyState, ErrorState, Facet,
  LoadingState, MetricTile, PageHeader, StatusDot, Summary, TemplateApp,
  TemplateProviders, ThemeProvider, ToastProvider, defineSurfaceRegistry,
  isAppRoute, isRouteEnabled, matchesCommand, selectCommandItems,
  selectEnabledRoutes, selectNavItems, Tooltip,
  templateConfig, useTheme, useToast,
]
type PublicTypes = AppRoute | AppShellChrome | AppShellProps | BadgeProps | CardProps | CommandItem |
  CommandPaletteProps | DemoRecord | DialogProps | EmptyStateProps | ErrorStateProps | FacetProps |
  LoadingStateProps | MetricTileProps | PageHeaderProps | StatusDotProps | SummaryItem | SummaryProps |
  ShellSlot | SurfaceCommand | SurfaceDefinition | SurfaceNav | SurfaceRegistry |
  TemplateConfig | TemplateProvidersProps | Theme | ThemeContextValue |
  ThemeProviderProps | Toast | ToastContextValue | ToastInput | ToastProviderProps | TooltipProps |
  WebsiteContent | WebsiteFaq | WebsiteFeature
const publicType: PublicTypes | undefined = undefined
const actionCommand: CommandItem = {
  id: 'run-action',
  label: 'Run action',
  description: 'Exercise a non-navigation command',
  action: () => undefined,
  group: 'Actions',
  keywords: ['action'],
}
void values
void publicType
void actionCommand

const root = document.getElementById('root')
if (!root) throw new Error('Consumer root element is missing')
createRoot(root).render(<Card><Badge tone="success">Package styles loaded</Badge></Card>)
`

  const viteConfig = `
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({ plugins: [react(), tailwindcss()] })
`

  const indexHtml = '<!doctype html><html><body><div id="root"></div><script type="module" src="/consumer.tsx"></script></body></html>\n'

  writeFileSync(join(consumerRoot, 'package.json'), `${JSON.stringify(consumerMetadata, null, 2)}\n`)
  writeFileSync(join(consumerRoot, 'tsconfig.json'), `${JSON.stringify(tsconfig, null, 2)}\n`)
  writeFileSync(join(consumerRoot, 'consumer.tsx'), consumerSource.trimStart())
  writeFileSync(join(consumerRoot, 'vite.config.ts'), viteConfig.trimStart())
  writeFileSync(join(consumerRoot, 'index.html'), indexHtml)

  runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumerRoot)
  const tscPath = join(consumerRoot, 'node_modules', 'typescript', 'bin', 'tsc')
  const typecheck = spawnSync(process.execPath, [tscPath, '--project', 'tsconfig.json'], { cwd: consumerRoot, stdio: 'inherit' })
  if (typecheck.error) throw typecheck.error
  if (typecheck.status !== 0) throw new Error(`Detached consumer typecheck exited with ${typecheck.status ?? 1}`)
  runNpm(['run', 'build'], consumerRoot)
  const assetsRoot = join(consumerRoot, 'dist', 'assets')
  const cssAsset = readdirSync(assetsRoot).find((file) => file.endsWith('.css'))
  if (!cssAsset) throw new Error('Detached consumer build did not emit CSS')
  const compiledCss = readFileSync(join(assetsRoot, cssAsset), 'utf8')
  if (!compiledCss.includes('.bg-theme-surface')) {
    throw new Error('Detached consumer CSS is missing package component utilities')
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  exitCode = 1
} finally {
  rmSync(tempRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
}

if (exitCode !== 0) process.exit(exitCode)
