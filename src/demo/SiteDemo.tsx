import { ArrowRight, CheckCircle2, Moon, Sparkles, Sun } from 'lucide-react'
import type { TemplateConfig } from '../types'
import { Badge, Card } from '../components/ui'
import { useTheme } from '../components/providers/ThemeProvider'
import { routeHref } from '../routing'
import { isRouteEnabled } from '../surface-registry'

export function SiteDemo({ config }: { readonly config: TemplateConfig }) {
  const { theme, toggleTheme } = useTheme()
  const appEnabled = isRouteEnabled(config.surfaces, '/app')
  const primitivesEnabled = isRouteEnabled(config.surfaces, '/primitives')
  return (
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-8 md:py-14">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent font-bold text-white shadow-glow-brand-sm">{config.brand.markLabel}</div>
          <span className="font-semibold text-theme-text-primary">{config.brand.appName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-xl border border-theme-border bg-theme-surface p-2.5 text-theme-text-secondary hover:bg-theme-hover" type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
          </button>
          {appEnabled ? <a className="rounded-xl border border-theme-border bg-theme-surface px-4 py-2 text-sm text-theme-text-secondary hover:bg-theme-hover" href={routeHref('/app')}>{config.website.openAppLabel}</a> : null}
        </div>
      </header>
      <section className="relative overflow-hidden rounded-3xl border border-theme-border bg-theme-surface p-8 shadow-theme-lg md:p-12">
        <div className="absolute right-8 top-8 hidden h-48 w-48 rounded-full bg-accent-muted blur-3xl md:block" aria-hidden="true" />
        <Badge tone="note">{config.website.badge}</Badge>
        <h1 className="mt-5 max-w-4xl text-3xl font-semibold tracking-tight text-theme-text-primary sm:text-4xl md:text-6xl">{config.brand.websiteTitle}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-theme-text-secondary">{config.brand.websiteLead}</p>
        {appEnabled || primitivesEnabled ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {appEnabled ? <a className="btn-brand inline-flex items-center px-5 py-3 text-sm font-semibold" href={routeHref('/app')}>{config.website.primaryCta} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></a> : null}
            {primitivesEnabled ? <a className="rounded-xl border border-theme-border bg-theme-elevated px-5 py-3 text-sm font-semibold text-theme-text-primary hover:bg-theme-hover" href={routeHref('/primitives')}>{config.website.secondaryCta}</a> : null}
          </div>
        ) : null}
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {config.website.features.map((feature) => (
          <Card key={feature.title} title={feature.title} eyebrow="Feature">
            <Sparkles className="mb-4 h-5 w-5 text-accent" aria-hidden="true" />
            <p className="text-sm leading-6 text-theme-text-secondary">{feature.description}</p>
          </Card>
        ))}
      </section>
      <section className="rounded-2xl border border-theme-border bg-theme-surface p-6 shadow-theme-sm">
        <h2 className="text-2xl font-semibold text-theme-text-primary">{config.website.faqTitle}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {config.website.faq.map((item) => (
            <div key={item.question} className="card-inner-lg">
              <CheckCircle2 className="mb-3 h-5 w-5 text-accent" aria-hidden="true" />
              <h3 className="font-medium text-theme-text-primary">{item.question}</h3>
              <p className="mt-2 text-sm text-theme-text-secondary">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
      <footer className="border-t-subtle py-6 text-sm text-theme-text-tertiary">{config.website.footer}</footer>
    </div>
  )
}
