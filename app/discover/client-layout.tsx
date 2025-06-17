"use client"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function DiscoverClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme() 
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className={cn(
        "flex-1 overflow-y-scroll",
        isDarkMode ? "bg-[#061F3F]" : ""
      )}>
        {children}
      </div>
    </div>
  )
} 