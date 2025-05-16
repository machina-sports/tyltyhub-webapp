"use client"

import StandingsProvider from "@/providers/standings/provider"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <StandingsProvider>
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-scroll">
          {children}
        </div>
      </div>
    </StandingsProvider>
  )
}