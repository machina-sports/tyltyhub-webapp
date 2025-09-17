'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './card'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { useBrandConfig } from '@/contexts/brand-context'

export function LGPDConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const { isDarkMode } = useTheme()
  const brand = useBrandConfig()

  useEffect(() => {
    const checkAndShowConsent = () => {
      const hasConsent = localStorage.getItem('lgpd-consent')
      const hasAgeVerification = localStorage.getItem('age-verification')
      
      // Only show LGPD consent if age verification is completed and LGPD consent hasn't been given
      if (!hasConsent && hasAgeVerification && brand.privacy?.lgpd?.enabled) {
        // Show after a small delay to prevent layout shift
        const timer = setTimeout(() => {
          setIsVisible(true)
        }, 1000)
        
        return () => clearTimeout(timer)
      }
    }

    // Check initially
    checkAndShowConsent()

    // Listen for age verification completion
    const handleAgeVerificationComplete = () => {
      checkAndShowConsent()
    }

    window.addEventListener('ageVerificationComplete', handleAgeVerificationComplete)

    return () => {
      window.removeEventListener('ageVerificationComplete', handleAgeVerificationComplete)
    }
  }, [brand.privacy?.lgpd?.enabled])

  const handleAccept = () => {
    localStorage.setItem('lgpd-consent', 'accepted')
    setIsVisible(false)
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('lgpdConsentChange', { detail: { visible: false } }))
  }

  const handleDismiss = () => {
    localStorage.setItem('lgpd-consent', 'dismissed')
    setIsVisible(false)
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('lgpdConsentChange', { detail: { visible: false } }))
  }

  // Dispatch event when component becomes visible
  useEffect(() => {
    if (isVisible) {
      window.dispatchEvent(new CustomEvent('lgpdConsentChange', { detail: { visible: true } }))
    }
  }, [isVisible])

  // Don't show if LGPD is disabled for this brand or not configured
  if (!isVisible || !brand.privacy?.lgpd?.enabled) return null

  const lgpdConfig = brand.privacy.lgpd
  const title = lgpdConfig.title || 'Privacidade e Cookies'
  const description = lgpdConfig.description || 'Utilizamos cookies e tecnologias similares para melhorar sua experiência.'
  const acceptText = lgpdConfig.acceptText || 'Aceitar'
  const dismissText = lgpdConfig.dismissText || 'Agora não'
  const privacyPolicyUrl = lgpdConfig.privacyPolicyUrl
  const privacyPolicyText = lgpdConfig.privacyPolicyText || 'política de privacidade'

  // Create description with privacy policy link if URL is provided
  const getDescriptionWithLink = () => {
    if (!privacyPolicyUrl) return description
    
    const parts = description.split(privacyPolicyText)
    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <a 
            href={privacyPolicyUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline"
          >
            {privacyPolicyText}
          </a>
          {parts[1]}
        </>
      )
    }
    return description
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] px-8 py-4 md:p-6 md:ml-[340px]">
      <Card className={cn(
        "mx-auto max-w-2xl md:max-w-[480px] shadow-lg",
        isDarkMode 
          ? "bg-card border-border" 
          : "bg-white border-border"
      )}>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4">
            <div className={cn(
              "prose prose-sm max-w-none",
              isDarkMode ? "prose-invert text-foreground" : "text-foreground"
            )}>
              <h3 className="text-md font-semibold mb-2">{title}</h3>
              <p className="text-xs">
                {getDescriptionWithLink()}
              </p>
            </div>
            <div className="flex flex-row gap-3">
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="flex-1 text-muted-foreground hover:bg-muted"
              >
                {dismissText || 'Agora não'}
              </Button>
              <Button
                onClick={handleAccept}
                variant="outline"
                style={{ backgroundColor: 'var(--brand-primary)' }}
                className="flex-1 text-primary-foreground hover:opacity-90"
              >
                {acceptText || 'Aceitar'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}