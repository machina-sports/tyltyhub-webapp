"use client"

import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import teamsData from "@/data/teams.json"

// Team mapping interface
interface TeamInfo {
  id: string
  name: string
  abbreviation: string
  logo: string
}

// Helper function to get team info by abbreviation
const getTeamByAbbreviation = (abbreviation: string): TeamInfo | null => {
  if (!abbreviation) return null;
  
  const upperAbbr = abbreviation.toUpperCase();
  
  // Find team by abbreviation
  const team = teamsData.teams.find(team => 
    team.abbreviation.toUpperCase() === upperAbbr
  );
  
  return team || null;
};

// Helper function to get team by generated code from name
const getTeamByGeneratedCode = (teamName: string): TeamInfo | null => {
  if (!teamName) return null;
  
  // Try to find team by name match
  const team = teamsData.teams.find(team => 
    team.name.toLowerCase().includes(teamName.toLowerCase()) ||
    teamName.toLowerCase().includes(team.name.toLowerCase())
  );
  
  return team || null;
};

// Market data structure from the API
interface MarketOption {
  id: number
  name: {
    shortText: string
    text: string
  }
  price: {
    odds: number
  }
}

interface MarketData {
  id: number
  marketType: string
  name: {
    text: string
  }
  options: MarketOption[]
  title: string
  value?: number
}

interface RelatedOddsProps {
  currentArticleId?: MarketData
  teamHomeAbbreviation?: string
  teamAwayAbbreviation?: string
  teamHomeName?: string
  teamAwayName?: string
  eventDateTime?: string
}

// Transform market data to display format
const transformMarketToDisplay = (
  market: MarketData, 
  homeAbbr?: string, 
  awayAbbr?: string,
  homeName?: string,
  awayName?: string
) => {
  if (!market || !market.options || market.options.length === 0) {
    return null;
  }

  console.log('Transform market data:', {
    market,
    homeAbbr,
    awayAbbr,
    homeName,
    awayName
  });

  // Get team info using provided data
  const homeTeam = getTeamByAbbreviation(homeAbbr || '');
  const awayTeam = getTeamByAbbreviation(awayAbbr || '');
  
  console.log('Team detection result:', {
    homeTeam,
    awayTeam,
    homeName,
    awayName
  });

  // Use provided names or fallback to detected team names
  const finalHomeName = homeName || homeTeam?.name;
  const finalAwayName = awayName || awayTeam?.name;
  
  // Generate team codes
  const homeTeamCode = homeTeam?.abbreviation || homeAbbr || 'HOME';
  const awayTeamCode = awayTeam?.abbreviation || awayAbbr || 'AWAY';

  const result = {
    id: market.id.toString(),
    homeTeam: {
      name: finalHomeName || 'Home Team',
      code: homeTeamCode,
      logo: homeTeam?.logo || '/team-logos/default.png'
    },
    awayTeam: finalAwayName ? {
      name: finalAwayName,
      code: awayTeamCode,
      logo: awayTeam?.logo || '/team-logos/default.png'
    } : null,
    marketType: market.marketType,
    title: market.title || market.name.text,
    options: market.options,
    value: market.value
  };
  
  console.log('Final result:', result);
  return result;
};

