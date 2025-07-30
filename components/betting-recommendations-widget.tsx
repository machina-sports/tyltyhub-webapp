/**
 * Betting Recommendations Widget
 * 
 * Usage:
 * <BettingRecommendationsWidget 
 *   markets={yourMarketsArray}
 *   title="Custom Title" 
 * />
 * 
 * Expected data structure:
 * markets: Array<{
 *   market_type: string,
 *   odds: number,
 *   rationale: string,
 *   recommendation: string, // "Alto", "Medio", "Bajo"
 *   title: string
 * }>
 */

"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'
import { TrendingUp, TrendingDown, Minus, ChevronLeft, ChevronRight } from 'lucide-react'

interface MarketRecommendation {
  market_type: string
  odds: number
  rationale: string
  recommendation: string
  title: string
}

interface BettingRecommendationsWidgetProps {
  markets: MarketRecommendation[]
  title?: string
  className?: string
}

// Individual Recommendation Card Component
function RecommendationCard({ market }: { market: MarketRecommendation }) {
  const { isDarkMode } = useTheme()

  const getRecommendationVariant = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'alto':
      case 'high':
        return 'default'
      case 'medio':
      case 'medium':
        return 'secondary'
      case 'bajo':
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'alto':
      case 'high':
        return <TrendingUp className="h-4 w-4" />
      case 'bajo':
      case 'low':
        return <TrendingDown className="h-4 w-4" />
      default:
        return <Minus className="h-4 w-4" />
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation.toLowerCase()) {
      case 'alto':
      case 'high':
        return isDarkMode ? 'text-green-400' : 'text-green-600'
      case 'bajo':
      case 'low':
        return isDarkMode ? 'text-red-400' : 'text-red-600'
      default:
        return isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
    }
  }

  return (
    <div className="w-full min-h-[220px]">
      <Card className="h-full">
        <CardContent className="p-5">
          {/* Header with title and recommendation */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-base mb-2 line-clamp-2">
                {market.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {market.market_type}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className={cn(
                "flex items-center gap-1",
                getRecommendationColor(market.recommendation)
              )}>
                {getRecommendationIcon(market.recommendation)}
              </div>
              <Badge 
                variant={getRecommendationVariant(market.recommendation)}
                className="text-sm px-3 py-1"
              >
                {market.recommendation}
              </Badge>
            </div>
          </div>

          {/* Odds display */}
          <div className="flex items-center justify-between mb-4 p-4 rounded-lg bg-muted/30">
            <span className="text-base font-medium">Cuota:</span>
            <a 
              href="https://www.bwin.es/es/sports"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "px-4 py-2 rounded-lg font-mono font-bold text-lg transition-all duration-200 hover:scale-105 cursor-pointer",
                isDarkMode 
                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 hover:bg-blue-500/30 hover:border-blue-500/60" 
                  : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:border-blue-300"
              )}
            >
              {market.odds.toFixed(2)}
            </a>
          </div>

          {/* Rationale */}
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {market.rationale}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function BettingRecommendationsWidget({ 
  markets, 
  title = "Recomendaciones de Apuestas",
  className 
}: BettingRecommendationsWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextRecommendation = () => {
    setCurrentIndex((prev) => (prev + 1) % markets.length)
  }

  const prevRecommendation = () => {
    setCurrentIndex((prev) => (prev - 1 + markets.length) % markets.length)
  }

  const goToRecommendation = (index: number) => {
    setCurrentIndex(index)
  }

  if (!markets || markets.length === 0) {
    return (
      <Card className={cn("w-full max-w-[450px]", className)}>
        <CardContent className="p-5">
          <p className="text-center text-muted-foreground">
            No hay recomendaciones disponibles
          </p>
        </CardContent>
      </Card>
    )
  }

  // Single recommendation - no carousel needed
  if (markets.length === 1) {
      return (
    <div className={cn("w-full max-w-[450px]", className)}>
      <div className="mb-3">
        <h3 className="text-base font-semibold text-bwin-brand-primary">{title}</h3>
      </div>
      <RecommendationCard market={markets[0]} />
    </div>
  )
  }

  // Multiple recommendations - carousel
  return (
    <div className={cn("w-full max-w-[450px]", className)}>
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-bwin-brand-primary">{title}</h3>
      </div>

      {/* Carousel Container */}
      <div className="rounded-lg border p-4 border-bwin-neutral-30 bg-bwin-neutral-20">
        {/* Current Recommendation */}
        <div className="overflow-hidden rounded-md">
          <RecommendationCard market={markets[currentIndex]} />
        </div>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-between mt-4">
          {/* Left Arrow */}
          <button
            onClick={prevRecommendation}
            className="p-2 rounded-full transition-colors hover:bg-bwin-brand-primary/20 text-bwin-brand-primary hover:text-bwin-brand-primary"
            aria-label="Recomendación anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-2">
            {markets.map((_, index) => (
              <button
                key={index}
                onClick={() => goToRecommendation(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors",
                  index === currentIndex
                    ? "bg-bwin-brand-primary"
                    : "bg-bwin-neutral-60 hover:bg-bwin-neutral-80"
                )}
                aria-label={`Ir a recomendación ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextRecommendation}
            className="p-2 rounded-full transition-colors hover:bg-bwin-brand-primary/20 text-bwin-brand-primary hover:text-bwin-brand-primary"
            aria-label="Siguiente recomendación"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>


      </div>
    </div>
  )
} 