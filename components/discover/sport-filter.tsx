"use client"

import Image from "next/image"
import { useState } from "react"
import { X, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import * as SelectPrimitive from "@radix-ui/react-select"
import teamsData from "@/data/teams.json"
import fifaCwcData from "@/data/fifa-cwc-2025.json"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

// Convert to array of team objects with name and id for filtering
const TEAMS = [
  { id: "all-teams", name: "Todos os Times", logo: null },
  ...teamsData.teams
]

// Find team details from teams.json based on team name from fifa-cwc-2025.json
const getTeamDetails = (teamName: string) => {
  // Find the team by normalizing and comparing names
  const team = teamsData.teams.find(t => 
    t.name.toLowerCase() === teamName.toLowerCase() ||
    t.name.toLowerCase().includes(teamName.toLowerCase()) ||
    teamName.toLowerCase().includes(t.name.toLowerCase())
  )
  return team || { id: "unknown", name: teamName, logo: null }
}

// Process FIFA CWC groups data for the filter component
const CWC_GROUPS = fifaCwcData.groups.map(group => {
  return {
    name: group.name,
    teams: group.teams.map(teamName => getTeamDetails(teamName))
  }
})

// Additional option for "All Teams"
const ALL_TEAMS_OPTION = { id: "all-teams", name: "Todos os Times", logo: null }

interface TeamFilterProps {
  value: string
  onChange: (value: string) => void
}

export function TeamFilter({ value, onChange }: TeamFilterProps) {
  const [activeGroup, setActiveGroup] = useState(CWC_GROUPS[0].name)
  const [open, setOpen] = useState(false)
  const { isDarkMode } = useTheme();

  // Selected team details for the dropdown trigger
  const selectedTeam = TEAMS.find(team => team.id === value) || ALL_TEAMS_OPTION

  // Helper to get what to display in the top bar
  const getDisplayValue = () => {
    if (value === "all-teams") return "Todos os Times"
    const team = TEAMS.find(t => t.id === value)
    return team?.name || "Todos os Times"
  }

  // Handle reset separately to avoid dropdown opening
  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("all-teams");
  };

  return (
    <div className="relative w-[220px]">
      <Select 
        value={value} 
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
      >
        <div className="relative">
          <SelectTrigger className={cn(
            "cursor-pointer pr-10 flex [&>span]:flex-grow [&>span]:mr-0 [&>svg]:hidden",
            isDarkMode 
              ? "bg-[#061F3F] border-[#45CAFF]/30 text-[#D3ECFF] hover:bg-[#45CAFF]/10" 
              : "bg-background hover:bg-accent hover:text-accent-foreground"
          )}>
            <div className="flex items-center gap-2 overflow-hidden w-full">
              {selectedTeam.logo && value !== 'all-teams' && (
                <div className="h-5 w-5 relative overflow-hidden flex-shrink-0">
                  <Image 
                    src={selectedTeam.logo}
                    alt={selectedTeam.name}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <span className="truncate">{getDisplayValue()}</span>
            </div>
            <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
              <ChevronDown className={cn(
                "h-4 w-4",
                isDarkMode ? "text-[#45CAFF]" : "opacity-50"
              )} />
            </div>
          </SelectTrigger>
          
          {/* X button positioned absolutely to avoid event conflicts */}
          {value !== 'all-teams' && (
            <button 
              onClick={handleReset}
              className={cn(
                "absolute right-8 top-0 bottom-0 flex items-center justify-center w-6 h-full hover:opacity-100 z-10",
                isDarkMode ? "text-[#45CAFF] opacity-70" : "opacity-70"
              )}
              aria-label="Reset filter"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <SelectContent className={cn(
          "p-0 w-[380px]",
          isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30"
        )}>
          <div className={cn(
            "flex flex-wrap p-3 border-b gap-2 justify-center",
            isDarkMode && "border-[#45CAFF]/30"
          )}>
            {CWC_GROUPS.map((group, index) => (
              <button
                key={group.name}
                className={cn(
                  "w-8 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center",
                  activeGroup === group.name
                    ? isDarkMode 
                      ? "bg-[#45CAFF] text-[#061F3F] shadow-sm" 
                      : "bg-primary text-primary-foreground shadow-sm"
                    : isDarkMode
                      ? "bg-[#061F3F] text-[#D3ECFF] border border-[#45CAFF]/30 hover:bg-[#45CAFF]/10"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
                onClick={() => setActiveGroup(group.name)}
              >
                {String.fromCharCode(65 + index)} 
              </button>
            ))}
          </div>
          
          <div className={cn(
            "grid grid-cols-4 gap-3 p-4 max-h-[280px] overflow-y-auto",
            isDarkMode && "bg-[#061F3F]"
          )}>
            {CWC_GROUPS.find(g => g.name === activeGroup)?.teams.map((team) => (
              <SelectItem 
                key={team.id} 
                value={team.id} 
                className={cn(
                  "flex justify-center items-center w-full h-[80px] p-1 cursor-pointer rounded-md transition-colors data-[highlighted]:outline-none",
                  isDarkMode 
                    ? "hover:bg-[#45CAFF]/10 data-[state=checked]:bg-[#45CAFF]/20 data-[highlighted]:bg-[#45CAFF]/10" 
                    : "hover:bg-accent data-[highlighted]:bg-accent"
                )}
              >
                <div className="flex flex-col items-center justify-center text-center h-full">
                  {team.logo ? (
                    <div className="h-10 w-10 relative overflow-hidden mb-2 flex-shrink-0">
                      <Image 
                        src={team.logo}
                        alt={team.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className={cn(
                      "h-10 w-10 rounded-full mb-2 flex items-center justify-center flex-shrink-0",
                      isDarkMode ? "bg-[#45CAFF]/10" : "bg-muted"
                    )}>
                      <span className={cn(
                        "text-xs font-medium",
                        isDarkMode && "text-[#D3ECFF]"
                      )}>{team.name.substring(0, 2)}</span>
                    </div>
                  )}
                  <div className="min-h-[2.5em] flex items-center">
                    <span className={cn(
                      "text-[11px] line-clamp-2 w-full font-medium",
                      isDarkMode ? "text-[#D3ECFF]" : ""
                    )}>
                      {team.name}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}

// Keep the original SportFilter for backward compatibility
const SPORTS = [
  "Todos os Esportes",
  "Futebol",
  "Basquete",
  "Tênis",
  "Beisebol",
  "Fórmula 1",
  "MMA",
  "Boxe"
]

interface SportFilterProps {
  value: string
  onChange: (value: string) => void
}

export function SportFilter({ value, onChange }: SportFilterProps) {
  return (
    <div className="w-[220px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Selecionar Esporte" />
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