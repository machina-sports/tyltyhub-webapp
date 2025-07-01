"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import teamsData from "@/data/teams.json"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { StandingsTable } from "./standings-table"
import { MatchesCalendar, MatchCard } from "./matches-calendar"
import { TeamsGrid } from "./teams-grid"
import { useGlobalState } from "@/store/useState";
import { useAppDispatch } from "@/store/dispatch";
import { AppState } from "@/store"
import { useMemo } from "react"
import { processPlayoffMatches, advanceWinners, resolveVirtualTeams } from "./playoff"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

// Helper function to convert playoff match to MatchCard format
const convertPlayoffMatchToFixture = (match: any) => {
  const translatePhase = (round: string) => {
    const phases: { [key: string]: string } = {
      'round_of_16': 'Round of 16',
      'quarterfinal': 'Quarter-finals', 
      'semifinal': 'Semi-finals',
      'final': 'Final'
    }
    return phases[round] || round
  }

  const getDisplayTeamName = (competitor: any, index: number) => {
    if (competitor?.resolvedName && !competitor.resolvedName.startsWith('Winner')) {
      return competitor.resolvedName
    }
    
    if (competitor?.name && !competitor.name.startsWith('Winner')) {
      return competitor.name
    }
    
    if (match.round === 'round_of_16') {
      if (competitor?.resolvedName) {
        return competitor.resolvedName
      }
      if (competitor?.name) {
        return competitor.name
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

  // Convert date to the format expected by MatchCard
  const date = new Date(match.date)
  const dateStr = date.toLocaleDateString('pt-BR', { 
    month: 'long', 
    day: 'numeric' 
  }).replace('de ', '')
  
  const timeStr = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return {
    date: dateStr,
    ko: timeStr,
    match: `${team1} x ${team2}`,
    venue: match.venue || '',
    phase: translatePhase(match.round),
    matchNumber: match.matchNumber,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    isFinished: match.status === 'closed',
    groupName: translatePhase(match.round)
  }
}

export function FifaCwcSchedule() {
  const { isDarkMode } = useTheme()
  const { data: standingsData, status: standingsStatus } = useGlobalState(state => state.standings)
  const { data: calendarData } = useGlobalState(state => state.calendar as any)
  const groups = standingsData?.value?.data[0]?.groups || []

  const teams = useMemo(() => {
    if (!groups.length) return []
    
    const uniqueTeams = new Map()
    groups.forEach(group => {
      group.standings.forEach(standing => {
        const team = standing.competitor
        if (!uniqueTeams.has(team.id)) {
          uniqueTeams.set(team.id, {
            id: team.id,
            name: team.name,
            abbreviation: team.abbreviation,
            country: team.country,
            country_code: team.country_code,
            form: team.form
          })
        }
      })
    })
    return Array.from(uniqueTeams.values())
  }, [groups])

  const playoffMatches = useMemo(() => {
    const matchesArray = calendarData?.data || calendarData
    
    if (!matchesArray || !standingsData) {
      return null
    }
    
    const matchesByDate = processPlayoffMatches(calendarData, standingsData)
    
    const resolvedMatches = resolveVirtualTeams(matchesByDate, standingsData)
    
    return resolvedMatches
  }, [calendarData, standingsData])
  
  const matchesArray = calendarData?.data || calendarData
  const hasCalendarData = matchesArray && Array.isArray(matchesArray) && matchesArray.length > 0
  const hasStandingsData = standingsData?.value?.data?.[0]?.groups && standingsData.value.data[0].groups.length > 0

  return (
    <div className="space-y-8">
      <Card className={cn(isDarkMode && "border-[#45CAFF]/30 bg-[#061F3F]")}>
        <CardHeader>
          <CardTitle className={cn("text-2xl", isDarkMode && "text-[#45CAFF]")}>
            {fifaCwcData.tournamentInfo.name}
          </CardTitle>
          <CardDescription className={cn(isDarkMode && "text-[#D3ECFF]")}>
            {fifaCwcData.tournamentInfo.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="clubs-view" className="w-full">
        <TabsList className={cn(
          "grid w-full grid-cols-3",
          isDarkMode && "bg-[#45CAFF] border-[#45CAFF]/30"
        )}>
          <TabsTrigger 
            value="clubs-view"
            className={cn(
              isDarkMode && "text-[#061F3F] data-[state=active]:bg-[#061F3F] data-[state=active]:text-[#D3ECFF]"
            )}
          >
            Clubes
          </TabsTrigger>
          <TabsTrigger 
            value="teams-view"
            className={cn(
              isDarkMode && "text-[#061F3F] data-[state=active]:bg-[#061F3F] data-[state=active]:text-[#D3ECFF]"
            )}
          >
            Classificação
          </TabsTrigger>
          <TabsTrigger 
            value="matches-view"
            className={cn(
              isDarkMode && "text-[#061F3F] data-[state=active]:bg-[#061F3F] data-[state=active]:text-[#D3ECFF]"
            )}
          >
            Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clubs-view" className="mt-4">
          <TeamsGrid />
        </TabsContent>

        <TabsContent value="teams-view" className="mt-4">
          <StandingsTable />
        </TabsContent>

        <TabsContent value="matches-view" className="mt-4">
          <div className="space-y-8">
            <div>
              <h3 className={cn("text-xl font-semibold mb-4", isDarkMode && "text-[#45CAFF]")}>
                Fase de Grupos
              </h3>
              <MatchesCalendar showPlayoffs={false} />
            </div>
            
            <div>
              <h3 className={cn("text-xl font-semibold mb-4", isDarkMode && "text-[#45CAFF]")}>
                Fase Eliminatória
              </h3>
              {playoffMatches && playoffMatches.matchesByDate && Object.keys(playoffMatches.matchesByDate).length > 0 ? (
                <div className="space-y-8">
                  {playoffMatches.dateOrder.map((date: string) => (
                    <div key={date} className="space-y-4">
                      <div className={cn(
                        "sticky top-0 z-10 bg-background border-b py-4 px-2",
                        isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30"
                      )}>
                        <h4 className={cn("text-lg font-semibold flex items-center")}>
                          <Calendar className={cn(
                            "mr-2 h-5 w-5",
                            isDarkMode ? "text-[#45CAFF]" : "text-primary"
                          )} />
                          <span className={cn(isDarkMode && "text-[#45CAFF]")}>
                            {new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "ml-2",
                              isDarkMode && "border-[#45CAFF]/30 text-[#D3ECFF]"
                            )}
                          >
                            {playoffMatches.matchesByDate[date].length} partidas
                          </Badge>
                        </h4>
                      </div>
                      
                      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {playoffMatches.matchesByDate[date].map((match: any, index: number) => {
                          const fixture = convertPlayoffMatchToFixture(match)
                          return (
                            <div key={match.id || index} className={cn(
                              match.round === 'final' && "ring-2 ring-yellow-500/20 rounded-md"
                            )}>
                              <MatchCard 
                                fixture={fixture}
                                useAbbreviation={false}
                                compact={false}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={cn("text-center p-8", isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground")}>
                  Carregando jogos da fase eliminatória...
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 