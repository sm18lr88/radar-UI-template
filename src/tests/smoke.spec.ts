import { expect, test } from '@playwright/test'

function parseRgb(value: string): readonly [number, number, number] | undefined {
  const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  const red = match?.[1]
  const green = match?.[2]
  const blue = match?.[3]
  if (!red || !green || !blue) return undefined
  return [Number(red), Number(green), Number(blue)]
}

function channel(value: number): number {
  const normalized = value / 255
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

function luminance(color: readonly [number, number, number]): number {
  return 0.2126 * channel(color[0]) + 0.7152 * channel(color[1]) + 0.0722 * channel(color[2])
}

function contrastRatio(a: readonly [number, number, number], b: readonly [number, number, number]): number {
  const lighter = Math.max(luminance(a), luminance(b))
  const darker = Math.min(luminance(a), luminance(b))
  return (lighter + 0.05) / (darker + 0.05)
}

test('dashboard shell supports theme and rail interactions', async ({ page }) => {
  await page.goto('/app')
  await expect(page.getByRole('heading', { name: /control room/i })).toBeVisible()
  await page.getByRole('button', { name: /toggle theme/i }).click()
  await page.getByRole('button', { name: /toggle theme/i }).click()
  const collapseButton = page.getByRole('button', { name: /collapse navigation/i })
  if (await collapseButton.count() > 0) {
    await collapseButton.click()
    await page.getByRole('button', { name: /expand navigation/i }).click()
  }
})

test('command palette navigates and reports empty results', async ({ page }) => {
  await page.goto('/app')
  await page.keyboard.press('ControlOrMeta+K')
  const commandSearch = page.getByRole('combobox', { name: /search commands/i })
  await commandSearch.press('End')
  await expect(commandSearch).toHaveAttribute('aria-activedescendant', /open-preferences/)
  await commandSearch.press('Home')
  await expect(commandSearch).toHaveAttribute('aria-activedescendant', /open-dashboard/)
  await commandSearch.fill('primitives')
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: /component gallery/i })).toBeVisible()
  await page.keyboard.press('ControlOrMeta+K')
  await page.getByRole('combobox', { name: /search commands/i }).fill('zz-no-command')
  await expect(page.getByText(/no commands found/i)).toBeVisible()
  await page.keyboard.press('Escape')
})

test('direct routes render their intended surfaces', async ({ page }) => {
  await page.goto('/site')
  await expect(page.getByRole('heading', { name: /build product surfaces/i })).toBeVisible()
  const siteWasDark = await page.locator('html').evaluate((element) => element.classList.contains('dark'))
  await page.getByRole('button', { name: /switch to .* theme/i }).click()
  const siteIsDark = await page.locator('html').evaluate((element) => element.classList.contains('dark'))
  expect(siteIsDark).toBe(!siteWasDark)
  await page.getByRole('link', { name: 'Open app' }).click()
  await expect(page).toHaveURL(/\/app$/)
  await expect(page.getByRole('heading', { name: /cool, dense control room/i })).toBeVisible()
  await page.goto('/app/states')
  await expect(page.getByText(/nothing here yet/i)).toBeVisible()
  await expect(page.getByText(/could not load preview/i)).toBeVisible()
})

test('navigation remains usable at desktop and mobile widths', async ({ page }) => {
  await page.goto('/app')
  const mobileNavigation = page.getByRole('combobox', { name: /navigate/i })
  if (await mobileNavigation.count() > 0) {
    await mobileNavigation.selectOption('/app/states')
  } else {
    await page.getByRole('button', { name: 'States' }).click()
  }
  await expect(page).toHaveURL(/\/app\/states$/)
  await expect(page.getByText(/nothing here yet/i)).toBeVisible()
})

test('dialog closes with Escape and restores focus', async ({ page }) => {
  await page.goto('/primitives')
  const trigger = page.getByRole('button', { name: 'Open dialog' })
  await trigger.click()
  await expect(page.getByRole('dialog', { name: 'Reusable dialog' })).toBeVisible()
  const close = page.getByRole('button', { name: 'Close dialog' })
  await expect(close).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(close).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog', { name: 'Reusable dialog' })).toBeHidden()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await expect(page.getByRole('dialog', { name: 'Reusable dialog' })).toBeVisible()
  await page.mouse.click(2, 2)
  await expect(page.getByRole('dialog', { name: 'Reusable dialog' })).toBeHidden()
  await expect(trigger).toBeFocused()
})

test('visible demo controls produce observable results', async ({ page }) => {
  await page.goto('/app')
  await page.getByRole('button', { name: 'Trigger toast' }).click()
  await expect(page.getByText('Template ready')).toBeVisible()

  await page.goto('/app/table')
  await page.getByRole('button', { name: 'Needs review' }).click()
  await expect(page.getByText('Reports export')).toBeVisible()
  await expect(page.getByText('Signup funnel')).toBeVisible()
  await expect(page.getByText('Billing workflow')).toBeHidden()

  await page.goto('/app/states')
  await page.getByRole('button', { name: 'Create example' }).click()
  await expect(page.getByText('Example created')).toBeVisible()
})

test('semantic text contrast passes in light and dark mode', async ({ page }) => {
  await page.goto('/app')
  for (const mode of ['light', 'dark'] as const) {
    await page.evaluate((theme) => {
      document.documentElement.classList.toggle('dark', theme === 'dark')
      document.documentElement.style.colorScheme = theme
    }, mode)
    const pairs = await page.evaluate(() => {
      const classPairs = [
        ['text-theme-text-primary', 'bg-theme-base'],
        ['text-theme-text-secondary', 'bg-theme-base'],
        ['text-theme-text-secondary', 'bg-theme-sidebar'],
        ['text-theme-text-tertiary', 'bg-theme-base'],
        ['text-theme-text-tertiary', 'bg-theme-surface'],
      ] as const
      return classPairs.map(([foregroundClass, backgroundClass]) => {
        const element = document.createElement('span')
        element.className = `${foregroundClass} ${backgroundClass}`
        element.textContent = 'Contrast sample'
        document.body.append(element)
        const style = getComputedStyle(element)
        const pair = { color: style.color, backgroundColor: style.backgroundColor }
        element.remove()
        return pair
      })
    })
    for (const pair of pairs) {
      const foreground = parseRgb(pair.color)
      const background = parseRgb(pair.backgroundColor)
      expect(foreground).toBeDefined()
      expect(background).toBeDefined()
      if (foreground && background) expect(contrastRatio(foreground, background)).toBeGreaterThanOrEqual(4.5)
    }
  }
})
