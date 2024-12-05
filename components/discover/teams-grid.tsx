"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Team {
  id: string
  name: string
  sport: string
  currentForm: string
  keyStats: Record<string, number>
  starPlayers: Array<{
    name: string
    position: string
    stats: string
  }>
  recentPerformance: string
}

interface TeamsGridProps {
  teams: Team[]
}

export function TeamsGrid({ teams }: TeamsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team) => (
        <Card key={team.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold">
                {team.name[0]}
              </div>
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <Badge variant="secondary">{team.sport}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Form:</span> {team.currentForm}
              </p>
              <p className="text-sm">
                <span className="font-medium">Performance:</span>{" "}
                {team.recentPerformance}
              </p>
              <div className="pt-2">
                <p className="text-sm font-medium mb-1">Star Players:</p>
                {team.starPlayers.map((player) => (
                  <div key={player.name} className="text-sm text-muted-foreground">
                    {player.name} - {player.stats}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}