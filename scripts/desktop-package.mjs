import { spawnSync } from 'node:child_process'
import { cpSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const targets = new Set(['dir', 'portable', 'nsis'])
const target = process.argv[2]

if (!targets.has(target)) {
  console.error('Usage: node ./scripts/desktop-package.mjs <dir|portable|nsis>')
  process.exit(1)
}

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const releaseDir = join(packageRoot, 'release')
const npmCli = process.env.npm_execpath

if (!npmCli) {
  console.error('npm_execpath is not set')
  process.exit(1)
}

const stagingDir = mkdtempSync(join(tmpdir(), `radar-ui-template-${target}-`))
let exitCode = 0

try {
  const result = spawnSync(
    process.execPath,
    [npmCli, 'exec', 'electron-builder', '--', '--win', target, `--config.directories.output=${stagingDir}`],
    { cwd: packageRoot, stdio: 'inherit' },
  )
  if (result.error) console.error(result.error.message)
  exitCode = result.status ?? 1

  if (exitCode === 0) {
    mkdirSync(releaseDir, { recursive: true })
    if (target === 'dir') {
      const unpackedSource = join(stagingDir, 'win-unpacked')
      const unpackedDestination = join(releaseDir, 'win-unpacked')
      rmSync(unpackedDestination, { recursive: true, force: true })
      cpSync(unpackedSource, unpackedDestination, { recursive: true })
      console.log(`desktop-package: copied ${unpackedDestination}`)
    } else {
      for (const entry of readdirSync(stagingDir)) {
        const source = join(stagingDir, entry)
        if (statSync(source).isDirectory() || entry === 'builder-debug.yml') continue
        cpSync(source, join(releaseDir, entry))
        console.log(`desktop-package: copied ${join(releaseDir, entry)}`)
      }
    }
  }
} finally {
  rmSync(stagingDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
}

if (exitCode !== 0) process.exit(exitCode)
