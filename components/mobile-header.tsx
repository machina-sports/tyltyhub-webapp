"use client"

import { ArrowLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const isArticlePage = pathname.startsWith("/discover/") && pathname !== "/discover"
  
  const getPageTitle = () => {
    if (isArticlePage) return "Article"
    if (pathname === "/discover") return "Discover"
    if (pathname === "/my-bets") return "My Bets"
    return "Home"
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b z-40 md:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="text-lg font-semibold">
          {getPageTitle()}
        </h1>

        {isArticlePage ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 ml-auto"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-10 ml-auto" />
        )}
      </div>
    </div>
  );
}