'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Card, CardContent } from './card'
import AnimatedShinyText from '@/components/magicui/animated-shiny-text'
import { BrandLogo } from '@/components/brand/brand-logo'
import { useBrandConfig } from '@/contexts/brand-context'

const brandId = process.env.NEXT_PUBLIC_BRAND || 'bwin';

export function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false)
  const [showUnderage, setShowUnderage] = useState(false)
  const brand = useBrandConfig()
  
  useEffect(() => {
    const hasVerification = localStorage.getItem('age-verification')
    if (!hasVerification) {
      setIsVisible(true)
      // Dispatch event when age verification becomes visible
      console.log('Age Verification: Dispatching visible=true event');
      window.dispatchEvent(new CustomEvent('ageVerificationChange', { detail: { visible: true } }))
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('age-verification', 'true')
    setIsVisible(false)
    
    // Dispatch custom event to notify other components
    console.log('Age Verification: Dispatching visible=false event');
    window.dispatchEvent(new CustomEvent('ageVerificationComplete'))
    window.dispatchEvent(new CustomEvent('ageVerificationChange', { detail: { visible: false } }))
  }

  const handleReject = () => {
    setShowUnderage(true)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 z-[100] backdrop-blur-md" 
        style={{
          backgroundColor: `rgba(0, 0, 0, ${brand.ageVerification?.backdropOpacity || '0.9'})`
        }}
      />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <Card 
          className="mx-auto max-w-md w-full shadow-2xl relative overflow-hidden bg-white"
          style={{
            border: brand.ageVerification?.modalBorder || '0'
          }}
        >
          {!showUnderage ? (
            <div>
              {/* Logo/Brand Header */}
              <div 
                className="text-white py-8 px-8"
                style={{
                  backgroundColor: brand.ageVerification?.headerBackgroundColor || 'hsl(var(--brand-primary))'
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <BrandLogo
                    variant="full"
                    width={140}
                    height={56}
                    priority
                    className="h-14 w-auto"
                  />
                  <div className="text-sm text-white font-medium">
                    {brand.content.subtitle}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 text-center bg-white">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-2">
                    {brand.ageVerification?.title || '¿Tienes 18 años o más?'}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {brand.ageVerification?.description || 'Para acceder a este contenido debes ser mayor de edad'}
                  </p>
                </div>
                
                {/* Buttons without shadows */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1 h-14 text-base font-semibold rounded-xl"
                    style={{
                      backgroundColor: brand.ageVerification?.rejectButton?.backgroundColor || '#FFFFFF',
                      color: brand.ageVerification?.rejectButton?.color || '#374151',
                      border: brand.ageVerification?.rejectButton?.border || '2px solid #D1D5DB',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = brand.ageVerification?.rejectButton?.hoverBackgroundColor || '#F9FAFB';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = brand.ageVerification?.rejectButton?.backgroundColor || '#FFFFFF';
                    }}
                  >
                    {brand.ageVerification?.rejectText || 'No'}
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className={`flex-1 h-14 text-base font-semibold rounded-xl ${brandId}-age-verification-cta`}
                  >
                    {brand.ageVerification?.acceptText || 'Sí, tengo 18+'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Logo/Brand Header */}
              <div 
                className="text-white py-8 px-8"
                style={{
                  backgroundColor: brand.ageVerification?.headerBackgroundColor || 'hsl(var(--brand-primary))'
                }}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <BrandLogo
                    variant="full"
                    width={140}
                    height={56}
                    priority
                    className="h-14 w-auto"
                  />
                  <div className="text-sm text-white font-medium">
                    {brand.content.subtitle}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 text-center bg-white">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-4">
                    Lo siento, aún no tienes<br />la edad suficiente para<br />acceder a este contenido.
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Este sitio es solo para mayores de 18 años
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  )
} 