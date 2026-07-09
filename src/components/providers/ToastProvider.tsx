import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { Tone } from '../../types'
import { Badge } from '../ui/Badge'

export type Toast = {
  readonly id: string
  readonly tone: Tone
  readonly title: string
  readonly message: string
}

export type ToastInput = Omit<Toast, 'id'>

export type ToastContextValue = {
  readonly pushToast: (toast: ToastInput) => void
}

export type ToastProviderProps = { readonly children: ReactNode }

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<readonly Toast[]>([])
  const timers = useRef(new Set<number>())

  useEffect(() => () => {
    for (const timer of timers.current) window.clearTimeout(timer)
    timers.current.clear()
  }, [])

  const pushToast = useCallback((toast: ToastInput) => {
    const id = crypto.randomUUID()
    setToasts((current) => [...current.slice(-2), { ...toast, id }])
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4_000)
    timers.current.add(timer)
  }, [])

  const value = useMemo(() => ({ pushToast }), [pushToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3" aria-atomic="false" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="dialog p-4 text-sm text-theme-text-secondary">
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="font-medium text-theme-text-primary">{toast.title}</span>
              <Badge tone={toast.tone}>{toast.tone}</Badge>
            </div>
            <p>{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const value = useContext(ToastContext)
  if (!value) throw new Error('useToast must be used within ToastProvider')
  return value
}
