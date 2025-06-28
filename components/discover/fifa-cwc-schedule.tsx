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
              <MatchesCalendar 
                showPlayoffs={true}
                standingsData={{
                  standings: {
                    value: {
                      data: [
                        {
                          groups: [
                            {
                              group_name: "A",
                              name: "Group A",
                              standings: [
                                {
                                  competitor: { name: "SE Palmeiras SP", abbreviation: "PAL", country: "Brazil", country_code: "BRA", id: "sr:competitor:1963" },
                                  rank: 1, points: 5, current_outcome: "Playoffs", goals_for: 4, goals_against: 2, goals_diff: 2, win: 1, draw: 2, loss: 0, played: 3
                                },
                                {
                                  competitor: { name: "Inter Miami CF", abbreviation: "MIA", country: "USA", country_code: "USA", id: "sr:competitor:659691" },
                                  rank: 2, points: 5, current_outcome: "Playoffs", goals_for: 4, goals_against: 3, goals_diff: 1, win: 1, draw: 2, loss: 0, played: 3
                                }
                              ]
                            },
                            {
                              group_name: "B",
                              name: "Group B",
                              standings: [
                                {
                                  competitor: { name: "Paris Saint-Germain", abbreviation: "PSG", country: "France", country_code: "FRA", id: "sr:competitor:1644" },
                                  rank: 1, points: 6, current_outcome: "Playoffs", goals_for: 6, goals_against: 1, goals_diff: 5, win: 2, draw: 0, loss: 1, played: 3
                                },
                                {
                                  competitor: { name: "Botafogo FR RJ", abbreviation: "BOT", country: "Brazil", country_code: "BRA", id: "sr:competitor:1958" },
                                  rank: 2, points: 6, current_outcome: "Playoffs", goals_for: 3, goals_against: 2, goals_diff: 1, win: 2, draw: 0, loss: 1, played: 3
                                }
                              ]
                            },
                            {
                              group_name: "C",
                              name: "Group C",
                              standings: [
                                {
                                  competitor: { name: "SL Benfica", abbreviation: "BEN", country: "Portugal", country_code: "PRT", id: "sr:competitor:3006" },
                                  rank: 1, points: 7, current_outcome: "Playoffs", goals_for: 9, goals_against: 2, goals_diff: 7, win: 2, draw: 1, loss: 0, played: 3
                                },
                                {
                                  competitor: { name: "Bayern Munich", abbreviation: "BMU", country: "Germany", country_code: "DEU", id: "sr:competitor:2672" },
                                  rank: 2, points: 6, current_outcome: "Playoffs", goals_for: 12, goals_against: 2, goals_diff: 10, win: 2, draw: 0, loss: 1, played: 3
                                }
                              ]
                            },
                            {
                              group_name: "D",
                              name: "Group D",
                              standings: [
                                {
                                  competitor: { name: "CR Flamengo RJ", abbreviation: "FLA", country: "Brazil", country_code: "BRA", id: "sr:competitor:5981" },
                                  rank: 1, points: 7, current_outcome: "Playoffs", goals_for: 6, goals_against: 2, goals_diff: 4, win: 2, draw: 1, loss: 0, played: 3
                                },
                                {
                                  competitor: { name: "Chelsea FC", abbreviation: "CHE", country: "England", country_code: "ENG", id: "sr:competitor:38" },
                                  rank: 2, points: 6, current_outcome: "Playoffs", goals_for: 6, goals_against: 3, goals_diff: 3, win: 2, draw: 0, loss: 1, played: 3
                                }
                              ]
                            },
                            {
                              group_name: "E",
                              name: "Group E",
                              standings: [
                                {
                                  competitor: { name: "Inter Milano", abbreviation: "INT", country: "Italy", country_code: "ITA", id: "sr:competitor:2697" },
                                  rank: 1, points: 7, current_outcome: "Playoffs", goals_for: 5, goals_against: 2, goals_diff: 3, win: 2, draw: 1, loss: 0, played: 3
                                },
                                {
                                  competitor: { name: "CF Monterrey", abbreviation: "MON", country: "Mexico", country_code: "MEX", id: "sr:competitor:1932" },
                                  rank: 2, points: 5, current_outcome: "Playoffs", goals_for: 5, goals_against: 1, goals_diff: 4, win: 1, draw: 2, loss: 0, played: 3
                                }
                              ]
                            },
                            {
                              group_name: "F",
                              name: "Group F",
                              standings: [
                                {
                                  competitor: { name: "Borussia Dortmund", abbreviation: "BVB", country: "Germany", country_code: "DEU", id: "sr:competitor:2673" },
                                  rank: 1, points: 7, current_outcome: "Playoffs", goals_for: 5, goals_against: 3, goals_diff: 2, win: 2, draw: 1, loss: 0, played: 3
                                },
                                {
                                  competitor: { name: "Fluminense FC RJ", abbreviation: "FLU", country: "Brazil", country_code: "BRA", id: "sr:competitor:1961" },
                                  rank: 2, points: 5, current_outcome: "Playoffs", goals_for: 4, goals_against: 2, goals_diff: 2, win: 1, draw: 2, loss: 0, played: 3
                                }
                              ]
                            },
                            {
                              group_name: "G",
                              name: "Group G",
                              standings: [
                                {
                                  competitor: { name: "Manchester City", abbreviation: "MCI", country: "England", country_code: "ENG", id: "sr:competitor:17" },
                                  rank: 1, points: 9, current_outcome: "Playoffs", goals_for: 10, goals_against: 1, goals_diff: 9, win: 3, draw: 0, loss: 0, played: 3
                                },
                                {
                                  competitor: { name: "Juventus Turin", abbreviation: "JUV", country: "Italy", country_code: "ITA", id: "sr:competitor:2687" },
                                  rank: 2, points: 6, current_outcome: "Playoffs", goals_for: 10, goals_against: 3, goals_diff: 7, win: 2, draw: 0, loss: 1, played: 3
                                }
                              ]
                            },
                            {
                              group_name: "H",
                              name: "Group H",
                              standings: [
                                {
                                  competitor: { name: "Real Madrid", abbreviation: "RMA", country: "Spain", country_code: "ESP", id: "sr:competitor:2829" },
                                  rank: 1, points: 4, current_outcome: "Playoffs", goals_for: 4, goals_against: 2, goals_diff: 2, win: 1, draw: 1, loss: 0, played: 2
                                },
                                {
                                  competitor: { name: "FC Salzburg", abbreviation: "RBS", country: "Austria", country_code: "AUT", id: "sr:competitor:2046" },
                                  rank: 2, points: 4, current_outcome: "Playoffs", goals_for: 2, goals_against: 1, goals_diff: 1, win: 1, draw: 1, loss: 0, played: 2
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  }
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 