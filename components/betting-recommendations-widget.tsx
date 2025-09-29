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
 *   title: string,
 *   selection?: string
 * }>
 */

"use client"

import { useTheme } from '@/components/theme-provider'
import { Card, CardContent } from '@/components/ui/card'
import { trackBettingLinkClick } from '@/lib/analytics/betting'
import { buildBettingUrl } from '@/lib/betting-urls'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface MarketRecommendation {
  market_type: string
  odds: number
  rationale: string
  title: string
  selection?: string
  event_id?: string
  market_id?: string
  option_id?: string
  deep_link?: string // format: "fixtureId-marketId-optionId"
}

interface BettingRecommendationsWidgetProps {
  markets: MarketRecommendation[]
  title?: string
  className?: string
}

// Individual Recommendation Card Component
function RecommendationCard({ market }: { market: MarketRecommendation }) {

  // Resolve IDs from explicit fields or from deep_link (fixture-market-option)
  const resolveIds = () => {
    const parts = (market.deep_link || '').split('-')
    const eventId = market.event_id || parts[0]
    const marketId = (market.market_id as any) || parts[1]
    const optionId = (market.option_id as any) || parts[2]
    return {
      eventId: eventId ? String(eventId) : '',
      marketId: marketId ? String(marketId) : '',
      optionId: optionId ? String(optionId) : ''
    }
  }

  const deeplinkHref = (() => {
    const { eventId, marketId, optionId } = resolveIds()
    if (eventId && marketId && optionId) {
      return buildBettingUrl({
        eventId,
        marketId,
        optionId,
        baseUrl: process.env.NEXT_PUBLIC_SPORTS_BASE_URL || undefined,
        language: 'en'
      })
    }
    return "https://www.bwin.es/en/sports"
  })()

  return (
    <div className="w-full">
      <Card className="h-full rounded-2xl">
        <CardContent className="p-5">
          {/* Header with title and odds in same row */}
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-3">
              <h4 className="font-semibold text-md line-clamp-2 leading-tight">
                {market.title}
              </h4>
              {market.runner && (
                <p className="text-sm text-muted-foreground mt-1 font-medium">
                  {market.runner}
                </p>
              )}
            </div>
            <a
              href={deeplinkHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                const { eventId, marketId, optionId } = resolveIds()
                trackBettingLinkClick({
                  eventId,
                  marketId,
                  optionId,
                  market_type: market.market_type,
                  market_title: market.title,
                  odds_value: market.odds
                });
              }}
              className={cn(
                "px-3 py-1.5 rounded-md font-mono font-bold text-lg cursor-pointer shrink-0",
                "bg-brand-primary/20 text-brand-primary border border-brand-primary/40 hover:bg-brand-primary/30 hover:border-brand-primary/60"
              )}
            >
              {typeof market.odds === 'number' ? market.odds.toFixed(2) : parseFloat(market.odds).toFixed(2)}
            </a>
          </div>

          {/* Rationale */}
          {market.rationale && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                {market.rationale}
              </p>
            </div>
          )}
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
      <Card className={cn("w-full max-w-[420px]", className)}>
        <CardContent className="p-3">
          <p className="text-center text-muted-foreground text-sm">
            No hay recomendaciones disponibles
          </p>
        </CardContent>
      </Card>
    )
  }

  // Single recommendation - no carousel needed
  if (markets.length === 1) {
    return (
      <div className={cn("w-full max-w-[420px]", className)}>
        <RecommendationCard market={markets[0]} />
      </div>
    )
  }

  // Multiple recommendations - carousel
  return (
    <div className={cn("w-full max-w-[420px]", className)}>
      {/* Carousel Container */}
      <div className="rounded-2xl border ml-9 md:ml-[0px] p-3 border-border bg-card">
        {/* Current Recommendation */}
        <div className="overflow-hidden rounded-md">
          <RecommendationCard market={markets[currentIndex]} />
        </div>

        {/* Carousel Navigation */}
        <div className="flex items-center justify-between mt-2">
          {/* Left Arrow */}
          <button
            onClick={prevRecommendation}
            className="p-1 rounded-full hover:bg-brand-primary/20 text-brand-primary hover:text-brand-primary"
            aria-label="Recomendación anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Indicators */}
          <div className="flex items-center gap-1">
            {markets.map((_, index) => (
              <button
                key={index}
                onClick={() => goToRecommendation(index)}
                className={cn(
                  "w-2 h-2 rounded-full",
                  index === currentIndex
                    ? "bg-brand-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Ir a recomendación ${index + 1}`}
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextRecommendation}
            className="p-1 rounded-full hover:bg-brand-primary/20 text-brand-primary hover:text-brand-primary"
            aria-label="Siguiente recomendación"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Odds Disclaimer */}
      <div className="mt-4 pt-2 border-t border-muted">
        <p className="text-xs text-muted-foreground text-center italic">
          * Cuotas sujetas a cambios
        </p>
      </div>
    </div>
  )
} 