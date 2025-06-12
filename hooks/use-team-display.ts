import { useMemo } from "react"
import teamsData from "@/data/teams.json"

interface TeamDisplayInfo {
  name: string
  abbreviation: string
  logo?: string
  league?: string
  id: string
}

export const useTeamDisplay = () => {
  
  // Helper function to normalize team names for logo lookup
  const normalizeTeamName = useMemo(() => (name: string): string => {
    const nameMap: Record<string, string> = {
      // Mapeamento de abreviações para nomes de arquivo
      "UCH": "placeholder",
      "ELP": "placeholder",
      "BOT": "botafogo",
      "CFC": "placeholder",
      "RIV": "river-plate",
      "UNI": "placeholder",
      "IND": "placeholder",
      "BSC": "placeholder",
      "CC": "placeholder",
      "LDU": "placeholder",
      "FLA": "flamengo",
      "SPA": "placeholder",
      "LIB": "placeholder",
      "PAL": "palmeiras",

      // Nomes completos
      "Botafogo FR RJ": "botafogo",
      "CR Flamengo RJ": "flamengo",
      "SE Palmeiras SP": "palmeiras",
      "CA River Plate (ARG)": "river-plate"
    };

    // Check if we have a direct mapping
    if (nameMap[name]) {
      return nameMap[name];
    }

    // Try to find a partial match
    const lowerName = name.toLowerCase();
    for (const [key, value] of Object.entries(nameMap)) {
      if (lowerName.includes(key.toLowerCase())) {
        return value;
      }
    }

    // If no match is found, return a placeholder
    return "placeholder";
  }, [])

  // Helper function to find team by name or abbreviation
  const findTeam = useMemo(() => (teamName: string): TeamDisplayInfo | null => {
    const normalizedName = teamName.toLowerCase().replace(/ /g, '-')
    
    // First try to find by exact match
    let team = teamsData.teams.find(t => 
      t.name.toLowerCase() === teamName.toLowerCase() || 
      t.abbreviation === teamName ||
      t.id === normalizedName
    )
    
    // If not found, try partial matches
    if (!team) {
      team = teamsData.teams.find(t => 
        t.name.toLowerCase().includes(teamName.toLowerCase()) ||
        teamName.toLowerCase().includes(t.name.toLowerCase())
      )
    }
    
    if (team) {
      return {
        name: team.name,
        abbreviation: team.abbreviation,
        logo: team.logo,
        league: team.league,
        id: team.id
      }
    }
    
    return null
  }, [])

  // Function to get display name (abbreviation or full name based on screen size)
  const getDisplayName = useMemo(() => (
    teamName: string, 
    options: {
      preferAbbreviation?: boolean
      fallbackToOriginal?: boolean
      maxLength?: number
    } = {}
  ): string => {
    const { 
      preferAbbreviation = false, 
      fallbackToOriginal = true,
      maxLength
    } = options
    
    const team = findTeam(teamName)
    
    if (team) {
      if (preferAbbreviation && team.abbreviation) {
        return team.abbreviation
      }
      
      if (maxLength && team.name.length > maxLength && team.abbreviation) {
        return team.abbreviation
      }
      
      return team.name
    }
    
    // If team not found, return original name or truncated version
    if (fallbackToOriginal) {
      if (maxLength && teamName.length > maxLength) {
        return teamName.substring(0, maxLength) + '...'
      }
      return teamName
    }
    
    return teamName
  }, [findTeam])

  // Function to get team logo
  const getTeamLogo = useMemo(() => (teamName: string): string | undefined => {
    const team = findTeam(teamName)
    return team?.logo
  }, [findTeam])

  // Function to get team league
  const getTeamLeague = useMemo(() => (teamName: string): string | undefined => {
    const team = findTeam(teamName)
    return team?.league
  }, [findTeam])

  // Function to get team abbreviation
  const getTeamAbbreviation = useMemo(() => (teamName: string): string | undefined => {
    const team = findTeam(teamName)
    return team?.abbreviation
  }, [findTeam])

  // Function to get full team info
  const getTeamInfo = useMemo(() => (teamName: string): TeamDisplayInfo | null => {
    return findTeam(teamName)
  }, [findTeam])

  // Function to determine if abbreviation should be used based on screen constraints
  const shouldUseAbbreviation = useMemo(() => (
    teamName: string,
    containerWidth?: number,
    isMobile?: boolean
  ): boolean => {
    const team = findTeam(teamName)
    
    if (!team || !team.abbreviation) {
      return false
    }
    
    // Always use abbreviation on mobile if available
    if (isMobile) {
      return true
    }
    
    // Use abbreviation if container is too small
    if (containerWidth && containerWidth < 120) {
      return true
    }
    
    // Use abbreviation for very long team names
    if (team.name.length > 15) {
      return true
    }
    
    return false
  }, [findTeam])

  return {
    normalizeTeamName,
    findTeam,
    getDisplayName,
    getTeamLogo,
    getTeamLeague,
    getTeamAbbreviation,
    getTeamInfo,
    shouldUseAbbreviation
  }
} 