"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/libs/utils"

const tabs = [
  { label: "Notícias", href: "/discover" },
  { label: "Times e Atletas", href: "/discover/teams" }
]

export function Tabs() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary px-4 py-2 rounded-md",
                pathname === tab.href
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
            </Link>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}