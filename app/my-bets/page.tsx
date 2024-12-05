"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import betsData from "@/data/my-bets.json"

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-500",
  won: "bg-green-500/10 text-green-500",
  lost: "bg-red-500/10 text-red-500"
}

export default function MyBetsPage() {
  const [filter, setFilter] = useState("all")
  
  const filteredBets = betsData.bets.filter(bet => 
    filter === "all" ? true : bet.status === filter
  )

  return (
    <div className="mobile-container py-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1>My Bets</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Bets</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="won">Won</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Stake</TableHead>
                <TableHead>Odds</TableHead>
                <TableHead>Potential Win</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Placed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBets.map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell className="font-medium">{bet.match}</TableCell>
                  <TableCell>{bet.type}</TableCell>
                  <TableCell>${bet.stake}</TableCell>
                  <TableCell>{bet.odds}</TableCell>
                  <TableCell>${bet.potentialWin}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={statusColors[bet.status as keyof typeof statusColors]}>
                      {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(bet.placedAt), "MMM d, yyyy HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="sm:hidden space-y-4">
          {filteredBets.map((bet) => (
            <div key={bet.id} className="p-4 space-y-3 border-b last:border-b-0">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="font-medium">{bet.match}</div>
                  <div className="text-sm text-muted-foreground">{bet.type}</div>
                </div>
                <Badge variant="secondary" className={statusColors[bet.status as keyof typeof statusColors]}>
                  {bet.status.charAt(0).toUpperCase() + bet.status.slice(1)}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <div className="text-muted-foreground">Stake</div>
                  <div>${bet.stake}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Odds</div>
                  <div>{bet.odds}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Potential Win</div>
                  <div>${bet.potentialWin}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Placed At</div>
                  <div>{format(new Date(bet.placedAt), "MMM d, HH:mm")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}