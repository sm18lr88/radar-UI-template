import { CommandPalette } from './components/command/CommandPalette'
import { TemplateProviders } from './components/providers/TemplateProviders'
import { AppShell } from './components/shell/AppShell'
import { Badge } from './components/ui/Badge'
import { AppDemo } from './demo/AppDemo'
import { PrimitivesPage } from './demo/PrimitivesPage'
import { SiteDemo } from './demo/SiteDemo'
import { locationMatchesRoute, navigateToRoute, replaceCurrentRoute, routeFromLocation } from './routing'
import { selectCommandItems, selectEnabledRoutes, selectNavItems } from './surface-registry'
import { templateConfig } from './template.config'
import type { AppRoute } from './types'
import { useEffect, useState } from 'react'

const enabledRoutes = selectEnabledRoutes(templateConfig.surfaces)
const navItems = selectNavItems(templateConfig.surfaces)
const commandItems = selectCommandItems(templateConfig.surfaces)

function assertNever(value: never): never {
  throw new Error(`Unhandled route: ${value}`)
}

function TemplateAppContent() {
  const [route, setRoute] = useState<AppRoute>(() => routeFromLocation(window.location, enabledRoutes))
  const [commandOpen, setCommandOpen] = useState(false)

  useEffect(() => {
    function syncRoute(): void {
      const nextRoute = routeFromLocation(window.location, enabledRoutes)
      if (!locationMatchesRoute(window.location, nextRoute)) replaceCurrentRoute(nextRoute)
      setRoute(nextRoute)
    }
    syncRoute()
    window.addEventListener('popstate', syncRoute)
    window.addEventListener('hashchange', syncRoute)
    return () => {
      window.removeEventListener('popstate', syncRoute)
      window.removeEventListener('hashchange', syncRoute)
    }
  }, [])

  useEffect(() => {
    if (route === '/site') return
    function onKeyDown(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [route])

  if (route === '/site') return <SiteDemo config={templateConfig} />

  const scopeControls = (
    <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
      <Badge tone="structural">Template</Badge>
      <Badge tone="note">Config-driven</Badge>
      <span className="hidden truncate text-sm text-theme-text-tertiary xl:inline">{templateConfig.brand.tagline}</span>
    </div>
  )
  let content
  switch (route) {
    case '/app':
    case '/app/table':
    case '/app/detail':
    case '/app/preferences':
    case '/app/states':
      content = <AppDemo key={route} route={route} config={templateConfig} />
      break
    case '/primitives':
      content = <PrimitivesPage />
      break
    default:
      content = assertNever(route)
  }

  return (
    <>
      <AppShell
        brand={templateConfig.brand}
        navItems={navItems}
        homePath={templateConfig.surfaces.defaultRoute}
        activePath={route}
        onNavigate={navigateToRoute}
        onOpenCommand={() => setCommandOpen(true)}
        scopeControls={scopeControls}
        rightExtras={<Badge tone="success">Ready</Badge>}
      >
        {content}
      </AppShell>
      <CommandPalette open={commandOpen} commands={commandItems} onClose={() => setCommandOpen(false)} onSelect={navigateToRoute} />
    </>
  )
}

export function TemplateApp() {
  return (
    <TemplateProviders>
      <TemplateAppContent />
    </TemplateProviders>
  )
}
