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
        return "1º Tempo"
      case "2nd_half":
        return "2º Tempo"
      case "halftime":
        return "Intervalo"
      case "extra_time_1st":
        return "1º Prorrogação"
      case "extra_time_2nd":
        return "2º Prorrogação"
      case "penalty_shootout":
        return "Pênaltis"
      case "full_time":
        return "Fim de Jogo"
      case "postponed":
        return "Adiado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className={cn(
      "max-w-[350px]",
      "rounded-lg",
      isDarkMode
        ? "dark bg-card"
        : "bg-card"
    )}>
      {/* Live Indicator */}
      {isLive && (
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-red-500 uppercase tracking-wide">
              AO VIVO
            </span>
          </div>
          {matchTime && (
            <span className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-medium",
              isDarkMode 
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                : "bg-blue-50 text-blue-600 border border-blue-200"
            )}>
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
                alt={teamHomeName || "Casa"}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div className={cn(
              "text-xs font-medium truncate",
              isDarkMode ? "text-gray-200" : "text-gray-700"
            )}>
              {teamHomeName || "Casa"}
            </div>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {homeScore}
          </div>
        </div>
        
        <div className={cn(
          "text-lg font-bold px-1",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
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
            <div className={cn(
              "text-xs font-medium truncate",
              isDarkMode ? "text-gray-200" : "text-gray-700"
            )}>
              {teamAwayName || "Visitante"}
            </div>
          </div>
          <div className={cn(
            "text-2xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            {awayScore}
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="space-y-1">
        {matchStatus && (
          <div className="flex items-center justify-center">
            <span className={cn(
              "text-xs px-2 py-1 rounded-full border font-medium",
              isDarkMode
                ? "border-gray-600 text-gray-300 bg-gray-800/50"
                : "border-gray-300 text-gray-600 bg-gray-50"
            )}>
              {formatMatchStatus(matchStatus)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

LiveMatchStatus.displayName = 'LiveMatchStatus' 