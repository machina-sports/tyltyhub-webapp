/**
 * Parlay Betting Widget
 * 
 * Usage:
 * <ParlayBettingWidget 
 *   parlay={parlayObject}
 * />
 * 
 * Expected data structure:
 * parlay: {
 *   leg_count: number,
 *   total_odd: number,
 *   potential_return: number,
 *   stake_suggestion: number,
 *   runners: Array<{
 *     title: string,
 *     price: number,
 *     name: string,
 *     marketType: string,
 *     event-id?: string,
 *     market-id?: string | number,
 *     option-id?: string | number
 *   }>
 * }
 */

"use client"

import { Card, CardContent } from '@/components/ui/card'
import { trackBettingLinkClick } from '@/lib/analytics/betting'
import { buildBettingUrl } from '@/lib/betting-urls'
import { cn } from '@/lib/utils'
import { Ticket } from 'lucide-react'
import { getBrandConfig } from '@/config/brands'

interface ParlayRunner {
  title: string
  price: number
  name: string
  marketType: string
  'event-id'?: string
  'market-id'?: string | number
  'option-id'?: string | number
}

interface ParlayBet {
  leg_count: number
  total_odd: number
  potential_return: number
  stake_suggestion: number
  runners: ParlayRunner[]
}

interface ParlayBettingWidgetProps {
  parlay: ParlayBet
  className?: string
}

export function ParlayBettingWidget({
  parlay,
  className
}: ParlayBettingWidgetProps) {

  if (!parlay || !parlay.runners || parlay.runners.length === 0) {
    return null
  }

  // Build deep link for entire parlay with multiple options
  const buildParlayUrl = () => {
    // Get brand configuration
    const brand = getBrandConfig()
    
    // Use same resolution logic as buildBettingUrl
    const resolvedBaseUrl = brand.sportsBaseUrl
      || process.env.NEXT_PUBLIC_SPORTS_BASE_URL 
      || process.env.NEXT_PUBLIC_BWIN_BASE_URL 
      || 'https://www.bwin.es'
    
    const resolvedLanguage = 'en'
    
    // Build options parameters for each runner
    const optionsParams = parlay.runners
      .map(runner => {
        const eventId = runner['event-id'] || ''
        const marketId = String(runner['market-id'] || '')
        const optionId = String(runner['option-id'] || '')
        
        if (eventId && marketId && optionId) {
          return `options=${eventId}-${marketId}-${optionId}`
        }
        return null
      })
      .filter(Boolean)
      .join('&')
    
    if (optionsParams) {
      return `${resolvedBaseUrl}/${resolvedLanguage}/sports?${optionsParams}`
    }
    
    return `${resolvedBaseUrl}/${resolvedLanguage}/sports`
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <Card className="rounded-lg border-border bg-card">
        <CardContent className="p-3 sm:p-4">

          {/* Header */}
          <div className="flex flex-row items-start justify-between mb-3">
            {/* Left side: Icon + Title/Counter */}
            <div className="flex items-start gap-2">
              <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-brand-primary shrink-0 mt-1" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base leading-tight">Bilhete Combinado</h3>
                <span className="text-[10px] sm:text-xs text-muted-foreground block">
                  {parlay.leg_count} seleções
                </span>
              </div>
            </div>

            {/* Right side: Odd Total Button */}
            <a
              href={buildParlayUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Track all runners
                parlay.runners.forEach(runner => {
                  trackBettingLinkClick({
                    eventId: runner['event-id'] || '',
                    marketId: String(runner['market-id'] || ''),
                    optionId: String(runner['option-id'] || ''),
                    market_type: runner.marketType,
                    market_title: runner.title,
                    odds_value: runner.price
                  });
                });
              }}
              className={cn(
                "inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-md font-mono font-bold text-lg sm:text-xl cursor-pointer",
                "bg-brand-primary/20 border border-brand-primary/40 hover:bg-brand-primary/30 hover:border-brand-primary/60"
              )}
              style={{ color: 'hsl(var(--odds-text-color))' }}
            >
              {parlay.total_odd.toFixed(2)}
            </a>
          </div>

          {/* Selections List */}
          <div className="space-y-2">
            {parlay.runners.map((runner, index) => {
              const eventId = runner['event-id'] || ''
              const marketId = String(runner['market-id'] || '')
              const optionId = String(runner['option-id'] || '')

              const deeplinkHref = (eventId && marketId && optionId)
                ? buildBettingUrl({
                  eventId,
                  marketId,
                  optionId,
                  baseUrl: process.env.NEXT_PUBLIC_SPORTS_BASE_URL || undefined,
                  language: 'en'
                })
                : buildParlayUrl()

              return (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/30"
                >
                  <div className="flex-1 flex items-start gap-1.5 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground shrink-0 mt-0.5">
                      {index + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium leading-tight line-clamp-2">
                        {runner.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        {runner.marketType}
                      </p>
                    </div>
                  </div>

                  <a
                    href={deeplinkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      trackBettingLinkClick({
                        eventId,
                        marketId,
                        optionId,
                        market_type: runner.marketType,
                        market_title: runner.title,
                        odds_value: runner.price
                      });
                    }}
                    className={cn(
                      "px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md font-mono font-bold text-sm sm:text-base cursor-pointer shrink-0",
                      "bg-brand-primary/20 border border-brand-primary/40 hover:bg-brand-primary/30 hover:border-brand-primary/60"
                    )}
                    style={{ color: 'hsl(var(--odds-text-color))' }}
                  >
                    {runner.price.toFixed(2)}
                  </a>
                </div>
              )
            })}
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

