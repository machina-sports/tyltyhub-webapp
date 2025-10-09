"use client"

import fifaCwcData from "@/data/fifa-cwc-2025.json"
import teamsData from "@/data/teams.json"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTeamDisplay } from "@/hooks/use-team-display"

// Function to generate AI insights for each team
const generateTeamInsight = (teamName: string): string => {
  const insights: Record<string, string> = {
    "Al Ahly": "Club más victorioso de África con fuerza en contraataques rápidos y mucha experiencia en torneos internacionales. Su organización defensiva es un punto fuerte, con capacidad de transiciones veloces hacia el ataque.",
    "Inter Miami": "Liderado por Messi, tiene estilo de juego técnico y puede sorprender a los favoritos con creatividad en jugadas individuales. El equipo estadounidense apuesta en la experiencia de sus estrellas y la integración con jóvenes talentos para enfrentar adversarios tradicionales.",
    "Palmeiras": "Fuerte tácticamente bajo el mando de Abel Ferreira, con defensa sólida y ataque eficiente. Favorito del grupo, el Verdão se destaca por la consistencia y repertorio táctico variado, alternando entre posesión de balón y contraataques precisos según la necesidad.",
    "Porto": "Equipo europeo experimentado con tradición internacional, juega con intensidad y fuerte marcaje en el mediocampo. Los Dragones suelen explotar bien las pelotas paradas y tienen gran capacidad de adaptación a diferentes escenarios de juego.",
    "Atletico Madrid": "Conocido por el estilo defensivo de Simeone, tiene transiciones rápidas y gran capacidad de adaptación táctica. El equipo español se destaca por el compromiso defensivo y eficiencia en las pocas ocasiones creadas, siendo especialista en juegos decisivos.",
    "Paris Saint-Germain": "Combina técnica individual excepcional con velocidad ofensiva devastadora, especialmente en contraataques. El PSG tiene un mediocampo creativo capaz de romper defensas cerradas y delanteros letales que pueden decidir partidos en jugadas aisladas.",
    "Botafogo": "Representante brasileño con estilo moderno y agresivo, destacándose por la intensidad y velocidad en las transiciones. El Fogão combina tradición sudamericana con métodos contemporáneos, resultando en un fútbol atractivo y competitivo a nivel internacional.",
    "Seattle Sounders": "Representante de la MLS con experiencia en competiciones CONCACAF, juega con alta intensidad física y mucha organización colectiva. Los Sounders son conocidos por su fuerte apoyo de hinchada y capacidad de crecer en momentos importantes de los torneos.",
    "Bayern Munich": "Máquina alemana de precisión táctica, combina disciplina europea con eficiencia ofensiva implacable. El Bayern mantiene su tradición de dominio en el mediocampo y presión alta, siendo capaz de controlar partidos y decidir en momentos clave con calidad individual.",
    "Auckland City": "Campeón de Oceanía con estilo combativo y mucha determinación, representa el fútbol de Nueva Zelanda con orgullo y dedicación. Aunque técnicamente inferior, el equipo compensará con intensidad física y espíritu de lucha contra adversarios más cotizados.",
    "Boca Juniors": "Tradición argentina y pasión sudamericana, el Xeneize tiene experiencia invaluable en competiciones internacionales. Boca se caracteriza por su fuerte personalidad en campo y capacidad de adaptación táctica, especialmente en fases eliminatorias donde la experiencia hace la diferencia.",
    "Benfica": "Representante portugués con historia rica en competiciones europeas, combina técnica individual con organización colectiva. Las Águilas tienen tradición de revelar talentos y jugar un fútbol ofensivo e inteligente, con capacidad de sorprender a grandes equipos europeos.",
    "Chelsea": "Gigante inglés con experiencia en finales mundiales, se destaca por la versatilidad táctica y plantel profundo. Los Blues tienen capacidad de adaptación a diferentes estilos de juego y mentalidad ganadora construida en décadas de éxito en competiciones de elite.",
    "Los Angeles FC": "Representante moderno de la MLS con inversiones significativas en talentos internacionales, juega un fútbol atractivo y ofensivo. El LAFC combina velocidad estadounidense con técnica internacional, resultando en un equipo dinámico y peligroso en ataque.",
    "Flamengo": "Paixão brasileira con estilo ofensivo tradicional, el Mengão tiene experiencia reciente en conquistas internacionales. El Flamengo se destaca por la calidad técnica individual y capacidad de crear jugadas espectaculares, especialmente en momentos decisivos de competiciones importantes.",
    "Espérance de Tunis": "Representante africano con tradición continental, conocido por la garra y determinación en campo. El club tunecino combina experiencia africana con organización táctica sólida, siendo capaz de complicar la vida de adversarios más cotizados con intensidad y dedicación.",
    "Manchester City": "Máquina de Guardiola, combina posesión de balón elaborada con presión alta devastadora. Los Citizens tienen el estilo más refinado del fútbol mundial, con capacidad de dominar partidos a través de control técnico y transiciones rápidas entre defensa y ataque.",
    "Wydad AC": "Representante marroquí con fuerte tradición africana, se caracteriza por la intensidad física y organización defensiva. El Wydad combina experiencia continental con determinación árabe, siendo especialista en torneos eliminatorios donde la mentalidad fuerte hace diferencia crucial.",
    "Al Ain": "Representa los Emiratos Árabes con estilo técnico, valorización de la posesión y combatividad en el mediocampo. El club combina jugadores locales con extranjeros experimentados, resultando en un fútbol equilibrado y competitivo en el contexto asiático.",
    "Juventus": "La tradicional 'Vecchia Signora' italiana se destaca por la organización defensiva y eficiencia en las finalizaciones. El club de Turín mantiene la solidez táctica característica del fútbol italiano, combinada con individualidades capaces de decidir juegos en jugadas aisladas.",
    "Real Madrid": "Actual campeón europeo y mayor club del mundo, combina talento individual y experiencia en decisiones. Los Merengues son favoritos en cualquier competición, con un plantel estrellado y mentalidad ganadora construida a lo largo de décadas de historia.",
    "Al Hilal": "Potencia saudí con inversiones recientes en estrellas internacionales, juega con ritmo intenso y proposición ofensiva. El club representa la nueva era del fútbol árabe, con capacidad financiera para atraer grandes nombres y armar equipos competitivos globalmente.",
    "Pachuca": "Club mexicano con fuerte inversión en jóvenes talentos, estilo dinámico y vertical de ataque. Conocidos por su excelente trabajo de base, apuestan en un fútbol moderno, con presión alta y transiciones rápidas hacia el campo ofensivo.",
    "Red Bull Salzburg": "Representante austriaco con estilo Red Bull de juego: presión alta, intensidad y velocidad en las transiciones. El equipo sigue la filosofía global de la marca, revelando jóvenes talentos y presentando fútbol vertical y agresivo, siempre buscando el gol adversario."
  };
  
  return insights[teamName] || "Equipo con estilo propio y características tácticas interesantes para seguir en el torneo. El equipo presenta un equilibrio entre organización defensiva y capacidad ofensiva, pudiendo sorprender a adversarios que los subestimen.";
};

