"use client"

export default function ChatClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex flex-col bg-bwin-neutral-10">
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