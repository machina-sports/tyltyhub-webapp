"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from "lucide-react"
import { format } from "date-fns"

interface Competition {
  id: string
  name: string
  teams: string[]
  date: string
  venue: string
  odds: Record<string, number>
  analysis: string
}

interface CompetitionsGridProps {
  competitions: Competition[]
}

export function CompetitionsGrid({ competitions }: CompetitionsGridProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {competitions.map((competition) => (
        <Card key={competition.id}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold">{competition.name}</h3>
              <Badge variant="secondary">
                {format(new Date(competition.date), "MMM d, yyyy")}
              </Badge>
            </div>
            <div className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {competition.venue}
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
                {Object.entries(competition.odds).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-sm font-medium mb-1">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </div>
                    <div className="text-lg font-bold">{value.toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{competition.analysis}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}