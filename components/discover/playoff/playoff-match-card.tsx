"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Clock, MapPin, Calendar } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useTeamDisplay } from "@/hooks/use-team-display"
import { TeamMatch } from "./team-match"

interface PlayoffMatchCardProps {
  match: any;
  compact?: boolean;
}

export const PlayoffMatchCard = ({ match, compact = false }: PlayoffMatchCardProps) => {
  const { isDarkMode } = useTheme();
  const { getTeamLogo, getSimplifiedName } = useTeamDisplay();
  
  const getDisplayTeamName = (competitor: any, index: number) => {
    if (competitor?.resolvedName && !competitor.resolvedName.startsWith('Winner')) {
      return getSimplifiedName(competitor.resolvedName)
    }
    
    if (competitor?.name && !competitor.name.startsWith('Winner')) {
      return getSimplifiedName(competitor.name)
    }
    
    if (match.round === 'round_of_16') {
      if (competitor?.resolvedName) {
        return getSimplifiedName(competitor.resolvedName)
      }
      if (competitor?.name) {
        return getSimplifiedName(competitor.name)
      }
      return competitor?.qualifier || `TBD ${index + 1}`
    }
    
    if (match.matchNumber) {
      if (match.round === 'quarterfinal') {
        const quarterBracket = [
          { match1: 49, match2: 50 },
          { match1: 51, match2: 52 }, 
          { match1: 53, match2: 54 },
          { match1: 55, match2: 56 }
        ]
        
        const bracketIndex = [57, 58, 59, 60].indexOf(match.matchNumber)
        if (bracketIndex >= 0) {
          const bracket = quarterBracket[bracketIndex]
          return index === 0 ? `Vencedor da Partida ${bracket.match1}` : `Vencedor da Partida ${bracket.match2}`
        }
      }
      
      if (match.round === 'semifinal') {
        const semiBracket = [
          { quarter1: 57, quarter2: 58 },
          { quarter1: 59, quarter2: 60 }
        ]
        
        const bracketIndex = [61, 62].indexOf(match.matchNumber)
        if (bracketIndex >= 0) {
          const bracket = semiBracket[bracketIndex]
          return index === 0 ? `Vencedor da Partida ${bracket.quarter1}` : `Vencedor da Partida ${bracket.quarter2}`
        }
      }
      
      if (match.round === 'final') {
        return index === 0 ? `Vencedor da Partida 61` : `Vencedor da Partida 62`
      }
    }
    
    return competitor?.resolvedName || competitor?.name || `TBD ${index + 1}`
  }
  
  const team1 = getDisplayTeamName(match.competitors?.[0], 0)
  const team2 = getDisplayTeamName(match.competitors?.[1], 1)
  
  const team1Original = match.competitors?.[0]?.resolvedName || match.competitors?.[0]?.name || ''
  const team2Original = match.competitors?.[1]?.resolvedName || match.competitors?.[1]?.name || ''
  
  const team1Logo = getTeamLogo(team1Original) || '/team-logos/default.png'
  const team2Logo = getTeamLogo(team2Original) || '/team-logos/default.png'
  
  const getMatchResult = () => {
    if (match.status === 'closed' && match.homeScore !== undefined && match.awayScore !== undefined) {
      return `${match.homeScore} - ${match.awayScore}`
    }
    return 'x'
  }
  
  const translatePhase = (round: string) => {
    const phases: { [key: string]: string } = {
      'round_of_16': 'Oitavas de Final',
      'quarterfinal': 'Quartas de Final',
      'semifinal': 'Semifinais',
      'final': 'Final'
    }
    return phases[round] || round
  }
  
  return (
    <TooltipProvider>
      <div className={cn(
        "border rounded-md bg-card hover:bg-muted/10 transition-colors h-full",
        compact ? "p-3" : "p-4",
        isDarkMode && "border-[#45CAFF]/30 bg-[#061F3F] hover:bg-[#061f3ff3]",
        match.status === 'closed' && "border-green-500/50"
      )}>
        {match.matchNumber && (
          <div className={cn(
            "text-xs text-center mb-2 px-2 py-1 rounded bg-muted/50",
            isDarkMode ? "text-[#D3ECFF] bg-[#45CAFF]/10" : "text-muted-foreground"
          )}>
            Partida {match.matchNumber}
          </div>
        )}
        
        <div className={cn(
          "grid grid-cols-[1fr_auto_1fr] items-center gap-2",
          compact ? "mb-2" : "mb-3"
        )}>
          <TeamMatch 
            teamName={team1} 
            logo={team1Logo} 
            compact={compact}
          />
          <span className={cn(
            "font-bold px-2",
            compact ? "text-sm" : "text-base",
            isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground",
            match.status === 'closed' && "text-green-600"
          )}>
            {getMatchResult()}
          </span>
          <TeamMatch 
            teamName={team2} 
            logo={team2Logo} 
            isSecond={true} 
            compact={compact}
          />
        </div>
        
        <div className={cn(
          "space-y-1 text-xs",
          isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
        )}>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="font-medium">
              {new Date(match.date).toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(match.date).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
          
          {match.venue && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{match.venue}</span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}; 