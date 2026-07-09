import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import type { BadgeTone, Tone } from '../../types'

export type BadgeProps = {
  readonly tone?: BadgeTone
  readonly size?: 'sm' | 'default'
  readonly className?: string
  readonly children: ReactNode
}

export type StatusDotProps = {
  readonly tone: Tone
  readonly label: string
}

const toneClasses: Record<BadgeTone, string> = {
  success: 'status-healthy',
  warning: 'status-degraded',
  alert: 'status-alert',
  error: 'status-unhealthy',
  info: 'status-neutral',
  neutral: 'status-unknown',
  note: 'bg-accent-muted text-accent-text border-accent/30',
  accent1: 'badge-accent-1',
  accent2: 'badge-accent-2',
  accent3: 'badge-accent-3',
  structural: 'bg-theme-elevated text-theme-text-secondary border-theme-border',
}

const dotClasses: Record<Tone, string> = {
  success: 'status-dot-success',
  warning: 'status-dot-warning',
  alert: 'status-dot-alert',
  error: 'status-dot-error',
  info: 'status-dot-info',
  neutral: 'status-dot-neutral',
}

export function Badge({ tone = 'neutral', size = 'default', className, children }: BadgeProps) {
  return <span className={clsx(size === 'sm' ? 'badge-sm' : 'badge', toneClasses[tone], className)}>{children}</span>
}

export function StatusDot({ tone, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-theme-text-secondary">
      <span className={clsx('h-2.5 w-2.5 rounded-full', dotClasses[tone])} aria-hidden="true" />
      {label ? <span>{label}</span> : null}
    </span>
  )
}
