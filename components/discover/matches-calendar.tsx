"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useState, useMemo } from "react"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useTeamDisplay } from "@/hooks/use-team-display"

type Fixture = {
  date: string;
  ko: string;
  match: string;
  venue: string;
  groupName: string;
};

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
}

// Component for team in match
const TeamMatch = ({ teamName, logo, isSecond }: TeamMatchProps) => {
  const { isDarkMode } = useTheme();
  const { getDisplayName, shouldUseAbbreviation } = useTeamDisplay();
  
  // Use abbreviation on smaller screens or for long team names
  const displayName = getDisplayName(teamName, {
    preferAbbreviation: shouldUseAbbreviation(teamName, undefined, window?.innerWidth < 768),
    maxLength: 15
  });
  
  return (
    <div className={`flex items-center gap-2 ${isSecond ? 'justify-start' : 'justify-end'}`}>
      {!isSecond && (
        <span className={cn(
          "font-medium text-sm overflow-wrap-normal word-break-normal",
          isDarkMode ? "text-[#45CAFF]" : ""
        )}>
          {displayName}
        </span>
      )}
      {logo && (
        <div className="relative h-7 w-7 flex-shrink-0">
          <Image 
            src={logo} 
            alt={teamName} 
            fill 
            className="object-contain"
            sizes="28px"
          />
        </div>
      )}
      {isSecond && (
        <span className={cn(
          "font-medium text-sm overflow-wrap-normal word-break-normal",
          isDarkMode ? "text-[#45CAFF]" : ""
        )}>
          {displayName}
        </span>
      )}
    </div>
  );
};

// Match Card Component for both mobile and desktop
const MatchCard = ({ fixture }: { fixture: Fixture }) => {
  const { isDarkMode } = useTheme();
  const { getTeamLogo } = useTeamDisplay();
  const teams = fixture.match.split(" x ").map(t => t.trim());
  const teamLogos = teams.map(t => getTeamLogo(t));
  
  return (
    <div className={cn(
      "border rounded-md p-4 bg-card hover:bg-muted/10 transition-colors h-full",
      isDarkMode && "border-[#45CAFF]/30 bg-[#061F3F] hover:bg-[#061f3ff3]"
    )}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-3">
        <TeamMatch teamName={teams[0]} logo={teamLogos[0]} />
        <span className={cn(
          "text-base font-bold px-2",
          isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
        )}>x</span>
        <TeamMatch teamName={teams[1]} logo={teamLogos[1]} isSecond />
      </div>
      
      <div className={cn(
        "grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm border-t pt-3",
        isDarkMode && "border-[#45CAFF]/30"
      )}>
        <Clock className={cn("h-4 w-4 flex-shrink-0", isDarkMode ? "text-[#45CAFF]" : "text-blue-500")} />
        <span className={cn(
          "overflow-wrap-normal word-break-normal",
          isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
        )}>{fixture.ko}</span>
        
        <MapPin className={cn("h-4 w-4 flex-shrink-0", isDarkMode ? "text-[#45CAFF]" : "text-blue-500")} />
        <span className={cn(
          "overflow-wrap-normal word-break-normal",
          isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
        )}>{fixture.venue}</span>
        
        <Users className={cn("h-4 w-4 flex-shrink-0", isDarkMode ? "text-[#45CAFF]" : "text-blue-500")} />
        <span className={cn(
          "overflow-wrap-normal word-break-normal",
          isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
        )}>
          {fixture.groupName.replace('Group', 'Grupo')}
        </span>
      </div>
    </div>
  );
};

export function MatchesCalendar() {
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
    return fixtures.sort((a, b) => {
      const dateA = parseDate(a.date, a.ko);
      const dateB = parseDate(b.date, b.ko);
      return dateA.getTime() - dateB.getTime();
    });
  }, []);
  
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
    <div>
      {sortedDates.map(date => (
        <div key={date} className="mb-8">
          <div className={cn(
            "sticky top-0 z-10 bg-background mb-4 py-6 px-4 border-b",
            isDarkMode && "bg-[#061F3F] border-[#45CAFF]/30"
          )}>
            <h2 className="text-xl font-bold flex items-center">
              <Calendar className={cn(
                "h-5 w-5 mr-2",
                isDarkMode ? "text-[#45CAFF]" : "text-primary"
              )} />
              <span className={cn(isDarkMode && "text-[#45CAFF]")}>
                {translateDate(date)}
              </span>
              <Badge 
                variant="outline" 
                className={cn(
                  "ml-2",
                  isDarkMode && "border-[#45CAFF]/30 text-[#D3ECFF]"
                )}
              >
                {fixturesByDate[date].length} partidas
              </Badge>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fixturesByDate[date].map((fixture, index) => (
              <MatchCard key={index} fixture={fixture} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 