import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export type CardProps = {
  readonly title?: string
  readonly eyebrow?: string
  readonly action?: ReactNode
  readonly className?: string
  readonly children: ReactNode
}

export type MetricTileProps = {
  readonly label: string
  readonly value: string
  readonly change: string
  readonly children: ReactNode
}

export function Card({ title, eyebrow, action, className, children }: CardProps) {
  return (
    <section className={clsx('rounded-xl border border-theme-border bg-theme-surface shadow-theme-sm', className)}>
      {title || eyebrow || action ? (
        <header className="flex items-start justify-between gap-3 border-b-subtle px-4 py-3">
          <div>
            {eyebrow ? <p className="text-xs font-medium uppercase tracking-[0.16em] text-theme-text-tertiary">{eyebrow}</p> : null}
            {title ? <h2 className="text-base font-semibold text-theme-text-primary">{title}</h2> : null}
          </div>
          {action}
        </header>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  )
}

export function MetricTile({ label, value, change, children }: MetricTileProps) {
  return (
    <div className="rounded-xl border border-theme-border bg-theme-surface p-4 shadow-theme-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-theme-text-secondary">{label}</p>
        {children}
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-theme-text-primary">{value}</p>
      <p className="mt-1 text-sm text-theme-text-tertiary">{change}</p>
    </div>
  )
}
