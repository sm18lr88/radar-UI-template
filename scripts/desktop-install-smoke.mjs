import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, readdirSync, rmSync, watch } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import packageMetadata from '../package.json' with { type: 'json' }

if (process.platform !== 'win32') {
  console.error('desktop-install-smoke is only supported on Windows')
  process.exit(1)
}

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const installRoot = mkdtempSync(join(tmpdir(), 'radar-ui-template-install-'))
const installer = join(packageRoot, 'release', `${packageMetadata.productName} Setup ${packageMetadata.version}.exe`)
const executable = join(installRoot, `${packageMetadata.productName}.exe`)
let exitCode = 0

function waitForRemoval(targetPath) {
  if (!existsSync(targetPath)) return Promise.resolve()
  return new Promise((resolve, reject) => {
    let settled = false
    const watcher = watch(dirname(targetPath), () => {
      if (!existsSync(targetPath)) finish()
    })
    const timeout = setTimeout(() => finish(new Error(`Timed out waiting for uninstall cleanup: ${targetPath}`)), 30_000)
    function finish(error) {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      watcher.close()
      if (error) reject(error)
      else resolve()
    }
    if (!existsSync(targetPath)) finish()
  })
}

try {
  if (!existsSync(installer)) {
    console.error(`Installer not found: ${installer}`)
    exitCode = 1
  } else {
    const install = spawnSync(installer, ['/S', `/D=${installRoot}`], { stdio: 'inherit' })
    if (install.error) console.error(install.error.message)
    exitCode = install.status ?? 1
  }

  if (exitCode === 0 && !existsSync(executable)) {
    console.error(`Installed executable not found: ${executable}`)
    exitCode = 1
  }

  if (exitCode === 0) {
    const smoke = spawnSync(process.execPath, [join(packageRoot, 'scripts', 'desktop-smoke.mjs')], {
      env: { ...process.env, RADAR_DESKTOP_EXECUTABLE: executable },
      stdio: 'inherit',
    })
    if (smoke.error) console.error(smoke.error.message)
    exitCode = smoke.status ?? 1
  }

  const uninstallerName = existsSync(installRoot)
    ? readdirSync(installRoot).find((entry) => /^Uninstall .+\.exe$/i.test(entry))
    : undefined
  if (!uninstallerName) {
    if (exitCode === 0) {
      console.error(`Uninstaller not found in ${installRoot}`)
      exitCode = 1
    }
  } else {
    const uninstall = spawnSync(join(installRoot, uninstallerName), ['/S'], { stdio: 'inherit' })
    if (uninstall.error) console.error(uninstall.error.message)
    const uninstallExitCode = uninstall.status ?? 1
    if (uninstallExitCode === 0) await waitForRemoval(installRoot)
    else if (exitCode === 0) exitCode = uninstallExitCode
  }
} finally {
  rmSync(installRoot, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 })
}

if (exitCode !== 0) process.exit(exitCode)
