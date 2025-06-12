"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"
import { useGlobalState } from "@/store/useState"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useTeamDisplay } from "@/hooks/use-team-display"

// Helper function to find team logo by name
const findTeamLogo = (abbreviation: string): string | undefined => {
  const teamsData = require("@/data/teams.json")
  const normalizedName = abbreviation.toLowerCase().replace(/ /g, '-')
  const team = teamsData.teams.find((t: any) => 
    t.name.toLowerCase() === abbreviation.toLowerCase() || 
    t.abbreviation === abbreviation
  )
  return team?.logo
}

export function StandingsTable() {
  const { data: standingsData, status } = useGlobalState(state => state.standings)
  const { isDarkMode } = useTheme() 
  const { getDisplayName } = useTeamDisplay()
  const groups = standingsData?.value?.data[0]?.groups || []

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className={cn(
          "animate-spin rounded-full h-8 w-8 border-b-2",
          isDarkMode ? "border-[#45CAFF]" : "border-gray-900"
        )}></div>
      </div>
    )
  }

  if (status === "failed") {
    return (
      <div className="flex justify-center items-center min-h-[200px] text-red-500">
        Erro ao carregar os dados da classificação
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {groups.map((group: any) => (
        <Card 
          key={`team-${group.id}`} 
          className={cn(
            "overflow-hidden h-full flex flex-col",
            isDarkMode && "border-[#45CAFF]/30 bg-[#061F3F]"
          )}
        >
          <CardHeader className={cn(
            "pb-2",
            isDarkMode ? "bg-[#061F3F] border-b border-[#45CAFF]/30" : "bg-muted/50"
          )}>
            <CardTitle className={cn(
              "text-xl font-semibold",
              isDarkMode && "text-[#45CAFF]"
            )}>
              Grupo {group.group_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1 px-2 sm:px-6">
            <div className="overflow-x-auto w-full">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow className={cn(
                    isDarkMode && "border-[#45CAFF]/30"
                  )}>
                    <TableHead className={cn(
                      "w-[10%] text-center text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>Pos</TableHead>
                    <TableHead className={cn(
                      "w-[35%] text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>Time</TableHead>
                    <TableHead className={cn(
                      "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>J</TableHead>
                    <TableHead className={cn(
                      "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>V</TableHead>
                    <TableHead className={cn(
                      "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>E</TableHead>
                    <TableHead className={cn(
                      "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>D</TableHead>
                    <TableHead className={cn(
                      "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>SG</TableHead>
                    <TableHead className={cn(
                      "w-[15%] text-center text-xs sm:text-sm px-1 sm:px-4",
                      isDarkMode && "text-[#45CAFF]"
                    )}>Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.standings.map((standing: any) => (
                    <TableRow 
                      key={standing.competitor.id}
                      className={cn(
                        "transition-colors",
                        isDarkMode && "hover:bg-[#45CAFF]/10 border-[#45CAFF]/30"
                      )}
                    >
                      <TableCell className={cn(
                        "text-center font-medium text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>
                        {standing.rank}
                      </TableCell>
                      <TableCell className={cn(
                        "text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <div className={cn(
                            "relative h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 rounded-full flex items-center justify-center",
                            isDarkMode ? "bg-[#45CAFF]/10" : "bg-muted/30"
                          )}>
                            {findTeamLogo(standing.competitor.abbreviation) ? (
                              <Image
                                src={findTeamLogo(standing.competitor.abbreviation) || ''}
                                alt={standing.competitor.abbreviation}
                                fill
                                className="object-contain"
                                sizes="24px"
                              />
                            ) : (
                              <span className={cn(
                                "text-xs font-medium",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>
                                {standing.competitor.abbreviation}
                              </span>
                            )}
                          </div>
                          <span 
                            title={standing.competitor.name} 
                            className={cn(
                              "truncate",
                              isDarkMode && "text-[#D3ECFF]"
                            )}
                          >
                            {getDisplayName(standing.competitor.name, {
                              preferAbbreviation: true,
                              fallbackToOriginal: true
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className={cn(
                        "text-center text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>{standing.played}</TableCell>
                      <TableCell className={cn(
                        "text-center text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>{standing.win}</TableCell>
                      <TableCell className={cn(
                        "text-center text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>{standing.draw}</TableCell>
                      <TableCell className={cn(
                        "text-center text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>{standing.loss}</TableCell>
                      <TableCell className={cn(
                        "text-center text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>{standing.goals_diff}</TableCell>
                      <TableCell className={cn(
                        "text-center font-semibold text-xs sm:text-sm px-1 sm:px-4",
                        isDarkMode ? "text-[#45CAFF]" : ""
                      )}>
                        {standing.points}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 