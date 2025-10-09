'use client'

import { useEffect, useState } from 'react'
import { ResponsibleGamingFooter } from './responsible-gaming-footer'
import { ResponsibleGamingMobile } from './responsible-gaming-mobile'

interface ResponsibleGamingResponsiveProps {
  className?: string
  showLogo?: boolean
}

export function ResponsibleGamingResponsive({ 
  className,
  showLogo = true
}: ResponsibleGamingResponsiveProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkMobile()

    // Add event listener
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (isMobile) {
    return (
      <ResponsibleGamingMobile 
        className={className} 
        showLogo={showLogo} 
      />
    )
  }

  return (
    <ResponsibleGamingFooter 
      variant={showLogo ? 'with-logo' : 'without-logo'} 
      className={className} 
    />
  )
}
