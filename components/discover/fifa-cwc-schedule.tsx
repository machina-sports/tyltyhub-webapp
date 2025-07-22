"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { StandingsTable } from "./standings-table"
import { MatchCard } from "./matches-calendar"
import { TeamsGrid } from "./teams-grid"
import { useGlobalState } from "@/store/useState";
import { useMemo } from "react"
import { processPlayoffMatches, processGroupStageMatches, resolveVirtualTeams } from "./playoff"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

const convertPlayoffMatchToFixture = (match: any, phase: string) => {
  const getDisplayTeamName = (competitor: any) => {
    return competitor?.name || competitor?.id || 'TBD'
  }

  const team1 = getDisplayTeamName(match.competitors?.[0])
  const team2 = getDisplayTeamName(match.competitors?.[1])

  const date = new Date(match.date)
  const dateStr = date.toLocaleDateString('es-ES', { 
    month: 'long', 
    day: 'numeric' 
  }).replace('de ', '')
  
  const timeStr = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  return {
    date: dateStr,
    ko: timeStr,
    match: `${team1} x ${team2}`,
    venue: match.venue || '',
    phase: phase,
    homeScore: match.homeScore,
    awayScore: match.awayScore,
    isFinished: match.isFinished || (match.homeScore !== undefined && match.awayScore !== undefined),
    groupName: phase
  }
}

export function FifaCwcSchedule() {
  const standingsData = useGlobalState((state: any) => state.standings.data)

  const convertGroupMatchToFixture = (match: any, groupName: string) => {
    const date = new Date(match.date)
    const dateStr = date.toLocaleDateString('es-ES', { 
      month: 'long', 
      day: 'numeric' 
    }).replace('de ', '')
    
    const timeStr = date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

    return {
      date: dateStr,
      ko: timeStr,
      match: `${match.homeTeam} x ${match.awayTeam}`,
      venue: match.venue || '',
      groupName: `Grupo ${groupName}`,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      isFinished: match.isFinished || (match.homeScore !== undefined && match.awayScore !== undefined)
    }
  }

  const fixtures = useMemo(() => {
    const allFixtures: any[] = []

    // Add group stage matches
    fifaCwcData.groups.forEach(group => {
      if (group.fixtures && Array.isArray(group.fixtures)) {
        group.fixtures.forEach(fixture => {
          allFixtures.push({
            date: fixture.date,
            ko: fixture.ko,
            match: fixture.match,
            venue: fixture.venue,
            groupName: `Grupo ${group.name.replace('Group ', '')}`,
            homeScore: undefined,
            awayScore: undefined,
            isFinished: false
          })
        })
      }
    })

    return allFixtures
  }, [])

  return (
    <div className="w-full space-y-6">
      <Card className="bg-bwin-neutral-20 border-bwin-neutral-30">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-bwin-neutral-100">
            Copa Mundial de Clubes FIFA 2025
          </CardTitle>
          <CardDescription className="text-bwin-neutral-80">
            15 de junio - 13 de julio • Estados Unidos
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="clubs-view" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-bwin-neutral-20 border-bwin-neutral-30">
          <TabsTrigger 
            value="clubs-view"
            className="text-bwin-neutral-100 data-[state=active]:bg-bwin-brand-primary data-[state=active]:text-bwin-neutral-0"
          >
            Clubes
          </TabsTrigger>
          <TabsTrigger 
            value="teams-view"
            className="text-bwin-neutral-100 data-[state=active]:bg-bwin-brand-primary data-[state=active]:text-bwin-neutral-0"
          >
            Clasificación
          </TabsTrigger>
          <TabsTrigger 
            value="matches-view"
            className="text-bwin-neutral-100 data-[state=active]:bg-bwin-brand-primary data-[state=active]:text-bwin-neutral-0"
          >
            Calendario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clubs-view" className="mt-4">
          <TeamsGrid />
        </TabsContent>

        <TabsContent value="teams-view" className="mt-4">
          <StandingsTable />
        </TabsContent>

        <TabsContent value="matches-view" className="mt-4">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-bwin-neutral-100">
              <Calendar className="h-5 w-5 text-bwin-brand-primary" />
              <h3 className="text-lg font-semibold">Calendario de Partidos</h3>
              <Badge variant="outline" className="border-bwin-neutral-40 text-bwin-neutral-80">
                {fixtures.length} partidos
              </Badge>
            </div>
            <div className="grid gap-4">
              {fixtures.map((fixture, index) => (
                <MatchCard 
                  key={index} 
                  fixture={fixture} 
                  useAbbreviation={false}
                  compact={true}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 