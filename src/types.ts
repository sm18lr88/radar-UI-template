import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type Tone = 'success' | 'warning' | 'alert' | 'error' | 'info' | 'neutral'

export type BadgeTone = Tone | 'note' | 'accent1' | 'accent2' | 'accent3' | 'structural'

export const APP_ROUTES = ['/app', '/app/table', '/app/detail', '/app/preferences', '/app/states', '/primitives', '/site'] as const

export type AppRoute = (typeof APP_ROUTES)[number]

export type NavItem = {
  readonly id: string
  readonly label: string
  readonly path: AppRoute
  readonly icon: LucideIcon
  readonly description: string
}

export type CommandItem = {
  readonly id: string
  readonly label: string
  readonly description: string
  readonly path?: AppRoute
  readonly action?: () => void
  readonly icon?: LucideIcon
  readonly group?: string
  readonly shortcut?: string
  readonly keywords: readonly string[]
}

export type SurfaceNav = Omit<NavItem, 'path'> & {
  readonly order: number
}

export type SurfaceCommand = Omit<CommandItem, 'path' | 'action'> & {
  readonly order: number
}

export type SurfaceDefinition = {
  readonly enabled: boolean
  readonly nav?: SurfaceNav
  readonly command?: SurfaceCommand
}

export type SurfaceRegistry = {
  readonly defaultRoute: AppRoute
  readonly routes: Readonly<Record<AppRoute, SurfaceDefinition>>
}

export type TemplateBrand = {
  readonly appName: string
  readonly tagline: string
  readonly markLabel: string
  readonly shellSubtitle: string
  readonly websiteTitle: string
  readonly websiteLead: string
}

export type WebsiteFeature = {
  readonly title: string
  readonly description: string
}

export type WebsiteFaq = {
  readonly question: string
  readonly answer: string
}

export type WebsiteContent = {
  readonly badge: string
  readonly openAppLabel: string
  readonly primaryCta: string
  readonly secondaryCta: string
  readonly features: readonly WebsiteFeature[]
  readonly proofItems: readonly string[]
  readonly faqTitle: string
  readonly faq: readonly WebsiteFaq[]
  readonly footer: string
}

export type MetricCard = {
  readonly label: string
  readonly value: string
  readonly change: string
  readonly tone: Tone
}

export type DemoRecord = {
  readonly id: string
  readonly name: string
  readonly owner: string
  readonly status: Tone
  readonly statusLabel: string
  readonly impact: string
  readonly updated: string
}

export type TemplateConfig = {
  readonly brand: TemplateBrand
  readonly website: WebsiteContent
  readonly surfaces: SurfaceRegistry
  readonly metrics: readonly MetricCard[]
  readonly records: readonly DemoRecord[]
}

export type ShellSlot = ReactNode
