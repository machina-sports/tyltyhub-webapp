"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SearchToggleButton } from "./search-toggle-button"
import { useSearchWrapper } from "./search-wrapper"

export function DiscoverMobileTopbar() {
  const router = useRouter()
  const { clearSearchQuery } = useSearchWrapper()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleLogoClick = () => {
    router.push("/")
  }

  if (!isMobile) {
    return null
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-bwin-neutral-0 w-full md:hidden">
      <div
        onClick={handleLogoClick}
        className="flex items-center cursor-pointer py-3"
        role="button"
        aria-label="Ir al inicio"
      >
        <Image
          src="/bwin-logo.png"
          alt="bwin"
          width={80}
          height={32}
          priority
          className="h-8 w-auto"
        />
      </div>
      
      {/* Botão Search apenas no mobile */}
      <SearchToggleButton onClearSearch={clearSearchQuery} />
    </div>
  )
}
