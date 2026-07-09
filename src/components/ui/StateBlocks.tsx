import { AlertTriangle, Loader2, SearchX } from 'lucide-react'
import type { ReactNode } from 'react'

export type EmptyStateProps = {
  readonly title: string
  readonly description: string
  readonly action?: ReactNode
  readonly compact?: boolean
}

export type LoadingStateProps = { readonly label?: string }

export type ErrorStateProps = {
  readonly title: string
  readonly description: string
}

export function EmptyState({ title, description, action, compact = false }: EmptyStateProps) {
  return (
    <div className={`grid place-items-center rounded-xl border border-dashed border-theme-border-light bg-theme-surface text-center ${compact ? 'min-h-0 p-6' : 'min-h-56 p-8'}`}>
      <div>
        <SearchX className="mx-auto h-8 w-8 text-theme-text-tertiary" aria-hidden="true" />
        <h3 className="mt-3 text-base font-semibold text-theme-text-primary">{title}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-theme-text-secondary">{description}</p>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  )
}

export function LoadingState({ label = 'Loading workspace' }: LoadingStateProps) {
  return (
    <div className="grid min-h-56 place-items-center rounded-xl border border-theme-border bg-theme-surface p-8 text-center" role="status">
      <div className="text-theme-text-secondary">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" aria-hidden="true" />
        <p className="mt-3 text-sm font-medium">{label}</p>
      </div>
    </div>
  )
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <div className="rounded-xl border border-theme-border bg-theme-surface p-6 shadow-theme-sm" role="alert">
      <div className="flex gap-3">
        <AlertTriangle className="mt-0.5 h-6 w-6 shrink-0 text-status-error" aria-hidden="true" />
        <div>
          <h3 className="font-semibold text-theme-text-primary">{title}</h3>
          <p className="mt-1 text-sm text-theme-text-secondary">{description}</p>
        </div>
      </div>
    </div>
  )
}
