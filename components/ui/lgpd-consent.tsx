'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './card'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'

export function LGPDConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    const hasConsent = localStorage.getItem('lgpd-consent')
    if (!hasConsent) {
      // Show after a small delay to prevent layout shift
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('lgpd-consent', 'accepted')
    setIsVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem('lgpd-consent', 'dismissed')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className={cn(
        "mx-auto max-w-2xl shadow-lg",
        isDarkMode 
          ? "bg-bwin-neutral-20 border-bwin-neutral-30" 
          : "bg-white"
      )}>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            <div className={cn(
              "prose prose-sm max-w-none",
              isDarkMode ? "prose-invert text-bwin-neutral-90" : ""
            )}>
              <h3 className="text-lg font-semibold mb-2">Privacidad y Cookies</h3>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia de navegación, 
                personalizar contenido y anuncios, y analizar el tráfico del sitio. 
                Al continuar navegando, aceptas nuestra política de privacidad.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-brand-primary hover:bg-brand-secondary text-bwin-neutral-0"
              >
                Aceptar
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className={cn(
                  "flex-1",
                  isDarkMode 
                    ? "text-white hover:bg-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                Ahora no
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
