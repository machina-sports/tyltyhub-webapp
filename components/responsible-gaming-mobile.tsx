'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useBrandConfig } from '@/contexts/brand-context'

interface ResponsibleGamingMobileProps {
  className?: string
  showLogo?: boolean
}

export function ResponsibleGamingMobile({
  className,
  showLogo = true
}: ResponsibleGamingMobileProps) {
  const brand = useBrandConfig();
  return (
    <div className={cn(
      "w-full md:mb-0 py-8 mt-2 responsible-gaming-mobile",
      className
    )}>
      <div className="w-full">
        <div className="px-6">
          <div className="flex flex-col items-center space-y-4">
            {showLogo && (
              <div className="flex-shrink-0 py-4">
                <Image
                  src={brand.branding.logo.full}
                  alt={brand.displayName}
                  width={120}
                  height={24}
                  priority
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-4 w-full">
              <div className="flex-shrink-0">
                <Image
                  src="/Sin diversión no hay juego.png"
                  alt="Sin diversión no hay juego"
                  width={100}
                  height={32}
                  className="w-24 h-8"
                />
              </div>
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
            </div>

            <div className="flex items-center justify-center gap-6 w-full">
              <div className="flex-shrink-0 py-4">
                <Image
                  src="/Juego Seguro.png"
                  alt="Juego Seguro"
                  width={150}
                  height={32}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
