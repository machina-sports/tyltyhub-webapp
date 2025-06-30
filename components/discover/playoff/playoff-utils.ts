export const processPlayoffMatches = (calendarData: any, standingsData: any) => {
  const matchesArray = calendarData?.data || calendarData
  
  if (!matchesArray || !Array.isArray(matchesArray)) {
    return {}
  }
  
  const playoffMatches = matchesArray.filter((match: any) => {
    const matchData = match.value
    const phase = matchData?.sport_event?.sport_event_context?.stage?.phase
    
    const isPlayoffMatch = phase === 'playoffs'
    
    return isPlayoffMatch
  })
  
  const allMatches: any[] = []
  
  playoffMatches.forEach((match: any) => {
    const matchData = match.value
    const title = matchData?.title || ''
    const startTime = matchData?.sport_event?.start_time
    const venue = matchData?.sport_event?.venue
    const competitors = matchData?.sport_event?.competitors || []
    const sportEventStatus = matchData?.sport_event_status || {}
    
    let round = ''
    let matchNumber = 0
    
    if (title.includes('Winner Group')) {
      round = 'round_of_16'
      const matchDate = new Date(startTime)
      const matchDateStr = matchDate.toISOString().substring(0, 10)
      const matchTime = matchDate.getUTCHours()
      
      if (matchDateStr === '2025-06-28') {
        matchNumber = title.includes('Winner Group A') ? 49 : 50
      } else if (matchDateStr === '2025-06-29') {
        matchNumber = title.includes('Winner Group B') ? 51 : 52
      } else if (matchDateStr === '2025-06-30') {
        matchNumber = 53
      } else if (matchDateStr === '2025-07-01') {
        matchNumber = title.includes('Winner Group G') ? 54 : 55
      } else if (matchDateStr === '2025-07-02') {
        matchNumber = 56
      }
    } else if (title.includes('Winner Match')) {
      const matchNumbers = title.match(/Winner Match (\d+)/g)
      
      if (matchNumbers && matchNumbers.length === 2) {
        const match1 = parseInt(matchNumbers[0].replace('Winner Match ', ''))
        const match2 = parseInt(matchNumbers[1].replace('Winner Match ', ''))
        
        if (match1 >= 49 && match1 <= 56 && match2 >= 49 && match2 <= 56) {
          round = 'quarterfinal'
          
          if ((match1 === 53 && match2 === 54) || (match1 === 54 && match2 === 53)) {
            matchNumber = 57
          } else if ((match1 === 49 && match2 === 50) || (match1 === 50 && match2 === 49)) {
            matchNumber = 58
          } else if ((match1 === 51 && match2 === 52) || (match1 === 52 && match2 === 51)) {
            matchNumber = 59
          } else if ((match1 === 55 && match2 === 56) || (match1 === 56 && match2 === 55)) {
            matchNumber = 60
          }
        } else if (match1 >= 57 && match1 <= 60 && match2 >= 57 && match2 <= 60) {
          round = 'semifinal'
          
          if ((match1 === 57 && match2 === 58) || (match1 === 58 && match2 === 57)) {
            matchNumber = 61
          } else if ((match1 === 59 && match2 === 60) || (match1 === 60 && match2 === 59)) {
            matchNumber = 62
          }
        } else if (match1 >= 61 && match1 <= 62 && match2 >= 61 && match2 <= 62) {
          round = 'final'
          matchNumber = 63
        }
      }
    }
    
    if (round) {
      // Keep original date string to avoid timezone issues
      const processedMatch = {
        id: matchData.sport_event?.id || title,
        title: title,
        date: startTime, // Keep original startTime to preserve timezone
        venue: venue?.name ? `${venue.name}, ${venue.city_name}` : 'TBD',
        competitors: competitors.map((comp: any) => ({
          id: comp.id,
          name: comp.name,
          abbreviation: comp.abbreviation,
          virtual: comp.virtual || false,
          qualifier: comp.qualifier,
          resolvedName: comp.name
        })),
        round,
        matchNumber,
        status: sportEventStatus.match_status || 'not_started',
        homeScore: sportEventStatus.home_score,
        awayScore: sportEventStatus.away_score,
        period_scores: sportEventStatus.period_scores || [],
        winner_id: sportEventStatus.winner_id,
        match_status: sportEventStatus.match_status
      }
      
      allMatches.push(processedMatch)
    }
  })
  
  // Sort all matches by date
  allMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  return groupPlayoffsByDate(allMatches)
}

