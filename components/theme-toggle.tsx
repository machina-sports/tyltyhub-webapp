"use client"

import * as React from "react"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleDarkMode, isDarkMode } = useTheme()

  return (
    <div className={cn("flex items-center justify-center w-full p-2 text-white rounded-md", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isDarkMode}
        onClick={toggleDarkMode}
        className={cn(
          "relative inline-flex h-7 w-14 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          isDarkMode ? "bg-[#45CAFF]" : "bg-[#061F3F]"
        )}
      >
        <span className="sr-only">
          {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-flex items-center justify-center h-6 w-6 transform rounded-full shadow ring-0 transition duration-200 ease-in-out",
            isDarkMode ? "translate-x-7 bg-[#061F3F]" : "translate-x-0 bg-white"
          )}
        >
          {isDarkMode ? (
            <Moon className="h-4 w-4 text-[#45CAFF]" />
          ) : (
            <Sun className="h-4 w-4 text-[#061F3F]" />
          )}
        </span>
      </button>
    </div>
  )
} 