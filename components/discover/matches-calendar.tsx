"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState, useMemo } from "react"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useTeamDisplay } from "@/hooks/use-team-display"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Fixture = {
  date: string;
  ko: string;
  match: string;
  venue: string;
  groupName: string;
  homeScore?: number;
  awayScore?: number;
  isFinished?: boolean;
};

type PlayoffFixture = {
  date: string;
  ko: string;
  match: string;
  venue: string;
  phase: 'Round of 16' | 'Quarter-finals' | 'Semi-finals' | 'Final';
  matchNumber?: number;
  homeScore?: number;
  awayScore?: number;
  isFinished?: boolean;
};

type StandingsTeam = {
  competitor: {
    name: string;
    abbreviation: string;
    country: string;
    country_code: string;
    id: string;
  };
  rank: number;
  points: number;
  current_outcome?: string;
  goals_for: number;
  goals_against: number;
  goals_diff: number;
  win: number;
  draw: number;
  loss: number;
  played: number;
};

type GroupStanding = {
  group_name: string;
  name: string;
  standings: StandingsTeam[];
};

type StandingsData = {
  standings: {
    value: {
      data: Array<{
        groups: GroupStanding[];
      }>;
    };
  };
};

const generatePlayoffFixtures = (standingsData?: StandingsData): PlayoffFixture[] => {
  if (!standingsData?.standings?.value?.data?.[0]?.groups) {
    return [];
  }

  const groups = standingsData.standings.value.data[0].groups;
  const fixtures: PlayoffFixture[] = [];
  
  const qualifiedTeams: { team: StandingsTeam; groupName: string }[] = [];
  
  groups.forEach(group => {
    const sortedStandings = [...group.standings]
      .sort((a, b) => {
        return a.rank - b.rank;
      })
      .slice(0, 2);
    
    sortedStandings.forEach(team => {
      if (team.current_outcome === 'Playoffs') {
        qualifiedTeams.push({ team, groupName: group.group_name });
      }
    });
  });

  const firstPlaceTeams = qualifiedTeams.filter(({ team }) => team.rank === 1);
  const secondPlaceTeams = qualifiedTeams.filter(({ team }) => team.rank === 2);

  firstPlaceTeams.sort((a, b) => a.groupName.localeCompare(b.groupName));
  secondPlaceTeams.sort((a, b) => a.groupName.localeCompare(b.groupName));

  const roundOf16Matchups = [
    { firstGroup: 'A', secondGroup: 'B', venue: 'Lincoln Financial Field, Philadelphia', date: 'June 28', time: '13:00' },
    { firstGroup: 'C', secondGroup: 'D', venue: 'Bank of America Stadium, Charlotte', date: 'June 28', time: '17:00' },
    { firstGroup: 'E', secondGroup: 'F', venue: 'Bank of America Stadium, Charlotte', date: 'June 30', time: '16:00' },
    { firstGroup: 'G', secondGroup: 'H', venue: 'Camping World Stadium, Orlando', date: 'June 30', time: '22:00' },
    { firstGroup: 'B', secondGroup: 'A', venue: 'Mercedes-Benz Stadium, Atlanta', date: 'June 29', time: '13:00' },
    { firstGroup: 'D', secondGroup: 'C', venue: 'Hard Rock Stadium, Miami Gardens', date: 'June 29', time: '17:00' },
    { firstGroup: 'F', secondGroup: 'E', venue: 'Mercedes-Benz Stadium, Atlanta', date: 'July 1', time: '22:00' },
    { firstGroup: 'H', secondGroup: 'G', venue: 'Hard Rock Stadium, Miami Gardens', date: 'July 1', time: '16:00' },
  ];

  roundOf16Matchups.forEach((matchup, index) => {
    const firstPlaceTeam = firstPlaceTeams.find(t => t.groupName === matchup.firstGroup);
    const secondPlaceTeam = secondPlaceTeams.find(t => t.groupName === matchup.secondGroup);
    
    if (firstPlaceTeam && secondPlaceTeam) {
      fixtures.push({
        date: matchup.date,
        ko: matchup.time,
        match: `${firstPlaceTeam.team.competitor.name} x ${secondPlaceTeam.team.competitor.name}`,
        venue: matchup.venue,
        phase: 'Round of 16',
        matchNumber: index + 1
      });
    }
  });

  const quarterFinalMatchups = [
    { date: 'July 4', time: '22:00', venue: 'Lincoln Financial Field, Philadelphia' },
    { date: 'July 4', time: '16:00', venue: 'Camping World Stadium, Orlando' },
    { date: 'July 5', time: '13:00', venue: 'Mercedes-Benz Stadium, Atlanta' },
    { date: 'July 5', time: '17:00', venue: 'MetLife Stadium, East Rutherford' },
  ];

  quarterFinalMatchups.forEach((matchup, index) => {
    const match1 = index * 2 + 1;
    const match2 = index * 2 + 2;
    fixtures.push({
      date: matchup.date,
      ko: matchup.time,
      match: `Vencedor Oitava ${match1} x Vencedor Oitava ${match2}`,
      venue: matchup.venue,
      phase: 'Quarter-finals',
      matchNumber: index + 1
    });
  });

  const semiFinalMatchups = [
    { date: 'July 8', time: '16:00', venue: 'MetLife Stadium, East Rutherford' },
    { date: 'July 9', time: '16:00', venue: 'MetLife Stadium, East Rutherford' },
  ];

  semiFinalMatchups.forEach((matchup, index) => {
    const quarter1 = index * 2 + 1;
    const quarter2 = index * 2 + 2;
    fixtures.push({
      date: matchup.date,
      ko: matchup.time,
      match: `Vencedor Quarta ${quarter1} x Vencedor Quarta ${quarter2}`,
      venue: matchup.venue,
      phase: 'Semi-finals',
      matchNumber: index + 1
    });
  });

  fixtures.push({
    date: 'July 13',
    ko: '16:00',
    match: 'Vencedor Semifinal 1 x Vencedor Semifinal 2',
    venue: 'MetLife Stadium, East Rutherford',
    phase: 'Final',
    matchNumber: 1
  });

  return fixtures;
};

