'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Card, CardContent } from './card'
import AnimatedShinyText from '@/components/magicui/animated-shiny-text'

export function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false)
  const [showUnderage, setShowUnderage] = useState(false)
  
  useEffect(() => {
    const hasVerification = localStorage.getItem('age-verification')
    if (!hasVerification) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('age-verification', 'true')
    setIsVisible(false)
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('ageVerificationComplete'))
  }

  const handleReject = () => {
    setShowUnderage(true)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Backdrop with blur */}
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md" />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <Card className="mx-auto max-w-md w-full shadow-2xl relative overflow-hidden border-0 bg-white">
          {!showUnderage ? (
            <div>
              {/* Logo/Brand Header */}
              <div className="bg-bwin-neutral-0 text-white py-8 px-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image
                    src="/bwin-logo.png"
                    alt="bwin"
                    width={140}
                    height={56}
                    priority
                    className="h-14 w-auto"
                  />
                  <AnimatedShinyText className="text-sm text-bwin-brand-primary font-medium">
                    Inteligencia Artificial de bwin
                  </AnimatedShinyText>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 text-center bg-white">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 leading-tight mb-2">
                    ¿Tienes 18 años o más?
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Para acceder a este contenido debes ser mayor de edad
                  </p>
                </div>
                
                {/* Buttons without shadows */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1 h-14 text-base font-semibold border-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    No
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="flex-1 h-14 text-base font-semibold rounded-xl transition-all duration-200 bg-bwin-brand-primary hover:bg-bwin-brand-secondary text-bwin-neutral-0"
                  >
                    Sí, tengo 18+
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Logo/Brand Header */}
              <div className="bg-bwin-neutral-0 text-white py-8 px-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Image
                    src="/bwin-logo.png"
                    alt="bwin"
                    width={140}
                    height={56}
                    priority
                    className="h-14 w-auto"
                  />
                  <AnimatedShinyText className="text-sm text-bwin-brand-primary font-medium">
                    Inteligencia Artificial de bwin
                  </AnimatedShinyText>
                  <div className="text-xs text-bwin-neutral-60 font-roboto">Versión Beta</div>
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