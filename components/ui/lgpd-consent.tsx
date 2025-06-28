'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Card, CardContent } from './card'
import { useTheme } from '@/components/theme-provider'

export function LGPDConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const { isDarkMode } = useTheme()
  
  useEffect(() => {
    const checkVisibility = () => {
      const hasConsent = localStorage.getItem('lgpd-consent')
      const hasAgeVerification = localStorage.getItem('age-verification')
      
      // Only show LGPD consent if age verification is complete
      if (!hasConsent && hasAgeVerification) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Check on mount
    checkVisibility()

    // Listen for storage changes
    window.addEventListener('storage', checkVisibility)
    
    // Custom event for local storage changes in same tab
    window.addEventListener('ageVerificationComplete', checkVisibility)

    return () => {
      window.removeEventListener('storage', checkVisibility)
      window.removeEventListener('ageVerificationComplete', checkVisibility)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('lgpd-consent', 'true')
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className={cn(
        "mx-auto max-w-2xl shadow-lg",
        isDarkMode 
          ? "bg-[#061F3F] border-[#1E3A5F]" 
          : "bg-white"
      )}>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            <div className={cn(
              "prose prose-sm max-w-none",
              isDarkMode ? "prose-invert text-[#D3ECFF]" : ""
            )}>
              <h3 className="text-lg font-semibold mb-2">Privacidade e Cookies</h3>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência de navegação, 
                personalizar conteúdo e anúncios, e analisar o tráfego do site. 
                Ao continuar navegando, você concorda com nossa política de privacidade.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-[#0066CC] hover:bg-[#0052A3] text-white"
              >
                Aceitar
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
                Agora não
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
