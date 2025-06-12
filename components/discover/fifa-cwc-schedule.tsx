"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import teamsData from "@/data/teams.json"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useMemo } from "react"
import { ChevronDown, Calendar, Clock, MapPin, Users, Sparkles } from "lucide-react"
import { useGlobalState } from "@/store/useState"
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

// Helper function to normalize team names for logo lookup
const normalizeTeamName = (name: string): string => {
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
};

// Helper function to find team logo by name
const findTeamLogo = (abbreviation: string): string | undefined => {
  const normalizedName = abbreviation.toLowerCase().replace(/ /g, '-')
  const team = teamsData.teams.find(t => 
    t.name.toLowerCase() === abbreviation.toLowerCase() || 
    t.abbreviation === abbreviation
  )
  return team?.logo
}

// Helper to find team league
const findTeamLeague = (teamName: string): string | undefined => {
  const normalizedName = teamName.toLowerCase().replace(/ /g, '-')
  const team = teamsData.teams.find(t => t.id === normalizedName)
  return team?.league
}

// Helper to find team abbreviation
const findTeamAbbreviation = (teamName: string): string | undefined => {
  const normalizedName = teamName.toLowerCase().replace(/ /g, '-')
  const team = teamsData.teams.find(t => t.id === normalizedName)
  return team?.abbreviation
}

