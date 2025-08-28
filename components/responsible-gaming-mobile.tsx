'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ResponsibleGamingMobileProps {
  className?: string
  showLogo?: boolean
}

export function ResponsibleGamingMobile({ 
  className,
  showLogo = true
}: ResponsibleGamingMobileProps) {
  return (
    <div className={cn(
      "w-full bg-bwin-neutral-0 border-t-2 border-bwin-brand-primary/40 md:mb-0",
      className
    )}>
      {/* Single Mobile Banner with all elements */}
      <div className="w-full bg-bwin-neutral-0 border-y border-bwin-brand-primary/30">
        <div className="px-6 py-4">
          <div className="flex flex-col items-center space-y-4">
            {/* Top Row - Logo and Main Message */}
            <div className="flex items-center justify-center gap-4 w-full">
              {showLogo && (
                <div className="flex-shrink-0">
                  <Image
                    src="/bwin-logo.png"
                    alt="bwin"
                    width={80}
                    height={24}
                    className="w-20 h-6"
                    priority
                  />
                </div>
              )}
              
              <div className="flex-shrink-0">
                <Image
                  src="/Juega con responsabilidad.png"
                  alt="Juega con responsabilidad"
                  width={120}
                  height={24}
                  className="w-28 h-6"
                />
              </div>
            </div>
            
            {/* Second Row - Fun Message */}
            <div className="flex-shrink-0">
              <Image
                src="/Sin diversión no hay juego.png"
                alt="Sin diversión no hay juego"
                width={100}
                height={32}
                className="w-24 h-8"
              />
            </div>
            
            {/* Third Row - Age and Safety Icons */}
            <div className="flex items-center justify-center gap-6 w-full">
              <div className="flex-shrink-0">
                <Image
                  src="/+18.png"
                  alt="+18"
                  width={32}
                  height={32}
                  className="w-10 h-10"
                />
              </div>
              
              <div className="flex-shrink-0">
                <Image
                  src="/mano.png"
                  alt="AutoProhibición"
                  width={80}
                  height={40}
                  className="w-24 h-12"
                />
              </div>
              
              <div className="flex-shrink-0">
                <Image
                  src="/Juego Seguro.png"
                  alt="Juego Seguro"
                  width={120}
                  height={24}
                  className="w-28 h-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
