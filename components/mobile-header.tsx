"use client"

import { ArrowLeft, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import { useChatState } from "@/hooks/use-chat-state"

interface MobileHeaderProps {
  onMenuClick: () => void
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { resetChat } = useChatState()
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
    <div className="fixed top-0 left-0 right-0 h-16 bg-[#0A5EEA] backdrop-blur-sm border-b z-40 md:hidden">
      <div className="flex items-center justify-between h-full px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-10 w-10 text-white hover:bg-white/20 hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 
          className="text-lg font-semibold cursor-pointer text-white" 
          onClick={handleHomeNavigation}
        >
          {getPageTitle()}
        </h1>

        {isArticlePage ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 ml-auto text-white hover:bg-white/20 hover:text-white"
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