"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { StandingsTable } from "./standings-table"
import { MatchesCalendar } from "./matches-calendar"
import { TeamsGrid } from "./teams-grid"

export function FifaCwcSchedule() {
  const { isDarkMode } = useTheme()

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
          <MatchesCalendar />
        </TabsContent>
      </Tabs>
    </div>
  )
} 