type EnhancedFixture = Fixture | (PlayoffFixture & { groupName: string });

const isPlayoffFixture = (fixture: EnhancedFixture): fixture is PlayoffFixture & { groupName: string } => {
  return 'phase' in fixture;
};

const translatePhase = (phase: string): string => {
  const translations: Record<string, string> = {
    'Round of 16': 'Oitavas de Final',
    'Quarter-finals': 'Quartas de Final',
    'Semi-finals': 'Semifinais',
    'Final': 'Final'
  };
  return translations[phase] || phase;
};

interface MatchesCalendarProps {
  useAbbreviations?: boolean;
  compact?: boolean;
  maxMatches?: number;
  maxWidth?: string;
  standingsData?: StandingsData;
  showPlayoffs?: boolean;
  gamesData?: any[];
}

const translateDate = (date: string): string => {
  return date
    .replace('June', 'Junho')
    .replace('July', 'Julho')
    .replace('August', 'Agosto')
    .replace('September', 'Setembro')
    .replace('October', 'Outubro')
    .replace('November', 'Novembro')
    .replace('December', 'Dezembro')
    .replace('January', 'Janeiro')
    .replace('February', 'Fevereiro')
    .replace('March', 'Março')
    .replace('April', 'Abril')
    .replace('May', 'Maio')
}

const parseDate = (dateStr: string, timeStr: string): Date => {
  const monthMap: Record<string, string> = {
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12',
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05'
  };
  
  const [month, day] = dateStr.split(' ');
  const monthNum = monthMap[month];
  
  const [hour, minute] = timeStr.split(':').map(Number);
  
  return new Date(2025, parseInt(monthNum) - 1, parseInt(day), hour, minute);
}

const groupByDate = (fixtures: Fixture[]): Record<string, Fixture[]> => {
  const grouped: Record<string, Fixture[]> = {};
  
  fixtures.forEach(fixture => {
    if (!grouped[fixture.date]) {
      grouped[fixture.date] = [];
    }
    grouped[fixture.date].push(fixture);
  });
  
  return grouped;
}

interface TeamMatchProps {
  teamName: string;
  logo?: string;
  isSecond?: boolean;
  useAbbreviation?: boolean;
  compact?: boolean;
}

