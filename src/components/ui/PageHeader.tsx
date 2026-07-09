import type { ReactNode } from 'react'
import { Badge } from './Badge'

export type PageHeaderProps = {
  readonly eyebrow: string
  readonly title: string
  readonly description: string
  readonly actions?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <Badge tone="note">{eyebrow}</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-theme-text-primary">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-theme-text-secondary">{description}</p>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </header>
  )
}
