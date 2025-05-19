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

  // Function to toggle to Palmeiras theme
  const togglePalmeirasTheme = React.useCallback(() => {
    if (theme === 'palmeiras') {
      setTheme('light')
    } else {
      setTheme('palmeiras')
    }
  }, [theme, setTheme])

  return {
    theme,
    setTheme,
    togglePalmeirasTheme,
    isPalmeirasTheme: theme === 'palmeiras'
  }
}