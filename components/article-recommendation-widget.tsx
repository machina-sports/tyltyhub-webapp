/**
 * Article Recommendation Widget
 * 
 * Usage:
 * <ArticleRecommendationWidget 
 *   articles={yourArticlesArray}
 * />
 * 
 * Expected data structure:
 * articles: Array<{
 *   article_id: string,
 *   image_path: string,
 *   title: string,
 *   subtitle: string,
 *   slug: string
 * }>
 */

"use client"

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface ArticleRecommendation {
  article_id: string
  image_path: string
  title: string
  subtitle: string
  slug: string
}

interface ArticleRecommendationWidgetProps {
  articles: ArticleRecommendation[]
  className?: string
}

// Individual Article Card Component
function ArticleCard({ article, isCarousel = false }: { article: ArticleRecommendation, isCarousel?: boolean }) {
  const articleHref = `/discover/${article.slug}`

  const content = (
    <div className="group">
      {/* Article Image - 850x566 aspect ratio (1.5:1) */}
      {article.image_path && (
        <Link href={articleHref} className="block">
          <div className="relative w-full rounded-md overflow-hidden mb-3" style={{ aspectRatio: '850/566' }}>
            <Image
              src={article.image_path}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 420px) 100vw, 420px"
            />
          </div>
        </Link>
      )}

      {/* Article Content */}
      <div className="space-y-2">
        <Link href={articleHref}>
          <h4 className="article-title-hover font-semibold text-md line-clamp-2 leading-tight transition-colors cursor-pointer">
            {article.title}
          </h4>
        </Link>
        
        {article.subtitle && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {article.subtitle}
          </p>
        )}
      </div>
    </div>
  )

  // If in carousel, return content without Card wrapper
  if (isCarousel) {
    return <div className="w-full">{content}</div>
  }

  // Single card with its own border
  return (
    <div className="w-full">
      <Card className="h-full rounded-lg border-border bg-card hover:border-brand-primary/60 transition-colors">
        <CardContent className="p-4">
          {content}
        </CardContent>
      </Card>
    </div>
  )
}

export function ArticleRecommendationWidget({
  articles,
  className
}: ArticleRecommendationWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextArticle = () => {
    setCurrentIndex((prev) => (prev + 1) % articles.length)
  }

  const prevArticle = () => {
    setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)
  }

  const goToArticle = (index: number) => {
    setCurrentIndex(index)
  }

  if (!articles || articles.length === 0) {
    return (
      <Card className={cn("w-full max-w-[420px]", className)}>
        <CardContent className="p-3">
          <p className="text-center text-muted-foreground text-sm">
            No articles available
          </p>
        </CardContent>
      </Card>
    )
  }

  // Single article - no carousel needed
  if (articles.length === 1) {
    return (
      <div className={cn("w-full max-w-[420px]", className)}>
        <ArticleCard article={articles[0]} />
      </div>
    )
  }

  // Multiple articles - carousel
  return (
    <div className={cn("w-full max-w-[420px]", className)}>
      {/* Carousel Container - Single border containing everything */}
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow ml-9 md:ml-[0px] p-4">
        {/* Current Article - No nested Card wrapper */}
        <ArticleCard article={articles[currentIndex]} isCarousel={true} />

        {/* Carousel Navigation */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          {/* Left Arrow */}
          <button
            onClick={prevArticle}
            className="p-1 rounded-full hover:bg-brand-primary/20 text-brand-primary hover:text-brand-primary"
            aria-label="Previous article"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => goToArticle(index)}
                className={cn(
                  "w-2 h-2 rounded-full",
                  index === currentIndex
                    ? "bg-brand-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to article ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextArticle}
            className="p-1 rounded-full hover:bg-brand-primary/20 text-brand-primary hover:text-brand-primary"
            aria-label="Next article"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

