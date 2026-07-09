import { expect, test } from '@playwright/test'
import { routeFromLocation } from '../routing'
import type { AppRoute } from '../types'

const allRoutes: readonly [AppRoute, ...AppRoute[]] = ['/app', '/app/states', '/site']

test('browser locations use pathname routes', () => {
  expect(routeFromLocation({ protocol: 'https:', pathname: '/site', hash: '' }, allRoutes)).toBe('/site')
})

test('desktop file locations use hash routes', () => {
  expect(routeFromLocation({ protocol: 'file:', pathname: '/dist/index.html', hash: '#/app/states' }, allRoutes)).toBe('/app/states')
})

test('disabled routes fall back to the first enabled route', () => {
  const enabledRoutes: readonly [AppRoute, ...AppRoute[]] = ['/site']
  expect(routeFromLocation({ protocol: 'https:', pathname: '/app', hash: '' }, enabledRoutes)).toBe('/site')
})
