"use client"
// import Footer from "@/components/footer"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

// import InteractiveAvatar from "@/components/chat/video"

// import { Sidebar } from "@/components/sidebar"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isDarkMode } = useTheme() 
  return (
    <div className={cn(
      "min-h-screen bg-background flex flex-col",
      isDarkMode ? "bg-[#061F3F]" : ""
    )}>
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-auto mt-12 min-h-[calc(100vh-27rem)]">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-scroll">
            {children}
          </div>
        </div>
      </main>
      {/* <div className="fixed bottom-4 right-[0] xl:right-[150px] bottom-[150px] -translate-x-1/2 border rounded-full">
        {process.env.FEATURE_TOGGLE_ENABLE_AVATAR === '1' && <InteractiveAvatar />}
      </div> */}
      {/* <Footer /> */}
    </div>
  )
}