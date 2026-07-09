import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const sourceRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const npmCli = process.env.npm_execpath

if (!npmCli) {
  console.error('npm_execpath is not set')
  process.exit(1)
}

const tempRoot = mkdtempSync(join(tmpdir(), 'radar-ui-template-smoke-'))
const destination = join(tempRoot, 'template')
const excludedNames = new Set(['.git', 'dist', 'node_modules', 'playwright-report', 'release', 'test-results'])
let exitCode = 0

try {
  cpSync(sourceRoot, destination, {
    recursive: true,
    filter: (source) => !excludedNames.has(basename(source)),
  })

  const commands = [
    ['install', '--ignore-scripts', '--no-audit', '--no-fund'],
    ['run', 'tsc'],
    ['run', 'build'],
    ['run', 'desktop:build'],
  ]
  for (const args of commands) {
    console.log(`copy-smoke: npm ${args.join(' ')}`)
    const result = spawnSync(process.execPath, [npmCli, ...args], { cwd: destination, stdio: 'inherit' })
    if (result.error) console.error(result.error.message)
    if (result.status !== 0) {
      exitCode = result.status ?? 1
      break
    }
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
}

if (exitCode !== 0) process.exit(exitCode)
