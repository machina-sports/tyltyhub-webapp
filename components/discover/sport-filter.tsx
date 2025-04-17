"use client"

import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import teamsData from "@/data/teams.json"

// Convert to array of team objects with name and id for filtering
const TEAMS = [
  { id: "all-teams", name: "All Teams", logo: null },
  ...teamsData.teams
]

interface TeamFilterProps {
  value: string
  onChange: (value: string) => void
}

export function TeamFilter({ value, onChange }: TeamFilterProps) {
  return (
    <div className="w-[180px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="All Teams">
            {value !== "all-teams" && (
              <div className="flex items-center gap-2">
                {TEAMS.find(team => team.id === value)?.logo && (
                  <div className="h-5 w-5 relative overflow-hidden rounded-full">
                    <Image 
                      src={TEAMS.find(team => team.id === value)?.logo || ""}
                      alt={TEAMS.find(team => team.id === value)?.name || ""}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                {TEAMS.find(team => team.id === value)?.name}
              </div>
            )}
            {value === "all-teams" && "All Teams"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {TEAMS.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <div className="flex items-center gap-2">
                {team.logo && (
                  <div className="h-5 w-5 relative overflow-hidden rounded-full flex-shrink-0">
                    <Image 
                      src={team.logo}
                      alt={team.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <span>{team.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

// Keep the original SportFilter for backward compatibility
const SPORTS = [
  "All Sports",
  "Football",
  "Basketball",
  "Tennis",
  "Baseball",
  "Formula 1",
  "MMA",
  "Boxing"
]

interface SportFilterProps {
  value: string
  onChange: (value: string) => void
}

export function SportFilter({ value, onChange }: SportFilterProps) {
  return (
    <div className="w-[180px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select Sport" />
        </SelectTrigger>
        <SelectContent>
          {SPORTS.map((sport) => (
            <SelectItem key={sport} value={sport.toLowerCase()}>
              {sport}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}