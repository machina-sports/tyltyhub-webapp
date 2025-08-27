"use client"

import { ResponsibleGamingResponsive } from "@/components/responsible-gaming-responsive"
import TrendingProvider from "@/providers/trending/provider"

// import Footer from "@/components/footer"

// import InteractiveAvatar from "@/components/chat/video"

// import { Sidebar } from "@/components/sidebar"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TrendingProvider>
      <div className="min-h-screen bg-bwin-neutral-10 flex flex-col">
        {/* <Sidebar /> */}
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="flex-1 bg-bwin-neutral-10">
            {children}
          </div>
        </main>
        {/* <div className="fixed bottom-4 right-[0] xl:right-[150px] bottom-[150px] -translate-x-1/2 border rounded-full">
          {process.env.FEATURE_TOGGLE_ENABLE_AVATAR === '1' && <InteractiveAvatar />}
        </div> */}
        {/* <Footer /> */}
        {/* Responsible Gaming Footer - only one instance */}
        <ResponsibleGamingResponsive />
      </div>
    </TrendingProvider>
  )
}