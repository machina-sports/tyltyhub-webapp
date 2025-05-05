"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/libs/utils'
import { Button } from '@/components/ui/button'
import { MessageSquare, Compass, History, X, Palette } from 'lucide-react'
import { MobileHeader } from './mobile-header'
import { useChatState } from '@/hooks/use-chat-state'

interface Route {
  label: string
  icon: React.ElementType
  href: string
}

const routes: Route[] = [
  {
    label: 'Chat',
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

  const handleNavigation = (href: string) => {
    if (href === '/') {
      resetChat()
    }
    router.push(href)
    setIsOpen(false)
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
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-56",
        "space-y-4 pt-16 md:pt-4 flex flex-col h-full bg-sportingbet-bright-deep-blue border-r",
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
        
        <div className="px-3 py-2 flex-1 flex flex-col">
          <div 
            onClick={() => handleNavigation('/')} 
            className="flex items-center justify-center pl-3 mb-8 cursor-pointer"
            role="button"
            aria-label="Go to home"
          >
            <Image 
              src="/sb-logo-novo.svg" 
              alt="Logo Sportingbet" 
              width={150} 
              height={45}
              priority
            />
          </div>
          <div 
            onClick={() => handleNavigation('/')} 
            className="flex items-center justify-center pl-3 mb-14 cursor-pointer"
            role="button"
            aria-label="Go to home"
          >
            <Image 
              src="/cwc-logo.png" 
              alt="Logo Copa do Mundo de Clubes da FIFA" 
              width={88}
              height={29}
              style={{ width: 'auto', height: '29px' }}
              priority
            />
          </div>
          <div className="space-y-2">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start text-white hover:text-white rounded-lg h-12 px-4",
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
        <div className="px-4 pb-4 pt-2">
          <a 
            href="https://www.sportingbet.bet.br/pt-br/mobileportal/register" 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 bg-[#061F3F] hover:bg-[#0A2950] active:bg-[#041A33] text-white font-medium rounded-md text-sm text-center shadow-sm transition-colors duration-200 mb-2"
          >
            Registre-se Agora
          </a>
          <a 
            href="https://www.sportingbet.bet.br/pt-br/labelhost/login" 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => setIsOpen(false)}
            className="block w-full py-3 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-medium rounded-md text-sm text-center border border-white/20 transition-colors duration-200"
          >
            Entrar
          </a>
        </div>
        <div className="p-4 border-t border-[#D3ECFF]/20">
          <div className="text-white/70 text-xs text-center">
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