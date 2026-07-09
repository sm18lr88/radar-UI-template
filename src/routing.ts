import { isAppRoute } from './surface-registry'
import type { AppRoute } from './types'

type RouteLocation = Pick<Location, 'hash' | 'pathname' | 'protocol'>

export function routeFromLocation(location: RouteLocation, enabledRoutes: readonly [AppRoute, ...AppRoute[]]): AppRoute {
  const hashPath = location.hash.startsWith('#/') ? location.hash.slice(1) : undefined
  const candidate = location.protocol === 'file:' ? hashPath : location.pathname
  return candidate !== undefined && isAppRoute(candidate) && enabledRoutes.includes(candidate)
    ? candidate
    : enabledRoutes[0]
}

export function navigateToRoute(path: AppRoute): void {
  if (window.location.protocol === 'file:') {
    window.location.hash = path
    return
  }

  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function routeHref(path: AppRoute): string {
  return window.location.protocol === 'file:' ? `#${path}` : path
}
