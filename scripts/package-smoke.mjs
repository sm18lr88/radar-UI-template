import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
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
  ]
  for (const file of requiredFiles) {
    if (!packedFiles.has(file)) throw new Error(`Packed package is missing ${file}`)
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
    dependencies: {
      [packageMetadata.name]: `file:${tarballPath}`,
      react: packageMetadata.dependencies.react,
      'react-dom': packageMetadata.dependencies['react-dom'],
    },
    devDependencies: {
      '@types/react': packageMetadata.devDependencies['@types/react'],
      '@types/react-dom': packageMetadata.devDependencies['@types/react-dom'],
      typescript: packageMetadata.devDependencies.typescript,
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
import {
  AppShell,
  APP_ROUTES,
  Badge,
  Card,
  CommandPalette,
  Dialog,
  EmptyState,
  ErrorState,
  LoadingState,
  MetricTile,
  PageHeader,
  StatusDot,
  TemplateApp,
  TemplateProviders,
  ThemeProvider,
  ToastProvider,
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
import type {
  AppRoute,
  AppShellProps,
  BadgeProps,
  CardProps,
  CommandPaletteProps,
  DemoRecord,
  DialogProps,
  EmptyStateProps,
  ErrorStateProps,
  LoadingStateProps,
  MetricTileProps,
  PageHeaderProps,
  StatusDotProps,
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
  WebsiteContent,
  WebsiteFaq,
  WebsiteFeature,
} from '${packageMetadata.name}'

const values = [
  APP_ROUTES, AppShell, Badge, Card, CommandPalette, Dialog, EmptyState, ErrorState,
  LoadingState, MetricTile, PageHeader, StatusDot, TemplateApp,
  TemplateProviders, ThemeProvider, ToastProvider, defineSurfaceRegistry,
  isAppRoute, isRouteEnabled, matchesCommand, selectCommandItems,
  selectEnabledRoutes, selectNavItems,
  templateConfig, useTheme, useToast,
]
type PublicTypes = AppRoute | AppShellProps | BadgeProps | CardProps |
  CommandPaletteProps | DemoRecord | DialogProps | EmptyStateProps | ErrorStateProps |
  LoadingStateProps | MetricTileProps | PageHeaderProps | StatusDotProps |
  ShellSlot | SurfaceCommand | SurfaceDefinition | SurfaceNav | SurfaceRegistry |
  TemplateConfig | TemplateProvidersProps | Theme | ThemeContextValue |
  ThemeProviderProps | Toast | ToastContextValue | ToastInput | ToastProviderProps |
  WebsiteContent | WebsiteFaq | WebsiteFeature
const publicType: PublicTypes | undefined = undefined
void values
void publicType
`

  writeFileSync(join(consumerRoot, 'package.json'), `${JSON.stringify(consumerMetadata, null, 2)}\n`)
  writeFileSync(join(consumerRoot, 'tsconfig.json'), `${JSON.stringify(tsconfig, null, 2)}\n`)
  writeFileSync(join(consumerRoot, 'consumer.tsx'), consumerSource.trimStart())

  runNpm(['install', '--ignore-scripts', '--no-audit', '--no-fund'], consumerRoot)
  const tscPath = join(consumerRoot, 'node_modules', 'typescript', 'bin', 'tsc')
  const typecheck = spawnSync(process.execPath, [tscPath, '--project', 'tsconfig.json'], { cwd: consumerRoot, stdio: 'inherit' })
  if (typecheck.error) throw typecheck.error
  if (typecheck.status !== 0) throw new Error(`Detached consumer typecheck exited with ${typecheck.status ?? 1}`)
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  exitCode = 1
} finally {
  rmSync(tempRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
}

if (exitCode !== 0) process.exit(exitCode)
