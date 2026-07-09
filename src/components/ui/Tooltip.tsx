import { useId } from 'react'
import type { ReactNode } from 'react'

export type TooltipProps = {
  readonly content: string
  readonly children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const tooltipId = useId()
  return (
    <span className="group relative inline-flex" tabIndex={0} aria-describedby={tooltipId}>
      {children}
      <span id={tooltipId} role="tooltip" className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 w-max max-w-64 -translate-x-1/2 rounded-md border border-theme-border bg-theme-elevated px-2 py-1 text-xs text-theme-text-primary opacity-0 shadow-theme-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {content}
      </span>
    </span>
  )
}
