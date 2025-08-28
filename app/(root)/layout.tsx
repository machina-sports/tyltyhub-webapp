"use client"

import TrendingProvider from "@/providers/trending/provider"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TrendingProvider>
      <div className="min-h-screen bg-bwin-neutral-10 flex flex-col">
        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="flex-1 bg-bwin-neutral-10">
            {children}
          </div>
        </main>
      </div>
    </TrendingProvider>
  )
}