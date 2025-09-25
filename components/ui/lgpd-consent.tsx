'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from './card'
import { Button } from './button'
import { Switch } from './switch'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { useBrandConfig } from '@/contexts/brand-context'
import { ChevronDown, ChevronUp, Settings } from 'lucide-react'

interface CookieConsent {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

const defaultConsent: CookieConsent = {
  essential: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false
}

export function LGPDConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent)
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

  const applyCookieConsent = (consentData: CookieConsent) => {
    // Store consent preferences
    localStorage.setItem('cookie-consent', JSON.stringify(consentData))
    localStorage.setItem('lgpd-consent', 'accepted')
    
    // Apply consent to analytics
    if (consentData.analytics) {
      // Enable GA4 if not already loaded
      if (typeof window !== 'undefined' && !window.gtag) {
        loadGoogleAnalytics()
      }
    } else {
      // Disable GA4 tracking
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        })
      }
    }
    
    setIsVisible(false)
    window.dispatchEvent(new CustomEvent('cookieConsentChange', { 
      detail: { consent: consentData, visible: false } 
    }))
  }

  const loadGoogleAnalytics = () => {
    if (typeof window === 'undefined') return
    
    const script1 = document.createElement('script')
    script1.async = true
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${brand.analytics.ga4Primary}`
    document.head.appendChild(script1)
    
    const script2 = document.createElement('script')
    script2.async = true
    script2.src = `https://www.googletagmanager.com/gtag/js?id=${brand.analytics.ga4Secondary}`
    document.head.appendChild(script2)
    
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) { window.dataLayer.push(args) }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', brand.analytics.ga4Primary)
    gtag('config', brand.analytics.ga4Secondary)
  }

  const handleAcceptAll = () => {
    const fullConsent: CookieConsent = {
      essential: true,
      analytics: true,
      marketing: true
    }
    applyCookieConsent(fullConsent)
  }

  const handleRejectAll = () => {
    const minimalConsent: CookieConsent = {
      essential: true,
      analytics: false,
      marketing: false
    }
    applyCookieConsent(minimalConsent)
  }

  const handleSaveSettings = () => {
    applyCookieConsent(consent)
  }

  const handleConsentChange = (category: keyof CookieConsent, value: boolean) => {
    if (category === 'essential') return // Essential cookies cannot be disabled
    setConsent(prev => ({ ...prev, [category]: value }))
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

  const cookieCategories = [
    {
      key: 'essential' as keyof CookieConsent,
      title: 'Cookies Esenciales',
      description: 'Necesarias para el funcionamiento básico del sitio web, incluyendo navegación y autenticación.',
      required: true
    },
    {
      key: 'analytics' as keyof CookieConsent,
      title: 'Cookies de Análisis',
      description: 'Google Analytics para entender cómo los usuarios interactúan con nuestro sitio (_ga, _gid, _gat).',
      required: false
    },
    {
      key: 'marketing' as keyof CookieConsent,
      title: 'Cookies de Marketing',
      description: 'Actualmente no utilizamos cookies de marketing o publicidad.',
      required: false
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[10000] px-4 py-4 md:p-6 md:ml-[340px]">
      <Card className={cn(
        "mx-auto shadow-lg",
        showSettings ? "max-w-4xl md:max-w-[600px]" : "max-w-2xl md:max-w-[480px]",
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
              <p className="text-xs mb-3">
                {getDescriptionWithLink()}
              </p>
              
              {/* Privacy Footnote */}
              <div className="bg-muted/50 p-3 rounded-lg border-l-4 border-orange-500 mb-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Importante:</strong> No introduzcas información personal en este chat. 
                  Los datos no son procesados por Entain. Este es un servicio informativo sobre deportes y apuestas.
                </p>
              </div>
            </div>

            {/* Cookie Settings */}
            {showSettings && (
              <div className="space-y-3 border-t pt-4">
                <h4 className="text-sm font-semibold">Configuración de Cookies</h4>
                {cookieCategories.map((category) => (
                  <div key={category.key} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-medium">{category.title}</h5>
                        {category.required && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                            Requeridas
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                    <Switch
                      checked={consent[category.key]}
                      onCheckedChange={(checked) => handleConsentChange(category.key, checked)}
                      disabled={category.required}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {!showSettings ? (
                // Initial view buttons
                <div className="flex flex-row gap-3">
                  <Button
                    onClick={handleRejectAll}
                    variant="ghost"
                    className="flex-1 text-muted-foreground hover:bg-muted"
                  >
                    Rechazar Todo
                  </Button>
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="outline"
                    className="flex-1"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Configurar
                  </Button>
                  <Button
                    onClick={handleAcceptAll}
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                    className="flex-1 text-primary-foreground hover:opacity-90"
                  >
                    {acceptText || 'Aceptar Todo'}
                  </Button>
                </div>
              ) : (
                // Settings view buttons
                <div className="flex flex-row gap-3">
                  <Button
                    onClick={() => setShowSettings(false)}
                    variant="ghost"
                    className="flex-1"
                  >
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Ocultar
                  </Button>
                  <Button
                    onClick={handleRejectAll}
                    variant="outline"
                    className="flex-1"
                  >
                    Rechazar Todo
                  </Button>
                  <Button
                    onClick={handleSaveSettings}
                    style={{ backgroundColor: 'var(--brand-primary)' }}
                    className="flex-1 text-primary-foreground hover:opacity-90"
                  >
                    Guardar Preferencias
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}