"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGlobalState } from "@/store/useState"
import { cn } from "@/lib/utils"

export function StandingsTable() {
  const standingsData = useGlobalState((state: any) => state.standings.data)

  const groups = standingsData?.value?.data?.[0]?.groups || []

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center text-bwin-neutral-60 py-8">
        Clasificación no disponible
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {groups.map((group: any) => (
        <Card 
          key={`team-${group.id}`} 
          className="overflow-hidden h-full flex flex-col bg-bwin-neutral-20 border-bwin-neutral-30"
        >
          <CardHeader className="pb-2 bg-bwin-neutral-20 border-b border-bwin-neutral-30">
            <CardTitle className="text-xl font-semibold text-brand-primary">
              Grupo {group.group_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex-1 px-2 sm:px-6">
            <div className="overflow-x-auto w-full">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-bwin-neutral-30">
                    <th className="text-left text-xs font-medium text-bwin-neutral-70 uppercase tracking-wider py-2 w-8">
                      Pos
                    </th>
                    <th className="text-left text-xs font-medium text-bwin-neutral-70 uppercase tracking-wider py-2">
                      Equipo
                    </th>
                    <th className="text-center text-xs font-medium text-bwin-neutral-70 uppercase tracking-wider py-2 w-8">
                      PJ
                    </th>
                    <th className="text-center text-xs font-medium text-bwin-neutral-70 uppercase tracking-wider py-2 w-8">
                      PTS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bwin-neutral-30">
                  {group.standings?.map((standing: any, index: number) => (
                    <tr key={standing.competitor.id || index} className="hover:bg-bwin-neutral-30/30 transition-colors">
                      <td className="py-2 text-sm font-medium text-bwin-neutral-100">
                        {standing.rank}
                      </td>
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-bwin-neutral-100">
                            {standing.competitor.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 text-center text-sm text-bwin-neutral-80">
                        {standing.played || 0}
                      </td>
                      <td className="py-2 text-center text-sm font-semibold text-brand-primary">
                        {standing.points || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 