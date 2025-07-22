"use client"

import Image from "next/image"
import { useState, useEffect, useMemo } from "react"
import { X, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import teamsData from "@/data/teams.json"
import fifaCwcData from "@/data/fifa-cwc-2025.json"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/store/dispatch"
import { useTeamDisplay } from "@/hooks/use-team-display"

const TEAMS = [
  { id: "all-teams", name: "Todos los Equipos", logo: null },
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

// Create team list from CWC groups
const CWC_GROUPS = fifaCwcData.groups.map(group => ({
  name: group.name,
  teams: group.teams.map(teamName => getTeamDetails(teamName))
}))

interface TeamFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TeamFilter({ value, onChange }: TeamFilterProps) {
  const [open, setOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState('A')
  const [isMobile, setIsMobile] = useState(false)
  const { getDisplayName, shouldUseAbbreviation } = useTeamDisplay()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const selectedTeam = useMemo(() => {
    return TEAMS.find(team => team.id === value) || TEAMS[0]
  }, [value])

  const handleTeamSelect = (teamId: string) => {
    onChange(teamId)
    setOpen(false)
  }

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange('all-teams')
  }

  // Calculate dynamic padding based on whether reset button is visible
  const triggerPaddingRight = value !== 'all-teams' ? 'pr-16' : 'pr-10'

  return (
    <div className="relative w-[220px]">
      <Select 
        value={value} 
        onValueChange={handleTeamSelect}
        open={open}
        onOpenChange={setOpen}
      >
        <div className="relative">
          <SelectTrigger className={cn(
            `cursor-pointer pr-10 flex [&>span]:flex-grow [&>span]:mr-0 [&>svg]:hidden ${triggerPaddingRight}`,
            "bg-bwin-neutral-20 border-bwin-neutral-30 text-bwin-neutral-100 hover:bg-bwin-neutral-30"
          )}>
            <SelectValue>
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
                <span className="truncate">
                  {value !== 'all-teams' ? getDisplayName(selectedTeam.name, { 
                    preferAbbreviation: shouldUseAbbreviation(selectedTeam.name, undefined, isMobile),
                    maxLength: isMobile ? 10 : 20
                  }) : selectedTeam.name}
                </span>
              </div>
            </SelectValue>
            <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-bwin-brand-primary opacity-70" />
            </div>
          </SelectTrigger>
          
          {/* X button positioned absolutely to avoid event conflicts */}
          {value !== 'all-teams' && (
            <button 
              onClick={handleReset}
              className="absolute right-8 top-0 bottom-0 flex items-center justify-center w-6 h-full hover:opacity-100 z-10 text-bwin-brand-primary opacity-70"
              aria-label="Reset filter"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <SelectContent className="p-0 w-[380px] bg-bwin-neutral-20 border-bwin-neutral-30">
          <div className="flex flex-wrap p-3 border-b gap-2 justify-center border-bwin-neutral-30">
            {CWC_GROUPS.map((group, index) => (
              <button
                key={group.name}
                className={cn(
                  "w-8 h-8 rounded-md text-xs font-medium transition-colors flex items-center justify-center",
                  activeGroup === group.name
                    ? "bg-bwin-brand-primary text-bwin-neutral-0"
                    : "bg-bwin-neutral-30 text-bwin-neutral-100 border border-bwin-neutral-40 hover:bg-bwin-neutral-40"
                )}
                onClick={() => setActiveGroup(group.name)}
              >
                {String.fromCharCode(65 + index)} 
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-4 gap-3 p-4 max-h-[280px] overflow-y-auto bg-bwin-neutral-20">
            {CWC_GROUPS.find(g => g.name === activeGroup)?.teams.map((team) => (
              <SelectItem 
                key={team.id} 
                value={team.id} 
                className="flex justify-center items-center w-full h-[80px] p-1 cursor-pointer rounded-md transition-colors data-[highlighted]:outline-none hover:bg-bwin-neutral-30 data-[state=checked]:bg-bwin-brand-primary/20 data-[highlighted]:bg-bwin-neutral-30"
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
                    <div className="h-10 w-10 rounded-full mb-2 flex items-center justify-center flex-shrink-0 bg-bwin-neutral-30">
                      <span className="text-xs font-medium text-bwin-neutral-100">{team.name.substring(0, 2)}</span>
                    </div>
                  )}
                  <span className="text-xs font-medium text-center leading-tight text-bwin-neutral-100">
                    {getDisplayName(team.name, { 
                      preferAbbreviation: shouldUseAbbreviation(team.name, undefined, true),
                      maxLength: 12
                    })}
                  </span>
                </div>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}

const SPORTS = [
  "Todos los Deportes",
  "Fútbol", 
  "Baloncesto",
  "Tenis",
  "Béisbol",
  "Fórmula 1",
  "MMA",
  "Boxeo"
]

interface SportFilterProps {
  value: string
  onChange: (value: string) => void
}

export function SportFilter({ value, onChange }: SportFilterProps) {
  return (
    <div className="w-[220px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-bwin-neutral-20 border-bwin-neutral-30 text-bwin-neutral-100">
          <SelectValue placeholder="Seleccionar Deporte" />
        </SelectTrigger>
        <SelectContent className="bg-bwin-neutral-20 border-bwin-neutral-30">
          {SPORTS.map((sport) => (
            <SelectItem key={sport} value={sport.toLowerCase()} className="text-bwin-neutral-100 hover:bg-bwin-neutral-30">
              {sport}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}