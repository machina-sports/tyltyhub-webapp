"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import teamsData from "@/data/teams.json"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { useTeamDisplay } from "@/hooks/use-team-display"

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

export function TeamsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      {fifaCwcData.groups.flatMap(group => group.teams).map((team, idx) => (
        <TeamCard key={team + idx} teamName={team} />
      ))}
    </div>
  );
}