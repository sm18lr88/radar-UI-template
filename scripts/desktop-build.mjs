import { spawnSync } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeDesktopIcon } from './desktop-icon.mjs'

const npmCli = process.env.npm_execpath
const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))

if (!npmCli) {
  console.error('npm_execpath is not set')
  process.exit(1)
}

writeDesktopIcon(packageRoot)

const result = spawnSync(process.execPath, [npmCli, 'exec', 'vite', '--', 'build'], {
  cwd: packageRoot,
  env: { ...process.env, RADAR_DESKTOP_BUILD: '1' },
  stdio: 'inherit',
})

if (result.error) console.error(result.error.message)
if (result.status !== 0) process.exit(result.status ?? 1)
