'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useBrandConfig } from '@/contexts/brand-context'

interface ResponsibleGamingFooterProps {
  variant?: 'with-logo' | 'without-logo'
  className?: string
}

export function ResponsibleGamingFooter({ 
  variant = 'with-logo', 
  className 
}: ResponsibleGamingFooterProps) {
  const brand = useBrandConfig();
  const showImages = brand.responsibleGaming.footer?.images?.showImages ?? true;
  const images = brand.responsibleGaming.footer?.images;
  
  return (
    <footer className={cn(
      "w-full mb-20 md:mb-0 py-4 mt-4 responsible-gaming-footer",
      className
    )}>
      <div className="w-full">
        <div className="mobile-container py-4">
          {showImages ? (
            // Show images for bwin
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 lg:gap-6">
              {variant === 'with-logo' && (
                <div className="flex-shrink-0">
                  <Image
                    src={brand.branding.logo.full}
                    alt={brand.displayName}
                    width={brand.branding.logo.footer?.width || 80}
                    height={brand.branding.logo.footer?.height || 24}
                    className={brand.branding.logo.footer?.className || "w-20 h-6 md:w-24 md:h-7"}
                    priority
                  />
                </div>
              )}
              
              {images?.responsabilidad && (
                <div className="flex-shrink-0">
                  <Image
                    src={images.responsabilidad}
                    alt="Juega con responsabilidad"
                    width={120}
                    height={24}
                    className="w-28 h-6 md:w-32 md:h-7"
                  />
                </div>
              )}
              
              {images?.diversion && (
                <div className="flex-shrink-0">
                  <Image
                    src={images.diversion}
                    alt="Sin diversión no hay juego"
                    width={200}
                    height={32}
                    className="w-24 h-8 md:w-40 md:h-12"
                  />
                </div>
              )}
              
              {images?.age && (
                <div className="flex-shrink-0">
                  <Image
                    src={images.age}
                    alt="+18"
                    width={32}
                    height={32}
                    className="w-8 h-8 md:w-9 md:h-9"
                  />
                </div>
              )}
              
              {images?.mano && (
                <div className="flex-shrink-0">
                  <Image
                    src={images.mano}
                    alt="AutoProhibición"
                    width={80}
                    height={40}
                    className="w-20 h-10 md:w-24 md:h-12"
                  />
                </div>
              )}
              
              {images?.seguro && (
                <div className="flex-shrink-0">
                  <Image
                    src={images.seguro}
                    alt="Juego Seguro"
                    width={120}
                    height={24}
                    className="w-28 h-6 md:w-32 md:h-7"
                  />
                </div>
              )}
              
              {/* Odds Disclaimer */}
              {brand.responsibleGaming.footer?.oddsDisclaimer && (
                <div className="w-full text-center mt-3 max-w-2xl">
                  <p className="text-xs text-muted-foreground italic">
                    {brand.responsibleGaming.footer.oddsDisclaimer}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Show text disclaimer for sportingbet
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              {variant === 'with-logo' && (
                <div className="flex-shrink-0">
                  <Image
                    src={brand.branding.logo.full}
                    alt={brand.displayName}
                    width={brand.branding.logo.footer?.width || 80}
                    height={brand.branding.logo.footer?.height || 24}
                    className={brand.branding.logo.footer?.className || "w-20 h-6 md:w-24 md:h-7"}
                    priority
                  />
                </div>
              )}
              
              {brand.responsibleGaming.footer?.disclaimer && (
                <div className="text-sm text-muted-foreground max-w-2xl">
                  {brand.responsibleGaming.footer.disclaimer}
                </div>
              )}
              
              {brand.responsibleGaming.footer?.copyright && (
                <div className="text-sm text-muted-foreground">
                  {brand.responsibleGaming.footer.copyright}
                </div>
              )}
              
              {/* Odds Disclaimer */}
              {brand.responsibleGaming.footer?.oddsDisclaimer && (
                <div className="text-xs text-muted-foreground italic mt-2 max-w-2xl">
                  {brand.responsibleGaming.footer.oddsDisclaimer}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
