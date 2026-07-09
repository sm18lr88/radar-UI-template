import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
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

function snapshotDirectory(directory) {
  if (!existsSync(directory)) return undefined
  const hash = createHash('sha256')
  function visit(current) {
    for (const entry of readdirSync(current).sort()) {
      const path = join(current, entry)
      if (statSync(path).isDirectory()) visit(path)
      else {
        hash.update(path.slice(directory.length))
        hash.update(readFileSync(path))
      }
    }
  }
  visit(directory)
  return hash.digest('hex')
}

const sourceDist = join(sourceRoot, 'dist')
const sourceDistBefore = snapshotDirectory(sourceDist)

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
  if (snapshotDirectory(sourceDist) !== sourceDistBefore) {
    console.error('copy-smoke changed the source dist directory')
    exitCode = 1
  }
} finally {
  rmSync(tempRoot, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
}

if (exitCode !== 0) process.exit(exitCode)
