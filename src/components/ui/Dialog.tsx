import { X } from 'lucide-react'
import { useId } from 'react'
import type { ReactNode } from 'react'
import { useModalDialog } from './useModalDialog'

export type DialogProps = {
  readonly open: boolean
  readonly title: string
  readonly description: string
  readonly children: ReactNode
  readonly onClose: () => void
}

export function Dialog({ open, title, description, children, onClose }: DialogProps) {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useModalDialog(open, onClose)
  if (!open) return null
  return (
    <dialog ref={dialogRef} className="dialog dialog-modal w-full max-w-[34rem] p-5 text-theme-text-primary" aria-labelledby={titleId} aria-describedby={descriptionId} onClick={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 id={titleId} className="text-lg font-semibold text-theme-text-primary">{title}</h2>
          <p id={descriptionId} className="text-sm text-theme-text-secondary">{description}</p>
        </div>
        <button className="rounded-lg border border-theme-border bg-theme-elevated p-2 text-theme-text-secondary hover:bg-theme-hover" type="button" onClick={onClose} aria-label="Close dialog">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  )
}
