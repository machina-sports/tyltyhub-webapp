"use client"

// import Footer from "@/components/footer"

// import InteractiveAvatar from "@/components/chat/video"

// import { Sidebar } from "@/components/sidebar"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-auto mt-20 min-h-[calc(100vh-27rem)]">
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-scroll">
            {children}
          </div>
        </div>
      </main>
      <div className="fixed bottom-4 right-[0] xl:right-[150px] bottom-[150px] -translate-x-1/2 border rounded-full">
        {/* {process.env.FEATURE_TOGGLE_ENABLE_AVATAR === '1' && <InteractiveAvatar />} */}
      </div>
      {/* <Footer /> */}
    </div>
  )
}