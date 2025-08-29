"use client"

import TrendingProvider from "@/providers/trending/provider"

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TrendingProvider>
      {children}
    </TrendingProvider>
  )
}