// Function to generate AI insights for each team
const generateTeamInsight = (teamName: string): string => {
  const insights: Record<string, string> = {
    "Al Ahly": "Clube mais vitorioso da África com força em contra-ataques rápidos e muita experiência em torneios internacionais. Sua organização defensiva é um ponto forte, com capacidade de transições velozes para o ataque.",
    "Inter Miami": "Liderado por Messi, tem estilo de jogo técnico e pode surpreender os favoritos com criatividade em jogadas individuais. O time americano aposta na experiência de suas estrelas e na integração com jovens talentos para enfrentar adversários tradicionais.",
    "Palmeiras": "Forte taticamente sob comando de Abel Ferreira, com defesa sólida e ataque eficiente. Favorito do grupo, o Verdão se destaca pela consistência e repertório tático variado, alternando entre posse de bola e contra-ataques precisos conforme a necessidade.",
    "Porto": "Time europeu experiente com tradição internacional, joga com intensidade e forte marcação no meio-campo. Os Dragões costumam explorar bem as bolas paradas e têm grande capacidade de adaptação a diferentes cenários de jogo.",
    "Atletico Madrid": "Conhecido pelo estilo defensivo de Simeone, tem transições rápidas e grande capacidade de adaptação tática. A equipe espanhola se destaca pelo comprometimento defensivo e eficiência nas poucas chances criadas, sendo especialista em jogos decisivos.",
    "Paris Saint-Germain": "Equipe estelar com jogadores de classe mundial, busca domínio de posse e ataques rápidos pelos flancos. Apostando na velocidade e na qualidade técnica individual, o time parisiense tem grande capacidade de decidir partidas em lampejos de genialidade.",
    "Botafogo": "Equipe em ascensão, propõe jogo ofensivo e tem excelente qualidade técnica no meio-campo e ataque. Com investimento recente, o Glorioso apresenta futebol moderno, com jogadores técnicos e velozes, especialmente em contra-ataques.",
    "Seattle Sounders": "Franquia mais consistente da MLS, joga com muita intensidade física e forte nos contra-ataques. O time americano é conhecido pela organização tática e pela força nas bolas aéreas, explorando bem as jogadas pelos flancos.",
    "Bayern Munich": "Gigante europeu com estilo de jogo dominante, ofensivo e com pressão alta. Entre os grandes favoritos, os bávaros contam com elenco de estrelas e tradição em grandes competições, aliado a um futebol de alta intensidade e precisão técnica.",
    "Auckland City": "Representante da Oceania com pouca exposição internacional, aposta em organização defensiva e contra-ataques. A equipe neozelandesa se destaca pela disciplina tática e pela união do grupo, compensando limitações técnicas com esforço coletivo.",
    "Boca Juniors": "Time argentino com tradição internacional, forte nas bolas paradas e com grande presença na área adversária. Os Xeneizes contam com a mística de sua história e a pressão imposta aos adversários, aliada a jogadores experientes em decisões.",
    "Benfica": "Equipe portuguesa técnica que valoriza a posse de bola e construção de jogadas desde o campo defensivo. As Águias apostam na formação de jovens talentos combinados com experiência internacional, além da capacidade de transições rápidas.",
    "Chelsea": "Equipe inglesa com elenco valioso e versátil, alterando entre domínio de posse e jogo rápido pelas pontas. Os Blues trazem a intensidade física da Premier League aliada à qualidade técnica de um elenco recheado de opções para diferentes sistemas táticos.",
    "Leon": "Representa o México com estilo tipicamente latino-americano, técnico e dinâmico especialmente nas transições. A equipe se destaca pela qualidade técnica individual de seus atletas e pela capacidade de criar desequilíbrios em jogadas individuais.",
    "Flamengo": "Elenco poderoso no contexto sul-americano, com jogadores decisivos e proposta ofensiva arrojada. O Rubro-Negro carioca conta com investimento consistente e mistura de experiência internacional com talentosos atletas formados em casa.",
    "Espérance de Tunis": "Força do futebol tunisiano que aposta em solidez defensiva e velocidade nas transições. O clube norte-africano é conhecido pela organização tática e capacidade de adaptação a diferentes estilos de adversários, especialmente em sua fortaleza como mandante.",
    "River Plate": "Um dos gigantes da América do Sul, com estilo clássico argentino de posse de bola e passes triangulados. Os Millonarios têm tradição de formar grandes talentos e manter um estilo ofensivo, valorizando a construção paciente e chegada ao ataque com muitos jogadores.",
    "Urawa Red Diamonds": "Representante japonês disciplinado taticamente, com forte organização coletiva e transições rápidas. A equipe se destaca pela preparação física e constância durante os 90 minutos, além da capacidade técnica acima da média para o futebol asiático.",
    "Monterrey": "Clube mexicano com investimento consistente, combinando força física e qualidade técnica latino-americana. Os Rayados contam com jogadores experientes internacionalmente e boa estrutura, o que os coloca como um adversário respeitável para qualquer equipe.",
    "Inter Milan": "Campeão italiano com forte estrutura defensiva e ataque eficiente, especialista em jogos de confronto direto. A equipe nerazzurri mantém a tradição italiana de solidez tática, mas com toques modernos de velocidade e criatividade ofensiva.",
    "Fluminense": "Campeão da Libertadores com estilo definido de jogo de posse, triangulações e saída curta desde o goleiro. Sob comando de Fernando Diniz, o Tricolor traz uma proposta de futebol diferenciada, com valorização extrema da posse e construção com muitos passes.",
    "Borussia Dortmund": "Equipe alemã de ataque intenso, transições verticais rápidas e força no apoio de sua torcida. O time aurinegro se caracteriza pela velocidade ofensiva e capacidade de pressionar a saída de bola adversária, além da tradicional qualidade na formação de jovens talentos.",
    "Ulsan HD": "Campeão coreano que se destaca pela organização tática e forte preparação física dos atletas. A equipe sul-coreana aposta na intensidade do início ao fim das partidas e no trabalho coletivo para superar adversários tecnicamente mais qualificados.",
    "Mamelodi Sundowns": "Potência sul-africana que joga futebol técnico e dinâmico, com atletas fisicamente fortes. O time se diferencia no contexto africano pela proposta ofensiva e estrutura profissional, com investimentos consistentes em infraestrutura e contratações.",
    "Manchester City": "Equipe de Guardiola é um dos grandes favoritos, com domínio absoluto de posse e construção paciente de jogadas. Os Citizens representam o ápice do futebol moderno e controlado, com movimentações sincronizadas e jogadores de altíssimo nível técnico em todas as posições.",
    "Wydad AC": "Clube marroquino forte fisicamente e sólido defensivamente, especialista em jogos de confronto direto. A equipe norte-africana conta com a experiência em competições continentais e a capacidade de neutralizar equipes tecnicamente superiores.",
    "Al Ain": "Representa os Emirados Árabes com estilo técnico, valorização da posse e combatividade no meio-campo. O clube combina jogadores locais com estrangeiros experientes, resultando em um futebol equilibrado e competitivo no contexto asiático.",
    "Juventus": "A tradicional 'Vecchia Signora' italiana se destaca pela organização defensiva e eficiência nas finalizações. O clube de Turim mantém a solidez tática característica do futebol italiano, combinada com individualidades capazes de decidir jogos em lances isolados.",
    "Real Madrid": "Atual campeão europeu e maior clube do mundo, combina talento individual e experiência em decisões. Os Merengues são favoritos em qualquer competição, com um elenco estrelado e mentalidade vencedora construída ao longo de décadas de história.",
    "Al Hilal": "Potência saudita com investimentos recentes em estrelas internacionais, joga com ritmo intenso e proposição ofensiva. O clube representa a nova era do futebol árabe, com capacidade financeira para atrair grandes nomes e montar equipes competitivas globalmente.",
    "Pachuca": "Clube mexicano com forte investimento em jovens talentos, estilo dinâmico e vertical de ataque. Conhecidos por seu excelente trabalho de base, apostam em um futebol moderno, com pressão alta e transições rápidas para o campo ofensivo.",
    "Red Bull Salzburg": "Representante austríaco com estilo Red Bull de jogo: pressão alta, intensidade e velocidade nas transições. A equipe segue a filosofia global da marca, revelando jovens talentos e apresentando futebol vertical e agressivo, sempre buscando o gol adversário."
  };
  
  return insights[teamName] || "Equipe com estilo próprio e características táticas interessantes para acompanhar no torneio. O time apresenta um equilíbrio entre organização defensiva e capacidade ofensiva, podendo surpreender adversários que os subestimem.";
};

