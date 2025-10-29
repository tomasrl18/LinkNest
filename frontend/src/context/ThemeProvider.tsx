import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type ThemeMode = 'light' | 'dark' | 'system'

type ThemeContextType = {
  mode: ThemeMode
  resolved: 'light' | 'dark'
  setTheme: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'ln-theme'

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyThemeToDom(theme: 'light' | 'dark') {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  // Keep DaisyUI theme in sync if used
  root.setAttribute('data-theme', theme === 'dark' ? 'mydark' : 'light')
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system'
    const saved = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) || 'system'
    return saved
  })

  const resolved = useMemo<'light' | 'dark'>(() => {
    return mode === 'system' ? getSystemPreference() : mode
  }, [mode])

  useEffect(() => {
    applyThemeToDom(resolved)
  }, [resolved])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => {
      if (mode === 'system') {
        applyThemeToDom(getSystemPreference())
      }
    }
    media.addEventListener?.('change', listener)
    return () => media.removeEventListener?.('change', listener)
  }, [mode])

  const setTheme = (m: ThemeMode) => {
    setMode(m)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {}
  }

  const toggle = () => {
    const next = resolved === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  const value: ThemeContextType = { mode, resolved, setTheme, toggle }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}

