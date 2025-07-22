"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { useTeamDisplay } from "@/hooks/use-team-display"

interface LiveMatchStatusProps {
  eventStatus: any
  isDarkMode: boolean
  teamHomeName?: string
  teamAwayName?: string
  teamHomeAbbreviation?: string
  teamAwayAbbreviation?: string
}

export const LiveMatchStatus = React.memo(({ 
  eventStatus, 
  isDarkMode,
  teamHomeName,
  teamAwayName,
  teamHomeAbbreviation,
  teamAwayAbbreviation
}: LiveMatchStatusProps) => {
  const { getTeamLogo } = useTeamDisplay()

  if (!eventStatus) return null

  const isLive = eventStatus.status === "live"
  const homeScore = eventStatus.home_score || 0
  const awayScore = eventStatus.away_score || 0
  const matchTime = eventStatus.clock?.played || ""
  const matchStatus = eventStatus.match_status || ""
  const situation = eventStatus.match_situation

  // Get team logos using the hook
  const homeTeamLogo = getTeamLogo(teamHomeName || teamHomeAbbreviation || "")
  const awayTeamLogo = getTeamLogo(teamAwayName || teamAwayAbbreviation || "")

  // Format match status for display
  const formatMatchStatus = (status: string) => {
    switch (status) {
      case "1st_half":
        return "1er Tiempo"
      case "2nd_half":
        return "2do Tiempo"
      case "halftime":
        return "Descanso"
      case "extra_time_1st":
        return "1er Tiempo Extra"
      case "extra_time_2nd":
        return "2do Tiempo Extra"
      case "penalty_shootout":
        return "Penales"
      case "full_time":
        return "Tiempo Completo"
      case "postponed":
        return "Aplazado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="max-w-[350px] rounded-lg bg-bwin-neutral-20 border border-bwin-neutral-30">
      {/* Live Indicator */}
      {isLive && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
              EN VIVO
            </span>
          </div>
          {matchTime && (
            <span className="text-xs px-1.5 py-0.5 rounded-full font-medium bg-bwin-brand-primary/20 text-bwin-brand-primary border border-bwin-brand-primary/30">
              {matchTime}
            </span>
          )}
        </div>
      )}

      {/* Score Display */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {homeTeamLogo && (
              <img
                src={homeTeamLogo}
                alt={teamHomeName || "Local"}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="text-xs font-medium truncate text-bwin-neutral-80">
              {teamHomeName || "Local"}
            </div>
          </div>
          <div className="text-2xl font-bold text-bwin-neutral-100">
            {homeScore}
          </div>
        </div>
        
        <div className="text-lg font-bold px-1 text-bwin-neutral-60">
          ×
        </div>
        
        <div className="text-center flex-1">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {awayTeamLogo && (
              <img
                src={awayTeamLogo}
                alt={teamAwayName || "Visitante"}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className="text-xs font-medium truncate text-bwin-neutral-80">
              {teamAwayName || "Visitante"}
            </div>
          </div>
          <div className="text-2xl font-bold text-bwin-neutral-100">
            {awayScore}
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="space-y-1">
        {matchStatus && (
          <div className="flex items-center justify-center">
            <span className="text-xs px-2 py-1 rounded-full border font-medium border-bwin-neutral-40 text-bwin-neutral-80 bg-bwin-neutral-30">
              {formatMatchStatus(matchStatus)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

LiveMatchStatus.displayName = 'LiveMatchStatus' 