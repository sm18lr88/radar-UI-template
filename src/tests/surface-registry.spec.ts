import { expect, test } from '@playwright/test'
import { defineSurfaceRegistry, selectCommandItems, selectEnabledRoutes, selectNavItems } from '../surface-registry'
import { templateConfig } from '../template.config'

test('surface projections preserve route, navigation, and command order', () => {
  expect(selectEnabledRoutes(templateConfig.surfaces)).toEqual([
    '/app', '/app/table', '/app/detail', '/app/preferences', '/app/states', '/primitives', '/site',
  ])
  expect(selectNavItems(templateConfig.surfaces).map((item) => item.id)).toEqual([
    'dashboard', 'table', 'detail', 'preferences', 'states', 'primitives', 'site',
  ])
  expect(selectCommandItems(templateConfig.surfaces).map((item) => item.id)).toEqual([
    'open-dashboard', 'open-table', 'open-primitives', 'open-website', 'open-preferences',
  ])
})

test('disabled surfaces disappear from every projection', () => {
  const registry = defineSurfaceRegistry({
    ...templateConfig.surfaces,
    routes: {
      ...templateConfig.surfaces.routes,
      '/site': { ...templateConfig.surfaces.routes['/site'], enabled: false },
    },
  })

  expect(selectEnabledRoutes(registry)).not.toContain('/site')
  expect(selectNavItems(registry).map((item) => item.path)).not.toContain('/site')
  expect(selectCommandItems(registry).map((item) => item.path)).not.toContain('/site')
})

test('a non-app default remains first when the dashboard is disabled', () => {
  const registry = defineSurfaceRegistry({
    ...templateConfig.surfaces,
    defaultRoute: '/site',
    routes: {
      ...templateConfig.surfaces.routes,
      '/app': { ...templateConfig.surfaces.routes['/app'], enabled: false },
    },
  })

  expect(selectEnabledRoutes(registry)[0]).toBe('/site')
})

test('surface registry rejects a disabled default and duplicate channel metadata', () => {
  expect(() => defineSurfaceRegistry({
    ...templateConfig.surfaces,
    routes: {
      ...templateConfig.surfaces.routes,
      '/app': { ...templateConfig.surfaces.routes['/app'], enabled: false },
    },
  })).toThrow(/default route must be enabled/i)

  expect(() => defineSurfaceRegistry({
    ...templateConfig.surfaces,
    routes: {
      ...templateConfig.surfaces.routes,
      '/site': {
        ...templateConfig.surfaces.routes['/site'],
        command: { ...templateConfig.surfaces.routes['/site'].command, id: 'open-dashboard' },
      },
    },
  })).toThrow(/command ids must be unique/i)

  expect(() => defineSurfaceRegistry({
    ...templateConfig.surfaces,
    routes: {
      ...templateConfig.surfaces.routes,
      '/site': {
        ...templateConfig.surfaces.routes['/site'],
        nav: { ...templateConfig.surfaces.routes['/site'].nav, order: Number.NaN },
      },
    },
  })).toThrow(/navigation order values must be non-negative safe integers/i)
})
