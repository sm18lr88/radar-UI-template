import { createContext, useContext, useEffect, useEffectEvent, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'light' | 'dark'

export type ThemeContextValue = {
  readonly theme: Theme
  readonly toggleTheme: () => void
  readonly setTheme: (theme: Theme) => void
}

export type ThemeProviderProps = {
  readonly children: ReactNode
  readonly storageKey?: string
  readonly onThemeChange?: (theme: Theme) => void
}

const THEME_KEY = 'radar-ui-template-theme'
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function readInitialTheme(storageKey: string): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(storageKey)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): void {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children, storageKey = THEME_KEY, onThemeChange }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => readInitialTheme(storageKey))
  const notifyThemeChange = useEffectEvent((nextTheme: Theme) => onThemeChange?.(nextTheme))

  useEffect(() => {
    applyTheme(theme)
    window.localStorage.setItem(storageKey, theme)
    notifyThemeChange(theme)
  }, [storageKey, theme])

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme: setThemeState,
    toggleTheme: () => setThemeState((current) => current === 'dark' ? 'light' : 'dark'),
  }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme must be used within ThemeProvider')
  return value
}
