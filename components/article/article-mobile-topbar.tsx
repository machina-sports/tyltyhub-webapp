"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArticleShareButton } from "./article-share-button"
import { useArticleContext } from "./article-context"
import { BrandLogo } from "@/components/brand"

export function ArticleMobileTopbar() {
  const router = useRouter()
  const { articleId, title, url, shareImageUrl } = useArticleContext()
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
    <div className="flex items-center justify-between px-6 py-3 bg-background w-full md:hidden" style={{
      borderBottom: '1px solid hsl(var(--brand-primary) / 0.2)'
    }}>
      <div
        onClick={handleLogoClick}
        className="flex items-center cursor-pointer py-3"
        role="button"
        aria-label="Ir al inicio"
      >
        <BrandLogo
          variant="full"
          width={80}
          height={32}
          priority
          className="h-8 w-auto"
        />
      </div>
      
      {/* Botão Share apenas no mobile */}
      <ArticleShareButton 
        articleId={articleId}
        title={title}
        url={url}
        shareImageUrl={shareImageUrl}
        iconOnly
      />
    </div>
  )
}
