import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { _electron as electron } from '@playwright/test'
import electronPath from 'electron'
import packageMetadata from '../package.json' with { type: 'json' }

const appName = packageMetadata.productName
const packagedExecutable = process.env.RADAR_DESKTOP_EXECUTABLE
const rendererErrors = []
const userDataDir = mkdtempSync(join(tmpdir(), 'radar-ui-template-electron-'))
const launchArgs = packagedExecutable === undefined
  ? ['./electron/main.cjs', `--user-data-dir=${userDataDir}`]
  : [`--user-data-dir=${userDataDir}`]

let electronApp

try {
  electronApp = await electron.launch({
    executablePath: packagedExecutable ?? electronPath,
    args: launchArgs,
  })
  const page = await electronApp.firstWindow()
  page.on('pageerror', (error) => rendererErrors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') rendererErrors.push(message.text())
  })

  await page.getByRole('heading', { name: /cool, dense control room/i }).waitFor()
  await page.getByRole('button', { name: /toggle theme/i }).click()
  await page.getByRole('button', { name: /toggle theme/i }).click()
  await page.getByRole('button', { name: 'Trigger toast' }).click()
  await page.getByText('Template ready').waitFor()
  await page.getByRole('button', { name: /command/i }).click()
  await page.getByRole('dialog').waitFor()
  await page.keyboard.press('Escape')

  await page.getByRole('button', { name: 'Table', exact: true }).click()
  await page.getByText('Table demo').waitFor()
  await page.getByRole('button', { name: 'Needs review' }).click()
  if (await page.locator('tbody tr').count() !== 2) throw new Error('Table filter did not reduce the desktop rows')
  await page.getByRole('button', { name: 'Detail', exact: true }).click()
  await page.getByText('Detail surface').waitFor()
  await page.getByRole('button', { name: 'Preferences', exact: true }).click()
  await page.getByRole('dialog', { name: 'Settings dialog' }).waitFor()
  await page.getByLabel('Workspace name').fill('Desktop smoke workspace')
  await page.getByLabel('Default view').selectOption('table')
  await page.getByRole('button', { name: 'Save preferences' }).click()
  await page.getByRole('dialog', { name: 'Settings dialog' }).waitFor({ state: 'hidden' })
  await page.getByRole('button', { name: 'Open settings dialog' }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'States', exact: true }).click()
  await page.getByText('Nothing here yet').waitFor()
  await page.getByRole('button', { name: 'Create example' }).click()
  await page.getByText('Example created').waitFor()
  await page.getByRole('button', { name: 'Primitives', exact: true }).click()
  await page.getByRole('heading', { name: 'Component gallery' }).waitFor()
  await page.getByRole('button', { name: 'Open dialog' }).click()
  await page.getByRole('dialog', { name: 'Reusable dialog' }).waitFor()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Website' }).click()
  await page.getByRole('heading', { name: /build product surfaces/i }).waitFor()
  await page.getByRole('button', { name: /switch to .* theme/i }).click()
  await page.getByRole('link', { name: 'Browse primitives' }).click()
  await page.getByRole('heading', { name: 'Component gallery' }).waitFor()
  await page.getByRole('button', { name: 'Website' }).click()
  await page.getByRole('link', { name: 'Open app' }).click()
  await page.getByRole('heading', { name: /cool, dense control room/i }).waitFor()

  const browserWindow = await electronApp.browserWindow(page)
  const hidden = browserWindow.evaluate((window) => new Promise((resolve) => {
    if (!window.isVisible()) {
      resolve(true)
      return
    }
    const timeout = setTimeout(() => resolve(false), 5_000)
    window.once('hide', () => {
      clearTimeout(timeout)
      resolve(true)
    })
  }))
  await browserWindow.evaluate((window) => window.close())
  if (!await hidden) {
    throw new Error(`${appName} did not hide to tray when the window closed`)
  }

  const shown = browserWindow.evaluate((window) => new Promise((resolve) => {
    if (window.isVisible()) {
      resolve(true)
      return
    }
    const timeout = setTimeout(() => resolve(false), 5_000)
    window.once('show', () => {
      clearTimeout(timeout)
      resolve(true)
    })
  }))
  const secondInstance = spawnSync(packagedExecutable ?? electronPath, launchArgs, { encoding: 'utf8', timeout: 10_000 })
  if (secondInstance.error) throw secondInstance.error
  if (secondInstance.status !== 0) {
    throw new Error(`Second instance exited ${secondInstance.status}: ${secondInstance.stderr}`)
  }
  if (!await shown) {
    throw new Error(`${appName} did not restore from its single-instance activation path`)
  }
  if (rendererErrors.length > 0) {
    throw new Error(`Renderer errors: ${rendererErrors.join(' | ')}`)
  }
} finally {
  try {
    if (electronApp) {
      await electronApp.evaluate(({ app }) => app.quit())
      await electronApp.close()
    }
  } finally {
    rmSync(userDataDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 })
  }
}