const TeamMatch = ({ teamName, logo, isSecond, useAbbreviation = false, compact = false }: TeamMatchProps) => {
  const { isDarkMode } = useTheme();
  const { getDisplayName, shouldUseAbbreviation } = useTeamDisplay();
  
  const displayName = getDisplayName(teamName, {
    preferAbbreviation: useAbbreviation || shouldUseAbbreviation(teamName, undefined, compact),
    maxLength: compact ? 8 : 15
  });
  
  return (
    <div className={`flex items-center gap-2 ${isSecond ? 'justify-start' : 'justify-end'}`}>
      {!isSecond && (
        <span className={cn(
          "font-medium overflow-wrap-normal word-break-normal",
          compact ? "text-xs" : "text-sm",
          isDarkMode ? "text-[#45CAFF]" : ""
        )}>
          {displayName}
        </span>
      )}
      {logo && (
        <div className={cn(
          "relative flex-shrink-0",
          compact ? "h-5 w-5" : "h-7 w-7"
        )}>
          <Image 
            src={logo} 
            alt={teamName} 
            fill 
            className="object-contain"
            sizes={compact ? "20px" : "28px"}
          />
        </div>
      )}
      {isSecond && (
        <span className={cn(
          "font-medium overflow-wrap-normal word-break-normal",
          compact ? "text-xs" : "text-sm",
          isDarkMode ? "text-[#45CAFF]" : ""
        )}>
          {displayName}
        </span>
      )}
    </div>
  );
};

const convertEdtToLocal = (dateStr: string, timeStr: string) => {
  const edtDate = parseDate(dateStr, timeStr);
  
  const utcTime = new Date(edtDate.getTime() + (4 * 60 * 60 * 1000));
  
  const localTimeStr = utcTime.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
  
  return {
    localTime: localTimeStr,
    edtTime: timeStr
  };
};

const getMatchResult = (fixture: EnhancedFixture, gameData?: any) => {
  if (fixture.isFinished && typeof fixture.homeScore === 'number' && typeof fixture.awayScore === 'number') {
    return `${fixture.homeScore} - ${fixture.awayScore}`;
  }
  
  if (gameData?.value?.sport_event_status?.home_score !== undefined && 
      gameData?.value?.sport_event_status?.away_score !== undefined) {
    return `${gameData.value.sport_event_status.home_score} - ${gameData.value.sport_event_status.away_score}`;
  }
  
  if (typeof fixture.homeScore === 'number' && typeof fixture.awayScore === 'number') {
    return `${fixture.homeScore} - ${fixture.awayScore}`;
  }
  
  return 'x';
};

export const MatchCard = ({ fixture, useAbbreviation = false, compact = false, gameData }: { 
  fixture: EnhancedFixture; 
  useAbbreviation?: boolean; 
  compact?: boolean;
  gameData?: any;
}) => {
  const { isDarkMode } = useTheme();
  const { getTeamLogo } = useTeamDisplay();
  const teams = fixture.match.split(" x ").map(t => t.trim());
  const teamLogos = teams.map(t => getTeamLogo(t));
  
  const timeInfo = convertEdtToLocal(fixture.date, fixture.ko);
  
  const matchResult = getMatchResult(fixture, gameData);
  
  return (
    <TooltipProvider>
      <div className={cn(
        "border rounded-md bg-card hover:bg-muted/10 transition-colors h-full",
        compact ? "p-3" : "p-4",
        isDarkMode && "border-[#45CAFF]/30 bg-[#061F3F] hover:bg-[#061f3ff3]"
      )}>
        <div className={cn(
          "grid grid-cols-[1fr_auto_1fr] items-center gap-2",
          compact ? "mb-2" : "mb-3"
        )}>
          <TeamMatch 
            teamName={teams[0]} 
            logo={teamLogos[0]} 
            useAbbreviation={useAbbreviation}
            compact={compact}
          />
          <span className={cn(
            "font-bold px-2",
            compact ? "text-sm" : "text-base",
            isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
          )}>{matchResult}</span>
          <TeamMatch 
            teamName={teams[1]} 
            logo={teamLogos[1]} 
            isSecond 
            useAbbreviation={useAbbreviation}
            compact={compact}
          />
        </div>
        
        <div className={cn(
          "grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 border-t pt-2",
          compact ? "text-xs" : "text-sm",
          isDarkMode && "border-[#45CAFF]/30"
        )}>
          <Clock className={cn(
            "flex-shrink-0", 
            compact ? "h-3 w-3" : "h-4 w-4",
            isDarkMode ? "text-[#45CAFF]" : "text-blue-500"
          )} />
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={cn(
                "overflow-wrap-normal word-break-normal cursor-help",
                isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
              )}>
                {fixture.ko}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Para sua localidade o horário é: {timeInfo.localTime}</p>
            </TooltipContent>
          </Tooltip>
          
          <MapPin className={cn(
            "flex-shrink-0", 
            compact ? "h-3 w-3" : "h-4 w-4",
            isDarkMode ? "text-[#45CAFF]" : "text-blue-500"
          )} />
          <span className={cn(
            "overflow-wrap-normal word-break-normal",
            isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
          )}>{compact ? fixture.venue.split(',')[0] : fixture.venue}</span>
          
          <Users className={cn(
            "flex-shrink-0", 
            compact ? "h-3 w-3" : "h-4 w-4",
            isDarkMode ? "text-[#45CAFF]" : "text-blue-500"
          )} />
          <span className={cn(
            "overflow-wrap-normal word-break-normal",
            isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
          )}>
            {isPlayoffFixture(fixture) 
              ? translatePhase(fixture.phase)
              : fixture.groupName.replace('Group', 'Grupo')
            }
          </span>
        </div>
      </div>
    </TooltipProvider>
  );
};

