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
  
  const normalizeTeamName = useMemo(() => (name: string): string => {
    const nameMap: Record<string, string> = {
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

      "Botafogo FR RJ": "botafogo",
      "CR Flamengo RJ": "flamengo",
      "SE Palmeiras SP": "palmeiras",
      "CA River Plate (ARG)": "river-plate",
      
      "Espérance de Tunis": "espérance-de-tunis",
      "Esperance de Tunis": "espérance-de-tunis",
      "Esperance Sportive de Tunis": "espérance-de-tunis",
      "EST": "espérance-de-tunis",
      "Los Angeles FC": "los-angeles-fc",
      "Los Angeles": "los-angeles-fc",
      "LAFC": "los-angeles-fc",
      "LAC": "los-angeles-fc",
      "LA": "los-angeles-fc",
      "LAF": "los-angeles-fc"
    };

    if (nameMap[name]) {
      return nameMap[name];
    }

    const lowerName = name.toLowerCase();
    for (const [key, value] of Object.entries(nameMap)) {
      if (lowerName.includes(key.toLowerCase())) {
        return value;
      }
    }

    return "placeholder";
  }, [])

  const findTeam = useMemo(() => (teamName: string): TeamDisplayInfo | null => {
    const normalizedName = teamName.toLowerCase().replace(/ /g, '-')
    
    let team = teamsData.teams.find(t => 
      t.name.toLowerCase() === teamName.toLowerCase() || 
      t.abbreviation === teamName ||
      t.id === normalizedName
    )
    
    if (!team) {
      team = teamsData.teams.find(t => 
        t.name.toLowerCase().includes(teamName.toLowerCase()) ||
        teamName.toLowerCase().includes(t.name.toLowerCase())
      )
    }
    
    if (!team) {
      const specialCases: Record<string, string> = {
        "espérance de tunis": "espérance-de-tunis",
        "esperance de tunis": "espérance-de-tunis", 
        "esperance sportive de tunis": "espérance-de-tunis",
        "est": "espérance-de-tunis",
        "los angeles fc": "los-angeles-fc",
        "los angeles": "los-angeles-fc",
        "lafc": "los-angeles-fc",
        "lac": "los-angeles-fc",
        "la": "los-angeles-fc",
        "laf": "los-angeles-fc",
        "inter milano": "inter-milan",
        "inter de milano": "inter-milan",
        "fc internazionale milano": "inter-milan"
      }
      
      const specialId = specialCases[teamName.toLowerCase()]
      if (specialId) {
        team = teamsData.teams.find(t => t.id === specialId)
      }
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
    
    if (fallbackToOriginal) {
      if (maxLength && teamName.length > maxLength) {
        return teamName.substring(0, maxLength) + '...'
      }
      return teamName
    }
    
    return teamName
  }, [findTeam])

  const getTeamLogo = useMemo(() => (teamName: string): string | undefined => {
    const team = findTeam(teamName)
    return team?.logo
  }, [findTeam])

  const getTeamLeague = useMemo(() => (teamName: string): string | undefined => {
    const team = findTeam(teamName)
    return team?.league
  }, [findTeam])

  const getTeamAbbreviation = useMemo(() => (teamName: string): string | undefined => {
    const team = findTeam(teamName)
    return team?.abbreviation
  }, [findTeam])

  const getTeamInfo = useMemo(() => (teamName: string): TeamDisplayInfo | null => {
    return findTeam(teamName)
  }, [findTeam])

  const shouldUseAbbreviation = useMemo(() => (
    teamName: string,
    containerWidth?: number,
    isMobile?: boolean
  ): boolean => {
    const team = findTeam(teamName)
    
    if (!team || !team.abbreviation) {
      return false
    }
    
    if (isMobile) {
      return true
    }
    
    if (containerWidth && containerWidth < 120) {
      return true
    }
    
    if (team.name.length > 15) {
      return true
    }
    
    return false
  }, [findTeam])

  const getSimplifiedName = useMemo(() => (teamName: string): string => {
    const simplifiedNames: Record<string, string> = {
      "SE Palmeiras SP": "Palmeiras",
      "CR Flamengo RJ": "Flamengo", 
      "Botafogo FR RJ": "Botafogo",
      "Fluminense FC RJ": "Fluminense",
      
      "Paris Saint-Germain": "PSG",
      "Manchester City": "Manchester City",
      "Real Madrid": "Real Madrid",
      "Bayern Munich": "Bayern",
      "Borussia Dortmund": "Dortmund",
      "Chelsea FC": "Chelsea",
      "SL Benfica": "Benfica",
      "Juventus Turin": "Juventus",
      
      "Inter Milano": "Inter de Milão",
      "Inter de Milano": "Inter de Milão",
      "FC Internazionale Milano": "Inter de Milão",
      
      "Inter Miami CF": "Inter Miami",
      "CF Monterrey": "Monterrey",
      "Los Angeles FC": "LAFC",
      
      "Al Hilal SFC": "Al Hilal",
      "Al Ain FC": "Al Ain",
      
      "CA River Plate (ARG)": "River Plate",
      "Boca Juniors": "Boca Juniors",
      
      "Esperance Sportive de Tunis": "Esperance",
      "Espérance de Tunis": "Esperance",
      "Mamelodi Sundowns": "Sundowns",
      "Wydad AC": "Wydad",
      
      "Auckland City FC": "Auckland City",
      "Urawa Red Diamonds": "Urawa",
      "Seattle Sounders": "Seattle",
      "FC Salzburg": "Salzburg",
      "Red Bull Salzburg": "RB Salzburg",
      "Atletico Madrid": "Atlético Madrid",
      "FC Porto": "Porto",
      "CF Pachuca": "Pachuca"
    }
    
    if (simplifiedNames[teamName]) {
      return simplifiedNames[teamName]
    }
    
    let simplified = teamName
    
    simplified = simplified.replace(/^(SE|CR|CA|CF|FC|SC|SL|AC)\s+/, '')
    
    simplified = simplified.replace(/\s+(SP|RJ|FC|CF|SFC|AC)$/, '')
    
    simplified = simplified.replace(/\s+\([A-Z]{3}\)$/, '')
    
    return simplified
  }, [])

  return {
    normalizeTeamName,
    findTeam,
    getDisplayName,
    getTeamLogo,
    getTeamLeague,
    getTeamAbbreviation,
    getTeamInfo,
    shouldUseAbbreviation,
    getSimplifiedName
  }
} 