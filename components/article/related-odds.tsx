"use client"

import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from 'date-fns/locale'
import Image from "next/image"
import Link from "next/link"
import { useGlobalState } from "@/store/useState"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

interface OddsData {
  id: string
  homeTeam: {
    name: string
    code: string
    logo?: string
  }
  awayTeam: {
    name: string
    code: string
    logo?: string
  }
  matchDate: string
  matchTime: string
  odds: {
    // Resultado 1X2
    resultado1x2?: {
      home: string
      draw: string
      away: string
    }
    // Mais/Menos (Over/Under)
    maisLenos?: {
      over25: string
      under25: string
      over35: string
      under35: string
    }
    // Ambas as equipes marcam
    ambasEquipesMarcam?: {
      sim: string
      nao: string
    }
    // Próximo gol
    proximoGol?: {
      home: string
      away: string
      nenhum: string
    }
    // Chance Dupla
    chanceDupla?: {
      homeOrDraw: string // 1X
      awayOrDraw: string // X2
      homeOrAway: string // 12
    }
    // 1X2 e ambas as equipes marcam
    resultado1x2EAmbas?: {
      homeESim: string
      homeENao: string
      drawESim: string
      drawENao: string
      awayESim: string
      awayENao: string
    }
    // 1X2 & Mais de 2,5
    resultado1x2EMais25?: {
      homeEMais: string
      homeEMenos: string
      drawEMais: string
      drawEMenos: string
      awayEMais: string
      awayEMenos: string
    }
  }
  lastUpdated: string
}

interface RelatedOddsProps {
  currentArticleId?: string
  limit?: number
}

// Dummy data - replace with actual API call later
const getDummyOdds = (): OddsData[] => [
  {
    id: "1",
    homeTeam: { name: "Real Madrid", code: "RMA", logo: "/team-logos/real-madrid.png" },
    awayTeam: { name: "Manchester City", code: "MCI", logo: "/team-logos/manchester-city.png" },
    matchDate: "2024-12-18",
    matchTime: "16:00",
    odds: {
      resultado1x2: {
        home: "2.20",
        draw: "3.40",
        away: "2.90"
      },
      maisLenos: {
        over25: "1.80",
        under25: "2.05",
        over35: "2.85",
        under35: "1.45"
      },
      ambasEquipesMarcam: {
        sim: "1.75",
        nao: "2.10"
      },
      proximoGol: {
        home: "1.95",
        away: "2.30",
        nenhum: "4.50"
      },
      chanceDupla: {
        homeOrDraw: "1.30",
        awayOrDraw: "1.65",
        homeOrAway: "1.25"
      },
      resultado1x2EAmbas: {
        homeESim: "5.50",
        homeENao: "1.85",
        drawESim: "5.25",
        drawENao: "4.20",
        awayESim: "11.00",
        awayENao: "2.45"
      }
    },
    lastUpdated: "2024-12-15T14:30:00Z"
  },
  {
    id: "2",
    homeTeam: { name: "Paris Saint-Germain", code: "PSG", logo: "/team-logos/paris-saint-germain.png" },
    awayTeam: { name: "Bayern Munich", code: "BAY", logo: "/team-logos/bayern-munich.png" },
    matchDate: "2024-12-19",
    matchTime: "20:30",
    odds: {
      resultado1x2: {
        home: "2.45",
        draw: "3.25",
        away: "2.65"
      },
      maisLenos: {
        over25: "1.65",
        under25: "2.25",
        over35: "2.40",
        under35: "1.60"
      },
      ambasEquipesMarcam: {
        sim: "1.65",
        nao: "2.25"
      },
      proximoGol: {
        home: "2.10",
        away: "2.15",
        nenhum: "4.20"
      },
      chanceDupla: {
        homeOrDraw: "1.45",
        awayOrDraw: "1.55",
        homeOrAway: "1.30"
      },
      resultado1x2EAmbas: {
        homeESim: "4.80",
        homeENao: "1.95",
        drawESim: "4.60",
        drawENao: "3.80",
        awayESim: "9.50",
        awayENao: "2.25"
      }
    },
    lastUpdated: "2024-12-15T16:45:00Z"
  }
];

