"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { MessageSquare, Compass, History, X } from 'lucide-react'
import { MobileHeader } from './mobile-header'
import { useChatState } from '@/hooks/use-chat-state'
import { ThemeToggle } from './theme-toggle'
import { useTheme } from './theme-provider'
import AnimatedShinyText from './magicui/animated-shiny-text'

interface Route {
  label: string
  icon: React.ElementType
  href: string
}

const routes: Route[] = [
  {
    label: 'Conversar',
    icon: MessageSquare,
    href: '/',
  },
  {
    label: 'Descobrir',
    icon: Compass,
    href: '/discover',
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { resetChat } = useChatState()
  const [isOpen, setIsOpen] = useState(false)
  const { isDarkMode } = useTheme()

  const handleNavigation = (href: string) => {
    if (href === '/') {
      resetChat()
    }
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'navigation_click', {
        event_category: 'sidebar_menu',
        event_label: `Clicked ${href}`,
        value: href,
      });
    }
    router.push(href)
    setIsOpen(false)
  }

  const handleLogoClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'navigation_click', {
        event_category: 'sidebar_logo',
        event_label: 'Clicked Logo',
        value: '/',
      });
    }
    handleNavigation('/')
  }

  useEffect(() => {
    // Close sidebar when route changes (mobile)
    setIsOpen(false)
  }, [pathname])

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      <MobileHeader onMenuClick={() => setIsOpen(true)} />

      <div className={cn(
        "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static w-72",
        "space-y-4 pt-16 md:pt-4 flex flex-col h-full bg-sportingbet-bright-deep-blue border-r",
        isDarkMode ? "bg-[#061F3F] border-[#D3ECFF]/20" : "bg-sportingbet-bright-deep-blue border-white/10",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="pr-4 pl-2 absolute top-4 right-0 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-10 w-10 text-white hover:bg-white/20 active:bg-white/30"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="px-8 py-2 flex-1 flex flex-col">
          {/* Fixed height logo container */}
          <div className="h-[80px] min-h-[80px] flex flex-col items-center justify-center mb-8">
            <div
              onClick={handleLogoClick}
              className="flex items-center justify-center pl-3 cursor-pointer ml-[-10px]"
              role="button"
              aria-label="Go to home"
            >
              <Image
                src="/outline.png"
                alt="Sportingbot"
                width={250}
                height={120}
                priority
                className="ml-[-4px]"
              />
            </div>
            <AnimatedShinyText className="text-xs text-white/50 pt-3">A Inteligência Artificial da Sportingbet</AnimatedShinyText>
            <div className="text-[10px] text-white/40 pt-1 font-sportingbet">Versão Beta</div>
          </div>
          {/* Navigation buttons with fixed position */}
          <div className="space-y-4 border-t border-white/10 pt-4">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-base text-white hover:text-white rounded-lg h-16 px-8",
                  pathname === route.href
                    ? "bg-white/20 text-white hover:bg-white/30 font-medium"
                    : "hover:bg-white/10 active:bg-white/15 transition-colors duration-200"
                )}
                onClick={() => handleNavigation(route.href)}
              >
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="px-8 py-2 pb-4 pt-2">
          <a
            href="https://www.sportingbet.bet.br/pt-br/myaccount/register?utm_source=spbot&utm_medium=botao&utm_campaign=5530097&utm_content=registrar&utm_term=5530097-botmundial-spbet-sprts-br-2025-06-17-pt-botao--acq-web&wm=5530097"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className={cn(
              "block w-full py-3 text-white font-medium rounded-md text-sm text-center shadow-sm transition-colors duration-200 mb-4",
              isDarkMode
                ? "bg-[#0078B3] hover:bg-[#006699] active:bg-[#005580]"
                : "bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#004080]"
            )}
          >
            Registre-se Agora
          </a>
          <a
            href="https://www.sportingbet.bet.br/pt-br/labelhost/login?utm_source=spbot&utm_medium=botao&utm_campaign=5530097&utm_content=entrar&utm_term=5530097-botmundial-spbet-sprts-br-2025-06-17-pt-botao--acq-web&wm=5530097"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-medium rounded-md text-sm text-center border border-white/20 transition-colors duration-200 mb-2"
          >
            Entrar
          </a>
          <div className="mt-3 border-t border-white/10 pt-3 flex justify-center">
            <ThemeToggle />
          </div>
        </div>
        <div className="px-4 py-3 border-t border-[#D3ECFF]/20">
          <div className="text-[#D3ECFF]/70 text-[11px] leading-tight text-center">
            18+. Apostar pode causar dependência e transtornos do jogo patológico. Jogue com responsabilidade. Autorizada pela SPA/MF sob licença nº 247.
          </div>
        </div>
        <div className="px-4 py-2 border-t border-[#D3ECFF]/20">
          <div className="text-[#D3ECFF]/70 text-xs text-center">
            © {new Date().getFullYear()} Sportingbet
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}