export function MatchesCalendar({ 
  useAbbreviations = false, 
  compact = false, 
  maxMatches,
  maxWidth,
  standingsData,
  showPlayoffs = false,
  gamesData = []
}: MatchesCalendarProps = {}) {
  const { isDarkMode } = useTheme()

  const allFixtures = useMemo(() => {
    const fixtures: EnhancedFixture[] = [];
    
    if (showPlayoffs && standingsData) {
      const playoffFixtures = generatePlayoffFixtures(standingsData);
      playoffFixtures.forEach(fixture => {
        fixtures.push({
          ...fixture,
          groupName: translatePhase(fixture.phase)
        });
      });
    } else {
      fifaCwcData.groups.forEach(group => {
        group.fixtures.forEach(fixture => {
          fixtures.push({
            ...fixture,
            groupName: group.name
          });
        });
      });
    }
    
    const sorted = fixtures.sort((a, b) => {
      const dateA = parseDate(a.date, a.ko);
      const dateB = parseDate(b.date, b.ko);
      return dateA.getTime() - dateB.getTime();
    });

    return maxMatches ? sorted.slice(0, maxMatches) : sorted;
  }, [maxMatches, standingsData, showPlayoffs]);
  
  const fixturesByDate = useMemo(() => {
    return groupByDate(allFixtures);
  }, [allFixtures]);
  
  const sortedDates = useMemo(() => {
    const dates = Object.keys(fixturesByDate);
    return dates.sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA.getTime() - dateB.getTime();
    });
  }, [fixturesByDate]);

  return (
    <div style={maxWidth ? { maxWidth } : undefined}>
      {sortedDates.map(date => (
        <div key={date} className={compact ? "mb-4" : "mb-8"}>
          <div className={cn(
            "sticky top-0 z-10 bg-background border-b",
            compact ? "mb-2 py-3 px-2" : "mb-4 py-6 px-4",
            isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30"
          )}>
            <h2 className={cn(
              "font-bold flex items-center",
              compact ? "text-base" : "text-xl"
            )}>
              <Calendar className={cn(
                "mr-2",
                compact ? "h-4 w-4" : "h-5 w-5",
                isDarkMode ? "text-[#45CAFF]" : "text-primary"
              )} />
              <span className={cn(isDarkMode && "text-[#45CAFF]")}>
                {translateDate(date)}
              </span>
              <Badge 
                variant="outline" 
                className={cn(
                  "ml-2",
                  compact && "text-xs",
                  isDarkMode && "border-[#45CAFF]/30 text-[#D3ECFF]"
                )}
              >
                {fixturesByDate[date].length} partidas
              </Badge>
            </h2>
          </div>
          
          <div className={cn(
            "grid gap-3",
            compact 
              ? "grid-cols-1 sm:grid-cols-2" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          )}>
            {fixturesByDate[date].map((fixture, index) => (
              <MatchCard 
                key={index} 
                fixture={fixture} 
                useAbbreviation={useAbbreviations}
                compact={compact}
                gameData={gamesData?.find(game => 
                  game.value?.name?.shortText?.includes(fixture.match.split(' x ')[0]) &&
                  game.value?.name?.shortText?.includes(fixture.match.split(' x ')[1])
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 