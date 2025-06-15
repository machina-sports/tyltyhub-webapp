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
};

interface MatchesCalendarProps {
  useAbbreviations?: boolean;
  compact?: boolean;
  maxMatches?: number;
  maxWidth?: string;
}

// Helper to translate month names in dates
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

// Helper to parse and sort dates
const parseDate = (dateStr: string, timeStr: string): Date => {
  // Convert month names to their numeric values
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
  
  // Parse the date string (e.g., "June 15")
  const [month, day] = dateStr.split(' ');
  const monthNum = monthMap[month];
  
  // Extract hour from time (assuming format like "8:00 p.m. EDT")
  let [hourMin, period] = timeStr.split(' ');
  let [hour, minute] = hourMin.split(':').map(Number);
  
  // Convert to 24-hour format if PM
  if (period.toLowerCase().startsWith('p') && hour < 12) {
    hour += 12;
  }
  // Convert 12 AM to 0
  if (period.toLowerCase().startsWith('a') && hour === 12) {
    hour = 0;
  }
  
  // Use 2025 as the year for FIFA CWC
  return new Date(2025, parseInt(monthNum) - 1, parseInt(day), hour, minute);
}

// Function to group fixtures by date
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

// Component for team in match
const TeamMatch = ({ teamName, logo, isSecond, useAbbreviation = false, compact = false }: TeamMatchProps) => {
  const { isDarkMode } = useTheme();
  const { getDisplayName, shouldUseAbbreviation } = useTeamDisplay();
  
  // Use abbreviation based on props or screen constraints
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

// Helper to convert EDT time to user's local timezone
const convertEdtToLocal = (dateStr: string, timeStr: string) => {
  // Parse the EDT time (EDT is UTC-4)
  const edtDate = parseDate(dateStr, timeStr);
  
  // EDT is UTC-4, so we need to add 4 hours to get UTC, then convert to local
  const utcTime = new Date(edtDate.getTime() + (4 * 60 * 60 * 1000));
  
  // Format local time
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

// Match Card Component for both mobile and desktop
export const MatchCard = ({ fixture, useAbbreviation = false, compact = false }: { 
  fixture: Fixture; 
  useAbbreviation?: boolean; 
  compact?: boolean; 
}) => {
  const { isDarkMode } = useTheme();
  const { getTeamLogo } = useTeamDisplay();
  const teams = fixture.match.split(" x ").map(t => t.trim());
  const teamLogos = teams.map(t => getTeamLogo(t));
  
  // Convert time to local timezone
  const timeInfo = convertEdtToLocal(fixture.date, fixture.ko);
  
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
          )}>x</span>
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
            {fixture.groupName.replace('Group', 'Grupo')}
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
  maxWidth 
}: MatchesCalendarProps = {}) {
  const { isDarkMode } = useTheme();

  // Combine and sort all fixtures by date and time
  const allFixtures = useMemo(() => {
    const fixtures: Fixture[] = [];
    
    fifaCwcData.groups.forEach(group => {
      group.fixtures.forEach(fixture => {
        fixtures.push({
          ...fixture,
          groupName: group.name
        });
      });
    });
    
    // Sort by date and time
    const sorted = fixtures.sort((a, b) => {
      const dateA = parseDate(a.date, a.ko);
      const dateB = parseDate(b.date, b.ko);
      return dateA.getTime() - dateB.getTime();
    });

    // Limit matches if maxMatches is specified
    return maxMatches ? sorted.slice(0, maxMatches) : sorted;
  }, [maxMatches]);
  
  // Group fixtures by date for display
  const fixturesByDate = useMemo(() => {
    return groupByDate(allFixtures);
  }, [allFixtures]);
  
  // Get sorted dates
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
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 