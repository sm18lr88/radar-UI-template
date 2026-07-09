import { useEffect, useEffectEvent, useRef } from 'react'

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export function useModalDialog(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeDialog = useEffectEvent(onClose)

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return
    const previouslyFocused = document.activeElement
    if (!dialog.open) dialog.showModal()
    return () => {
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const dialog = dialogRef.current
    if (!dialog) return
    const dialogElement = dialog
    function onCancel(event: Event): void {
      event.preventDefault()
      closeDialog()
    }
    function onKeyDown(event: KeyboardEvent): void {
      if (event.key !== 'Tab') return
      const focusable = [...dialogElement.querySelectorAll<HTMLElement>(focusableSelector)]
      const first = focusable[0]
      const last = focusable.at(-1)
      if (!first || !last) {
        event.preventDefault()
        return
      }
      if (event.shiftKey && (document.activeElement === first || !dialogElement.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    dialogElement.addEventListener('cancel', onCancel)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      dialogElement.removeEventListener('cancel', onCancel)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [open])

  return dialogRef
}
