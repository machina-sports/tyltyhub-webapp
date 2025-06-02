"use client"

import StandingsProvider from "@/providers/standings/provider"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme() 
  return (
    <StandingsProvider>
      <div className="flex flex-col h-full overflow-hidden">
        <div className={cn(
          "flex-1 overflow-y-scroll",
          isDarkMode ? "bg-[#061F3F]" : ""
        )}>
          {children}
        </div>
      </div>
    </StandingsProvider>
  )
}