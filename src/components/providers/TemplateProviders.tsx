import type { ReactNode } from 'react'
import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'

export type TemplateProvidersProps = { readonly children: ReactNode }

export function TemplateProviders({ children }: TemplateProvidersProps) {
  return (
    <ThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </ThemeProvider>
  )
}
