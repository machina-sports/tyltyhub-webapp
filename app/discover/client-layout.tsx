"use client"

export default function DiscoverClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-scroll bg-bwin-neutral-10">
        {children}
      </div>
    </div>
  )
} 