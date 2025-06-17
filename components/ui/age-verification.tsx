'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Card, CardContent } from './card'
import { useTheme } from '@/components/theme-provider'
import AnimatedShinyText from '@/components/magicui/animated-shiny-text'

export function AgeVerification() {
  const [isVisible, setIsVisible] = useState(false)
  const [showUnderage, setShowUnderage] = useState(false)
  const { isDarkMode } = useTheme()
  
  useEffect(() => {
    const hasVerification = localStorage.getItem('age-verification')
    if (hasVerification) {
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
      <div className="fixed inset-0 z-[100] bg-gray-900/80 backdrop-blur-md" />
      
      {/* Modal Content */}
      <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[30vh] p-4">
        <Card className="mx-auto max-w-sm w-full shadow-2xl relative overflow-hidden border-0">
          {!showUnderage ? (
            <div className="bg-white">
              {/* Logo/Brand Header */}
              <div className="bg-[#013DC4] text-white py-4 px-6">
                <div className="h-[80px] min-h-[80px] flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center pl-3 ml-[-10px]">
                    <Image
                      src="/outline.png"
                      alt="Sportingbot"
                      width={250}
                      height={120}
                      priority
                      className="ml-[-4px]"
                    />
                  </div>
                  <AnimatedShinyText className="text-xs text-white/50 pt-3">A Inteligência Artificial da Sportingbet</AnimatedShinyText>
                  <div className="text-[10px] text-white/40 pt-1 font-sportingbet">Versão Beta</div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 text-center bg-gray-50">
                {/* Message */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-700 leading-tight">
                    VOCÊ TEM MAIS DE 18<br />ANOS?
                  </h2>
                </div>
                
                {/* Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="flex-1 h-14 text-lg font-semibold border-gray-400 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    NÃO
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="flex-1 h-14 text-lg font-semibold bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg"
                  >
                    SIM
                  </Button>
                </div>
              </div>
              
            </div>
          ) : (
            <div className="bg-white">
              {/* Logo/Brand Header */}
              <div className="bg-[#013DC4] text-white py-4 px-6">
                <div className="h-[80px] min-h-[80px] flex flex-col items-center justify-center">
                  <div className="flex items-center justify-center pl-3 ml-[-10px]">
                    <Image
                      src="/outline.png"
                      alt="Sportingbot"
                      width={250}
                      height={120}
                      priority
                      className="ml-[-4px]"
                    />
                  </div>
                  <AnimatedShinyText className="text-xs text-white/50 pt-3">A Inteligência Artificial da Sportingbet</AnimatedShinyText>
                  <div className="text-[10px] text-white/40 pt-1 font-sportingbet">Versão Beta</div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 text-center bg-gray-50">
                {/* Underage Message */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-700 leading-tight">
                    Desculpe. Você ainda não<br />tem idade suficiente para<br />acessar este material.
                  </h2>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </>
  )
} 