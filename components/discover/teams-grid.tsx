"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Team {
  id: string
  name: string
  logo: string
  league: string
  aiInsights?: string // Optional field for AI insights
}

interface TeamsGridProps {
  teams: Team[]
}

// Generate a sample AI insight paragraph for a team
const generateAIInsights = (team: Team): string => {
  const insights = [
    `${team.name} has been showing impressive form in the ${team.league} this season, with strong defensive performances and efficient attacking play. Their tactical discipline and team chemistry have been key factors in their recent success.`,
    `Analysis of ${team.name}'s recent matches in the ${team.league} reveals a consistent playing style with emphasis on possession and quick transitions. Their ability to adapt to different opponents has been noteworthy.`,
    `${team.name} has demonstrated remarkable resilience in the ${team.league}, bouncing back from setbacks with determination. Their strategic approach to matches and player development pipeline continue to yield positive results.`,
    `Statistical analysis shows ${team.name} is among the top performers in the ${team.league} in terms of expected goals (xG) and defensive solidity. Their balanced approach to offense and defense makes them a formidable opponent.`
  ];
  
  // Return a random insight from the array
  return insights[Math.floor(Math.random() * insights.length)];
};

export function TeamsGrid({ teams }: TeamsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team) => (
        <Card key={team.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-16 w-16 relative rounded-md overflow-hidden">
                {team.logo ? (
                  <Image
                    src={team.logo}
                    alt={team.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-2xl font-bold">
                    {team.name[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <Badge variant="secondary">{team.league}</Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">AI Insights</h4>
              <div className="bg-secondary/50 p-3 rounded-md text-sm">
                {team.aiInsights || generateAIInsights(team)}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}