"use client"

import * as React from "react"
import { Sun } from "lucide-react"
import { Icon } from "lucide-react"
import { pigHead } from "@lucide/lab"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, togglePalmeirasTheme, isPalmeirasTheme } = useTheme()

  return (
    <div className={cn("flex items-center justify-center w-full p-2 text-white rounded-md", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isPalmeirasTheme}
        onClick={togglePalmeirasTheme}
        className={cn(
          "relative inline-flex h-7 w-14 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          isPalmeirasTheme ? "bg-[#00502E]" : "bg-[#061F3F]"
        )}
      >
        <span className="sr-only">
          {isPalmeirasTheme ? "Desativar tema Palmeiras" : "Ativar tema Palmeiras"}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-flex items-center justify-center h-6 w-6 transform rounded-full shadow ring-0 transition duration-200 ease-in-out",
            isPalmeirasTheme ? "translate-x-7 bg-white" : "translate-x-0 bg-white"
          )}
        >
          {isPalmeirasTheme ? (
            <Icon iconNode={pigHead} className="h-4 w-4 text-[#006B3D]" />
          ) : (
            <Sun className="h-4 w-4 text-yellow-500" />
          )}
        </span>
      </button>
    </div>
  )
} 