"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps as NextThemeProviderProps } from "next-themes/dist/types"
import { useTheme as useNextTheme } from "next-themes"

export interface ThemeProviderProps extends NextThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Add a hook to get and set the current theme
export function useTheme() {
  const { theme, setTheme } = useNextTheme()

  // Function to toggle dark mode
  const toggleDarkMode = React.useCallback(() => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }, [theme, setTheme])

  return {
    theme,
    setTheme,
    toggleDarkMode,
    isDarkMode: theme === 'dark'
  }
}