// Translation helper for leagues
const translateLeague = (league: string): string => {
  const translations: Record<string, string> = {
    "LaLiga": "LaLiga Espanhola",
    "Premier League": "Premier League Inglesa",
    "Bundesliga": "Bundesliga Alemã",
    "Serie A": "Serie A Italiana",
    "Ligue 1": "Ligue 1 Francesa",
    "Primeira Liga": "Primeira Liga Portuguesa",
    "MLS": "Major League Soccer (EUA)",
    "Liga MX": "Liga MX (México)",
    "K League 1": "K League 1 (Coreia do Sul)",
    "J1 League": "J1 League (Japão)",
    "Saudi Pro League": "Saudi Pro League (Arábia Saudita)",
    "UAE Pro League": "UAE Pro League (Emirados Árabes)",
  }
  
  return translations[league] || league
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

// Team Card Component with AI insights
const TeamCard = ({ teamName }: { teamName: string }) => {
  const { isDarkMode } = useTheme();
  const { getTeamLogo, getTeamLeague } = useTeamDisplay();
  const logo = getTeamLogo(teamName);
  const league = getTeamLeague(teamName);
  const insight = generateTeamInsight(teamName);
  
  return (
    <div className={cn(
      "border rounded-lg p-4 hover:bg-muted/30 transition-colors h-full flex flex-col",
      isDarkMode ? "border-[#45CAFF]/30 bg-[#061F3F] hover:bg-[#061f3ff3]" : ""
    )}>
      <div className="flex items-start gap-3 mb-3">
        {logo && (
          <div className="relative h-14 w-14 flex-shrink-0 mt-1">
            <Image 
              src={logo} 
              alt={teamName} 
              fill 
              className="object-contain"
              sizes="56px"
            />
          </div>
        )}
        <div className="min-w-0 space-y-1">
          <h3 className={cn(
            "text-sm font-semibold overflow-wrap-normal word-break-normal",
            isDarkMode ? "text-[#45CAFF]" : "text-foreground"
          )}>
            {teamName}
          </h3>
          {league && (
            <p className={cn(
              "text-xs overflow-wrap-normal word-break-normal",
              isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
            )}>
              {translateLeague(league)}
            </p>
          )}
        </div>
      </div>
      
      <div className={cn(
        "mt-1 pt-3 border-t text-sm flex-1",
        isDarkMode && "border-[#45CAFF]/30"
      )}>
        <div className={cn(
          "flex items-center gap-1.5 mb-2", 
          isDarkMode ? "text-[#45CAFF]" : "text-blue-600"
        )}>
          <Sparkles className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">Análise IA</span>
        </div>
        <div className={cn(
          "text-xs leading-relaxed space-y-1.5 overflow-auto max-h-[12rem]",
          isDarkMode ? "text-[#D3ECFF]" : "text-muted-foreground"
        )}>
          {insight.split('. ').map((sentence, index) => 
            sentence ? (
              <p key={index} className="overflow-wrap-normal word-break-normal">
                {sentence}{sentence.endsWith('.') ? '' : '.'}
              </p>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
};

// Date section component for mobile
const DateSection = ({ date, fixtures }: { date: string; fixtures: Fixture[] }) => {
  const [isOpen, setIsOpen] = useState(true);
  const translatedDate = translateDate(date);
  const { isDarkMode } = useTheme();
  
  return (
    <div className="mb-6">
      <button 
        className="w-full p-3 flex items-center justify-between bg-primary/10 text-left rounded-t-lg border-b"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-bold text-lg flex items-center">
          <Calendar className={cn("h-5 w-5 mr-2", isDarkMode ? "text-[#45CAFF]" : "")} />
          {translatedDate}
        </h3>
        <Badge>{fixtures.length} partidas</Badge>
      </button>
      
      {isOpen && (
        <div className="space-y-3 p-2">
          {fixtures.map((fixture, index) => (
            <MatchCard key={index} fixture={fixture} />
          ))}
        </div>
      )}
    </div>
  );
};

export function FifaCwcSchedule() {
  const { data: standingsData, status } = useGlobalState(state => state.standings)
  const { isDarkMode } = useTheme() 
  const { getDisplayName, getTeamLogo, shouldUseAbbreviation } = useTeamDisplay()
  const groups = standingsData?.value?.data[0]?.groups || []

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
    <div className="space-y-8">
      <Card className={cn(isDarkMode && "border-[#45CAFF]/30 bg-[#061F3F]")}>
        <CardHeader>
          <CardTitle className={cn("text-2xl", isDarkMode && "text-[#45CAFF]")}>
            {fifaCwcData.tournamentInfo.name}
          </CardTitle>
          <CardDescription className={cn(isDarkMode && "text-[#D3ECFF]")}>
            {fifaCwcData.tournamentInfo.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="clubs-view" className="w-full">
        <TabsList className={cn(
          "grid w-full grid-cols-3",
          isDarkMode && "bg-[#45CAFF] border-[#45CAFF]/30"
        )}>
          <TabsTrigger 
            value="clubs-view"
            className={cn(
              isDarkMode && "text-[#061F3F] data-[state=active]:bg-[#061F3F] data-[state=active]:text-[#D3ECFF]"
            )}
          >
            Clubes
          </TabsTrigger>
          <TabsTrigger 
            value="teams-view"
            className={cn(
              isDarkMode && "text-[#061F3F] data-[state=active]:bg-[#061F3F] data-[state=active]:text-[#D3ECFF]"
            )}
          >
            Classificação
          </TabsTrigger>
          <TabsTrigger 
            value="matches-view"
            className={cn(
              isDarkMode && "text-[#061F3F] data-[state=active]:bg-[#061F3F] data-[state=active]:text-[#D3ECFF]"
            )}
          >
            Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clubs-view" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {fifaCwcData.groups.flatMap(group => group.teams).map((team, idx) => (
              <TeamCard key={team + idx} teamName={team} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams-view" className="mt-4">
          {status === "loading" && (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className={cn(
                "animate-spin rounded-full h-8 w-8 border-b-2",
                isDarkMode ? "border-[#45CAFF]" : "border-gray-900"
              )}></div>
            </div>
          )}

          {status === "failed" && (
            <div className="flex justify-center items-center min-h-[200px] text-red-500">
              Erro ao carregar os dados da classificação
            </div>
          )}

          {status === "idle" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {groups.map((group) => (
                <Card 
                  key={`team-${group.id}`} 
                  className={cn(
                    "overflow-hidden h-full flex flex-col",
                    isDarkMode && "border-[#45CAFF]/30 bg-[#061F3F]"
                  )}
                >
                  <CardHeader className={cn(
                    "pb-2",
                    isDarkMode ? "bg-[#061F3F] border-b border-[#45CAFF]/30" : "bg-muted/50"
                  )}>
                    <CardTitle className={cn(
                      "text-xl font-semibold",
                      isDarkMode && "text-[#45CAFF]"
                    )}>
                      Grupo {group.group_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 px-2 sm:px-6">
                    <div className="overflow-x-auto w-full">
                      <Table className="w-full table-fixed">
                        <TableHeader>
                          <TableRow className={cn(
                            isDarkMode && "border-[#45CAFF]/30"
                          )}>
                            <TableHead className={cn(
                              "w-[10%] text-center text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>Pos</TableHead>
                            <TableHead className={cn(
                              "w-[35%] text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>Time</TableHead>
                            <TableHead className={cn(
                              "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>J</TableHead>
                            <TableHead className={cn(
                              "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>V</TableHead>
                            <TableHead className={cn(
                              "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>E</TableHead>
                            <TableHead className={cn(
                              "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>D</TableHead>
                            <TableHead className={cn(
                              "w-[8%] text-center text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>SG</TableHead>
                            <TableHead className={cn(
                              "w-[15%] text-center text-xs sm:text-sm px-1 sm:px-4",
                              isDarkMode && "text-[#45CAFF]"
                            )}>Pts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {group.standings.map((standing) => (
                            <TableRow 
                              key={standing.competitor.id}
                              className={cn(
                                "transition-colors",
                                isDarkMode && "hover:bg-[#45CAFF]/10 border-[#45CAFF]/30"
                              )}
                            >
                              <TableCell className={cn(
                                "text-center font-medium text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>
                                {standing.rank}
                              </TableCell>
                              <TableCell className={cn(
                                "text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>
                                <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                                  <div className={cn(
                                    "relative h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 rounded-full flex items-center justify-center",
                                    isDarkMode ? "bg-[#45CAFF]/10" : "bg-muted/30"
                                  )}>
                                    {findTeamLogo(standing.competitor.abbreviation) ? (
                                      <Image
                                        src={findTeamLogo(standing.competitor.abbreviation) || ''}
                                        alt={standing.competitor.abbreviation}
                                        fill
                                        className="object-contain"
                                        sizes="24px"
                                      />
                                    ) : (
                                      <span className={cn(
                                        "text-xs font-medium",
                                        isDarkMode && "text-[#D3ECFF]"
                                      )}>
                                        {standing.competitor.abbreviation}
                                      </span>
                                    )}
                                  </div>
                                  <span 
                                    title={standing.competitor.name} 
                                    className={cn(
                                      "truncate",
                                      isDarkMode && "text-[#D3ECFF]"
                                    )}
                                  >
                                    {getDisplayName(standing.competitor.name, {
                                      preferAbbreviation: true,
                                      fallbackToOriginal: true
                                    })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className={cn(
                                "text-center text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>{standing.played}</TableCell>
                              <TableCell className={cn(
                                "text-center text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>{standing.win}</TableCell>
                              <TableCell className={cn(
                                "text-center text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>{standing.draw}</TableCell>
                              <TableCell className={cn(
                                "text-center text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>{standing.loss}</TableCell>
                              <TableCell className={cn(
                                "text-center text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode && "text-[#D3ECFF]"
                              )}>{standing.goals_diff}</TableCell>
                              <TableCell className={cn(
                                "text-center font-semibold text-xs sm:text-sm px-1 sm:px-4",
                                isDarkMode ? "text-[#45CAFF]" : ""
                              )}>
                                {standing.points}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="matches-view" className="mt-4">
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
        </TabsContent>
      </Tabs>
    </div>
  )
} 