"use client"

import { ArrowLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useChatState } from "@/hooks/use-chat-state"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const pathname = usePathname() || ''
  const router = useRouter()
  const { resetChat } = useChatState()
  const { isDarkMode } = useTheme()
  const isArticlePage = pathname.startsWith("/discover/") && pathname !== "/discover"
  
  const getPageTitle = () => {
    if (isArticlePage) return "Artigo"
    if (pathname === "/discover") return "Descobrir"
    return "Chat"
  }

  const handleHomeNavigation = () => {
    if (pathname === '/') {
      resetChat()
    } else {
      router.push('/')
    }
  }

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 h-16 backdrop-blur-sm border-b z-40 md:hidden",
      isDarkMode ? "bg-[#061F3F]" : "bg-[#0A5EEA]"
    )}>
      <div className="flex items-center justify-between h-full px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-12 w-12 text-white hover:bg-white/20 active:bg-white/30 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-8 w-8" />
        </Button>
        
        <h1 
          className="text-lg font-semibold cursor-pointer text-white py-2 px-4 -mx-4 flex-1 text-center" 
          onClick={handleHomeNavigation}
          role="button"
          aria-label="Go to home"
        >
          {getPageTitle()}
        </h1>

        {isArticlePage ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-12 w-12 ml-auto text-white hover:bg-white/20 active:bg-white/30 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div className="w-12 ml-auto" />
        )}
      </div>
    </div>
  );
}