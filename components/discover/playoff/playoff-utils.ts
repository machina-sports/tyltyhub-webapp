
export const processPlayoffMatches = (calendarData: any, standingsData?: any) => {
  const matchesArray = calendarData?.data || calendarData
  
  if (!matchesArray || !Array.isArray(matchesArray)) {
    return { matchesByDate: {}, dateOrder: [] }
  }

  const playoffMatches = matchesArray.filter((match: any) => {
    const matchData = match.value
    const phase = matchData?.sport_event?.sport_event_context?.stage?.phase
    return phase === 'playoffs'
  })



  const processedMatches = playoffMatches.map((match: any) => {
    const matchData = match.value
    const startTime = matchData?.sport_event?.start_time
    const venue = matchData?.sport_event?.venue
    const competitors = matchData?.sport_event?.competitors || []
    const sportEventStatus = matchData?.sport_event_status || {}

    const homeScore = sportEventStatus.home_score
    const awayScore = sportEventStatus.away_score
    const matchStatus = sportEventStatus.match_status
    const generalStatus = matchData?.status
    
    const isFinished = matchStatus === 'ended' || matchStatus === 'ap' || matchStatus === 'aet' || generalStatus === 'closed'
    
    const finalHomeScore = isFinished && (homeScore !== undefined && homeScore !== null) ? homeScore : undefined
    const finalAwayScore = isFinished && (awayScore !== undefined && awayScore !== null) ? awayScore : undefined

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
      status: matchStatus || 'not_started',
      homeScore: finalHomeScore,
      awayScore: finalAwayScore,
      isFinished: isFinished,
      winner_id: sportEventStatus.winner_id
    }
  })

  return groupMatchesByDate(processedMatches)
}

export const processGroupStageMatches = (calendarData: any, standingsData?: any) => {
  const matchesArray = calendarData?.data || calendarData
  
  if (!matchesArray || !Array.isArray(matchesArray)) {
    return { matchesByDate: {}, dateOrder: [] }
  }

  const groupStageMatches = matchesArray.filter((match: any) => {
    const matchData = match.value
    const phase = matchData?.sport_event?.sport_event_context?.stage?.phase
    return phase !== 'playoffs'
  })

  const processedMatches = groupStageMatches.map((match: any) => {
    const matchData = match.value
    const startTime = matchData?.sport_event?.start_time
    const venue = matchData?.sport_event?.venue
    const competitors = matchData?.sport_event?.competitors || []
    const sportEventStatus = matchData?.sport_event_status || {}
    const group = matchData?.sport_event?.sport_event_context?.group
    const groups = matchData?.sport_event?.sport_event_context?.groups

    const homeScore = sportEventStatus.home_score
    const awayScore = sportEventStatus.away_score
    const matchStatus = sportEventStatus.match_status
    const generalStatus = matchData?.status
    
    const isFinished = matchStatus === 'ended' || matchStatus === 'ap' || matchStatus === 'aet' || generalStatus === 'closed'
    
    const finalHomeScore = isFinished && (homeScore !== undefined && homeScore !== null) ? homeScore : undefined
    const finalAwayScore = isFinished && (awayScore !== undefined && awayScore !== null) ? awayScore : undefined

    let groupName = 'Group Stage'
    if (groups && groups.length > 0) {
      groupName = groups[0].group_name || 'Group Stage'
    } else if (group) {
      groupName = group.name || group.group_name || 'Group Stage'
    }


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
      status: matchStatus || 'not_started',
      homeScore: finalHomeScore,
      awayScore: finalAwayScore,
      isFinished: isFinished,
      winner_id: sportEventStatus.winner_id,
      group: groupName
    }
  })

  return groupMatchesByDate(processedMatches)
}

export const groupMatchesByDate = (matches: any[]) => {
  const matchesByDate: { [key: string]: any[] } = {}
  const dateOrder: string[] = []
  
  matches.forEach(match => {
    let matchDate: Date
    try {
      matchDate = new Date(match.date)
      if (isNaN(matchDate.getTime())) {
        console.warn('Invalid date found:', match.date)
        return
      }
    } catch (error) {
      console.warn('Error parsing match date:', match.date, error)
      return
    }
    
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
  
  Object.keys(matchesByDate).forEach(date => {
    matchesByDate[date].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
  })
  
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

export const resolveVirtualTeams = (groupedData: any, standingsData?: any) => {
  return groupedData
}

export const advanceWinners = (groupedData: any) => {
  return groupedData
} 