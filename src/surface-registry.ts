import { APP_ROUTES } from './types'
import type { AppRoute, CommandItem, NavItem, SurfaceRegistry } from './types'

const appRouteSet: ReadonlySet<string> = new Set(APP_ROUTES)

function assertUnique(values: readonly (string | number)[], label: string): void {
  if (new Set(values).size !== values.length) throw new Error(`${label} must be unique`)
}

function assertOrders(values: readonly number[], label: string): void {
  if (values.some((value) => !Number.isSafeInteger(value) || value < 0)) throw new Error(`${label} must be non-negative safe integers`)
  assertUnique(values, label)
}

export function defineSurfaceRegistry<const Registry extends SurfaceRegistry>(registry: Registry): Registry {
  if (!registry.routes[registry.defaultRoute].enabled) throw new Error('The default route must be enabled')

  const navigation = APP_ROUTES.flatMap((route) => registry.routes[route].nav ?? [])
  const commands = APP_ROUTES.flatMap((route) => registry.routes[route].command ?? [])
  assertUnique(navigation.map((item) => item.id), 'Navigation IDs')
  assertOrders(navigation.map((item) => item.order), 'Navigation order values')
  assertUnique(commands.map((item) => item.id), 'Command IDs')
  assertOrders(commands.map((item) => item.order), 'Command order values')
  return registry
}

export function selectEnabledRoutes(registry: SurfaceRegistry): readonly [AppRoute, ...AppRoute[]] {
  const remainingRoutes = APP_ROUTES.filter((route) => route !== registry.defaultRoute && registry.routes[route].enabled)
  return [registry.defaultRoute, ...remainingRoutes]
}

export function selectNavItems(registry: SurfaceRegistry): readonly NavItem[] {
  return APP_ROUTES.flatMap((path) => {
    const surface = registry.routes[path]
    return surface.enabled && surface.nav ? [{ ...surface.nav, path }] : []
  }).sort((left, right) => left.order - right.order).map(({ order: _order, ...item }) => item)
}

export function selectCommandItems(registry: SurfaceRegistry): readonly CommandItem[] {
  return APP_ROUTES.flatMap((path) => {
    const surface = registry.routes[path]
    return surface.enabled && surface.command ? [{ ...surface.command, path }] : []
  }).sort((left, right) => left.order - right.order).map(({ order: _order, ...item }) => item)
}

export function isAppRoute(path: string): path is AppRoute {
  return appRouteSet.has(path)
}

export function isRouteEnabled(registry: SurfaceRegistry, route: AppRoute): boolean {
  return registry.routes[route].enabled
}