export function RelatedOdds({ currentArticleId, limit = 4 }: RelatedOddsProps) {
  // TODO: Replace with actual global state when backend is ready
  // const odds = useGlobalState((state: any) => state.odds);
  const { isDarkMode } = useTheme();
  
  // Using dummy data for now - replace with filtered odds from global state
  const relatedOdds = getDummyOdds().slice(0, limit);

  if (relatedOdds.length === 0) {
    return null;
  }

  const formatMatchDate = (date: string, time: string) => {
    const matchDate = new Date(`${date}T${time}`);
    return matchDate.toLocaleDateString('pt-BR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).toUpperCase();
  };

  const getTeamLogo = (logo?: string) => {
    if (!logo) return 'https://placehold.co/40x40?text=?';
    return logo.startsWith('http') ? logo : logo;
  };

  const handleOddsClick = (matchId: string, betType: string, value: string) => {
    // TODO: Replace with actual sportsbook URL when backend is ready
    const sportsbookUrl = `/sportsbook/${matchId}/${betType}?odds=${encodeURIComponent(value)}`;
    window.open(sportsbookUrl, '_blank');
  };

  const OddsButton = ({ 
    value, 
    matchId, 
    betType,
    size = 'sm' 
  }: { 
    value: string; 
    matchId: string; 
    betType: string;
    size?: 'xs' | 'sm';
  }) => (
    <button
      onClick={() => handleOddsClick(matchId, betType, value)}
      className={cn(
        "font-semibold rounded-md transition-all duration-200",
        size === 'xs' ? "text-xs px-2 py-1" : "text-sm px-3 py-1.5",
        isDarkMode 
          ? "bg-[#45CAFF]/20 text-[#45CAFF] hover:bg-[#45CAFF]/30 border border-[#45CAFF]/40 hover:border-[#45CAFF]/60" 
          : "bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30 hover:border-primary/50"
      )}
    >
      {value}
    </button>
  );

  const MatchHeader = ({ match }: { match: OddsData }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src={getTeamLogo(match.homeTeam.logo)}
              alt={match.homeTeam.name}
              fill
              className="object-contain rounded-sm"
              sizes="24px"
            />
          </div>
          <span className={cn(
            "font-semibold text-sm",
            isDarkMode ? "text-[#D3ECFF]" : "text-foreground"
          )}>
            {match.homeTeam.code}
          </span>
        </div>
        <span className={cn(
          "text-sm",
          isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
        )}>
          @
        </span>
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src={getTeamLogo(match.awayTeam.logo)}
              alt={match.awayTeam.name}
              fill
              className="object-contain rounded-sm"
              sizes="24px"
            />
          </div>
          <span className={cn(
            "font-semibold text-sm",
            isDarkMode ? "text-[#D3ECFF]" : "text-foreground"
          )}>
            {match.awayTeam.code}
          </span>
        </div>
      </div>
      <div className={cn(
        "text-xs",
        isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
      )}>
        {formatMatchDate(match.matchDate, match.matchTime)}
      </div>
    </div>
  );

  const BetTypeWidgets = {
    Resultado1X2: ({ match }: { match: OddsData }) => {
      if (!match.odds.resultado1x2) return null;
      return (
        <div className="space-y-3">
          <div className={cn(
            "text-xs font-medium text-center",
            isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground"
          )}>
            Resultado 1X2
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>1</div>
              <OddsButton value={match.odds.resultado1x2.home} matchId={match.id} betType="home-win" size="sm" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>X</div>
              <OddsButton value={match.odds.resultado1x2.draw} matchId={match.id} betType="draw" size="sm" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>2</div>
              <OddsButton value={match.odds.resultado1x2.away} matchId={match.id} betType="away-win" size="sm" />
            </div>
          </div>
        </div>
      );
    },

    MaisLenos: ({ match }: { match: OddsData }) => {
      if (!match.odds.maisLenos) return null;
      return (
        <div className="space-y-3">
          <div className={cn("text-xs font-medium text-center", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>
            Mais/Menos
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>+2.5</div>
              <OddsButton value={match.odds.maisLenos.over25} matchId={match.id} betType="over25" size="sm" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>-2.5</div>
              <OddsButton value={match.odds.maisLenos.under25} matchId={match.id} betType="under25" size="sm" />
            </div>
          </div>
        </div>
      );
    },

    AmbasEquipesMarcam: ({ match }: { match: OddsData }) => {
      if (!match.odds.ambasEquipesMarcam) return null;
      return (
        <div className="space-y-3">
          <div className={cn("text-xs font-medium text-center", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>
            Ambas as equipes marcam
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>Sim</div>
              <OddsButton value={match.odds.ambasEquipesMarcam.sim} matchId={match.id} betType="both-score-yes" size="sm" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>Não</div>
              <OddsButton value={match.odds.ambasEquipesMarcam.nao} matchId={match.id} betType="both-score-no" size="sm" />
            </div>
          </div>
        </div>
      );
    },

    ProximoGol: ({ match }: { match: OddsData }) => {
      if (!match.odds.proximoGol) return null;
      return (
        <div className="space-y-3">
          <div className={cn("text-xs font-medium text-center", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>
            Próximo gol
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>{match.homeTeam.code}</div>
              <OddsButton value={match.odds.proximoGol.home} matchId={match.id} betType="next-goal-home" size="xs" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>Nenhum</div>
              <OddsButton value={match.odds.proximoGol.nenhum} matchId={match.id} betType="next-goal-none" size="xs" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>{match.awayTeam.code}</div>
              <OddsButton value={match.odds.proximoGol.away} matchId={match.id} betType="next-goal-away" size="xs" />
            </div>
          </div>
        </div>
      );
    },

    ChanceDupla: ({ match }: { match: OddsData }) => {
      if (!match.odds.chanceDupla) return null;
      return (
        <div className="space-y-3">
          <div className={cn("text-xs font-medium text-center", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>
            Chance Dupla
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>1 ou X</div>
              <OddsButton value={match.odds.chanceDupla.homeOrDraw} matchId={match.id} betType="double-chance-1x" size="xs" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>X ou 2</div>
              <OddsButton value={match.odds.chanceDupla.awayOrDraw} matchId={match.id} betType="double-chance-x2" size="xs" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>1 ou 2</div>
              <OddsButton value={match.odds.chanceDupla.homeOrAway} matchId={match.id} betType="double-chance-12" size="xs" />
            </div>
          </div>
        </div>
      );
    },

    Resultado1X2EAmbas: ({ match }: { match: OddsData }) => {
      if (!match.odds.resultado1x2EAmbas) return null;
      return (
        <div className="space-y-3">
          <div className={cn("text-xs font-medium text-center", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>
            1X2 e ambas as equipes marcam
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>Sim & 1</div>
              <OddsButton value={match.odds.resultado1x2EAmbas.homeESim} matchId={match.id} betType="1x2-both-score-home" size="xs" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>Sim & X</div>
              <OddsButton value={match.odds.resultado1x2EAmbas.drawESim} matchId={match.id} betType="1x2-both-score-draw" size="xs" />
            </div>
            <div className="text-center space-y-2">
              <div className={cn("text-xs font-medium", isDarkMode ? "text-[#D3ECFF]/70" : "text-muted-foreground")}>Sim & 2</div>
              <OddsButton value={match.odds.resultado1x2EAmbas.awayESim} matchId={match.id} betType="1x2-both-score-away" size="xs" />
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Resultado 1X2 */}
      <div className="space-y-4">
        <h3 className={cn("text-lg font-semibold", isDarkMode ? "text-[#D3ECFF]" : "text-foreground")}>
          Resultado 1X2
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {relatedOdds.map((match: OddsData) => (
            <Card key={`1x2-${match.id}`} className={cn(
              "overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[320px] max-w-[320px]",
              isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "border-border"
            )}>
              <div className="p-4 w-full">
                <MatchHeader match={match} />
                <BetTypeWidgets.Resultado1X2 match={match} />
                <p className={cn("text-xs text-center mt-3", isDarkMode ? "text-[#D3ECFF]/50" : "text-muted-foreground")}>
                  Odds atualizadas {formatDistanceToNow(new Date(match.lastUpdated), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Mais/Menos */}
      <div className="space-y-4">
        <h3 className={cn("text-lg font-semibold", isDarkMode ? "text-[#D3ECFF]" : "text-foreground")}>
          Mais/Menos
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {relatedOdds.map((match: OddsData) => (
            <Card key={`mais-menos-${match.id}`} className={cn(
              "overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[320px] max-w-[320px]",
              isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "border-border"
            )}>
              <div className="p-4 w-full">
                <MatchHeader match={match} />
                <BetTypeWidgets.MaisLenos match={match} />
                <p className={cn("text-xs text-center mt-3", isDarkMode ? "text-[#D3ECFF]/50" : "text-muted-foreground")}>
                  Odds atualizadas {formatDistanceToNow(new Date(match.lastUpdated), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Ambas as equipes marcam */}
      <div className="space-y-4">
        <h3 className={cn("text-lg font-semibold", isDarkMode ? "text-[#D3ECFF]" : "text-foreground")}>
          Ambas as equipes marcam
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {relatedOdds.map((match: OddsData) => (
            <Card key={`ambas-marcam-${match.id}`} className={cn(
              "overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[320px] max-w-[320px]",
              isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "border-border"
            )}>
              <div className="p-4 w-full">
                <MatchHeader match={match} />
                <BetTypeWidgets.AmbasEquipesMarcam match={match} />
                <p className={cn("text-xs text-center mt-3", isDarkMode ? "text-[#D3ECFF]/50" : "text-muted-foreground")}>
                  Odds atualizadas {formatDistanceToNow(new Date(match.lastUpdated), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Próximo gol */}
      <div className="space-y-4">
        <h3 className={cn("text-lg font-semibold", isDarkMode ? "text-[#D3ECFF]" : "text-foreground")}>
          Próximo gol
        </h3>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {relatedOdds.map((match: OddsData) => (
            <Card key={`proximo-gol-${match.id}`} className={cn(
              "overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[320px] max-w-[320px]",
              isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "border-border"
            )}>
              <div className="p-4 w-full">
                <MatchHeader match={match} />
                <BetTypeWidgets.ProximoGol match={match} />
                <p className={cn("text-xs text-center mt-3", isDarkMode ? "text-[#D3ECFF]/50" : "text-muted-foreground")}>
                  Odds atualizadas {formatDistanceToNow(new Date(match.lastUpdated), { addSuffix: true, locale: ptBR })}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

             {/* Chance Dupla */}
       <div className="space-y-4">
         <h3 className={cn("text-lg font-semibold", isDarkMode ? "text-[#D3ECFF]" : "text-foreground")}>
           Chance Dupla
         </h3>
         <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
           {relatedOdds.map((match: OddsData) => (
             <Card key={`chance-dupla-${match.id}`} className={cn(
               "overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[320px] max-w-[320px]",
               isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "border-border"
             )}>
               <div className="p-4 w-full">
                 <MatchHeader match={match} />
                 <BetTypeWidgets.ChanceDupla match={match} />
                 <p className={cn("text-xs text-center mt-3", isDarkMode ? "text-[#D3ECFF]/50" : "text-muted-foreground")}>
                   Odds atualizadas {formatDistanceToNow(new Date(match.lastUpdated), { addSuffix: true, locale: ptBR })}
                 </p>
               </div>
             </Card>
           ))}
         </div>
       </div>

       {/* 1X2 e ambas as equipes marcam */}
       <div className="space-y-4">
         <h3 className={cn("text-lg font-semibold", isDarkMode ? "text-[#D3ECFF]" : "text-foreground")}>
           1X2 e ambas as equipes marcam
         </h3>
         <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
           {relatedOdds.map((match: OddsData) => (
             <Card key={`1x2-ambas-${match.id}`} className={cn(
               "overflow-hidden flex-none first:ml-0 last:mr-4 min-w-[320px] max-w-[320px]",
               isDarkMode ? "bg-[#061F3F] border-[#45CAFF]/30" : "border-border"
             )}>
               <div className="p-4 w-full">
                 <MatchHeader match={match} />
                 <BetTypeWidgets.Resultado1X2EAmbas match={match} />
                 <p className={cn("text-xs text-center mt-3", isDarkMode ? "text-[#D3ECFF]/50" : "text-muted-foreground")}>
                   Odds atualizadas {formatDistanceToNow(new Date(match.lastUpdated), { addSuffix: true, locale: ptBR })}
                 </p>
               </div>
             </Card>
           ))}
         </div>
       </div>
     </div>
  )
} 