// Translation helper for leagues
const translateLeague = (league: string): string => {
  const translations: Record<string, string> = {
    "LaLiga": "LaLiga Española",
    "Premier League": "Premier League Inglesa",
    "Bundesliga": "Bundesliga Alemana",
    "Serie A": "Serie A Italiana",
    "Ligue 1": "Ligue 1 Francesa",
    "Primeira Liga": "Primeira Liga Portuguesa",
    "MLS": "Major League Soccer (EUA)",
    "Liga MX": "Liga MX (México)",
    "K League 1": "K League 1 (Corea del Sur)",
    "J1 League": "J1 League (Japón)",
    "Saudi Pro League": "Saudi Pro League (Arabia Saudí)",
    "UAE Pro League": "UAE Pro League (Emiratos Árabes)",
  }
  
  return translations[league] || league
}

// Team Card Component with AI insights
const TeamCard = ({ teamName }: { teamName: string }) => {
  const { getTeamLogo, getTeamLeague } = useTeamDisplay();
  const logo = getTeamLogo(teamName);
  const league = getTeamLeague(teamName);
  const insight = generateTeamInsight(teamName);
  
  return (
    <div className="border rounded-lg p-4 hover:bg-bwin-neutral-30/30 transition-colors h-full flex flex-col bg-bwin-neutral-20 border-bwin-neutral-30">
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
          <h3 className="text-sm font-semibold overflow-wrap-normal word-break-normal text-brand-primary">
            {teamName}
          </h3>
          {league && (
            <p className="text-xs overflow-wrap-normal word-break-normal text-bwin-neutral-100">
              {translateLeague(league)}
            </p>
          )}
              </div>
            </div>
            
      <div className="mt-1 pt-3 border-t text-sm flex-1 border-bwin-neutral-30">
        <div className="text-xs leading-relaxed space-y-1.5 overflow-auto max-h-[12rem] text-bwin-neutral-80">
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
  // Get all teams from CWC groups
  const allTeams = fifaCwcData.groups.flatMap(group => group.teams);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-bwin-neutral-100">
          Clubes Participantes
        </h2>
        <p className="text-bwin-neutral-80">
          32 clubes de 6 confederaciones compitiendo por el título mundial
        </p>
      </div>

      {fifaCwcData.groups.map((group, groupIndex) => (
        <div key={group.name} className="space-y-4">
          <h3 className="text-lg font-semibold text-brand-primary border-b border-bwin-neutral-30 pb-2">
            Grupo {group.name.replace('Group ', '')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {group.teams.map((teamName) => (
              <TeamCard key={teamName} teamName={teamName} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}