export function RelatedOdds({ 
  currentArticleId, 
  teamHomeAbbreviation, 
  teamAwayAbbreviation,
  teamHomeName,
  teamAwayName,
  eventDateTime
}: RelatedOddsProps) {
  const { isDarkMode } = useTheme();
  
  if (!currentArticleId) {
    return null;
  }

  const marketData = transformMarketToDisplay(
    currentArticleId, 
    teamHomeAbbreviation, 
    teamAwayAbbreviation,
    teamHomeName,
    teamAwayName
  );
  
  if (!marketData) {
    return null;
  }

  // Format event datetime
  const formatEventTime = (dateTimeString?: string) => {
    if (!dateTimeString) return 'Agora';
    
    try {
      const eventDate = new Date(dateTimeString);
      const now = new Date();
      
      // If the event is in the past or very soon (within 1 hour), show "Agora"
      if (eventDate <= now || (eventDate.getTime() - now.getTime()) < 60 * 60 * 1000) {
        return 'Agora';
      }
      
      return `em ${formatDistanceToNow(eventDate, { locale: ptBR })}`;
    } catch (error) {
      return 'Agora';
    }
  };

  const handleOddsClick = (optionId: number, odds: number, optionName: string) => {
    // Track GA4 event for odds click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'odds_click', {
        event_category: 'odds_widget',
        event_action: 'click_odds_button',
        event_label: `${marketData.homeTeam.code} vs ${marketData.awayTeam?.code || 'TBD'} - ${optionName}`,
        market_id: marketData.id,
        market_type: marketData.marketType,
        market_title: marketData.title,
        option_id: optionId,
        odds_value: odds,
        home_team: marketData.homeTeam.code,
        away_team: marketData.awayTeam?.code || null,
        event_time: eventDateTime || null,
        value: odds
      });
    }

    const sportsbookUrl = `/sportsbook/${marketData.id}/${optionId}?odds=${encodeURIComponent(odds)}`;
    window.open(sportsbookUrl, '_blank');
  };

  const OddsButton = ({ option }: { option: MarketOption }) => {
    if (!option.price?.odds || option.price.odds <= 0) {
      return (
        <div className={cn(
          "text-sm px-3 py-1.5 font-semibold rounded-md opacity-50 cursor-not-allowed",
          isDarkMode 
            ? "bg-gray-600 text-gray-400 border border-gray-500" 
            : "bg-gray-200 text-gray-500 border border-gray-300"
        )}>
          N/A
        </div>
      );
    }

    return (
      <button
        onClick={() => handleOddsClick(option.id, option.price.odds, option.name.shortText || option.name.text)}
        className={cn(
          "text-sm px-3 py-1.5 font-semibold rounded-md transition-all duration-200",
          isDarkMode 
            ? "bg-[#45CAFF]/20 text-[#45CAFF] hover:bg-[#45CAFF]/30 border border-[#45CAFF]/40 hover:border-[#45CAFF]/60" 
            : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary/50"
        )}
      >
        {option.price.odds.toFixed(2)}
      </button>
    );
  };

  return (
    <Card className={cn(
      "overflow-hidden max-w-[420px] ml-3 rounded-2xl",
      isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "border-border"
    )}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Home Team */}
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image
                src={marketData.homeTeam.logo}
                alt={marketData.homeTeam.name}
                fill
                className="object-contain rounded-sm"
                sizes="24px"
              />
            </div>
            <span className={cn(
              "font-semibold text-sm truncate",
              isDarkMode ? "text-[#D3ECFF]" : "text-foreground"
            )}>
              {marketData.homeTeam.code}
            </span>
            
            {/* Away Team - Show if available */}
            {marketData.awayTeam && (
              <>
                <span className={cn(
                  "text-xs mx-1 flex-shrink-0",
                  isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
                )}>
                  vs
                </span>
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image
                    src={marketData.awayTeam.logo}
                    alt={marketData.awayTeam.name}
                    fill
                    className="object-contain rounded-sm"
                    sizes="24px"
                  />
                </div>
                <span className={cn(
                  "font-semibold text-sm truncate",
                  isDarkMode ? "text-[#D3ECFF]" : "text-foreground"
                )}>
                  {marketData.awayTeam.code}
                </span>
              </>
            )}
          </div>
          <div className={cn(
            "text-xs flex-shrink-0 ml-2",
            isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
          )}>
            {formatEventTime(eventDateTime)}
          </div>
        </div>

        {/* Market Title */}
        <div className={cn(
          "text-xs font-medium text-center mb-3",
          isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
        )}>
          {marketData.title}
        </div>

        {/* Options */}
        <div className={cn(
          "grid gap-2 items-end",
          marketData.options.length === 2 ? "grid-cols-2" : "grid-cols-3"
        )}>
          {marketData.options.map((option) => (
            <div key={option.id} className="text-center space-y-2">
              <div className={cn(
                "text-xs font-medium",
                isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
              )}>
                {option.name.shortText || option.name.text}
              </div>
              <OddsButton option={option} />
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className={cn(
          "text-xs text-center mt-4",
          isDarkMode ? "text-[#D3ECFF]/50" : "text-muted-foreground"
        )}>
          Odds atualizadas {formatDistanceToNow(new Date(), { addSuffix: true, locale: ptBR })}
        </p>
      </div>
    </Card>
  );
} 