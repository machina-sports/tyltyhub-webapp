'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ResponsibleGamingFloatingProps {
  className?: string
}

export function ResponsibleGamingFloating({ className }: ResponsibleGamingFloatingProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Show after 3 seconds on mobile devices
    const timer = setTimeout(() => {
      if (window.innerWidth < 768 && !isDismissed) {
        setIsVisible(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isDismissed])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    // Remember dismissal for this session
    sessionStorage.setItem('rg-floating-dismissed', 'true')
  }

  useEffect(() => {
    // Check if user has already dismissed this session
    const dismissed = sessionStorage.getItem('rg-floating-dismissed')
    if (dismissed) {
      setIsDismissed(true)
    }
  }, [])

  if (!isVisible || isDismissed) return null

  return (
    <div className={cn(
      "fixed bottom-4 left-4 right-4 z-50 md:hidden",
      className
    )}>
      <div className="bg-bwin-neutral-0 border-2 border-brand-primary/40 rounded-xl shadow-lg p-4">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-bwin-neutral-20 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4 text-bwin-neutral-60" />
        </button>
        
        {/* Content */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          {/* Main message */}
          <Image
            src="/Juega con responsabilidad.png"
            alt="Juega con responsabilidad"
            width={120}
            height={24}
            className="w-24 h-5"
          />
          
          {/* Fun message */}
          <Image
            src="/Sin diversión no hay juego.png"
            alt="Sin diversión no hay juego"
            width={100}
            height={32}
            className="w-20 h-6"
          />
          
          {/* Icons row */}
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/+18.png"
              alt="+18"
              width={32}
              height={32}
              className="w-6 h-6"
            />
            <Image
              src="/mano.png"
              alt="AutoProhibición"
              width={80}
              height={40}
              className="w-16 h-8"
            />
            <Image
              src="/Juego Seguro.png"
              alt="Juego Seguro"
              width={120}
              height={24}
              className="w-20 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
