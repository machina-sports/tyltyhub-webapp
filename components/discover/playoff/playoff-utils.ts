// Simple utility to process and group playoff matches by date
export const processPlayoffMatches = (calendarData: any, standingsData?: any) => {
  const matchesArray = calendarData?.data || calendarData
  
  if (!matchesArray || !Array.isArray(matchesArray)) {
    return { matchesByDate: {}, dateOrder: [] }
  }

  // Filter playoff matches
  const playoffMatches = matchesArray.filter((match: any) => {
    const matchData = match.value
    const phase = matchData?.sport_event?.sport_event_context?.stage?.phase
    return phase === 'playoffs'
  })

  // Convert to simpler format
  const processedMatches = playoffMatches.map((match: any) => {
    const matchData = match.value
    const startTime = matchData?.sport_event?.start_time
    const venue = matchData?.sport_event?.venue
    const competitors = matchData?.sport_event?.competitors || []
    const sportEventStatus = matchData?.sport_event_status || {}

    return {
      id: matchData.sport_event?.id || matchData?.title || '',
      title: matchData?.title || '',
      date: startTime,
      venue: venue?.name ? `${venue.name}, ${venue.city_name}` : 'TBD',
      competitors: competitors.map((comp: any) => ({
        id: comp.id,
        name: comp.name,
        abbreviation: comp.abbreviation,
        virtual: comp.virtual || false,
        qualifier: comp.qualifier
      })),
      status: sportEventStatus.match_status || 'not_started',
      homeScore: sportEventStatus.home_score,
      awayScore: sportEventStatus.away_score,
      winner_id: sportEventStatus.winner_id
    }
  })

  return groupMatchesByDate(processedMatches)
}

// Simple function to group matches by date
export const groupMatchesByDate = (matches: any[]) => {
  const matchesByDate: { [key: string]: any[] } = {}
  const dateOrder: string[] = []
  
  matches.forEach(match => {
    let matchDate: Date
    try {
      matchDate = new Date(match.date)
      if (isNaN(matchDate.getTime())) {
        console.warn('Invalid date found:', match.date)
        return // Skip invalid dates
      }
    } catch (error) {
      console.warn('Error parsing match date:', match.date, error)
      return // Skip invalid dates
    }
    
    // Create date key in YYYY-MM-DD format
    const year = matchDate.getFullYear()
    const month = String(matchDate.getMonth() + 1).padStart(2, '0')
    const day = String(matchDate.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`
    
    if (!matchesByDate[dateKey]) {
      matchesByDate[dateKey] = []
      dateOrder.push(dateKey)
    }
    
    matchesByDate[dateKey].push(match)
  })
  
  // Sort matches within each date by time
  Object.keys(matchesByDate).forEach(date => {
    matchesByDate[date].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
  })
  
  // Sort dates chronologically
  dateOrder.sort((a, b) => {
    const dateA = new Date(a).getTime()
    const dateB = new Date(b).getTime()
    return dateA - dateB
  })
  
  return {
    matchesByDate,
    dateOrder
  }
}

// Simplified function that just returns the grouped data without complex logic
export const resolveVirtualTeams = (groupedData: any, standingsData?: any) => {
  // For now, just return the data as-is
  // You can add team name resolution logic here if needed later
  return groupedData
}

// Simplified function that just returns the grouped data without winner advancement
export const advanceWinners = (groupedData: any) => {
  // For now, just return the data as-is
  // You can add winner advancement logic here if needed later
  return groupedData
} 