'use client'

import { cn } from '@/lib/utils'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useBrandConfig } from '@/contexts/brand-context'

interface ResponsibleGamingFloatingProps {
  className?: string
}

export function ResponsibleGamingFloating({ className }: ResponsibleGamingFloatingProps) {
  const brand = useBrandConfig();
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
      <div className="bg-neutral-10 border-2 border-brand-primary/40 rounded-xl shadow-lg p-4">
        {/* Dismiss button */}
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-neutral-20 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4 text-neutral-60" />
        </button>
        
        {/* Content */}
        <div className="flex flex-col items-center space-y-3 pt-2">
          {brand.responsibleGaming.footer?.images?.showImages ? (
            // Show images for bwin
            <>
              {/* Main message */}
              {brand.responsibleGaming.footer.images.responsabilidad && (
                <Image
                  src={brand.responsibleGaming.footer.images.responsabilidad}
                  alt="Juega con responsabilidad"
                  width={120}
                  height={24}
                  className="w-24 h-5"
                />
              )}
              
              {/* Fun message */}
              {brand.responsibleGaming.footer.images.diversion && (
                <Image
                  src={brand.responsibleGaming.footer.images.diversion}
                  alt="Sin diversión no hay juego"
                  width={200}
                  height={32}
                  className="w-40 h-6"
                />
              )}
              
              {/* Icons row */}
              <div className="flex items-center justify-center gap-3">
                {brand.responsibleGaming.footer.images.age && (
                  <Image
                    src={brand.responsibleGaming.footer.images.age}
                    alt="+18"
                    width={32}
                    height={32}
                    className="w-6 h-6"
                  />
                )}
                {brand.responsibleGaming.footer.images.mano && (
                  <Image
                    src={brand.responsibleGaming.footer.images.mano}
                    alt="AutoProhibición"
                    width={80}
                    height={40}
                    className="w-16 h-8"
                  />
                )}
                {brand.responsibleGaming.footer.images.seguro && (
                  <Image
                    src={brand.responsibleGaming.footer.images.seguro}
                    alt="Juego Seguro"
                    width={120}
                    height={24}
                    className="w-20 h-4"
                  />
                )}
              </div>
            </>
          ) : (
            // Show text disclaimer for sportingbet
            <div className="text-center space-y-2">
              {brand.responsibleGaming.footer?.disclaimer && (
                <div className="text-xs text-muted-foreground">
                  {brand.responsibleGaming.footer.disclaimer}
                </div>
              )}
              {brand.responsibleGaming.footer?.copyright && (
                <div className="text-xs text-muted-foreground">
                  {brand.responsibleGaming.footer.copyright}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
