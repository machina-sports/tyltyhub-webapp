"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Home, Compass, History, Sun, Moon, X } from 'lucide-react'
import { MobileHeader } from './mobile-header'
import { useChatState } from '@/hooks/use-chat-state'

interface Route {
  label: string
  icon: React.ElementType
  href: string
}

const routes: Route[] = [
  {
    label: 'Home',
    icon: Home,
    href: '/',
  },
  {
    label: 'Discover',
    icon: Compass,
    href: '/discover',
  }
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { resetChat } = useChatState()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavigation = (href: string) => {
    if (href === '/') {
      resetChat()
    }
    router.push(href)
  }

  return (
    <>
      <MobileHeader onMenuClick={() => setIsOpen(true)} />

      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:w-56",
        "space-y-4 pt-16 md:pt-4 flex flex-col h-full bg-background/95 border-r",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-3 py-2 flex-1 flex flex-col">
          <div 
            onClick={() => handleNavigation('/')} 
            className="flex items-center justify-center pl-3 mb-6 cursor-pointer"
          >
            <Image 
              src="/sb-logo.png" 
              alt="SportingBet Logo" 
              width={150} 
              height={50}
              priority
            />
          </div>
          <div 
            onClick={() => handleNavigation('/')} 
            className="flex items-center justify-center pl-3 mb-14 cursor-pointer"
          >
            <Image 
              src="/cwc-logo.png" 
              alt="FIFA Club World Cup Logo" 
              width={110} 
              height={36}
              priority
            />
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-secondary"
                )}
                onClick={() => handleNavigation(route.href)}
              >
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </Button>
            ))}
          </div>
          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {mounted && theme === 'dark' ? (
                <>
                  <Sun className="h-5 w-5 mr-3" />
                  Light Mode
                </>
              ) : mounted ? (
                <>
                  <Moon className="h-5 w-5 mr-3" />
                  Dark Mode
                </>
              ) : (
                <span className="invisible">Loading...</span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}