export const groupPlayoffsByDate = (matches: any[]) => {
  const matchesByDate: { [key: string]: any[] } = {}
  const dateOrder: string[] = []
  
  matches.forEach(match => {
    // Handle date parsing more robustly, preserving local timezone
    let matchDate: Date
    try {
      matchDate = new Date(match.date)
      // Validate the date
      if (isNaN(matchDate.getTime())) {
        console.warn('Invalid date found:', match.date)
        matchDate = new Date() // fallback to current date
      }
    } catch (error) {
      console.warn('Error parsing match date:', match.date, error)
      matchDate = new Date() // fallback to current date
    }
    
    // Use local date string to avoid timezone conversion issues
    const year = matchDate.getFullYear()
    const month = String(matchDate.getMonth() + 1).padStart(2, '0')
    const day = String(matchDate.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}` // YYYY-MM-DD format in local timezone
    
    if (!matchesByDate[dateKey]) {
      matchesByDate[dateKey] = []
      dateOrder.push(dateKey)
    }
    
    matchesByDate[dateKey].push(match)
  })
  
  // Sort matches within each date by actual match date
  Object.keys(matchesByDate).forEach(date => {
    matchesByDate[date].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateA - dateB
    })
  })
  
  // Sort dates based on the earliest match date in each day
  dateOrder.sort((a, b) => {
    const earliestMatchA = matchesByDate[a][0]
    const earliestMatchB = matchesByDate[b][0]
    const dateA = new Date(earliestMatchA.date).getTime()
    const dateB = new Date(earliestMatchB.date).getTime()
    return dateA - dateB
  })
  
  return {
    matchesByDate,
    dateOrder
  }
}

export const advanceWinners = (groupedData: any) => {
  const { matchesByDate, dateOrder } = groupedData
  
  const getMatchWinner = (match: any) => {
    if (match.winner_id) {
      const winnerCompetitor = match.competitors.find((comp: any) => comp.id === match.winner_id)
      if (winnerCompetitor) {
        return {
          name: winnerCompetitor.resolvedName || winnerCompetitor.name,
          id: winnerCompetitor.id,
          method: 'winner_id'
        }
      }
    }
    
    if (match.homeScore !== undefined && match.awayScore !== undefined && 
        match.homeScore !== null && match.awayScore !== null &&
        (match.homeScore !== 0 || match.awayScore !== 0)) {
      
      if (match.homeScore > match.awayScore) {
        const winnerCompetitor = match.competitors[0]
        return {
          name: winnerCompetitor.resolvedName || winnerCompetitor.name,
          id: winnerCompetitor.id,
          method: 'score',
          score: `${match.homeScore}-${match.awayScore}`
        }
      } else if (match.awayScore > match.homeScore) {
        const winnerCompetitor = match.competitors[1]
        return {
          name: winnerCompetitor.resolvedName || winnerCompetitor.name,
          id: winnerCompetitor.id,
          method: 'score',
          score: `${match.homeScore}-${match.awayScore}`
        }
      } else {
        return null
      }
    }
    
    return null
  }
  
  // Collect all matches by round
  const allMatches: any[] = []
  Object.keys(matchesByDate).forEach(date => {
    allMatches.push(...matchesByDate[date])
  })
  
  const round16Winners: { [key: number]: any } = {}
  const quarterWinners: { [key: number]: any } = {}
  const semiWinners: { [key: number]: any } = {}
  
  // Process round of 16 matches
  allMatches.filter(match => match.round === 'round_of_16').forEach((match: any) => {
    const matchNumber = match.matchNumber
    const winner = getMatchWinner(match)
    
    if (winner) {
      round16Winners[matchNumber] = winner
    }
  })
  
  // Process quarterfinal matches
  allMatches.filter(match => match.round === 'quarterfinal').forEach((match: any) => {
    const matchNumber = match.matchNumber
    
    const matchNumbers = match.title.match(/Winner Match (\d+)/g)
    if (matchNumbers && matchNumbers.length === 2) {
      const sourceMatch1 = parseInt(matchNumbers[0].replace('Winner Match ', ''))
      const sourceMatch2 = parseInt(matchNumbers[1].replace('Winner Match ', ''))
      
      if (round16Winners[sourceMatch1]) {
        match.competitors[0].resolvedName = round16Winners[sourceMatch1].name
        match.competitors[0].name = round16Winners[sourceMatch1].name
      } else {
        match.competitors[0].resolvedName = `Vencedor da Partida ${sourceMatch1}`
        match.competitors[0].name = `Vencedor da Partida ${sourceMatch1}`
      }
      
      if (round16Winners[sourceMatch2]) {
        match.competitors[1].resolvedName = round16Winners[sourceMatch2].name
        match.competitors[1].name = round16Winners[sourceMatch2].name
      } else {
        match.competitors[1].resolvedName = `Winner Match ${sourceMatch2}`
        match.competitors[1].name = `Winner Match ${sourceMatch2}`
      }
    }
    
    const winner = getMatchWinner(match)
    if (winner) {
      quarterWinners[matchNumber] = winner
    }
  })
  
  // Process semifinal matches
  allMatches.filter(match => match.round === 'semifinal').forEach((match: any) => {
    const matchNumber = match.matchNumber
    
    const matchNumbers = match.title.match(/Winner Match (\d+)/g)
    if (matchNumbers && matchNumbers.length === 2) {
      const sourceMatch1 = parseInt(matchNumbers[0].replace('Winner Match ', ''))
      const sourceMatch2 = parseInt(matchNumbers[1].replace('Winner Match ', ''))
      
      if (quarterWinners[sourceMatch1]) {
        match.competitors[0].resolvedName = quarterWinners[sourceMatch1].name
        match.competitors[0].name = quarterWinners[sourceMatch1].name
      } else {
        match.competitors[0].resolvedName = `Winner Match ${sourceMatch1}`
        match.competitors[0].name = `Winner Match ${sourceMatch1}`
      }
      
      if (quarterWinners[sourceMatch2]) {
        match.competitors[1].resolvedName = quarterWinners[sourceMatch2].name
        match.competitors[1].name = quarterWinners[sourceMatch2].name
      } else {
        match.competitors[1].resolvedName = `Winner Match ${sourceMatch2}`
        match.competitors[1].name = `Winner Match ${sourceMatch2}`
      }
    }
    
    const winner = getMatchWinner(match)
    if (winner) {
      semiWinners[matchNumber] = winner
    }
  })
  
  // Process final matches
  allMatches.filter(match => match.round === 'final').forEach((match: any) => {
    const matchNumber = match.matchNumber
    
    const matchNumbers = match.title.match(/Winner Match (\d+)/g)
    if (matchNumbers && matchNumbers.length === 2) {
      const sourceMatch1 = parseInt(matchNumbers[0].replace('Winner Match ', ''))
      const sourceMatch2 = parseInt(matchNumbers[1].replace('Winner Match ', ''))
      
      if (semiWinners[sourceMatch1]) {
        match.competitors[0].resolvedName = semiWinners[sourceMatch1].name
        match.competitors[0].name = semiWinners[sourceMatch1].name
      } else {
        match.competitors[0].resolvedName = `Winner Match ${sourceMatch1}`
        match.competitors[0].name = `Winner Match ${sourceMatch1}`
      }
      
      if (semiWinners[sourceMatch2]) {
        match.competitors[1].resolvedName = semiWinners[sourceMatch2].name
        match.competitors[1].name = semiWinners[sourceMatch2].name
      } else {
        match.competitors[1].resolvedName = `Winner Match ${sourceMatch2}`
        match.competitors[1].name = `Winner Match ${sourceMatch2}`
      }
    }
    
    getMatchWinner(match)
  })
  
  return {
    matchesByDate,
    dateOrder
  }
}

export const resolveVirtualTeams = (groupedData: any, standingsData: any) => {
  if (!standingsData?.value?.data?.[0]?.groups) {
    return groupedData
  }
  
  const { matchesByDate, dateOrder } = groupedData
  
  const groups = standingsData.value.data[0].groups
  const teamsByGroup: { [key: string]: any } = {}
  
  groups.forEach((group: any) => {
    const sortedStandings = [...group.standings].sort((a: any, b: any) => a.rank - b.rank)
    teamsByGroup[group.group_name] = {
      winner: sortedStandings[0]?.competitor,
      runnerUp: sortedStandings[1]?.competitor
    }
  })
  
  const resolveTeamName = (competitorName: string) => {
    const winnerMatch = competitorName.match(/Winner Group ([A-H])/)
    const runnerUpMatch = competitorName.match(/Runner-Up Group ([A-H])/)
    
    if (winnerMatch) {
      const group = winnerMatch[1]
      const resolvedName = teamsByGroup[group]?.winner?.name || competitorName
      return resolvedName
    }
    
    if (runnerUpMatch) {
      const group = runnerUpMatch[1]
      const resolvedName = teamsByGroup[group]?.runnerUp?.name || competitorName
      return resolvedName
    }
    
    return competitorName
  }
  
  const resolveMatchTitle = (title: string) => {
    if (title.includes('Winner Group') && title.includes('Runner-Up Group')) {
      const parts = title.split(' v ')
      if (parts.length === 2) {
        const team1 = resolveTeamName(parts[0])
        const team2 = resolveTeamName(parts[1])
        return `${team1} v ${team2}`
      }
    }
    return title
  }
  
  Object.keys(matchesByDate).forEach((date: string) => {
    matchesByDate[date] = matchesByDate[date].map((match: any) => ({
      ...match,
      title: resolveMatchTitle(match.title),
      competitors: match.competitors.map((comp: any) => ({
        ...comp,
        resolvedName: resolveTeamName(comp.name || comp.competitor?.name || '')
      }))
    }))
  })
  
  return advanceWinners({
    matchesByDate,
    dateOrder
  })
} 