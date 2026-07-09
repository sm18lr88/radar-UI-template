import { ChevronLeft, ChevronRight, Command, Moon, Sun } from 'lucide-react'
import { useState } from 'react'
import type { AppRoute, NavItem, ShellSlot, TemplateBrand } from '../../types'
import { useTheme } from '../providers/ThemeProvider'

export type AppShellProps = {
  readonly brand: TemplateBrand
  readonly navItems: readonly NavItem[]
  readonly homePath: AppRoute
  readonly activePath: AppRoute
  readonly onNavigate: (path: AppRoute) => void
  readonly onOpenCommand: () => void
  readonly scopeControls?: ShellSlot
  readonly rightExtras?: ShellSlot
  readonly accountSlot?: ShellSlot
  readonly chrome?: AppShellChrome
  readonly children: ShellSlot
}

export type AppShellChrome = {
  readonly navStart?: ShellSlot
  readonly navEnd?: ShellSlot
  readonly headerStart?: ShellSlot
  readonly headerEnd?: ShellSlot
}

function isActive(activePath: AppRoute, item: NavItem): boolean {
  if (item.path === '/app') return activePath === '/app'
  return activePath.startsWith(item.path)
}

export function AppShell({ brand, navItems, homePath, activePath, onNavigate, onOpenCommand, scopeControls, rightExtras, accountSlot, chrome, children }: AppShellProps) {
  const [pinned, setPinned] = useState(true)
  const { theme, toggleTheme } = useTheme()

  function onMobileNavigate(value: string): void {
    const item = navItems.find((candidate) => candidate.path === value)
    if (item) onNavigate(item.path)
  }

  return (
    <div className="flex min-h-[100dvh] bg-theme-base text-theme-text-primary">
      <aside className={`${pinned ? 'w-64' : 'w-[4.5rem]'} hidden shrink-0 border-r-subtle bg-theme-sidebar transition-[width] duration-200 md:flex md:flex-col`}>
        <div className="flex h-16 items-center gap-3 border-b-subtle px-3">
          <button className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-sm font-bold text-white shadow-glow-brand-sm" type="button" onClick={() => onNavigate(homePath)} aria-label="Go to default route">
            {brand.markLabel}
          </button>
          {pinned ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-theme-text-primary">{brand.appName}</p>
              <p className="truncate text-xs text-theme-text-tertiary">Template shell</p>
            </div>
          ) : null}
        </div>
        <nav className="flex-1 space-y-1 px-2 py-3" aria-label="Primary navigation">
          {chrome?.navStart}
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(activePath, item)
            return (
              <button
                key={item.id}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors ${active ? 'selection-strong selection-ring text-accent-text' : 'text-theme-text-secondary hover:bg-theme-hover hover:text-theme-text-primary'}`}
                type="button"
                title={pinned ? undefined : item.label}
                aria-current={active ? 'page' : undefined}
                onClick={() => onNavigate(item.path)}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {pinned ? <span className="truncate">{item.label}</span> : null}
              </button>
            )
          })}
          {chrome?.navEnd}
        </nav>
        <div className="border-t-subtle p-2">
          <button className="flex w-full items-center justify-center rounded-xl p-2 text-theme-text-secondary hover:bg-theme-hover" type="button" onClick={() => setPinned((value) => !value)} aria-label={pinned ? 'Collapse navigation' : 'Expand navigation'}>
            {pinned ? <ChevronLeft className="h-5 w-5" aria-hidden="true" /> : <ChevronRight className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b-subtle bg-theme-base/90 px-4 backdrop-blur-xl">
          {chrome?.headerStart}
          <select
            aria-label="Navigate"
            className="min-w-0 max-w-36 rounded-lg border border-theme-border bg-theme-surface px-2 py-2 text-sm text-theme-text-primary md:hidden"
            value={activePath}
            onChange={(event) => onMobileNavigate(event.target.value)}
          >
            {navItems.map((item) => <option key={item.id} value={item.path}>{item.label}</option>)}
          </select>
          <button className="btn-brand-muted hidden px-3 py-2 text-sm font-medium md:inline-flex" type="button" onClick={onOpenCommand}>
            <Command className="mr-2 h-4 w-4" aria-hidden="true" />
            Command
            <kbd className="ml-3 rounded bg-accent-light/30 px-1.5 py-0.5 text-xs">⌘K</kbd>
          </button>
          <button className="btn-brand-muted p-2 md:hidden" type="button" onClick={onOpenCommand} aria-label="Open command palette">
            <Command className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="hidden min-w-0 flex-1 sm:block">{scopeControls}</div>
          <div className="hidden sm:block">{rightExtras}</div>
          {chrome?.headerEnd}
          {accountSlot}
          <button className="rounded-xl border border-theme-border bg-theme-surface p-2 text-theme-text-secondary shadow-theme-sm hover:bg-theme-hover" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
        </header>
        <main id="main-content" className="min-w-0 flex-1 p-4 md:p-6">
          <div className="mx-auto w-full max-w-[96rem]">{children}</div>
        </main>
      </div>
    </div>
  )
}
