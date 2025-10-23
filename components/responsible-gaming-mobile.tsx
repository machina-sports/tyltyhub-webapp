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
  const showImages = brand.responsibleGaming.footer?.images?.showImages ?? true;
  const images = brand.responsibleGaming.footer?.images;

  return (
    <div className={cn(
      "w-full md:mb-0 py-8 pb-0 mt-2 responsible-gaming-mobile",
      className
    )}>
      <div className="w-full">
        <div className="px-6">
          {showImages ? (
            // Show images for bwin
            <div className="flex flex-col items-center space-y-4">
              {showLogo && (
                <div className="flex-shrink-0 py-4">
                  <Image
                    src={brand.branding.logo.full}
                    alt={brand.displayName}
                    width={brand.branding.logo.footer?.mobile?.width || brand.branding.logo.footer?.width || 120}
                    height={brand.branding.logo.footer?.mobile?.height || brand.branding.logo.footer?.height || 24}
                    className={brand.branding.logo.footer?.mobile?.className || brand.branding.logo.footer?.className || ""}
                    priority
                  />
                </div>
              )}

              <div className="flex items-center justify-center gap-4 w-full">
                {images?.diversion && (
                  <div className="flex-shrink-0">
                    <Image
                      src={images.diversion}
                      alt="Sin diversión no hay juego"
                      width={200}
                      height={32}
                      className="w-40 h-8"
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
                      className="w-28 h-6"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-6 w-full">
                {images?.age && (
                  <div className="flex-shrink-0">
                    <Image
                      src={images.age}
                      alt="+18"
                      width={32}
                      height={32}
                      className="w-10 h-10"
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
                      className="w-24 h-12"
                    />
                  </div>
                )}
              </div>

              {images?.seguro && (
                <div className="flex items-center justify-center gap-6 w-full">
                  <div className="flex-shrink-0 py-4">
                    <Image
                      src={images.seguro}
                      alt="Juego Seguro"
                      width={150}
                      height={32}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show text disclaimer for sportingbet
            <div className="flex flex-col items-center space-y-4 text-center">
              {showLogo && (
                <div className="flex-shrink-0">
                  <Image
                    src={brand.branding.logo.full}
                    alt={brand.displayName}
                    width={brand.branding.logo.footer?.mobile?.width || brand.branding.logo.footer?.width || 120}
                    height={brand.branding.logo.footer?.mobile?.height || brand.branding.logo.footer?.height || 24}
                    className={brand.branding.logo.footer?.mobile?.className || brand.branding.logo.footer?.className || ""}
                    priority
                  />
                </div>
              )}

              {brand.responsibleGaming.footer?.oddsDisclaimer && (
                <div className="mt-4 px-2">
                  <p className="text-xs text-muted-foreground/90 text-center italic max-w-2xl mx-auto">
                    {brand.responsibleGaming.footer.oddsDisclaimer}
                  </p>
                </div>
              )}
              
              {brand.responsibleGaming.footer?.disclaimer && (
                <div className="text-sm text-muted-foreground/90">
                  {brand.responsibleGaming.footer.disclaimer}
                </div>
              )}

              {brand.responsibleGaming.footer?.copyright && (
                <div className="text-sm text-muted-foreground/90">
                  {brand.responsibleGaming.footer.copyright}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
