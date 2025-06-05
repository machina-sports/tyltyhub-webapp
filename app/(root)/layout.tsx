"use client"

import TrendingProvider from "@/providers/trending/provider"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// import Footer from "@/components/footer"

// import InteractiveAvatar from "@/components/chat/video"

// import { Sidebar } from "@/components/sidebar"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme() 
  return (
    <TrendingProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* <Sidebar /> */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <div
            className={cn(
              "flex-1",
              isDarkMode ? "bg-[#061F3F]" : ""
            )}
          >
            {children}
          </div>
        </main>
        {/* <div className="fixed bottom-4 right-[0] xl:right-[150px] bottom-[150px] -translate-x-1/2 border rounded-full">
          {process.env.FEATURE_TOGGLE_ENABLE_AVATAR === '1' && <InteractiveAvatar />}
        </div> */}
        {/* <Footer /> */}
      </div>
    </TrendingProvider>
  )
}