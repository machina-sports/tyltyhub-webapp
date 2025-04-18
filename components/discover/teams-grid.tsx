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
    `${team.name} vem mostrando uma forma impressionante na ${team.league} nesta temporada, com atuações defensivas sólidas e um ataque eficiente. Sua disciplina tática e química de equipe têm sido fatores chave para o sucesso recente.`,
    `A análise das partidas recentes do ${team.name} na ${team.league} revela um estilo de jogo consistente, com ênfase na posse de bola e transições rápidas. Sua capacidade de adaptação a diferentes adversários tem sido notável.`,
    `${team.name} demonstrou uma resiliência notável na ${team.league}, superando obstáculos com determinação. Sua abordagem estratégica para as partidas e o desenvolvimento de jogadores continuam a gerar resultados positivos.`,
    `A análise estatística mostra que o ${team.name} está entre os melhores desempenhos na ${team.league} em termos de gols esperados (xG) e solidez defensiva. Sua abordagem equilibrada entre ataque e defesa os torna um adversário formidável.`
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
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Insights da IA</h4>
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