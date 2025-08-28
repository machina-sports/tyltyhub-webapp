'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface ResponsibleGamingFooterProps {
  variant?: 'with-logo' | 'without-logo'
  className?: string
}

export function ResponsibleGamingFooter({ 
  variant = 'with-logo', 
  className 
}: ResponsibleGamingFooterProps) {
  return (
    <footer className={cn(
      "w-full bg-bwin-neutral-0 border-t border-bwin-brand-primary/20 mb-20 md:mb-0",
      className
    )}>
      {/* Single Banner with all elements */}
      <div className="w-full bg-bwin-neutral-0 border-y border-bwin-brand-primary/30">
        <div className="mobile-container py-4">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-6">
            {variant === 'with-logo' && (
              <div className="flex-shrink-0">
                <Image
                  src="/bwin-logo.png"
                  alt="bwin"
                  width={80}
                  height={24}
                  className="w-20 h-6 md:w-24 md:h-7"
                  priority
                />
              </div>
            )}
            
            {/* JUEGA CON RESPONSABILIDAD */}
            <div className="flex-shrink-0">
              <Image
                src="/Juega con responsabilidad.png"
                alt="Juega con responsabilidad"
                width={120}
                height={24}
                className="w-28 h-6 md:w-32 md:h-7"
              />
            </div>
            
            {/* Sin diversión no hay juego */}
            <div className="flex-shrink-0">
              <Image
                src="/Sin diversión no hay juego.png"
                alt="Sin diversión no hay juego"
                width={100}
                height={32}
                className="w-24 h-8 md:w-28 md:h-9"
              />
            </div>
            
            {/* +18 Icon */}
            <div className="flex-shrink-0">
              <Image
                src="/+18.png"
                alt="+18"
                width={32}
                height={32}
                className="w-8 h-8 md:w-9 md:h-9"
              />
            </div>
            
            {/* AutoProhibición */}
            <div className="flex-shrink-0">
              <Image
                src="/mano.png"
                alt="AutoProhibición"
                width={80}
                height={40}
                className="w-20 h-10 md:w-24 md:h-12"
              />
            </div>
            
            {/* Juego Seguro */}
            <div className="flex-shrink-0">
              <Image
                src="/Juego Seguro.png"
                alt="Juego Seguro"
                width={120}
                height={24}
                className="w-28 h-6 md:w-32 md:h-7"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
