"use client"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function ChatClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme() 
  return (
    <div className={cn(
      "h-full flex flex-col",
      isDarkMode ? "bg-[#061F3F]" : "bg-background"
    )}>
      <div className="flex-1 pt-16 md:pt-0">
        {children}
      </div>
      {/* <div className="fixed bottom-4 right-[0] xl:right-[150px] bottom-[150px] -translate-x-1/2 border rounded-full">
        {process.env.FEATURE_TOGGLE_ENABLE_AVATAR === '1' && <InteractiveAvatar />}
      </div> */}
      {/* <Footer /> */}
    </div>
  )
} 